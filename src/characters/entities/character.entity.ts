// src/characters/entities/character.entity.ts
import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, ManyToMany, JoinTable, JoinColumn, OneToMany } from 'typeorm';
import { Attributes } from './attributes.entity';
import { Skills } from '../../skills/entities/skills.entity';
import { CharacterSkills } from './character-skills.entity';

@Entity()
export class Character {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToOne(() => Attributes, (attr) => attr.character)
  @JoinColumn({ name: 'id_attribute' })
  idAttribute: Attributes;

  @ManyToMany(() => Skills)
  @JoinTable({
    name: 'character_selected_skills',
    joinColumn: { name: 'character_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'skill_id', referencedColumnName: 'id' },
  })
  selectedSkills: Skills[];

  @Column('int')
  money: number;

  @Column('int')
  health: number;

  @Column('int', { default: 1 })
  nivel: number;

  @ManyToOne(() => User, (user) => user.characters)
  @JoinColumn({ name: 'id_user' })
  idUser: User;

  @OneToMany(() => CharacterSkills, (characterSkill) => characterSkill.character)
  characterSkills: CharacterSkills[];
}