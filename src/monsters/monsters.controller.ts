import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { MonstersService } from './monsters.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MasterGuard } from '../auth/master.guard';
import { CreateMonsterDto } from './dto/create-monster.dto';
import { UpdateMonsterDto } from './dto/update-monster.dto';

@UseGuards(JwtAuthGuard)
@Controller('monsters')
export class MonstersController {
  constructor(private readonly monstersService: MonstersService) {}

  @Get()
  findAll(@Query('type') type?: string, @Query('cr') cr?: string) {
    return this.monstersService.findAll(type, cr);
  }

  @UseGuards(MasterGuard)
  @Post()
  create(@Body() dto: CreateMonsterDto) {
    return this.monstersService.create(dto);
  }

  @UseGuards(MasterGuard)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMonsterDto) {
    return this.monstersService.update(id, dto);
  }

  @UseGuards(MasterGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.monstersService.remove(id);
  }
}
