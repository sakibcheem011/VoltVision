# VoltVision | Enterprise Core Smart Office IoT Dashboard

VoltVision is a comprehensive, real-time IoT dashboard system designed for smart office management. It provides a centralized platform to monitor and control IoT devices such as lights, fans, and sensors across different rooms in an office environment. The project is built with a modern microservices-style architecture, including a React frontend, a Node.js backend, and a Discord bot for remote administration.

## 🚀 Features

### 💻 Web Dashboard (Frontend)
- **Real-Time Monitoring:** Live updates of all connected IoT devices via WebSockets.
- **Device Control:** Toggle lights, fans, and other smart office appliances instantly.
- **Room Management:** View specific telemetry data per room (e.g., Executive Suite, Conference Room).
- **Energy Analytics:** Track real-time power consumption, voltage, and efficiency metrics.
- **Hardware Architecture View:** Visualize the physical connections between ESP32 microcontrollers and the server.
- **Responsive UI:** Built with React, TailwindCSS, and Lucide Icons for a premium, glassmorphism design.

### ⚙️ IoT Gateway (Backend)
- **REST API:** Endpoints for fetching device states, history, and usage analytics.
- **WebSocket Server:** Uses Socket.io to push real-time state changes to all connected clients.
- **Simulation Engine:** Built-in simulator that generates realistic IoT telemetry data, mimicking physical ESP32 devices.
- **CORS Secured:** Configured to accept connections strictly from the whitelisted frontend domains.

### 🤖 Discord Bot
- **Slash Commands:** Integrated Discord bot allowing remote management of the office.
- **`/status`:** Fetches the current live status of the office (Active devices, total power consumption).
- **`/devices`:** Lists all registered IoT devices and their current states.
- **REST Integration:** The bot communicates directly with the Node.js backend to fetch real-time data.

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS, Recharts, Framer Motion, Socket.io-client
- **Backend:** Node.js, Express.js, Socket.io, TypeScript
- **Discord Bot:** Node.js, Discord.js v14, Axios
- **Deployment:** Railway (Frontend, Backend, Discord Bot)

## 📦 Project Structure

```text
VoltVision/
├── backend/            # Express.js REST API & Socket.io server
├── discord-bot/        # Discord.js bot implementation
├── src/                # React frontend source code
├── package.json        # Frontend dependencies and scripts
└── RAILWAY_DEPLOYMENT.md # Deployment guide
```

## ⚙️ Running Locally

### 1. Setup Backend
```bash
cd backend
npm install
npm run dev
```
The backend will run on `http://localhost:4000`.

### 2. Setup Frontend
Open a new terminal window:
```bash
npm install
npm run dev
```
The frontend will run on `http://localhost:5173`.

### 3. Setup Discord Bot (Optional)
Open a new terminal window:
```bash
cd discord-bot
npm install
# Ensure you set DISCORD_TOKEN and CLIENT_ID in your environment variables
node scripts/register-commands.js
npm start
```

## 🌐 Deployment
This project is fully configured for deployment on [Railway](https://railway.app). 
For detailed deployment instructions, refer to `RAILWAY_DEPLOYMENT.md`.
