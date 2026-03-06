import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Character } from '../../characters/entities/character.entity';

@Entity('character_equipment')
export class CharacterEquipment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Character, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'character_id' })
  character: Character;

  @Column()
  name: string;

  @Column({ default: false })
  fromClass: boolean;
}
