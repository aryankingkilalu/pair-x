<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f2027,50:203a43,100:2c5364&height=200&section=header&text=ARYAN%20Session&fontSize=48&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=WhatsApp%20Session%20ID%20Generator%20for%20ARYAN-MD&descAlignY=58&descSize=16" width="100%" />

[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Baileys](https://img.shields.io/badge/Baileys-WhiskeySockets-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://github.com/WhiskeySockets/Baileys)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![Stars](https://img.shields.io/github/stars/aryankingkilalu/pair-x?style=for-the-badge&color=2c5364)](https://github.com/aryankingkilalu/pair-x/stargazers)
[![Forks](https://img.shields.io/github/forks/aryankingkilalu/pair-x?style=for-the-badge&color=203a43)](https://github.com/aryankingkilalu/pair-x/network/members)

**Pair your WhatsApp number or scan QR to generate a Session ID in seconds for [ARYAN-MD](https://github.com/aryankingkilalu/ARYAN-MD).**

</div>

---

## ✨ Features

- 🔗 **Pairing Code & QR Login**: Generate sessions using either a phone pairing code or QR code.
- ⚡ **Instant Delivery**: Generated Session ID (`Aryan-X:~...`) is delivered directly to your WhatsApp chat.
- 🎨 **Easy Rebranding (`clone.js`)**: Customize brand name, bot name, logo, theme, and session prefix from one config file.
- 🧩 **Built for ARYAN-MD**: Tailored to work smoothly with **ARYAN MD** deployments.
- 🔒 **Private & Direct**: Sessions are sent straight to your linked WhatsApp account.
- 🚀 **Flexible Hosting**: Runs locally, on a VPS (PM2), or on cloud platforms.

---

## 📖 How It Works

1. Open your deployed **ARYAN Session** web page.
2. Choose **Pairing Code** or **QR Code** (`/pair` or `/qr`).
3. If using pairing code, enter your WhatsApp number with country code and no `+` sign (for example, `2557XXXXXXXX`).
4. Open **WhatsApp → Settings → Linked Devices → Link a Device**.
5. Tap **Link with phone number instead** (when using a pairing code) and enter the code shown.
6. Once linked, your Session ID will arrive in your WhatsApp chat.
7. Copy the full Session ID and set it as `SESSION_ID` in your **ARYAN-MD** environment variables.

> ⚠️ **Warning:** Never share your Session ID with anyone. Anyone who has it can access your linked WhatsApp session.

---

## 🎨 Customization (`clone.js`)

Edit `clone.js` to update branding details without modifying core routes:

- `brand.name` & `brand.botName` — Set to `ARYAN MD` / `ARYAN MD Bot`
- `session.prefix` — Set to `Aryan-X:~`
- `logo.url` or `logo.png` — Add your custom logo
- `theme.color`, `theme.layout`, & `theme.mode` — Customize appearance

---

## 🚀 Deploy

Deploy your own **ARYAN Session** server:

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/aryankingkilalu/pair-x)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/aryankingkilalu/pair-x)

---

## 💻 Run Locally

### Requirements

- [Node.js](https://nodejs.org) `20.x` or newer
- [Git](https://git-scm.com)
- An active WhatsApp account

### Setup

```bash
git clone [https://github.com/aryankingkilalu/pair-x.git](https://github.com/aryankingkilalu/pair-x.git)
cd pair-x
npm install
npm start
