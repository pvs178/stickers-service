import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import { ResponseFormatter } from '../types/ApiResponse.js';

export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 300,
  handler: (req: Request, res: Response) => {
    res
      .status(429)
      .json(
        ResponseFormatter.error(
          'Too many API requests, please slow down.',
          'API_RATE_LIMIT_EXCEEDED'
        )
      );
  },
  standardHeaders: true,
  legacyHeaders: false
});
