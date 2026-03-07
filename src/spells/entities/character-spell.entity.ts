import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Character } from '../../characters/entities/character.entity';

@Entity()
export class CharacterSpell {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Character, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'character_id' })
  character: Character;

  @Column()
  name: string;

  @Column('int', { default: 0 })
  level: number; // 0 = cantrip, 1-9

  @Column({ nullable: true })
  school: string; // Abjuração, Evocação, etc.

  @Column({ nullable: true })
  castingTime: string; // "1 ação", "1 reação"...

  @Column({ nullable: true })
  range: string; // "Pessoal", "9 metros"...

  @Column({ nullable: true })
  duration: string; // "Instantâneo", "Concentração, 1 minuto"...

  @Column({ default: false })
  componentV: boolean;

  @Column({ default: false })
  componentS: boolean;

  @Column({ default: false })
  componentM: boolean;

  @Column({ nullable: true })
  materialComponent: string; // descrição do componente material

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  prepared: boolean;

  // false = veio do catálogo da classe (duração definida pelo D&D)
  // true  = adicionada manualmente durante uma sessão (duração personalizável)
  @Column({ default: false })
  isCustom: boolean;

  // true = magia inata racial (ex: Fogo das Fadas do Drow)
  @Column({ default: false })
  isRacial: boolean;

  @Column({ default: false })
  isActive: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  activeUntil: Date | null;
}
