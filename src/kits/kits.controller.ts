import { Controller, Get, UseGuards } from '@nestjs/common';
import { KitsService } from './kits.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('kits')
export class KitsController {
  constructor(private readonly kitsService: KitsService) {}

  @Get()
  findAll() {
    return this.kitsService.findAll();
  }
}
