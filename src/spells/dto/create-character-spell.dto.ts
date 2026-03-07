import { IsBoolean, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateCharacterSpellDto {
  @IsString()
  name: string;

  @IsInt()
  @Min(0)
  @Max(9)
  level: number;

  @IsOptional()
  @IsString()
  school?: string;

  @IsOptional()
  @IsString()
  castingTime?: string;

  @IsOptional()
  @IsString()
  range?: string;

  @IsOptional()
  @IsString()
  duration?: string;

  @IsOptional()
  @IsBoolean()
  componentV?: boolean;

  @IsOptional()
  @IsBoolean()
  componentS?: boolean;

  @IsOptional()
  @IsBoolean()
  componentM?: boolean;

  @IsOptional()
  @IsString()
  materialComponent?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  prepared?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  activeUntil?: Date | null;

  @IsOptional()
  @IsBoolean()
  isCustom?: boolean;

  @IsOptional()
  @IsBoolean()
  isRacial?: boolean;
}
