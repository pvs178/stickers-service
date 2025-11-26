import { Request, Response, NextFunction } from 'express';
import { validate as validateUuid } from 'uuid';
import { ResponseFormatter } from '../types/ApiResponse.js';

export function validateUuidParam(paramName: string = 'id') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const paramValue = req.params[paramName];

    if (!paramValue || !validateUuid(paramValue)) {
      res
        .status(400)
        .json(
          ResponseFormatter.error(
            `Invalid UUID format for parameter: ${paramName}`,
            'INVALID_UUID',
            { [paramName]: paramValue }
          )
        );
      return;
    }

    next();
  };
}

export function validateUuidQuery(queryName: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const queryValue = req.query[queryName] as string | undefined;

    if (queryValue && !validateUuid(queryValue)) {
      res
        .status(400)
        .json(
          ResponseFormatter.error(
            `Invalid UUID format for query parameter: ${queryName}`,
            'INVALID_UUID',
            { [queryName]: queryValue }
          )
        );
      return;
    }

    next();
  };
}
