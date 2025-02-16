// src/characters/entities/skills.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CharacterSkills } from '../../characters/entities/character-skills.entity';

@Entity()
export class Skills {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  attribute: string; // Atributo relacionado (ex: DES, INT, FOR)

  @OneToMany(() => CharacterSkills, (characterSkill) => characterSkill.skill)
  characterSkills: CharacterSkills[];
}