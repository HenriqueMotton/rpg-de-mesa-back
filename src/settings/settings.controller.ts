import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MasterGuard } from '../auth/master.guard';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  get() {
    return this.settingsService.get();
  }

  @Put()
  @UseGuards(JwtAuthGuard, MasterGuard)
  update(@Body() body: { sanidadeEnabled?: boolean }) {
    return this.settingsService.update(body);
  }
}
