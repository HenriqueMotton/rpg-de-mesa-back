import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export type ClassFeature = {
  name: string;
  description: string;
};

export type ClassProficiencies = {
  armor: string[];
  weapons: string[];
  tools: string[];
  savingThrows: string[];
};

export type ClassSkillOptions = {
  skills: string[]; // nomes das perícias disponíveis para a classe
  count: number;    // quantas o jogador pode escolher
};

export type ClassSpellEntry = {
  name: string;
  level: number;
  school: string;
  castingTime: string;
  range: string;
  duration: string;
  componentV: boolean;
  componentS: boolean;
  componentM: boolean;
  materialComponent?: string;
  description: string;
  unlockLevel: number;
};

@Entity('dnd_class')
export class DndClass {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  icon: string;

  @Column('text')
  tagline: string;

  @Column('text')
  description: string;

  @Column('text')
  imgGradient: string;

  @Column({ type: 'jsonb', default: '[]' })
  equipment: string[];

  @Column({ type: 'jsonb', default: '[]' })
  features: ClassFeature[];

  @Column({ type: 'jsonb', default: '[]' })
  classSpells: ClassSpellEntry[];

  @Column({ type: 'jsonb', nullable: true })
  proficiencies: ClassProficiencies;

  @Column({ type: 'jsonb', nullable: true })
  skillOptions: ClassSkillOptions;
}
