// src/characters/dto/create-character.dto.ts
import { IsNotEmpty, IsInt, IsArray, IsOptional } from 'class-validator';

export class CreateCharacterDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsInt()
  money: number;

  @IsNotEmpty()
  @IsInt()
  health: number;

  @IsNotEmpty()
  attributes: {
    forca: number;
    destreza: number;
    constituicao: number;
    inteligencia: number;
    sabedoria: number;
    carisma: number;
  };

  @IsOptional()
  @IsArray()
  selectedSkills: number[]; // IDs das perícias selecionadas

  @IsOptional()
  @IsInt()
  classId?: number;

  @IsOptional()
  @IsInt()
  raceId?: number;

  @IsOptional()
  @IsInt()
  subRaceId?: number;

  @IsOptional()
  @IsInt()
  height?: number;
}