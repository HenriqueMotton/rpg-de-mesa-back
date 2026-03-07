import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InitiativeSession } from './entities/initiative-session.entity';
import { InitiativeService } from './initiative.service';
import { InitiativeController } from './initiative.controller';

@Module({
  imports: [TypeOrmModule.forFeature([InitiativeSession])],
  providers: [InitiativeService],
  controllers: [InitiativeController],
})
export class InitiativeModule {}
