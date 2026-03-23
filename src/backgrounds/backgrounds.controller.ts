import { Controller, Get, UseGuards } from '@nestjs/common';
import { BackgroundsService } from './backgrounds.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('backgrounds')
@ApiBearerAuth()
@Controller('backgrounds')
export class BackgroundsController {
  constructor(private readonly backgroundsService: BackgroundsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Retorna todos os antecedentes disponíveis' })
  async findAll() {
    return this.backgroundsService.findAll();
  }
}
