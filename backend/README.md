# Smart Office IoT Monitoring Backend

This is the production-ready Node.js backend for the Smart Office IoT Dashboard.

## Features
- **Express.js API:** Serves both compatibility routes for the existing React frontend, and new standard REST APIs for future clients (like Discord bots).
- **Socket.IO:** Real-time event broadcasting for device state changes, camera occupancy updates, power updates, and alerts.
- **IoT Simulator:** An automatic simulation engine that toggles devices and camera states to simulate a real office environment and calculate energy consumption.
- **Alert Engine:** Automatically checks for rules (e.g. rooms left empty with devices on) and generates alerts.

## Getting Started

### Prerequisites
- Node.js (v18+)

### Installation
1. Navigate to the `backend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Server
Development mode (auto-reload):
```bash
npm run dev
```

Production build:
```bash
npm run build
npm start
```

The server will start on `http://localhost:4000`.

## Architecture
- `src/controllers` - Request handlers.
- `src/services` - Core state holding the rooms, devices, and alerts.
- `src/simulator` - Simulates IoT sensor data and updates every 20s.
- `src/alerts` - Business logic for generating energy waste warnings.
- `src/socket` - WebSocket initialization and event handling.

## Frontend Integration
The existing React frontend connects via REST API polling (`/api/state`) out of the box without any code changes. Ensure you route requests correctly (e.g., set up a proxy in Vite) if you intend to run them concurrently on different ports, or run the frontend and test the backend endpoints directly.

## API Endpoints

### Compatibility APIs (For Frontend)
- `GET /api/state`
- `POST /api/device/toggle`
- `POST /api/room/occupancy`
- `POST /api/alert/resolve`
- `POST /api/notifications/read`

### Standard REST APIs
- `GET /api/status`
- `GET /api/devices`
- `GET /api/rooms`
- `GET /api/cameras`
- `GET /api/alerts`
- `GET /api/usage`
- `GET /api/history`
- `GET /api/room/:id`
- `POST /api/device/:id/toggle`

## Socket.IO Events
Connect via Socket.IO to receive real-time updates:
- `state_updated` - Full state dump on regular simulation ticks.
- `device_updated` - Emitted when a specific device toggles ON/OFF.
- `camera_updated` - Emitted when occupancy changes.
- `alert_generated` - Emitted when a new alert is created.
