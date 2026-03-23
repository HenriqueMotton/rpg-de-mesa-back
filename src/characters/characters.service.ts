// src/characters/characters.service.ts
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Character } from './entities/character.entity';
import { Attributes } from './entities/attributes.entity';
import { Skills } from '../skills/entities/skills.entity';
import { CharacterSkills } from './entities/character-skills.entity';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { User } from '../user/entities/user.entity';
import { CreateCharacterDto } from './dto/create-character.dto';
import { Race } from '../race/entities/race.entity';
import { SubRace } from '../race/entities/sub-race.entity';
import { DndClass } from '../classes/entities/dnd-class.entity';
import { CharacterSpell } from '../spells/entities/character-spell.entity';
import { DndSpell } from '../spells/entities/dnd-spell.entity';
import { Background } from '../backgrounds/entities/background.entity';

const XP_THRESHOLDS = [0, 300, 900, 1800, 3800, 7500, 14000, 23000, 34000, 48000, 64000, 83000, 100000, 120000, 140000, 165000, 195000, 225000, 265000, 305000];

const HIT_DICE_BY_CLASS: Record<string, number> = {
  'Bárbaro': 12, 'Bardo': 8, 'Bruxo': 8, 'Clérico': 8, 'Druida': 8,
  'Feiticeiro': 6, 'Guerreiro': 10, 'Ladino': 8, 'Mago': 6,
  'Monge': 8, 'Paladino': 10, 'Patrulheiro': 10,
};

function getLevelFromXp(xp: number): number {
  let level = 1;
  for (let i = 1; i < XP_THRESHOLDS.length; i++) {
    if (xp >= XP_THRESHOLDS[i]) level = i + 1;
    else break;
  }
  return Math.min(level, 20);
}

@Injectable()
export class CharactersService {
  constructor(
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,
    @InjectRepository(Attributes)
    private readonly attributesRepository: Repository<Attributes>,
    @InjectRepository(Skills)
    private readonly skillsRepository: Repository<Skills>,
    @InjectRepository(CharacterSkills)
    private readonly characterSkillsRepository: Repository<CharacterSkills>,
    @InjectRepository(Race)
    private readonly raceRepository: Repository<Race>,
    @InjectRepository(SubRace)
    private readonly subRaceRepository: Repository<SubRace>,
    @InjectRepository(DndClass)
    private readonly dndClassRepository: Repository<DndClass>,
    @InjectRepository(CharacterSpell)
    private readonly characterSpellRepository: Repository<CharacterSpell>,
    @InjectRepository(DndSpell)
    private readonly dndSpellRepository: Repository<DndSpell>,
    @InjectRepository(Background)
    private readonly backgroundRepository: Repository<Background>,
  ) {}

