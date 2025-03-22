// src/characters/dto/update-character.dto.ts
import { IsOptional, IsInt, IsArray } from 'class-validator';

export class UpdateCharacterDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsInt()
  money?: number;

  @IsOptional()
  @IsInt()
  health?: number;

  @IsOptional()
  @IsInt()
  maxHealth?: number;
  
  @IsOptional()
  @IsInt()
  nivel?: number;

  @IsOptional()
  attributes?: {
    forca?: number;
    destreza?: number;
    constituicao?: number;
    inteligencia?: number;
    sabedoria?: number;
    carisma?: number;
  };

  @IsOptional()
  @IsArray()
  selectedSkills?: number[]; // IDs das perícias selecionadas

}