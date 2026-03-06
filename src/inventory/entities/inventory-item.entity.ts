import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Character } from '../../characters/entities/character.entity';

@Entity()
export class InventoryItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Character, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'character_id' })
  character: Character;

  @Column()
  name: string;

  @Column('int', { default: 1 })
  quantity: number;

  @Column('float', { default: 0 })
  weight: number; // peso por unidade em lb (D&D 5e)

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  description: string;
}
