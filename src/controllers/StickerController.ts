import { Request, Response } from 'express';
import { StickerService } from '../services/StickerService.js';
import { CreateStickerDto } from '../dto/CreateStickerDto.js';
import { UpdateStickerDto } from '../dto/UpdateStickerDto.js';
import { SocketService } from '../socket/SocketService.js';

export class StickerController {
  private stickerService: StickerService;

  constructor(socketService: SocketService) {
    this.stickerService = new StickerService(socketService);
  }

  async findAll(req: Request, res: Response): Promise<void> {
    const boardId = req.query.boardId as string | undefined;
    const stickers = await this.stickerService.findAll(boardId);
    res.json(stickers);
  }

  async findById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const sticker = await this.stickerService.findById(id);
    res.json(sticker);
  }

  async create(req: Request, res: Response): Promise<void> {
    const dto = req.body as CreateStickerDto;
    const sticker = await this.stickerService.create(dto);
    res.status(201).json(sticker);
  }

  async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const dto = req.body as UpdateStickerDto;
    const sticker = await this.stickerService.update(id, dto);
    res.json(sticker);
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await this.stickerService.delete(id);
    res.status(204).send();
  }
}
