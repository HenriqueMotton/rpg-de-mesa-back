import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { SpellsService } from './spells.service';
import { CreateCharacterSpellDto } from './dto/create-character-spell.dto';
import { UpdateCharacterSpellDto } from './dto/update-character-spell.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('spells')
@ApiBearerAuth()
@Controller('spells')
export class SpellsController {
  constructor(private readonly spellsService: SpellsService) {}

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
