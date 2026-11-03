
const { makeid } = require('./id');
const express = require('express');
const fs = require('fs');
let router = express.Router();
const pino = require('pino');

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
}

router.get('/', async (req, res) => {
    const id = makeid();
    let num = req.query.number;

    async function ARYAN_PAIR_CODE() {
        try {
            const {
                default: Aryan,
                useMultiFileAuthState,
                delay,
                makeCacheableSignalKeyStore,
                Browsers
            } = await import('@whiskeysockets/baileys');

            const { state, saveCreds } =
                await useMultiFileAuthState('./temp/' + id);

            let AryanSocket = Aryan({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(
                        state.keys,
                        pino({ level: 'fatal' }).child({ level: 'fatal' })
                    ),
                },
                printQRInTerminal: false,
                logger: pino({ level: 'fatal' }).child({ level: 'fatal' }),
                browser: Browsers.macOS('Chrome')
            });

            if (!AryanSocket.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g, '');
                const code = await AryanSocket.requestPairingCode(num);

                if (!res.headersSent) {
                    await res.send({ code });
                }
            }

            AryanSocket.ev.on('creds.update', saveCreds);

            AryanSocket.ev.on('connection.update', async (s) => {
                const { connection, lastDisconnect } = s;

                if (connection === 'open') {
                    await delay(6000);

                    let data = fs.readFileSync(
                        __dirname + `/temp/${id}/creds.json`
                    );

                    await delay(8000);
                    let b64data = Buffer.from(data).toString('base64');

                    let session = await AryanSocket.sendMessage(
                        AryanSocket.user.id,
                        { text: 'Aryan-X:-' + b64data }
                    );

                    let ARYAN_SESSION_TEXT =
                        `✅ Session paired successfully\n⚙️ Type: Base64\nStatus: 🟢 Online`;

                    await AryanSocket.newsletterFollow(
                        "120363400224487887@newsletter"
                    );

                    await AryanSocket.sendMessage(
                        AryanSocket.user.id,
                        { text: ARYAN_SESSION_TEXT },
                        { quoted: session }
                    );

                    await delay(100);
                    await AryanSocket.ws.close();
                    return await removeFile('./temp/' + id);

                } else if (
                    connection === 'close' &&
                    lastDisconnect &&
                    lastDisconnect.error &&
                    lastDisconnect.error.output.statusCode != 401
                ) {
                    await delay(10000);
                    ARYAN_PAIR_CODE();
                }
            });

        } catch (err) {
            console.error('Aryan pairing-code generation failed:', err);
            await removeFile('./temp/' + id);

            if (!res.headersSent) {
                res.status(503).json({
                    code: 'Service Currently Unavailable'
                });
            }
        }
    }

    return await ARYAN_PAIR_CODE();
});

module.exports = router;
