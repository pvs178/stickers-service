export class StickerNotFoundException extends Error {
  constructor(id: string) {
    super(`Sticker with id ${id} not found`);
    this.name = 'StickerNotFoundException';
  }
}

export class StickerValidationException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StickerValidationException';
  }
}
