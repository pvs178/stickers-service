import { Router } from 'express';
import { createStickersRouter } from './stickers.routes.js';
import { SocketService } from '../../socket/SocketService.js';

export function createV1Router(socketService: SocketService): Router {
  const router = Router();

  router.use('/stickers', createStickersRouter(socketService));

  return router;
}
