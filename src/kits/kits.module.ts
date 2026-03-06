import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Kit } from './entities/kit.entity';
import { KitsService } from './kits.service';
import { KitsController } from './kits.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Kit])],
  providers: [KitsService],
  controllers: [KitsController],
})
export class KitsModule {}
