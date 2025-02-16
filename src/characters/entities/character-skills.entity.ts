// src/characters/entities/character-skills.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Character } from './character.entity';
import { Skills } from '../../skills/entities/skills.entity';

@Entity()
export class CharacterSkills {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Character, (character) => character.characterSkills)
  @JoinColumn({ name: 'character_id' })
  character: Character;

  @ManyToOne(() => Skills, (skill) => skill.characterSkills)
  @JoinColumn({ name: 'skill_id' })
  skill: Skills;
}