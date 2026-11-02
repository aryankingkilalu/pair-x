'use strict';

const { makeid } = require('./id');
const QRCode = require('qrcode');
const express = require('express');
const fs = require('fs');
const path = require('path');
const pino = require('pino');

const router = express.Router();
const AUTH_ROOT = path.join(__dirname, 'temp');

function removeFile(filePath) {
    if (fs.existsSync(filePath)) {
        fs.rmSync(filePath, { recursive: true, force: true });
    }
}

router.get('/', async (_req, res) => {
    const id = makeid(8);
    const authDir = path.join(AUTH_ROOT, id);
    let socket;

    try {
        // Baileys v7 is ESM. Dynamic import keeps the existing Express app
        // and the rest of this project in CommonJS.
        const {
            default: makeWASocket,
            useMultiFileAuthState,
            Browsers
        } = await import('@whiskeysockets/baileys');

        const { state, saveCreds } = await useMultiFileAuthState(authDir);

        socket = makeWASocket({
            auth: state,
            printQRInTerminal: false,
            logger: pino({ level: 'silent' }),
            browser: Browsers.macOS('ARYAN-X')
        });

        socket.ev.on('creds.update', saveCreds);

        socket.ev.on('connection.update', async (update) => {
            const { connection, qr, lastDisconnect } = update;

            if (qr && !res.headersSent && !res.writableEnded) {
                try {
                    const image = await QRCode.toBuffer(qr);
                    res.setHeader('Content-Type', 'image/png');
                    res.setHeader('Cache-Control', 'no-store');
                    res.end(image);
                } catch (error) {
                    console.error('QR rendering failed:', error);
                    if (!res.headersSent) res.status(500).json({ error: 'Unable to render QR code' });
                }
            }

            if (connection === 'open') {
                console.log('QR session connected:', socket.user?.id || 'unknown');
                // This endpoint generates a session and sends it to the linked WhatsApp.
                // Give creds.update time to persist the latest credentials.
                await new Promise(resolve => setTimeout(resolve, 1500));

                try {
                    const credsPath = path.join(authDir, 'creds.json');
                    const data = await fs.promises.readFile(credsPath);
                    const session = 'ARYAN-X:~' + Buffer.from(data).toString('base64');

                    await socket.sendMessage(socket.user.id, { text: session });
                    await socket.sendMessage(socket.user.id, {
                        text: [
                            '╔════════════════════◇',
                            '║ SESSION CONNECTED',
                            '║ ARYAN X ULTRA BOT',
                            '╚════════════════════╝',
                            '',
                            'Your session ID has been sent above.',
                            'Keep it private and do not share it.'
                        ].join('\n')
                    });
                } catch (error) {
                    console.error('Could not send QR session:', error);
                } finally {
                    setTimeout(() => {
                        try { socket.end(undefined); } catch (_) {}
                        removeFile(authDir);
                    }, 500);
                }
            }

            if (connection === 'close') {
                const statusCode = lastDisconnect?.error?.output?.statusCode;
                console.error('QR connection closed. Status:', statusCode || 'unknown');
                if (!res.headersSent && !res.writableEnded) {
                    res.status(502).json({ error: 'WhatsApp connection closed. Please generate a new QR code.' });
                }
                removeFile(authDir);
            }
        });
    } catch (error) {
        console.error('QR pairing error:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'QR service is currently unavailable' });
        }
        removeFile(authDir);
        try { socket?.end(undefined); } catch (_) {}
    }
});

module.exports = router;
