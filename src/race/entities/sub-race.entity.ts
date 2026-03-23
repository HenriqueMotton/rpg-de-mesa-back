import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Race, RaceBonuses } from './race.entity';

export type RaceTrait = {
  name: string;
  description: string;
};

export type RaceSpellGrant = {
  name: string;
  minCharLevel?: number; // nível mínimo do personagem para receber esta magia (default: 1)
};

export type SubRaceCantripChoice = {
  count: number;
  from: string; // nome da classe para filtrar o catálogo, ex: 'Mago'
};

@Entity()
export class SubRace {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column({ type: 'jsonb' })
  bonuses: RaceBonuses; // bônus adicionais da sub-raça (zerados para os não aplicados)

  @Column({ type: 'jsonb', default: '[]' })
  traits: RaceTrait[];

  @Column({ type: 'jsonb', nullable: true })
  spellGrants: RaceSpellGrant[]; // magias auto-concedidas pela sub-raça (com nível mínimo opcional)

  @Column({ type: 'jsonb', nullable: true })
  cantripChoice: SubRaceCantripChoice | null; // truque à escolha do jogador

  @ManyToOne(() => Race, (race) => race.subRaces, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'race_id' })
  race: Race;
}
