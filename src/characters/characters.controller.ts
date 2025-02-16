// src/characters/characters.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { CharactersService } from './characters.service';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('characters')
@ApiBearerAuth()
@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Cria um novo personagem' })
  @ApiResponse({ status: 201, description: 'Personagem criado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  async create(@Body() createCharacterDto: CreateCharacterDto, @Request() req) {
    return this.charactersService.create(createCharacterDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Retorna todos os personagens do usuário' })
  @ApiResponse({ status: 200, description: 'Personagens retornados com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  async findAll(@Request() req) {
    return this.charactersService.findAllByUser(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Retorna um personagem específico' })
  @ApiResponse({ status: 200, description: 'Personagem retornado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 404, description: 'Personagem não encontrado.' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.charactersService.findOne(+id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Atualiza um personagem' })
  @ApiResponse({ status: 200, description: 'Personagem atualizado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 404, description: 'Personagem não encontrado.' })
  async update(@Param('id') id: string, @Body() updateCharacterDto: UpdateCharacterDto, @Request() req) {
    return this.charactersService.update(+id, updateCharacterDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Remove um personagem' })
  @ApiResponse({ status: 204, description: 'Personagem removido com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 404, description: 'Personagem não encontrado.' })
  async remove(@Param('id') id: string, @Request() req) {
    return this.charactersService.remove(+id, req.user.id);
  }
}