const express = require('express');
const app = express();
__path = process.cwd()
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 5000;
let server = require('./qr'),
    code = require('./pair');
require('events').EventEmitter.defaultMaxListeners = 500;
app.use('/scan', server);
app.use('/code', code);
app.use('/qr', async (req, res) => {
    res.sendFile(__path + '/qr.html')
})
app.use('/pair', async (req, res) => {
    res.sendFile(__path + '/pair.html')
})
app.use('/', async (req, res) => {
    res.sendFile(__path + '/main.html')
})
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));

app.listen(PORT, '0.0.0.0', () => {
    console.log(`
Don't Forget To Give Star

 Server running on http://localhost:` + PORT)
})

module.exports = app
  
