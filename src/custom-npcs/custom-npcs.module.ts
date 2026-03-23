import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomNpc } from './entities/custom-npc.entity';
import { CustomNpcsService } from './custom-npcs.service';
import { CustomNpcsController } from './custom-npcs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CustomNpc])],
  providers: [CustomNpcsService],
  controllers: [CustomNpcsController],
})
export class CustomNpcsModule {}
