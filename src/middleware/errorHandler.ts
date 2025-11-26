import { Request, Response, NextFunction } from 'express';
import { AppException } from '../exceptions/AppException.js';
import { ResponseFormatter } from '../types/ApiResponse.js';

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction): void {
  console.error('[Error Handler]', {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  if (err instanceof AppException) {
    res.status(err.statusCode).json(ResponseFormatter.error(err.message, err.code, err.details));
    return;
  }

  const message = process.env.NODE_ENV === 'development' ? err.message : 'Internal server error';

  res.status(500).json(ResponseFormatter.error(message, 'INTERNAL_ERROR'));
}
