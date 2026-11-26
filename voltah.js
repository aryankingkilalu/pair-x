'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.disable('x-powered-by');
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));
app.use(express.static(__dirname));

function loadRoute(routePath, modulePath) {
    try {
        const router = require(modulePath);
        app.use(routePath, router);
    } catch (err) {
        console.error(`Failed to load ${modulePath}:`, err.message);
        app.use(routePath, (_req, res) => {
            res.status(503).json({
                error: `Service ${routePath} unavailable`,
                details: err.message,
            });
        });
    }
}

loadRoute('/scan', './qr');
loadRoute('/code', './pair');

app.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'ok',
        brand: 'ARYAN MD',
        prefix: 'Aryan-X:~',
    });
});

app.get('/qr', (_req, res, next) => {
    res.sendFile(path.join(__dirname, 'qr.html'), (err) => {
        if (err) next(err);
    });
});

app.get('/pair', (_req, res, next) => {
    res.sendFile(path.join(__dirname, 'pair.html'), (err) => {
        if (err) next(err);
    });
});

app.get('/', (_req, res, next) => {
    res.sendFile(path.join(__dirname, 'main.html'), (err) => {
        if (err) next(err);
    });
});

app.use((err, _req, res, _next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`ARYAN-X session generator listening on port ${PORT}`);
});

module.exports = app;
    
