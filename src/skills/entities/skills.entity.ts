// src/characters/entities/skills.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, IsNull } from 'typeorm';
import { CharacterSkills } from '../../characters/entities/character-skills.entity';

@Entity()
export class Skills {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  attribute: string; // Atributo relacionado (ex: DES, INT, FOR)

  @Column({ nullable: true })
  description : string;

  @OneToMany(() => CharacterSkills, (characterSkill) => characterSkill.skill)
  characterSkills: CharacterSkills[];
}