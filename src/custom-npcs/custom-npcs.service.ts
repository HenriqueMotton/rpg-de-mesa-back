import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomNpc } from './entities/custom-npc.entity';
import { CreateCustomNpcDto } from './dto/create-custom-npc.dto';
import { UpdateCustomNpcDto } from './dto/update-custom-npc.dto';

@Injectable()
export class CustomNpcsService {
  constructor(
    @InjectRepository(CustomNpc)
    private readonly repo: Repository<CustomNpc>,
  ) {}

  create(dto: CreateCustomNpcDto): Promise<CustomNpc> {
    const npc = this.repo.create({ ...dto, status: dto.status ?? 'alive' });
    return this.repo.save(npc);
  }

  async findAll(
    page?: number,
    limit?: number,
    search?: string,
    status?: string,
  ): Promise<{ data: CustomNpc[]; total: number }> {
    const qb = this.repo.createQueryBuilder('npc');
    if (status) qb.andWhere('npc.status = :status', { status });
    if (search?.trim()) qb.andWhere('LOWER(npc.name) LIKE LOWER(:search)', { search: `%${search.trim()}%` });
    qb.orderBy('npc.createdAt', 'DESC');
    if (page && limit) {
      qb.skip((page - 1) * limit).take(limit);
    }
    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }

  async update(id: number, dto: UpdateCustomNpcDto): Promise<CustomNpc> {
    const npc = await this.repo.findOne({ where: { id } });
    if (!npc) throw new NotFoundException('NPC não encontrado');
    Object.assign(npc, dto);
    return this.repo.save(npc);
  }

  async remove(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
