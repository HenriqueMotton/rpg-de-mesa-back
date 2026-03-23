import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateCustomNpcDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() race?: string;
  @IsOptional() @IsString() role?: string;
  @IsOptional() @IsString() location?: string;
  @IsOptional() @IsString() appearance?: string;
  @IsOptional() @IsString() personality?: string;
  @IsOptional() @IsString() motivation?: string;
  @IsOptional() @IsString() secret?: string;
  @IsOptional() @IsString() faction?: string;
  @IsOptional() @IsString() notes?: string;

  @IsOptional() @IsInt() @Min(0) maxHp?: number;
  @IsOptional() @IsInt() @Min(0) currentHp?: number;

  @IsOptional()
  @IsIn(['alive', 'dead', 'missing'])
  status?: string;
}
