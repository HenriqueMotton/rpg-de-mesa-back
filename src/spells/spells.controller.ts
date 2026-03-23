import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request, HttpCode, Query } from '@nestjs/common';
import { SpellsService } from './spells.service';
import { CreateCharacterSpellDto } from './dto/create-character-spell.dto';
import { UpdateCharacterSpellDto } from './dto/update-character-spell.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MasterGuard } from '../auth/master.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('spells')
@ApiBearerAuth()
@Controller('spells')
export class SpellsController {
  constructor(private readonly spellsService: SpellsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('catalog')
  @ApiOperation({ summary: 'Retorna o catálogo de magias D&D 5e' })
  async findDndSpells(
    @Query('class') className?: string,
    @Query('maxLevel') maxLevel?: string,
  ) {
    return this.spellsService.findDndSpells(
      className,
      maxLevel !== undefined ? parseInt(maxLevel) : undefined,
    );
  }

  @UseGuards(JwtAuthGuard, MasterGuard)
  @Get('master/all')
  @ApiOperation({ summary: 'Retorna todas as magias de todos os personagens (apenas mestre)' })
  async findAllForMaster() {
    return this.spellsService.findAllForMaster();
  }

  @UseGuards(JwtAuthGuard, MasterGuard)
  @Get('master/character/:characterId')
  @ApiOperation({ summary: 'Retorna magias de um personagem específico (apenas mestre)' })
  async findByCharacterMaster(@Param('characterId') characterId: string) {
    return this.spellsService.findByCharacterMaster(+characterId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('character/:characterId/bulk')
  @ApiOperation({ summary: 'Adiciona múltiplas magias de uma vez' })
  async bulkCreate(
    @Param('characterId') characterId: string,
    @Body() body: { spells: any[] },
    @Request() req,
  ) {
    return this.spellsService.bulkCreate(+characterId, req.user.userId, body.spells);
  }

  @UseGuards(JwtAuthGuard)
  @Put('character/:characterId/prepare')
  @HttpCode(204)
  @ApiOperation({ summary: 'Define as magias preparadas do personagem' })
  async bulkPrepare(
    @Param('characterId') characterId: string,
    @Body() body: { preparedIds: number[] },
    @Request() req,
  ) {
    await this.spellsService.bulkSetPrepared(+characterId, req.user.userId, body.preparedIds ?? []);
  }

  @UseGuards(JwtAuthGuard)
  @Get('character/:characterId')
  @ApiOperation({ summary: 'Retorna as magias do personagem' })
  async findByCharacter(@Param('characterId') characterId: string, @Request() req) {
    return this.spellsService.findByCharacter(+characterId, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('character/:characterId')
  @ApiOperation({ summary: 'Adiciona uma magia ao grimório do personagem' })
  async create(
    @Param('characterId') characterId: string,
    @Body() dto: CreateCharacterSpellDto,
    @Request() req,
  ) {
    return this.spellsService.create(+characterId, req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Atualiza uma magia' })
  async update(@Param('id') id: string, @Body() dto: UpdateCharacterSpellDto, @Request() req) {
    return this.spellsService.update(+id, req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Remove uma magia do grimório' })
  async remove(@Param('id') id: string, @Request() req) {
    return this.spellsService.remove(+id, req.user.userId);
  }
}
