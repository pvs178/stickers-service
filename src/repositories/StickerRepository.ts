import { Repository } from 'typeorm';
import { AppDataSource } from '../database/data-source.js';
import { Sticker } from '../database/entities/Sticker.entity.js';

export class StickerRepository {
  private repository: Repository<Sticker>;

  constructor() {
    this.repository = AppDataSource.getRepository(Sticker);
  }

  async findById(id: string): Promise<Sticker | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findAll(boardId?: string): Promise<Sticker[]> {
    if (boardId) {
      return this.repository.find({ where: { boardId } });
    }
    return this.repository.find();
  }

  async create(sticker: Partial<Sticker>): Promise<Sticker> {
    const newSticker = this.repository.create(sticker);
    return this.repository.save(newSticker);
  }

  async update(id: string, sticker: Partial<Sticker>): Promise<Sticker | null> {
    await this.repository.update(id, sticker);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
