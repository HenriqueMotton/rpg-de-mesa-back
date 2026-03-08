import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export type MonsterAttack = {
  name: string;
  bonus: number;
  reach: string;
  damage: string;
  damageType: string;
  notes?: string;
};

export type MonsterTrait = {
  name: string;
  description: string;
};

@Entity('dnd_monster')
export class DndMonster {
  @PrimaryGeneratedColumn()
  id: number;

  /** Stable slug used to match seed data (null for fully custom monsters) */
  @Column({ type: 'varchar', nullable: true, unique: true })
  slug: string | null;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  size: string;

  @Column()
  cr: string;

  @Column('int')
  xp: number;

  @Column('int')
  ac: number;

  @Column({ type: 'varchar', nullable: true })
  acType: string | null;

  @Column('int')
  hp: number;

  @Column()
  speed: string;

  @Column({ type: 'jsonb', default: '[]' })
  attacks: MonsterAttack[];

  @Column({ type: 'jsonb', nullable: true, default: '[]' })
  traits: MonsterTrait[];

  /** false = seeded from PHB 5e data (read-only); true = created by master */
  @Column({ default: false })
  isCustom: boolean;
}
