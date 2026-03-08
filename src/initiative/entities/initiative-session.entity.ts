import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

export type MonsterAttackEntry = {
  name: string;
  bonus: number;
  reach: string;
  damage: string;
  damageType: string;
  notes?: string;
};

export type MonsterTraitEntry = {
  name: string;
  description: string;
};

export type InitiativeEntry = {
  characterId?: number | null;
  name: string;
  initiative: number;
  // Monster-specific fields
  isMonster?: boolean;
  monsterId?: string;
  monsterType?: string;
  size?: string;
  cr?: string;
  xp?: number;
  ac?: number;
  acType?: string;
  maxHp?: number;
  currentHp?: number;
  dead?: boolean;
  speed?: string;
  attacks?: MonsterAttackEntry[];
  traits?: MonsterTraitEntry[];
};

@Entity('initiative_session')
export class InitiativeSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', default: '[]' })
  entries: InitiativeEntry[];

  @Column({ default: 0 })
  currentTurnIndex: number;

  @UpdateDateColumn()
  updatedAt: Date;
}
