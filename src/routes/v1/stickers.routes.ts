import { Router, Request, Response, NextFunction } from 'express';
import { StickerController } from '../../controllers/StickerController.js';
import { validateDto } from '../../middleware/validateDto.js';
import { validateUuidParam, validateUuidQuery } from '../../middleware/validateUuid.js';
import { CreateStickerDto } from '../../dto/CreateStickerDto.js';
import { UpdateStickerDto } from '../../dto/UpdateStickerDto.js';
import { SocketService } from '../../socket/SocketService.js';

export function createStickersRouter(socketService: SocketService): Router {
  const router = Router();
  const stickerController = new StickerController(socketService);

  const asyncHandler =
    (fn: (req: Request, res: Response) => Promise<void>) =>
    (req: Request, res: Response, next: NextFunction) =>
      Promise.resolve(fn(req, res)).catch(next);

  router.get(
    '/',
    validateUuidQuery('boardId'),
    asyncHandler((req, res) => stickerController.findAll(req, res))
  );

  router.get(
    '/:id',
    validateUuidParam('id'),
    asyncHandler((req, res) => stickerController.findById(req, res))
  );

  router.post(
    '/',
    validateDto(CreateStickerDto),
    asyncHandler((req, res) => stickerController.create(req, res))
  );

  router.put(
    '/:id',
    validateUuidParam('id'),
    validateDto(UpdateStickerDto),
    asyncHandler((req, res) => stickerController.update(req, res))
  );

  router.delete(
    '/:id',
    validateUuidParam('id'),
    asyncHandler((req, res) => stickerController.delete(req, res))
  );

  return router;
}
