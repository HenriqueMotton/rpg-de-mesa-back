import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Background } from './entities/background.entity';
import { BackgroundsService } from './backgrounds.service';
import { BackgroundsController } from './backgrounds.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Background])],
  providers: [BackgroundsService],
  controllers: [BackgroundsController],
  exports: [BackgroundsService],
})
export class BackgroundsModule {}
