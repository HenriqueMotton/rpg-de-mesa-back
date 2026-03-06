import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharacterEquipment } from './entities/character-equipment.entity';
import { Character } from '../characters/entities/character.entity';
import { EquipmentService } from './equipment.service';
import { EquipmentController } from './equipment.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CharacterEquipment, Character])],
  providers: [EquipmentService],
  controllers: [EquipmentController],
})
export class EquipmentModule {}
