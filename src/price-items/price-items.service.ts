import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PriceItem } from './entities/price-item.entity';
import { CreatePriceItemDto } from './dto/create-price-item.dto';
import { UpdatePriceItemDto } from './dto/update-price-item.dto';
import { PRICE_ITEMS_SEED } from './price-items.seed';

@Injectable()
export class PriceItemsService implements OnModuleInit {
  constructor(
    @InjectRepository(PriceItem)
    private readonly repo: Repository<PriceItem>,
  ) {}

  async onModuleInit() {
    const count = await this.repo.count({ where: { isCustom: false } });
    if (count === 0) {
      const items = PRICE_ITEMS_SEED.map((s) => {
        const seed = s as typeof s & { notes?: string };
        return this.repo.create({ ...seed, slug: seed.slug, notes: seed.notes ?? null, isCustom: false });
      });
      await this.repo.save(items);
    }
  }

  findAll(category?: string): Promise<PriceItem[]> {
    const qb = this.repo
      .createQueryBuilder('p')
      .orderBy('p.priceGp', 'ASC');

    if (category) {
      qb.where('p.category = :category', { category });
    }

    return qb.getMany();
  }

  async create(dto: CreatePriceItemDto): Promise<PriceItem> {
    const item = this.repo.create({ ...dto, slug: null, isCustom: true });
    return this.repo.save(item);
  }

  async update(id: number, dto: UpdatePriceItemDto): Promise<PriceItem> {
    const item = await this.repo.findOne({ where: { id, isCustom: true } });
    if (!item) throw new NotFoundException('Item não encontrado ou não editável');
    Object.assign(item, dto);
    return this.repo.save(item);
  }

  async remove(id: number): Promise<void> {
    const item = await this.repo.findOne({ where: { id, isCustom: true } });
    if (!item) throw new NotFoundException('Item não encontrado ou não removível');
    await this.repo.remove(item);
  }
}
