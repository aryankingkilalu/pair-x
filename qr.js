
const {makeid} = require('./id');
const QRCode = require('qrcode');
const express = require('express');
const path = require('path');
const fs = require('fs');
let router = express.Router()
const pino = require("pino");

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, {
        recursive: true,
        force: true
    })
};

const {
    readFile
} = require("node:fs/promises")

router.get('/', async (req, res) => {
    const id = makeid();

    async function ARYAN_QR_CODE() {
        try {
            const {
                default: Aryan,
                useMultiFileAuthState,
                Browsers,
                delay,
            } = await import('@whiskeysockets/baileys');

            const {
                state,
                saveCreds
            } = await useMultiFileAuthState('./temp/' + id)

            let AryanSocket = Aryan({
                auth: state,
                printQRInTerminal: false,
                logger: pino({
                    level: "silent"
                }),
                browser: Browsers.macOS("Desktop"),
            });

            AryanSocket.ev.on('creds.update', saveCreds)

            AryanSocket.ev.on("connection.update", async (s) => {
                const {
                    connection,
                    lastDisconnect,
                    qr
                } = s;

                if (qr && !res.headersSent) {
                    res.type('png')
                        .set('Cache-Control', 'no-store, private')
                        .send(await QRCode.toBuffer(qr));
                }

                if (connection == "open") {
                    await delay(5000);

                    let data = fs.readFileSync(
                        __dirname + `/temp/${id}/creds.json`
                    );

                    await delay(800);

                    let b64data = Buffer.from(data).toString('base64');

                    let session = await AryanSocket.sendMessage(
                        AryanSocket.user.id,
                        { text: 'Aryan-X:-' + b64data }
                    );

                    let ARYAN_SESSION_TEXT = `
╔════════════════════◇
║『 ARYAN SESSION CONNECTED』
╚════════════════════╝


---

╔════════════════════◇
║『 YOU'VE CHOSEN ARYAN SESSION』
║ - Set the session ID in Heroku:
║ - SESSION_ID:
╚════════════════════╝
𒂀 Enjoy Aryan MD


---

Don't Forget To Give Star⭐ To My Repo
______________________________`;

                    await AryanSocket.sendMessage(
                        AryanSocket.user.id,
                        { text: ARYAN_SESSION_TEXT },
                        { quoted: session }
                    );

                    await delay(100);
                    await AryanSocket.ws.close();

                    return await removeFile("temp/" + id);

                } else if (
                    connection === "close" &&
                    lastDisconnect &&
                    lastDisconnect.error &&
                    lastDisconnect.error.output.statusCode != 401
                ) {
                    await delay(10000);
                    ARYAN_QR_CODE();
                }
            });

        } catch (err) {
            if (!res.headersSent) {
                res.status(503).json({
                    code: "Service is Currently Unavailable"
                });
            }

            console.log(err);
            await removeFile("temp/" + id);
        }
    }

    return await ARYAN_QR_CODE()
});

module.exports = router;
                        
