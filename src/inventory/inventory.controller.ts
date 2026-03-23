import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MasterGuard } from '../auth/master.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('inventory')
@ApiBearerAuth()
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @UseGuards(JwtAuthGuard, MasterGuard)
  @Get('master/character/:characterId')
  @ApiOperation({ summary: 'Retorna o inventário do personagem (apenas mestre)' })
  async findByCharacterMaster(@Param('characterId') characterId: string) {
    return this.inventoryService.findByCharacterMaster(+characterId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('character/:characterId')
  @ApiOperation({ summary: 'Retorna o inventário do personagem com peso total e capacidade de carga' })
  async findByCharacter(@Param('characterId') characterId: string, @Request() req) {
    return this.inventoryService.findByCharacter(+characterId, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('character/:characterId')
  @ApiOperation({ summary: 'Adiciona um item ao inventário do personagem' })
  async create(
    @Param('characterId') characterId: string,
    @Body() dto: CreateInventoryItemDto,
    @Request() req,
  ) {
    return this.inventoryService.create(+characterId, req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Atualiza um item do inventário' })
  async update(@Param('id') id: string, @Body() dto: UpdateInventoryItemDto, @Request() req) {
    return this.inventoryService.update(+id, req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Remove um item do inventário' })
  async remove(@Param('id') id: string, @Request() req) {
    return this.inventoryService.remove(+id, req.user.userId);
  }
}
