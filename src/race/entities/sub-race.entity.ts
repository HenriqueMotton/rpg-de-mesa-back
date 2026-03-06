import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Race, RaceBonuses } from './race.entity';

export type RaceTrait = {
  name: string;
  description: string;
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

  @ManyToOne(() => Race, (race) => race.subRaces, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'race_id' })
  race: Race;
}
