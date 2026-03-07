// src/characters/characters.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { CharactersService } from './characters.service';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MasterGuard } from '../auth/master.guard';
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
    return this.charactersService.findAllByUser(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, MasterGuard)
  @Get('master/all')
  async findAllCharacters() {
    return this.charactersService.findAllCharacters();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Retorna um personagem específico' })
  @ApiResponse({ status: 200, description: 'Personagem retornado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 404, description: 'Personagem não encontrado.' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.charactersService.findOne(+id, req.user.userId);
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

  @UseGuards(JwtAuthGuard, MasterGuard)
  @Post(':id/rest')
  @ApiOperation({ summary: 'Aplica descanso a um personagem (apenas mestre)' })
  async rest(
    @Param('id') id: string,
    @Body() body: { restType: 'long' | 'short'; hitDiceSpent?: number },
  ) {
    return this.charactersService.rest(+id, body.restType, body.hitDiceSpent ?? 0);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/spend-hit-dice')
  @ApiOperation({ summary: 'Gasta um dado de vida para se curar (descanso curto)' })
  async spendHitDice(@Param('id') id: string) {
    return this.charactersService.spendHitDice(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/avatar')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const dir = path.join(process.cwd(), 'uploads', 'avatars');
        fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `avatar-${req.params.id}-${uniqueSuffix}${path.extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/image\/(jpeg|jpg|png|gif|webp)/)) {
        return cb(new Error('Apenas imagens são permitidas'), false);
      }
      cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 },
  }))
  async uploadAvatar(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    return this.charactersService.uploadAvatar(+id, file.filename);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/avatar')
  async removeAvatar(@Param('id') id: string) {
    return this.charactersService.removeAvatar(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Remove um personagem' })
  @ApiResponse({ status: 204, description: 'Personagem removido com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 404, description: 'Personagem não encontrado.' })
  async remove(@Param('id') id: string, @Request() req) {
    return this.charactersService.remove(+id, req.user.userId);
  }
}