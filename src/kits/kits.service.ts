import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Kit, KitItem } from './entities/kit.entity';

function item(name: string, quantity: number, weight: number): KitItem {
  return { name, quantity, weight };
}

const KIT_SEED: { name: string; items: KitItem[] }[] = [
  {
    name: 'Kit de explorador',
    items: [
      item('Mochila',          1,  2.5),
      item('Saco de dormir',   1,  3  ),
      item('Kit de refeição',  1,  0.5),
      item('Caixa de isca',    1,  0.5),
      item('Tocha',            10, 0.5),
      item('Rações',           10, 1  ),
      item('Cantil',           1,  2.5),
      item('Corda de cânhamo', 1,  5  ),
    ],
  },
  {
    name: 'Kit de dungeon',
    items: [
      item('Mochila',          1,  2.5),
      item('Pé de cabra',      1,  2.5),
      item('Martelo',          1,  1.5),
      item('Piquete',          10, 0.1),
      item('Tocha',            10, 0.5),
      item('Caixa de isca',    1,  0.5),
      item('Rações',           10, 1  ),
      item('Cantil',           1,  2.5),
      item('Corda de cânhamo', 1,  5  ),
    ],
  },
  {
    name: 'Kit de diplomata',
    items: [
      item('Baú',               1,  25 ),
      item('Pasta de mapas',    2,  0.5),
      item('Roupas finas',      1,  3  ),
      item('Frasco de tinta',   1,  0  ),
      item('Pena',              1,  0  ),
      item('Lâmpada',           1,  0.5),
      item('Óleo',              2,  0.5),
      item('Papel',             5,  0  ),
      item('Perfume',           1,  0  ),
      item('Lacre',             1,  0  ),
      item('Sabão',             1,  0  ),
    ],
  },
  {
    name: 'Kit de artista',
    items: [
      item('Mochila',          1,  2.5),
      item('Saco de dormir',   1,  3  ),
      item('Fantasia',         2,  2  ),
      item('Vela',             5,  0  ),
      item('Rações',           5,  1  ),
      item('Cantil',           1,  2.5),
      item('Kit de disfarce',  1,  1  ),
    ],
  },
  {
    name: 'Kit de sacerdote',
    items: [
      item('Mochila',          1,  2.5),
      item('Cobertor',         1,  1.5),
      item('Vela',             10, 0  ),
      item('Caixa de isca',    1,  0.5),
      item('Caixa de esmolas', 1,  1  ),
      item('Incenso',          2,  0  ),
      item('Turíbulo',         1,  1  ),
      item('Vestes',           1,  2  ),
      item('Rações',           2,  1  ),
      item('Cantil',           1,  2.5),
    ],
  },
  {
    name: 'Kit de estudioso',
    items: [
      item('Mochila',          1,  2.5),
      item('Livro',            1,  2.5),
      item('Frasco de tinta',  1,  0  ),
      item('Pena',             10, 0  ),
      item('Pergaminho',       10, 0  ),
      item('Bolsa de areia',   1,  0.5),
      item('Faca pequena',     1,  0.5),
    ],
  },
];

@Injectable()
export class KitsService implements OnModuleInit {
  constructor(
    @InjectRepository(Kit)
    private readonly kitRepository: Repository<Kit>,
  ) {}

  async onModuleInit() {
    // Remove legacy name used before rename
    await this.kitRepository.delete({ name: 'Pacote de dungeon' });

    await this.kitRepository.upsert(
      KIT_SEED.map((s) => this.kitRepository.create(s)),
      ['name'],
    );
  }

  findAll(): Promise<Kit[]> {
    return this.kitRepository.find({ order: { name: 'ASC' } });
  }
}