  // Cria um novo personagem
  async create(createCharacterDto: CreateCharacterDto, user): Promise<Character> {
    const { name, money, health, attributes, selectedSkills, classSkillIds, raceSkillIds, raceId, subRaceId, classId, backgroundId, raceCantripName, height } = createCharacterDto;

    // Busca a raça e aplica bônus nos atributos base
    let race: Race | null = null;
    let subRace: SubRace | null = null;
    const bonuses = { forca: 0, destreza: 0, constituicao: 0, inteligencia: 0, sabedoria: 0, carisma: 0 };
    if (raceId) {
      race = await this.raceRepository.findOne({ where: { id: raceId } });
      if (race) Object.assign(bonuses, race.bonuses);
    }
    let dndClass: DndClass | null = null;
    if (classId) {
      dndClass = await this.dndClassRepository.findOne({ where: { id: classId } });
    }

    let background: Background | null = null;
    if (backgroundId) {
      background = await this.backgroundRepository.findOne({ where: { id: backgroundId } });
    }

    if (subRaceId) {
      subRace = await this.subRaceRepository.findOne({ where: { id: subRaceId } });
      if (subRace) {
        for (const key of Object.keys(bonuses) as Array<keyof typeof bonuses>) {
          bonuses[key] += subRace.bonuses[key] ?? 0;
        }
      }
    }

    const finalCon = attributes.constituicao + bonuses.constituicao;
    const conMod   = Math.floor((finalCon - 10) / 2);
    const effectiveHealth = Math.max(1, health + conMod);

    const attr = this.attributesRepository.create({
      forca:        String(attributes.forca        + bonuses.forca),
      destreza:     String(attributes.destreza     + bonuses.destreza),
      constituicao: String(finalCon),
      inteligencia: String(attributes.inteligencia + bonuses.inteligencia),
      sabedoria:    String(attributes.sabedoria    + bonuses.sabedoria),
      carisma:      String(attributes.carisma      + bonuses.carisma),
    });
    await this.attributesRepository.save(attr);

    const character = this.characterRepository.create({
      name,
      pp: createCharacterDto.pp ?? 0,
      money,
      pc: createCharacterDto.pc ?? 0,
      health: effectiveHealth,
      maxHealth: effectiveHealth,
      idAttribute: attr,
      idUser: { id: user.userId },
      ...(dndClass ? { dndClass } : {}),
      ...(race ? { race } : {}),
      ...(subRace ? { subRace } : {}),
      ...(background ? { background } : {}),
      ...(height != null ? { height } : {}),
    });

    await this.characterRepository.insert(character);

    // Perícias de classe
    if (selectedSkills.length > 0) {
      const classSkillSet = new Set(classSkillIds ?? []);
      const characterSkills = selectedSkills.map(skillId => ({
        character,
        skill: { id: skillId },
        source: classSkillSet.has(skillId) ? 'class' : 'choice',
      }));
      await this.characterSkillsRepository.insert(characterSkills);
    }

    // Perícias de raça — fixas (concedidas automaticamente)
    const fixedRaceSkillNames: string[] = race?.skillGrants?.fixed ?? [];
    if (fixedRaceSkillNames.length > 0) {
      const allSkills = await this.skillsRepository.find();
      const alreadyGranted = new Set([...selectedSkills, ...(raceSkillIds ?? [])]);
      const fixedSkills = allSkills.filter(sk =>
        fixedRaceSkillNames.some(n => n.toLowerCase().trim() === sk.name.toLowerCase().trim())
        && !alreadyGranted.has(sk.id)
      );
      if (fixedSkills.length > 0) {
        await this.characterSkillsRepository.insert(
          fixedSkills.map(sk => ({ character, skill: { id: sk.id }, source: 'race' }))
        );
      }
    }

    // Perícias de raça — escolhidas pelo jogador (ex: Meio-Elfo)
    if (raceSkillIds && raceSkillIds.length > 0) {
      const alreadyGranted = new Set(selectedSkills);
      const newRaceSkills = raceSkillIds.filter(id => !alreadyGranted.has(id));
      if (newRaceSkills.length > 0) {
        await this.characterSkillsRepository.insert(
          newRaceSkills.map(skillId => ({ character, skill: { id: skillId }, source: 'race' }))
        );
      }
    }

    // Magias raciais da sub-raça
    if (subRace) {
      // Magias fixas (ex: Drow: Luz Dançante ao nível 1, Fogo das Fadas ao nível 3, Escuridão ao nível 5)
      // Personagens novos sempre começam no nível 1 — só concede as magias elegíveis imediatamente
      const nivel = 1;
      const allGrants = subRace.spellGrants ?? [];
      const grantedNames: string[] = allGrants
        .filter((g) => (g.minCharLevel ?? 1) <= nivel)
        .map((g) => g.name);
      if (grantedNames.length > 0) {
        const dndSpells = await this.dndSpellRepository.find({ where: { name: In(grantedNames) } });
        if (dndSpells.length > 0) {
          await this.characterSpellRepository.insert(
            dndSpells.map(sp => ({
              character,
              name: sp.name,
              level: sp.level,
              school: sp.school,
              castingTime: sp.castingTime,
              range: sp.range,
              duration: sp.duration,
              componentV: sp.componentV,
              componentS: sp.componentS,
              componentM: sp.componentM,
              materialComponent: sp.materialComponent,
              description: sp.description,
              isRacial: true,
              prepared: true,
            }))
          );
        }
      }

      // Truque à escolha (ex: Alto Elfo escolhe 1 truque do Mago)
      if (subRace.cantripChoice && raceCantripName) {
        const cantripSpell = await this.dndSpellRepository.findOne({ where: { name: raceCantripName } });
        if (cantripSpell) {
          await this.characterSpellRepository.insert({
            character,
            name: cantripSpell.name,
            level: cantripSpell.level,
            school: cantripSpell.school,
            castingTime: cantripSpell.castingTime,
            range: cantripSpell.range,
            duration: cantripSpell.duration,
            componentV: cantripSpell.componentV,
            componentS: cantripSpell.componentS,
            componentM: cantripSpell.componentM,
            materialComponent: cantripSpell.materialComponent,
            description: cantripSpell.description,
            isRacial: true,
            prepared: true,
          });
        }
      }
    }

    // Perícias do background — fixas (concedidas automaticamente)
    if (background && background.skillGrants && background.skillGrants.length > 0) {
      const allSkills = await this.skillsRepository.find();
      const alreadyGranted = new Set([
        ...selectedSkills,
        ...(raceSkillIds ?? []),
      ]);
      const bgSkills = allSkills.filter(sk =>
        background.skillGrants.some(n => n.toLowerCase().trim() === sk.name.toLowerCase().trim())
        && !alreadyGranted.has(sk.id)
      );
      if (bgSkills.length > 0) {
        await this.characterSkillsRepository.insert(
          bgSkills.map(sk => ({ character, skill: { id: sk.id }, source: 'background' }))
        );
      }
    }

    return character;
  }

