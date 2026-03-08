// src/characters/dto/update-character.dto.ts
import { IsOptional, IsInt, IsArray, IsObject } from 'class-validator';

export class UpdateCharacterDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsInt()
  pp?: number; // peças de prata

  @IsOptional()
  @IsInt()
  money?: number; // peças de ouro

  @IsOptional()
  @IsInt()
  pc?: number; // peças de cobre

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
  @IsInt()
  xp?: number;

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

  @IsOptional()
  @IsObject()
  spellSlots?: Record<string, number>; // { "1": usedCount, ... }

  @IsOptional()
  @IsInt()
  hitDiceUsed?: number;

  @IsOptional()
  @IsInt()
  asiPointsUsed?: number;

  @IsOptional()
  freeAttrEdit?: boolean;
}