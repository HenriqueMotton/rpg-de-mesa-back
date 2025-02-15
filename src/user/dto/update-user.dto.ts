import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    example: 'novoemail@example.com',
    description: 'Novo email do usuário',
    required: false,
  })
  email?: string;

  @ApiProperty({
    example: 'novasenha123',
    description: 'Nova senha do usuário',
    required: false,
  })
  password?: string;

  @ApiProperty({
    example: 'João da Silva',
    description: 'Novo nome do usuário',
    required: false,
  })
  name?: string;
}