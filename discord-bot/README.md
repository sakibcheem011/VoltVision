# VoltVision Discord Bot

A standalone Discord bot for the VoltVision Smart Office IoT Monitoring System. It fetches live data from the backend APIs and provides beautiful Embed summaries directly in your Discord server.

## Prerequisites
- Node.js (v16.9.0 or higher required by discord.js)
- A registered Discord Application with Bot permissions.

## Setup Instructions

### 1. Configure the `.env` file
Copy the `.env.example` file to `.env` in this directory:
```bash
cp .env.example .env
```
Open `.env` and fill in your variables:
- `DISCORD_TOKEN`: Your Discord bot token from the Discord Developer Portal.
- `CLIENT_ID`: Your Discord application's Client ID.
- `BACKEND_URL`: The URL of your running backend (defaults to `http://localhost:4000`).

### 2. Register Slash Commands
Before you can use the commands, you must register them with Discord's API. Run the following command:
```bash
npm run register-commands
```
*(This may take up to an hour to propagate globally across all servers, though usually it's instant for servers the bot is freshly added to. You can alternatively configure guild-specific registration in `scripts/register-commands.js` for instant updates).*

### 3. Start the Bot
Run the bot using:
```bash
npm start
```
You should see a message in the console indicating the bot has logged in successfully.

## Available Commands

### `/status`
Shows the overall system status, total devices, devices currently ON, active alerts, and current power usage.

### `/devices`
Lists all 15 devices in the office, grouped by room, displaying their current ON/OFF status and power draw.

### `/usage`
Displays today's total energy usage (in kWh), the estimated cost, and the real-time total power (in Watts).

### `/alerts`
Lists any active system alerts, such as energy waste warnings (e.g., when a room is left empty with devices running).

### `/room <room_name>`
Provides a focused breakdown of a specific room (e.g., "Drawing Room", "Work Room 1"). Shows the AI camera's occupancy detection, room total power, and a list of active devices.

## Troubleshooting
- **No response / Bot is offline:** Ensure your `npm start` process is running.
- **"The IoT Gateway is offline" Error:** Ensure your `backend/` project is running locally on port 4000.
- **Commands not showing up:** Ensure you ran `npm run register-commands` and that your Discord client is refreshed (Ctrl+R).
