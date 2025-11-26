import { Request, Response } from 'express';
import { AppDataSource } from '../database/data-source.js';
import { ResponseFormatter } from '../types/ApiResponse.js';

export class HealthController {
  async check(_req: Request, res: Response): Promise<void> {
    const healthData = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        connected: false,
        type: 'postgres'
      },
      version: process.env.npm_package_version || '1.0.0'
    };

    try {
      if (AppDataSource.isInitialized) {
        await AppDataSource.query('SELECT 1');
        healthData.database.connected = true;
      }

      res.json(ResponseFormatter.success(healthData));
    } catch {
      healthData.status = 'degraded';
      res.status(503).json(ResponseFormatter.success(healthData));
    }
  }
}
