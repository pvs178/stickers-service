import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateStickerDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsNumber()
  positionX?: number;

  @IsOptional()
  @IsNumber()
  positionY?: number;

  @IsOptional()
  @IsString()
  color?: string;
}
