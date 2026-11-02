'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));

app.use('/scan', require('./qr'));
app.use('/code', require('./pair'));

app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.get('/qr', (_req, res) => {
    res.sendFile(path.join(__dirname, 'qr.html'));
});

app.get('/pair', (_req, res) => {
    res.sendFile(path.join(__dirname, 'pair.html'));
});

app.get('/', (_req, res) => {
    res.sendFile(path.join(__dirname, 'main.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`ARYAN-X session generator listening on port ${PORT}`);
});

module.exports = app;
