import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, ParseIntPipe, UseGuards,
} from '@nestjs/common';
import { PsychologyService } from './psychology.service';
import { CreateTraumaDto } from './dto/create-trauma.dto';
import { UpdateTraumaDto } from './dto/update-trauma.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MasterGuard } from '../auth/master.guard';

@Controller('psychology')
export class PsychologyController {
  constructor(private readonly service: PsychologyService) {}

  /** Master adds a trauma to a character */
  @UseGuards(JwtAuthGuard, MasterGuard)
  @Post('character/:characterId')
  create(
    @Param('characterId', ParseIntPipe) characterId: number,
    @Body() dto: CreateTraumaDto,
  ) {
    return this.service.create(characterId, dto);
  }

  /** Any authenticated user can read their own character's traumas */
  @UseGuards(JwtAuthGuard)
  @Get('character/:characterId')
  findByCharacter(@Param('characterId', ParseIntPipe) characterId: number) {
    return this.service.findByCharacter(characterId);
  }

  /** Master overview — all traumas across all characters */
  @UseGuards(JwtAuthGuard, MasterGuard)
  @Get()
  findAll() {
    return this.service.findAll();
  }

  /** Master resolves or edits a trauma */
  @UseGuards(JwtAuthGuard, MasterGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTraumaDto,
  ) {
    return this.service.update(id, dto);
  }

  /** Master removes a trauma permanently */
  @UseGuards(JwtAuthGuard, MasterGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
