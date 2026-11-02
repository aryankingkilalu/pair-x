'use strict';

const { makeid } = require('./id');
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

router.get('/', async (req, res) => {
    const rawNumber = String(req.query.number || '');
    const number = rawNumber.replace(/[^0-9]/g, '');

    if (!number || number.length < 7 || number.length > 15) {
        return res.status(400).json({ error: 'A valid phone number with country code is required.' });
    }

    const id = makeid(8);
    const authDir = path.join(AUTH_ROOT, id);
    let socket;
    let pairingCodeSent = false;

    try {
        // Baileys v7 is ESM. Dynamic import avoids converting the Express app.
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
            browser: Browsers.macOS('Chrome')
        });

        socket.ev.on('creds.update', saveCreds);

        socket.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect } = update;

            if (connection === 'open') {
                console.log('Phone pairing connected:', socket.user?.id || 'unknown');
                await new Promise(resolve => setTimeout(resolve, 1500));

                try {
                    const credsPath = path.join(authDir, 'creds.json');
                    const data = await fs.promises.readFile(credsPath);
                    const session = 'Aryan-X:~' + Buffer.from(data).toString('base64');

                    const sent = await socket.sendMessage(socket.user.id, { text: session });
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
                    }, { quoted: sent });
                } catch (error) {
                    console.error('Could not send pairing session:', error);
                } finally {
                    setTimeout(() => {
                        try { socket.end(undefined); } catch (_) {}
                        removeFile(authDir);
                    }, 500);
                }
            }

            if (connection === 'close') {
                const statusCode = lastDisconnect?.error?.output?.statusCode;
                console.error('Pairing connection closed. Status:', statusCode || 'unknown');
                if (!res.headersSent && !res.writableEnded) {
                    res.status(502).json({ error: 'WhatsApp connection closed. Please request a new pairing code.' });
                }
                removeFile(authDir);
            }
        });

        if (!state.creds.registered) {
            await new Promise(resolve => setTimeout(resolve, 1500));
            const code = await socket.requestPairingCode(number);
            pairingCodeSent = true;
            if (!res.headersSent && !res.writableEnded) {
                res.status(200).json({ code });
            }
        } else {
            if (!res.headersSent) {
                res.status(409).json({ error: 'This temporary session is already registered. Please start again.' });
            }
        }
    } catch (error) {
        console.error('Phone pairing error:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Pairing service is currently unavailable' });
        }
        removeFile(authDir);
        try { socket?.end(undefined); } catch (_) {}
    }
});

module.exports = router;
