import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { SubRace, RaceTrait } from './sub-race.entity';

export type RaceBonuses = {
  forca: number;
  destreza: number;
  constituicao: number;
  inteligencia: number;
  sabedoria: number;
  carisma: number;
};

export type RaceSkillGrants = {
  fixed: string[];      // perícias automaticamente concedidas
  choose?: {
    count: number;
    from: string[];     // [] = qualquer perícia
  };
};

@Entity()
export class Race {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column('text')
  description: string;

  @Column({ type: 'jsonb' })
  bonuses: RaceBonuses;

  @Column({ type: 'jsonb', default: '[]' })
  traits: RaceTrait[];

  @Column({ type: 'jsonb', nullable: true })
  skillGrants: RaceSkillGrants;

  @OneToMany(() => SubRace, (subRace) => subRace.race, { cascade: true })
  subRaces: SubRace[];
}
