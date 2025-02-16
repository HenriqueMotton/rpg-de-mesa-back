import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Character } from './entities/character.entity';
import { CharactersService } from './characters.service';
import { CharactersController } from './characters.controller';
import { Skills } from 'src/skills/entities/skills.entity';
import { Attributes } from './entities/attributes.entity';
import { CharacterSkills } from './entities/character-skills.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Character,
      Attributes,
      Skills,
      CharacterSkills,
    ]),
  ],
  providers: [CharactersService],
  controllers: [CharactersController],
  exports: [CharactersService],
})
export class CharacterModule {}