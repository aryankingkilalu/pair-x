
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 8000;
const __path = process.cwd();

require('events').EventEmitter.defaultMaxListeners = 500;

// Middleware lazima ianze kwanza
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const server = require('./qr');
const code = require('./pair');

app.use('/qr', server);
app.use('/code', code);

app.use('/pair', (req, res) => {
    res.sendFile(__path + '/pair.html');
});

app.use('/', (req, res) => {
    res.sendFile(__path + '/main.html');
});

app.listen(PORT, () => {
    console.log(`ARYAN-MD Server running on port ${PORT}`);
});

module.exports = app;
