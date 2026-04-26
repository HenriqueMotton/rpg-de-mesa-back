import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { CustomNpcsService } from './custom-npcs.service';
import { CreateCustomNpcDto } from './dto/create-custom-npc.dto';
import { UpdateCustomNpcDto } from './dto/update-custom-npc.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MasterGuard } from '../auth/master.guard';

@UseGuards(JwtAuthGuard, MasterGuard)
@Controller('custom-npcs')
export class CustomNpcsController {
  constructor(private readonly service: CustomNpcsService) {}

  @Post() create(@Body() dto: CreateCustomNpcDto) { return this.service.create(dto); }
  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return this.service.findAll(
      page ? +page : undefined,
      limit ? +limit : undefined,
      search,
      status,
    );
  }
  @Patch(':id') update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCustomNpcDto) { return this.service.update(id, dto); }
  @Delete(':id') remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}
