import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export type BackgroundFeature = {
  name: string;
  description: string;
};

@Entity('background')
export class Background {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  icon: string;

  @Column('text')
  description: string;

  @Column({ type: 'jsonb', default: '[]' })
  skillGrants: string[]; // 2 perícias fixas concedidas

  @Column({ type: 'jsonb', nullable: true })
  feature: BackgroundFeature; // habilidade especial do antecedente

  @Column({ type: 'jsonb', default: '[]' })
  equipment: string[];
}
