import 'reflect-metadata';
import dotenv from 'dotenv';
import express, { Request, Response, RequestHandler } from 'express';
import { createServer } from 'http';
import { AppDataSource } from './database/data-source.js';
import { StickerController } from './controllers/StickerController.js';
import { errorHandler } from './middleware/errorHandler.js';
import { validateDto } from './middleware/validateDto.js';
import { SocketService } from './socket/SocketService.js';
import { CreateStickerDto } from './dto/CreateStickerDto.js';
import { UpdateStickerDto } from './dto/UpdateStickerDto.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT: number = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

const socketService = new SocketService(httpServer);
const stickerController = new StickerController(socketService);

const asyncHandler =
  (fn: (req: Request, res: Response) => Promise<void>): RequestHandler =>
  (req, res, next) =>
    fn(req, res).catch(next);

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.get(
  '/api/v1/stickers',
  asyncHandler((req, res) => stickerController.findAll(req, res))
);
app.get(
  '/api/v1/stickers/:id',
  asyncHandler((req, res) => stickerController.findById(req, res))
);
app.post(
  '/api/v1/stickers',
  validateDto(CreateStickerDto),
  asyncHandler((req, res) => stickerController.create(req, res))
);
app.put(
  '/api/v1/stickers/:id',
  validateDto(UpdateStickerDto),
  asyncHandler((req, res) => stickerController.update(req, res))
);
app.delete(
  '/api/v1/stickers/:id',
  asyncHandler((req, res) => stickerController.delete(req, res))
);

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
