import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, Min } from 'class-validator';

export class CreateInventoryItemDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  weight: number;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  armorType?: string; // 'light' | 'medium' | 'heavy' | 'shield'

  @IsOptional()
  @IsInt()
  @Min(0)
  armorAc?: number;

  @IsOptional()
  @IsBoolean()
  isEquipped?: boolean;

  @IsOptional()
  @IsObject()
  properties?: Record<string, unknown>;
}
