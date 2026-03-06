import { Controller, Get, UseGuards } from '@nestjs/common';
import { RaceService } from './race.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('races')
@ApiBearerAuth()
@Controller('races')
export class RaceController {
  constructor(private readonly raceService: RaceService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Retorna todas as raças disponíveis' })
  async findAll() {
    return this.raceService.findAll();
  }
}
