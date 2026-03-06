import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharacterSpell } from './entities/character-spell.entity';
import { Character } from '../characters/entities/character.entity';
import { SpellsService } from './spells.service';
import { SpellsController } from './spells.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CharacterSpell, Character])],
  controllers: [SpellsController],
  providers: [SpellsService],
})
export class SpellsModule {}
