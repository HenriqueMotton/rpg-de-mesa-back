import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Character } from './character.entity';

@Entity()
export class Attributes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  forca: string;

  @Column()
  destreza: string;

  @Column()
  constituicao: string;

  @Column()
  inteligencia: string;

  @Column()
  sabedoria: string;

  @Column()
  carisma: string;

  @OneToOne(() => Character, (char) => char.idAttribute)
  character: Character;
}