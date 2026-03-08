import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { PriceItemsService } from './price-items.service';
import { CreatePriceItemDto } from './dto/create-price-item.dto';
import { UpdatePriceItemDto } from './dto/update-price-item.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MasterGuard } from '../auth/master.guard';

@Controller('price-items')
export class PriceItemsController {
  constructor(private readonly service: PriceItemsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query('category') category?: string) {
    return this.service.findAll(category);
  }

  @UseGuards(MasterGuard)
  @Post()
  create(@Body() dto: CreatePriceItemDto) {
    return this.service.create(dto);
  }

  @UseGuards(MasterGuard)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePriceItemDto) {
    return this.service.update(id, dto);
  }

  @UseGuards(MasterGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
