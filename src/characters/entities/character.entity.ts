// src/characters/entities/character.entity.ts
import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, ManyToMany, JoinTable, JoinColumn, OneToMany } from 'typeorm';
import { Attributes } from './attributes.entity';
import { Skills } from '../../skills/entities/skills.entity';
import { CharacterSkills } from './character-skills.entity';
import { Race } from '../../race/entities/race.entity';
import { SubRace } from '../../race/entities/sub-race.entity';
import { DndClass } from '../../classes/entities/dnd-class.entity';

@Entity()
export class Character {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => DndClass, { nullable: true, eager: false })
  @JoinColumn({ name: 'class_id' })
  dndClass: DndClass;

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

  @Column('int', { default: 0 })
  pp: number; // peças de prata

  @Column('int')
  money: number; // peças de ouro (po)

  @Column('int', { default: 0 })
  pl: number; // peças de platina

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

  @Column({ nullable: true, type: 'varchar' })
  avatarUrl: string | null;

  @Column({ nullable: true, type: 'int' })
  height: number | null;

  @Column({ type: 'jsonb', nullable: true, default: {} })
  spellSlots: Record<string, number>; // { "1": usedCount, "2": usedCount, ... }

  @Column({ type: 'int', default: 0 })
  hitDiceUsed: number;

  @Column({ type: 'int', default: 0 })
  asiPointsUsed: number;

  @Column({ type: 'boolean', default: false })
  freeAttrEdit: boolean;
}