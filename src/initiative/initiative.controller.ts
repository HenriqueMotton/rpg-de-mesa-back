import { Controller, Get, Post, Patch, Delete, Body, UseGuards, Query } from '@nestjs/common';
import { InitiativeService } from './initiative.service';
import { InitiativeEntry } from './entities/initiative-session.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MasterGuard } from '../auth/master.guard';

@UseGuards(JwtAuthGuard)
@Controller('initiative')
export class InitiativeController {
  constructor(private readonly initiativeService: InitiativeService) {}

  @Get('active')
  getActive() {
    return this.initiativeService.getActive();
  }

  @UseGuards(MasterGuard)
  @Post('publish')
  publish(@Body('entries') entries: InitiativeEntry[]) {
    return this.initiativeService.publish(entries ?? []);
  }

  @UseGuards(MasterGuard)
  @Patch('active/turn')
  setTurn(@Body('index') index: number) {
    return this.initiativeService.setTurn(index ?? 0);
  }

  @UseGuards(MasterGuard)
  @Delete('active')
  deactivate() {
    return this.initiativeService.deactivate();
  }

  @UseGuards(MasterGuard)
  @Patch('active/entry-hp')
  updateEntryHp(@Body('index') index: number, @Body('currentHp') currentHp: number) {
    return this.initiativeService.updateEntryHp(index ?? 0, currentHp ?? 0);
  }

  @UseGuards(JwtAuthGuard)
  @Get('active/xp-summary')
  getXpSummary() {
    return this.initiativeService.getXpSummary();
  }
}
