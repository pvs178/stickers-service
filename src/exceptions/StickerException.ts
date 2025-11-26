import { AppException } from './AppException.js';

export class StickerNotFoundException extends AppException {
  readonly statusCode = 404;
  readonly code = 'STICKER_NOT_FOUND';

  constructor(id: string) {
    super(`Sticker with id ${id} not found`, { stickerId: id });
  }
}

export class StickerValidationException extends AppException {
  readonly statusCode = 400;
  readonly code = 'VALIDATION_ERROR';

  constructor(message: string, details?: unknown) {
    super(message, details);
  }
}

export class BoardNotFoundException extends AppException {
  readonly statusCode = 404;
  readonly code = 'BOARD_NOT_FOUND';

  constructor(id: string) {
    super(`Board with id ${id} not found`, { boardId: id });
  }
}
