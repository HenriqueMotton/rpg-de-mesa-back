import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trauma } from './entities/trauma.entity';
import { Character } from '../characters/entities/character.entity';
import { PsychologyService } from './psychology.service';
import { PsychologyController } from './psychology.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Trauma, Character])],
  providers: [PsychologyService],
  controllers: [PsychologyController],
})
export class PsychologyModule {}
