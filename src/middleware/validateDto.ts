import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { StickerValidationException } from '../exceptions/StickerException.js';

type ClassConstructor<T = object> = new () => T;

export function validateDto<T extends object>(dtoClass: ClassConstructor<T>) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const dtoInstance = plainToInstance(dtoClass, req.body);
      const errors: ValidationError[] = await validate(dtoInstance);

      if (errors.length > 0) {
        const formattedErrors = errors.map((error) => ({
          field: error.property,
          constraints: error.constraints,
          value: error.value
        }));

        const message = errors
          .map((error) => Object.values(error.constraints || {}).join(', '))
          .join('; ');

        throw new StickerValidationException(`Validation failed: ${message}`, formattedErrors);
      }

      req.body = dtoInstance;
      next();
    } catch (error) {
      next(error);
    }
  };
}
