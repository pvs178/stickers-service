import { Request, Response, NextFunction } from 'express';
import {
  StickerNotFoundException,
  StickerValidationException
} from '../exceptions/StickerException.js';

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof StickerNotFoundException) {
    res.status(404).json({ error: err.message });
    return;
  }

  if (err instanceof StickerValidationException) {
    res.status(400).json({ error: err.message });
    return;
  }

  res.status(500).json({ error: 'Internal server error' });
}
