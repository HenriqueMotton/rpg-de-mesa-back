import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Character } from '../../characters/entities/character.entity';

export type TraumaSeverity = 'mild' | 'moderate' | 'severe';

@Entity()
export class Trauma {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Character, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'character_id' })
  character: Character;

  @Column()
  title: string;

  @Column({ nullable: true, type: 'text' })
  description: string | null;

  // 'mild' | 'moderate' | 'severe'
  @Column({ default: 'mild' })
  severity: string;

  // false = resolvido
  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
