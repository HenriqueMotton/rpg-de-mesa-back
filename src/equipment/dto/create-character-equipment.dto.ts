import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateCharacterEquipmentDto {
  @IsString()
  name: string;

  @IsBoolean()
  @IsOptional()
  fromClass?: boolean;
}
