import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Race } from './entities/race.entity';
import { SubRace } from './entities/sub-race.entity';
import { RaceService } from './race.service';
import { RaceController } from './race.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Race, SubRace])],
  providers: [RaceService],
  controllers: [RaceController],
  exports: [RaceService],
})
export class RaceModule {}
