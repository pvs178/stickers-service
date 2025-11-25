import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { Sticker } from '../database/entities/Sticker.entity.js';

export class SocketService {
  private io: SocketIOServer;

  constructor(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE']
      }
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.io.on('connection', (socket: Socket) => {
      console.log(`Client connected: ${socket.id}`);

      socket.on('join:board', (boardId: string) => {
        socket.join(`board:${boardId}`);
        console.log(`Client ${socket.id} joined board: ${boardId}`);
      });

      socket.on('leave:board', (boardId: string) => {
        socket.leave(`board:${boardId}`);
        console.log(`Client ${socket.id} left board: ${boardId}`);
      });

      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
  }

  emitStickerCreated(sticker: Sticker): void {
    this.io.to(`board:${sticker.boardId}`).emit('sticker:created', sticker);
  }

  emitStickerUpdated(sticker: Sticker): void {
    this.io.to(`board:${sticker.boardId}`).emit('sticker:updated', sticker);
  }

  emitStickerDeleted(stickerId: string, boardId: string): void {
    this.io.to(`board:${boardId}`).emit('sticker:deleted', { id: stickerId, boardId });
  }

  getIO(): SocketIOServer {
    return this.io;
  }
}
