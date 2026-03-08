import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonstersController } from './monsters.controller';
import { MonstersService } from './monsters.service';
import { DndMonster } from './entities/dnd-monster.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DndMonster])],
  controllers: [MonstersController],
  providers: [MonstersService],
})
export class MonstersModule {}
