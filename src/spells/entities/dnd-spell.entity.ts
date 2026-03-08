import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('dnd_spell')
export class DndSpell {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('int', { default: 0 })
  level: number;

  @Column({ nullable: true })
  school: string;

  @Column({ nullable: true })
  castingTime: string;

  @Column({ nullable: true })
  range: string;

  @Column({ nullable: true })
  duration: string;

  @Column({ default: false })
  componentV: boolean;

  @Column({ default: false })
  componentS: boolean;

  @Column({ default: false })
  componentM: boolean;

  @Column({ nullable: true })
  materialComponent: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'jsonb', default: [] })
  classes: string[];
}
