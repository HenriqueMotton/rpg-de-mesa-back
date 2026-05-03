import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class GlobalSettings {
  @PrimaryColumn()
  id: number; // singleton — sempre id = 1

  @Column({ type: 'boolean', default: false })
  sanidadeEnabled: boolean;
}
