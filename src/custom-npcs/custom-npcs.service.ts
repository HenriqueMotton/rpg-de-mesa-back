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

  findAll(): Promise<CustomNpc[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
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
