// src/characters/dto/create-character.dto.ts
import { IsNotEmpty, IsInt, IsArray, IsOptional } from 'class-validator';

export class CreateCharacterDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsInt()
  pp?: number; // peças de prata (default 0)

  @IsNotEmpty()
  @IsInt()
  money: number; // peças de ouro

  @IsOptional()
  @IsInt()
  pc?: number; // peças de cobre (default 0)

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