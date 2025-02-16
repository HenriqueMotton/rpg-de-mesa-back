// src/characters/characters.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('skills')
@ApiBearerAuth()
@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @UseGuards(JwtAuthGuard)
  // @Get()
  @ApiOperation({ summary: 'Retorna todas as skills do personagem' })
  @ApiResponse({ status: 200, description: 'Skills retornados com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  async findAllByUser(@Request() req) {
    // return this.skillsService.findAllByUser(req.user.id);
  }

  // @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Retorna todas as skills' })
  @ApiResponse({ status: 200, description: 'Skills retornados com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  async findAll() {
    return this.skillsService.findAll();
  }
}