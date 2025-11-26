import 'reflect-metadata';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { AppDataSource } from './database/data-source.js';
import { HealthController } from './controllers/HealthController.js';
import { errorHandler } from './middleware/errorHandler.js';
import { SocketService } from './socket/SocketService.js';
import { corsConfig } from './config/cors.config.js';
import { apiLimiter } from './config/rateLimit.config.js';
import { createV1Router } from './routes/v1/index.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT: number = parseInt(process.env.PORT || '3000', 10);

app.use(cors(corsConfig));
app.use(express.json());

const socketService = new SocketService(httpServer);
const healthController = new HealthController();

app.get('/health', (req: Request, res: Response) => healthController.check(req, res));

app.use('/api/v1', apiLimiter, createV1Router(socketService));

app.use(errorHandler);

async function start(): Promise<void> {
  try {
    await AppDataSource.initialize();
    console.log('Database connected');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }

  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('WebSocket server initialized');
  });
}

start();
