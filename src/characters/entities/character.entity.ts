// src/characters/entities/character.entity.ts
import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, ManyToMany, JoinTable, JoinColumn, OneToMany } from 'typeorm';
import { Attributes } from './attributes.entity';
import { Skills } from '../../skills/entities/skills.entity';
import { CharacterSkills } from './character-skills.entity';
import { Race } from '../../race/entities/race.entity';
import { SubRace } from '../../race/entities/sub-race.entity';

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

  @Column('int', {nullable: true})
  maxHealth: number;

  @Column('int', { default: 1 })
  nivel: number;

  @Column('int', { default: 0 })
  xp: number;

  @ManyToOne(() => User, (user) => user.characters)
  @JoinColumn({ name: 'id_user' })
  idUser: User;

  @OneToMany(() => CharacterSkills, (characterSkill) => characterSkill.character)
  characterSkills: CharacterSkills[];

  @ManyToOne(() => Race, { nullable: true, eager: false })
  @JoinColumn({ name: 'race_id' })
  race: Race;

  @ManyToOne(() => SubRace, { nullable: true, eager: false })
  @JoinColumn({ name: 'sub_race_id' })
  subRace: SubRace;
}