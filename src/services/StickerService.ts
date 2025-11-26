import { StickerRepository } from '../repositories/StickerRepository.js';
import { Sticker } from '../database/entities/Sticker.entity.js';
import { CreateStickerDto } from '../dto/CreateStickerDto.js';
import { UpdateStickerDto } from '../dto/UpdateStickerDto.js';
import { SocketService } from '../socket/SocketService.js';
import { StickerNotFoundException } from '../exceptions/StickerException.js';

export class StickerService {
  private stickerRepository: StickerRepository;
  private socketService: SocketService;

  constructor(socketService: SocketService) {
    this.stickerRepository = new StickerRepository();
    this.socketService = socketService;
  }

  async findAll(boardId?: string): Promise<Sticker[]> {
    return this.stickerRepository.findAll(boardId);
  }

  async findById(id: string): Promise<Sticker> {
    const sticker = await this.stickerRepository.findById(id);
    if (!sticker) {
      throw new StickerNotFoundException(id);
    }
    return sticker;
  }

  async create(dto: CreateStickerDto): Promise<Sticker> {
    const sticker = await this.stickerRepository.create(dto);
    this.socketService.emitStickerCreated(sticker);
    return sticker;
  }

  async update(id: string, dto: UpdateStickerDto): Promise<Sticker> {
    await this.findById(id);

    const updatedSticker = await this.stickerRepository.update(id, dto);
    if (!updatedSticker) {
      throw new StickerNotFoundException(id);
    }

    this.socketService.emitStickerUpdated(updatedSticker);
    return updatedSticker;
  }

  async delete(id: string): Promise<void> {
    const sticker = await this.findById(id);
    await this.stickerRepository.delete(id);
    this.socketService.emitStickerDeleted(id, sticker.boardId);
  }
}
