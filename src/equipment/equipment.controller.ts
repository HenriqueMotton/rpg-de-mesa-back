import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { CreateCharacterEquipmentDto } from './dto/create-character-equipment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('equipment')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Get('character/:characterId')
  findByCharacter(@Param('characterId') characterId: string, @Request() req) {
    return this.equipmentService.findByCharacter(+characterId, req.user.userId);
  }

  @Post('character/:characterId')
  create(
    @Param('characterId') characterId: string,
    @Body() dto: CreateCharacterEquipmentDto,
    @Request() req,
  ) {
    return this.equipmentService.create(+characterId, req.user.userId, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.equipmentService.remove(+id, req.user.userId);
  }
}
