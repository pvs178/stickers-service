import { IsNotEmpty, IsString, IsUUID, IsNumber, IsOptional } from 'class-validator';

export class CreateStickerDto {
  @IsNotEmpty()
  @IsUUID()
  boardId: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsNumber()
  positionX: number;

  @IsNotEmpty()
  @IsNumber()
  positionY: number;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsUUID()
  userId?: string;
}
