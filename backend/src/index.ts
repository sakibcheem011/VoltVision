import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import apiRoutes from './routes';
import { initSocket } from './socket';
import { startSimulator } from './simulator';
import { errorHandler, notFoundHandler } from './middlewares/errorMiddleware';

// Load env vars
dotenv.config();

const app = express();
const server = createServer(app);

// Initialize Socket.io
initSocket(server);

// Middlewares
app.use(helmet());
const allowedOrigin = process.env.FRONTEND_URL || '*';
app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// Health check for Render
app.get('/health', (req, res) => res.status(200).json({ status: 'healthy' }));

// Routes
app.use('/api', apiRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`[Server] IoT Backend running on port ${PORT}`);
  // Start the IoT Simulator
  startSimulator();
});
