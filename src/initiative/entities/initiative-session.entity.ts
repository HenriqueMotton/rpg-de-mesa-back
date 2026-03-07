import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

export type InitiativeEntry = {
  characterId: number;
  name: string;
  initiative: number;
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