  // Atualiza um personagem existente
  async update(id: number, updateCharacterDto: UpdateCharacterDto): Promise<Character> {
    const character = await this.characterRepository.findOne({ 
        where: { id }, 
        relations: ['idAttribute', 'selectedSkills', 'characterSkills'] 
    });

    if (!character) {
        throw new NotFoundException('Personagem não encontrado');
    }

    Object.assign(character, updateCharacterDto);

    if (updateCharacterDto.xp !== undefined) {
      character.nivel = getLevelFromXp(character.xp);
    }

    if (updateCharacterDto.attributes) {
        Object.assign(character.idAttribute, updateCharacterDto.attributes);
        await this.attributesRepository.save(character.idAttribute);
    }

    if (updateCharacterDto.selectedSkills) {
        const skills = await this.skillsRepository.findByIds(updateCharacterDto.selectedSkills);
        character.selectedSkills = skills;
    }

    await this.characterRepository.save(character).catch(error => {
      console.error('Erro ao salvar personagem:', error);
      throw new InternalServerErrorException('Erro ao atualizar personagem');
    });

    return character;
  }

  async findAllByUser(userId: number): Promise<Character[]> {
    return this.characterRepository.find({
      where: { idUser: { id: userId } },
      relations: ['race', 'subRace', 'dndClass'],
    });
  }

  async findAllCharacters(): Promise<Character[]> {
    return this.characterRepository.find({
      relations: ['idUser', 'dndClass', 'race', 'subRace'],
      order: { name: 'ASC' },
    });
  }

  async findOneForMaster(id: number): Promise<any> {
    const character = await this.characterRepository.findOne({
      where: { id },
      relations: [
        'idAttribute',
        'characterSkills',
        'characterSkills.skill',
        'race',
        'subRace',
        'dndClass',
        'background',
        'idUser',
      ],
    });
    if (!character) throw new NotFoundException('Personagem não encontrado');
    return character;
  }

  async findOne(id: number, userId: number): Promise<any> {
    const character = await this.characterRepository.findOne(
      { 
        where: { 
          id, 
          idUser: { id: userId } 
        }, 
        relations: [
          'idAttribute',
          'selectedSkills',
          'characterSkills',
          'characterSkills.skill',
          'race',
          'subRace',
          'dndClass',
          'background',
        ]
      }
    );
    if (!character) {
      throw new NotFoundException('Personagem não encontrado');
    }

    const formattedCharacter = {
      ...character,
      characterSkills: character.characterSkills.map(characterSkill => ({
        name: characterSkill.skill.name,
        attribute: characterSkill.skill.attribute,
        source: characterSkill.source ?? 'choice',
      })),
    };
    
    return formattedCharacter;
  }

