
<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f2027,50:203a43,100:2c5364&height=200&section=header&text=ARYAN%20Session&fontSize=48&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=WhatsApp%20Session%20ID%20Generator%20for%20ARYAN-MD&descAlignY=58&descSize=16" width="100%" />

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Baileys](https://img.shields.io/badge/Baileys-WhiskeySockets-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Stars](https://img.shields.io/github/stars/aryankingkilalu/pair-x?style=for-the-badge&color=2c5364)
![Forks](https://img.shields.io/github/forks/aryankingkilalu/pair-x?style=for-the-badge&color=203a43)

**Pair your WhatsApp number and get a session ID in seconds, ready to plug into [ARYAN-MD](https://github.com/aryankingkilalu/ARYAN-MD).**

</div>

---

## ✨ Features

- 🔗 **Pairing code login**: Enter your number and link your WhatsApp.
- ⚡ **Fast session generation**: Session ID is sent to your WhatsApp chat.
- 🧩 **Made for ARYAN-MD**: Designed for your ARYAN-MD bot.
- 🪶 **Lightweight**: Minimal dependencies.
- 🔒 **Private delivery**: Session is delivered to your own WhatsApp chat.
- 🚀 **Easy deployment**: Deploy on supported hosting platforms.

---

## 📖 How It Works

1. Open your deployed session page.
2. Enter your WhatsApp number with country code, e.g. `2557XXXXXXXX`.
3. A pairing code appears.
4. Open WhatsApp → Settings → Linked Devices → Link a Device.
5. Select Link with phone number instead.
6. Enter your pairing code.
7. Your session ID will be sent to your WhatsApp chat.
8. Copy it and set it as `SESSION_ID` in your ARYAN-MD deployment.

> ⚠️ Never share your session ID. Anyone who has it may access your WhatsApp account.

---

## 🚀 Deploy

Deploy your own ARYAN session server:

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/aryankingkilalu/pair-x)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/aryankingkilalu/pair-x)

---

## 💻 Run Locally

**Requirements**

- [Node.js](https://nodejs.org) 18 or newer
- [Git](https://git-scm.com)
- A WhatsApp account

**Setup**

```bash
git clone https://github.com/aryankingkilalu/pair-x.git
cd pair-x
npm install
npm start
```

Then open `http://localhost:8000` in your browser.

---

## 🖥️ Run on a VPS (PM2)

```bash
git clone https://github.com/aryankingkilalu/pair-x.git
cd pair-x
npm install
npm install -g pm2
pm2 start npm --name "aryan-session" -- start
pm2 save
pm2 startup
```

---

## ⚙️ Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Port the server listens on | `8000` |

Most hosting platforms configure PORT automatically.

---

## 🔌 Using the Session ID with ARYAN-MD

1. Open your [ARYAN-MD repository](https://github.com/aryankingkilalu/ARYAN-MD).
2. Deploy your bot.
3. Set your session ID as an environment variable:

```env
SESSION_ID=your_session_id_here
```

4. Start your bot and connect WhatsApp.

---

## ❓ Troubleshooting

| Problem | Fix |
|---------|-----|
| Pairing code doesn't work | Use your number with country code and without `+`. |
| Session ID not received | Check your WhatsApp chat with yourself. |
| Bot logs out after linking | Generate a fresh session. |
| npm install fails | Check your Node.js version and dependencies. |
| Free host sleeps | Use a VPS or supported hosting service. |

---

## 🛡️ Security Notes

- Treat your session ID like a password.
- Never share your session ID publicly.
- Logging out of the linked device invalidates the session.
- Only use session servers you trust.

---

## 🤝 Contributing

Pull requests and issues are welcome.

1. Fork the [pair-x repository](https://github.com/aryankingkilalu/pair-x).
2. Create a branch.
3. Commit your changes.
4. Push and open a Pull Request.

---

## 🌐 Related Projects

- 🤖 [ARYAN-MD](https://github.com/aryankingkilalu/ARYAN-MD): Your WhatsApp bot.
- 🔗 [ARYAN Pair-X](https://github.com/aryankingkilalu/pair-x): Your session generator.

---

## ⚠️ Disclaimer

This project is not affiliated with, authorized, or endorsed by WhatsApp or Meta. Use it responsibly and at your own risk. Automating WhatsApp accounts may violate WhatsApp's Terms of Service.

---

<div align="center">

Made with ❤️ by **ARYAN** 🇹🇿

⭐ *Star my repositories if you like my work!* ⭐

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:2c5364,50:203a43,100:0f2027&height=100&section=footer" width="100%" />

</div>
