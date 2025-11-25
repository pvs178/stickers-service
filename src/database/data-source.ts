import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { DatabaseConfig } from '../config/database.config.js';
import { Board } from './entities/Board.entity.js';
import { Sticker } from './entities/Sticker.entity.js';

const config = DatabaseConfig.getConfig();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.host,
  port: config.port,
  username: config.username,
  password: config.password,
  database: config.database,
  entities: [Board, Sticker],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
});
