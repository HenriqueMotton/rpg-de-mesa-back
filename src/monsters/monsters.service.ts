import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DndMonster } from './entities/dnd-monster.entity';
import { DND_MONSTERS_SEED } from './dnd-monsters.seed';
import { CreateMonsterDto } from './dto/create-monster.dto';
import { UpdateMonsterDto } from './dto/update-monster.dto';

@Injectable()
export class MonstersService implements OnModuleInit {
  constructor(
    @InjectRepository(DndMonster)
    private readonly repo: Repository<DndMonster>,
  ) {}

  async onModuleInit() {
    const count = await this.repo.count({ where: { isCustom: false } });
    if (count === 0) {
      const entities = DND_MONSTERS_SEED.map((s) =>
        this.repo.create({
          slug: s.id,
          name: s.name,
          type: s.type,
          size: s.size,
          cr: s.cr,
          xp: s.xp,
          ac: s.ac,
          acType: s.acType ?? null,
          hp: s.hp,
          speed: s.speed,
          attacks: s.attacks,
          traits: s.traits ?? [],
          isCustom: false,
        }),
      );
      await this.repo.save(entities);
    }
  }

  findAll(type?: string, cr?: string): Promise<DndMonster[]> {
    const qb = this.repo.createQueryBuilder('m').orderBy('m.cr', 'ASC').addOrderBy('m.name', 'ASC');
    if (type) qb.andWhere('LOWER(m.type) LIKE :type', { type: `%${type.toLowerCase()}%` });
    if (cr)   qb.andWhere('m.cr = :cr', { cr });
    return qb.getMany();
  }

  async create(dto: CreateMonsterDto): Promise<DndMonster> {
    const entity = this.repo.create({ ...dto, slug: null, isCustom: true });
    return this.repo.save(entity);
  }

  async update(id: number, dto: UpdateMonsterDto): Promise<DndMonster> {
    const monster = await this.repo.findOne({ where: { id } });
    if (!monster) throw new NotFoundException('Monstro não encontrado');
    if (!monster.isCustom) throw new NotFoundException('Monstros do catálogo não podem ser editados');
    Object.assign(monster, dto);
    return this.repo.save(monster);
  }

  async remove(id: number): Promise<void> {
    const monster = await this.repo.findOne({ where: { id } });
    if (!monster) throw new NotFoundException('Monstro não encontrado');
    if (!monster.isCustom) throw new NotFoundException('Monstros do catálogo não podem ser removidos');
    await this.repo.remove(monster);
  }
}
