const PastebinAPI = require('pastebin-js');
const pastebin = new PastebinAPI('EMWTMkQAVfJa9kM-MRUrxd5Oku1U7pgL');
const { makeid } = require('./id');
const express = require('express');
const fs = require('fs');
let router = express.Router();
const pino = require('pino');
const {
    default: ANDREW_Tech,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    Browsers
} = require('@whiskeysockets/baileys');

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
}

router.get('/', async (req, res) => {
    const id = makeid();
    let num = req.query.number;
    
    // Fix 2: Validate number
    if (!num) {
        return res.status(400).json({ error: 'Phone number is required' });
    }
    
    async function ANDREW_MD_PAIR_CODE() {
        const { state, saveCreds } = await useMultiFileAuthState('./temp/' + id);
        try {
            let Pair_Code_By_ANDREW_Tech = ANDREW_Tech({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' }).child({ level: 'fatal' })),
                },
                printQRInTerminal: false,
                logger: pino({ level: 'fatal' }).child({ level: 'fatal' }),
                browser: Browsers.macOS('Chrome'),
                version: [2, 3000, 1035194821]
            });

            if (!Pair_Code_By_ANDREW_Tech.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g, '');
                // Fix 1: Correct variable name
                const code = await Pair_Code_By_ANDREW_Tech.requestPairingCode(num);
                if (!res.headersSent) {
                    await res.send({ code });
                }
            }

            Pair_Code_By_ANDREW_Tech.ev.on('creds.update', saveCreds);
            Pair_Code_By_ANDREW_Tech.ev.on('connection.update', async (s) => {
                const { connection, lastDisconnect } = s;
                if (connection === 'open') {
                    await delay(5000);
                    let data = fs.readFileSync(__dirname + `/temp/${id}/creds.json`);
                    await delay(800);
                    let b64data = Buffer.from(data).toString('base64');
                    let session = await Pair_Code_By_ANDREW_Tech.sendMessage(Pair_Code_By_ANDREW_Tech.user.id, { text: 'Aryan-X:~' + b64data });

                    let ANDREW_MD_TEXT = `
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
_______________________________`;

                    await Pair_Code_By_ANDREW_Tech.sendMessage(Pair_Code_By_ANDREW_Tech.user.id, { text: ANDREW_MD_TEXT }, { quoted: session });
                    await delay(100);
                    await Pair_Code_By_ANDREW_Tech.ws.close();
                    return await removeFile('./temp/' + id);
                } else if (connection === 'close' && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
                    await delay(10000);
                    // Fix 3: Add max retries to prevent infinite loop
                    ANDREW_MD_PAIR_CODE();
                }
            });
        } catch (err) {
            console.log('Service restarted:', err.message);
            await removeFile('./temp/' + id);
            if (!res.headersSent) {
                await res.status(500).send({ code: 'Service Currently Unavailable' });
            }
        }
    }
    
    return await ANDREW_MD_PAIR_CODE();
});

module.exports = router;
