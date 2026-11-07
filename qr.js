
const { makeid } = require('./id');
const QRCode = require('qrcode');
const express = require('express');
const path = require('path');
const fs = require('fs');
const pino = require('pino');

let router = express.Router();

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;

    fs.rmSync(FilePath, {
        recursive: true,
        force: true
    });
}

router.get('/', async (req, res) => {
    const id = makeid();
    const tempDir = path.join(__dirname, 'temp', id);
    let reconnecting = false;
    let completed = false;

    async function ARYAN_QR_CODE() {
        let AryanSocket;

        try {
            const {
                default: Aryan,
                useMultiFileAuthState,
                Browsers,
                delay
            } = await import('@whiskeysockets/baileys');

            const {
                state,
                saveCreds
            } = await useMultiFileAuthState(tempDir);

            AryanSocket = Aryan({
                auth: state,
                printQRInTerminal: false,
                logger: pino({ level: 'silent' }),
                browser: Browsers.macOS('Desktop')
            });

            AryanSocket.ev.on('creds.update', saveCreds);

            AryanSocket.ev.on('connection.update', async (s) => {
                try {
                    const {
                        connection,
                        lastDisconnect,
                        qr
                    } = s;

                    if (qr && !res.headersSent && !completed) {
                        const qrImage = await QRCode.toBuffer(qr);

                        if (!res.headersSent) {
                            res.type('png')
                                .set('Cache-Control', 'no-store, private')
                                .send(qrImage);
                        }
                    }

                    if (connection === 'open' && !completed) {
                        completed = true;

                        console.log('ARYAN WhatsApp connected successfully');

                        await delay(3000);

                        // Ensure credentials are saved
                        await saveCreds();

                        const credsPath = path.join(tempDir, 'creds.json');

                        if (!fs.existsSync(credsPath)) {
                            throw new Error('creds.json not found');
                        }

                        const data = await fs.promises.readFile(credsPath);
                        const b64data = Buffer.from(data).toString('base64');

                        // Session contains sensitive WhatsApp credentials.
                        const session = await AryanSocket.sendMessage(
                            AryanSocket.user.id,
                            { text: 'Aryan-X:-' + b64data }
                        );

                        const ARYAN_SESSION_TEXT = `
╔════════════════════◇
║『 ARYAN SESSION CONNECTED』
╚════════════════════╝

╔════════════════════◇
║『 ARYAN-MD SESSION』
║ - Your WhatsApp session has been generated.
║ - Keep your session private.
╚════════════════════╝

𒂀 Enjoy ARYAN-MD

Don't Forget To Give Star ⭐ To My Repo
______________________________`;

                        await AryanSocket.sendMessage(
                            AryanSocket.user.id,
                            { text: ARYAN_SESSION_TEXT },
                            { quoted: session }
                        );

                        console.log('ARYAN session delivery completed');

                        await delay(1000);

                        await AryanSocket.ws.close();

                        await removeFile(tempDir);

                    } else if (
                        connection === 'close' &&
                        !completed &&
                        !reconnecting
                    ) {
                        const statusCode =
                            lastDisconnect?.error?.output?.statusCode;

                        console.log('ARYAN connection closed:', statusCode);

                        // Do not retry logged-out sessions.
                        if (statusCode === 401) {
                            console.log('WhatsApp logged out. Scan a new QR.');
                            await removeFile(tempDir);
                            return;
                        }

                        reconnecting = true;
                        await delay(5000);

                        // Avoid reconnecting after the HTTP request has ended.
                        if (!res.destroyed) {
                            await ARYAN_QR_CODE();
                        }
                    }

                } catch (err) {
                    completed = true;
                    console.error('ARYAN connection update error:', err);

                    try {
                        await AryanSocket?.ws?.close();
                    } catch (closeError) {
                        console.error(closeError);
                    }

                    await removeFile(tempDir);

                    if (!res.headersSent) {
                        res.status(503).json({
                            code: 'Session generation failed'
                        });
                    }
                }
            });

        } catch (err) {
            console.error('ARYAN QR generation error:', err);

            await removeFile(tempDir);

            if (!res.headersSent) {
                res.status(503).json({
                    code: 'Service is Currently Unavailable'
                });
            }
        }
    }

    return await ARYAN_QR_CODE();
});

module.exports = router;
                        
