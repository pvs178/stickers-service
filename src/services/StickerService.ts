import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { StickerRepository } from '../repositories/StickerRepository.js';
import { Sticker } from '../database/entities/Sticker.entity.js';
import { CreateStickerDto } from '../dto/CreateStickerDto.js';
import { UpdateStickerDto } from '../dto/UpdateStickerDto.js';
import { SocketService } from '../socket/SocketService.js';
import {
  StickerNotFoundException,
  StickerValidationException
} from '../exceptions/StickerException.js';

export class StickerService {
  private stickerRepository: StickerRepository;
  private socketService: SocketService;

  constructor(socketService: SocketService) {
    this.stickerRepository = new StickerRepository();
    this.socketService = socketService;
  }

  private async validateDto<T extends object>(dto: T, DtoClass: new () => T): Promise<void> {
    const instance = plainToInstance(DtoClass, dto);
    const errors = await validate(instance);

    if (errors.length > 0) {
      const messages = errors
        .map((error) => Object.values(error.constraints || {}).join(', '))
        .join('; ');
      throw new StickerValidationException(`Validation failed: ${messages}`);
    }
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
    await this.validateDto(dto, CreateStickerDto);
    const sticker = await this.stickerRepository.create(dto);
    this.socketService.emitStickerCreated(sticker);
    return sticker;
  }

  async update(id: string, dto: UpdateStickerDto): Promise<Sticker> {
    await this.findById(id);
    await this.validateDto(dto, UpdateStickerDto);

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
