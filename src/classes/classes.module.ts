import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DndClass } from './entities/dnd-class.entity';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DndClass])],
  controllers: [ClassesController],
  providers: [ClassesService],
})
export class ClassesModule {}
