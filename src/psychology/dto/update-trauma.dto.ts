import { IsBoolean, IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateTraumaDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(['mild', 'moderate', 'severe'])
  severity?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