  async uploadAvatar(id: number, filename: string): Promise<Character> {
    const character = await this.characterRepository.findOne({ where: { id } });
    if (!character) throw new NotFoundException('Personagem não encontrado');
    character.avatarUrl = `/uploads/avatars/${filename}`;
    return this.characterRepository.save(character);
  }

  // Aplica descanso a um personagem, recuperando slots, HP e dados de vida conforme D&D 5e
  async rest(id: number, restType: 'long' | 'short', hitDiceSpent = 0): Promise<Character> {
    const character = await this.characterRepository.findOne({
      where: { id },
      relations: ['dndClass'],
    });
    if (!character) throw new NotFoundException('Personagem não encontrado');

    const className = character.dndClass?.name ?? '';

    if (restType === 'long') {
      character.health = character.maxHealth;
      character.spellSlots = {};
      const toRecover = Math.max(1, Math.ceil(character.nivel / 2));
      character.hitDiceUsed = Math.max(0, (character.hitDiceUsed ?? 0) - toRecover);
      // Restaura magias raciais de 1×/descanso (level > 0)
      await this.characterSpellRepository
        .createQueryBuilder()
        .update()
        .set({ isActive: false, activeUntil: null })
        .where('character_id = :id AND "isRacial" = true AND level > 0', { id })
        .execute();
    } else {
      if (className === 'Bruxo') {
        character.spellSlots = {};
      }
      // Registra os dados de vida gastos pelo jogador durante o descanso curto
      if (hitDiceSpent > 0) {
        character.hitDiceUsed = Math.min(
          character.nivel,
          (character.hitDiceUsed ?? 0) + hitDiceSpent,
        );
      }
    }

    return this.characterRepository.save(character);
  }

  // Gasta um dado de vida durante descanso curto: rola o dado + mod. CON e cura o personagem
  async spendHitDice(id: number): Promise<{ roll: number; conMod: number; healing: number; newHealth: number; hitDiceUsed: number; maxDice: number; dieSize: number }> {
    const character = await this.characterRepository.findOne({
      where: { id },
      relations: ['dndClass', 'idAttribute'],
    });
    if (!character) throw new NotFoundException('Personagem não encontrado');

    const maxDice = character.nivel;
    const used = character.hitDiceUsed ?? 0;
    if (used >= maxDice) throw new BadRequestException('Sem dados de vida disponíveis');

    const className = character.dndClass?.name ?? '';
    const dieSize = HIT_DICE_BY_CLASS[className] ?? 8;

    const conScore = Number(character.idAttribute?.constituicao ?? 10);
    const conMod = Math.floor((conScore - 10) / 2);

    const roll = Math.floor(Math.random() * dieSize) + 1;
    const healing = Math.max(1, roll + conMod);

    character.health = Math.min(character.maxHealth, character.health + healing);
    character.hitDiceUsed = used + 1;

    await this.characterRepository.save(character);

    return { roll, conMod, healing, newHealth: character.health, hitDiceUsed: character.hitDiceUsed, maxDice, dieSize };
  }

  async removeAvatar(id: number): Promise<Character> {
    const character = await this.characterRepository.findOne({ where: { id } });
    if (!character) throw new NotFoundException('Personagem não encontrado');
    character.avatarUrl = null;
    return this.characterRepository.save(character);
  }

  async remove(id: number, userId: number): Promise<void> {
    // Remove Character Skill
    const characterSkills = await this.characterSkillsRepository.find({
      where: { character: { id } },
    });
    await this.characterSkillsRepository.remove(characterSkills);
  
    // Encontrar o personagem e carregar a relação com atributos
    const character = await this.characterRepository.findOne({
      where: { id, idUser: { id: userId } },
      relations: ['idAttribute'], 
    });
  
    if (!character) {
      throw new NotFoundException('Personagem não encontrado');
    }
  
    // Agora, removemos o personagem
    await this.characterRepository.remove(character);

    // Se o personagem tiver um atributo associado, excluímos
    if (character.idAttribute) {
      await this.attributesRepository.remove(character.idAttribute);
    }
  }
  
}