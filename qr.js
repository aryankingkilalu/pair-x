const PastebinAPI = require('pastebin-js'),
pastebin = new PastebinAPI('EMWTMkQAVfJa9kM-MRUrxd5Oku1U7pgL')
const { makeid } = require('./id');
const QRCode = require('qrcode');
const express = require('express');
const fs = require('fs');
let router = express.Router()
const pino = require("pino");

const {
    default: ARYAN_X_Tech,
    useMultiFileAuthState,
    Browsers,
    delay,
} = require("@whiskeysockets/baileys");

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, {
        recursive: true,
        force: true
    })
};

router.get('/', async (req, res) => {
    const id = makeid();

    async function ARYAN_X_QR_CODE() {
        const { state, saveCreds } = await useMultiFileAuthState('./temp/' + id)

        try {
            let Qr_Code_By_ARYAN_X = ARYAN_X_Tech({
                auth: state,
                printQRInTerminal: false,
                logger: pino({ level: "silent" }),
                browser: Browsers.macOS("ARYAN-X"),
                version: [2, 3000, 1035194821]
            });

            Qr_Code_By_ARYAN_X.ev.on('creds.update', saveCreds)

            Qr_Code_By_ARYAN_X.ev.on("connection.update", async (s) => {
                const { connection, lastDisconnect, qr } = s;

                if (qr && !res.headersSent) {
                    await res.end(await QRCode.toBuffer(qr));
                }

                if (connection == "open") {
                    await delay(5000);

                    let data = fs.readFileSync(__dirname + `/temp/${id}/creds.json`);
                    let b64data = Buffer.from(data).toString('base64');

                    let session = await Qr_Code_By_ARYAN_X.sendMessage(
                        Qr_Code_By_ARYAN_X.user.id,
                        { text: 'ARYAN-X:~' + b64data }
                    );

                    let ARYAN_X_TEXT = `
╔════════════════════◇
║『 SESSION CONNECTED』
║ ❍AYRAN X ULTRA BOT
║ ❍AYRAN💀
╚════════════════════╝

╔════════════════════◇
║『 YOU'VE CHOSEN AYRAN X ULTRA BOT 』
║  Set the session ID in Heroku:
║  SESSION_ID: 
╚════════════════════╝
𒂀 Enjoy AYRAN X ULTRA

Don't Forget To Give Star⭐ To My Repo
______________________________`;

                    await Qr_Code_By_ARYAN_X.sendMessage(
                        Qr_Code_By_ARYAN_X.user.id,
                        { text: ARYAN_X_TEXT },
                        { quoted: session }
                    );

                    await delay(100);
                    await Qr_Code_By_ARYAN_X.ws.close();

                    return await removeFile("./temp/" + id);
                } else if (
                    connection === "close" &&
                    lastDisconnect &&
                    lastDisconnect.error &&
                    lastDisconnect.error.output.statusCode != 401
                ) {
                    await delay(10000);
                    ARYAN_X_QR_CODE();
                }
            });

        } catch (err) {
            if (!res.headersSent) {
                await res.json({
                    code: "Service is Currently Unavailable"
                });
            }
            console.log(err);
            await removeFile("./temp/" + id);
        }
    }

    return await ARYAN_X_QR_CODE()
});

module.exports = router;
