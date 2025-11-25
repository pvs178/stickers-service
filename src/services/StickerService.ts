import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { StickerRepository } from '../repositories/StickerRepository.js';
import { Sticker } from '../database/entities/Sticker.entity.js';
import { CreateStickerDto } from '../dto/CreateStickerDto.js';
import { UpdateStickerDto } from '../dto/UpdateStickerDto.js';
import {
  StickerNotFoundException,
  StickerValidationException
} from '../exceptions/StickerException.js';

export class StickerService {
  private stickerRepository: StickerRepository;

  constructor() {
    this.stickerRepository = new StickerRepository();
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
    const createDto = plainToInstance(CreateStickerDto, dto);
    const errors = await validate(createDto);

    if (errors.length > 0) {
      const messages = errors
        .map((error) => Object.values(error.constraints || {}).join(', '))
        .join('; ');
      throw new StickerValidationException(`Validation failed: ${messages}`);
    }

    return this.stickerRepository.create({
      boardId: dto.boardId,
      content: dto.content,
      positionX: dto.positionX,
      positionY: dto.positionY,
      color: dto.color,
      userId: dto.userId
    });
  }

  async update(id: string, dto: UpdateStickerDto): Promise<Sticker> {
    const existingSticker = await this.stickerRepository.findById(id);
    if (!existingSticker) {
      throw new StickerNotFoundException(id);
    }

    const updateDto = plainToInstance(UpdateStickerDto, dto);
    const errors = await validate(updateDto);

    if (errors.length > 0) {
      const messages = errors
        .map((error) => Object.values(error.constraints || {}).join(', '))
        .join('; ');
      throw new StickerValidationException(`Validation failed: ${messages}`);
    }

    const updateData: Partial<Sticker> = {};
    if (dto.content !== undefined) updateData.content = dto.content;
    if (dto.positionX !== undefined) updateData.positionX = dto.positionX;
    if (dto.positionY !== undefined) updateData.positionY = dto.positionY;
    if (dto.color !== undefined) updateData.color = dto.color;

    const updatedSticker = await this.stickerRepository.update(id, updateData);
    if (!updatedSticker) {
      throw new StickerNotFoundException(id);
    }

    return updatedSticker;
  }

  async delete(id: string): Promise<void> {
    const sticker = await this.stickerRepository.findById(id);
    if (!sticker) {
      throw new StickerNotFoundException(id);
    }

    await this.stickerRepository.delete(id);
  }
}
