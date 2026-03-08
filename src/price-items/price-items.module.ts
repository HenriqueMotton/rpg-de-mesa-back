import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceItem } from './entities/price-item.entity';
import { PriceItemsService } from './price-items.service';
import { PriceItemsController } from './price-items.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PriceItem])],
  providers: [PriceItemsService],
  controllers: [PriceItemsController],
})
export class PriceItemsModule {}
