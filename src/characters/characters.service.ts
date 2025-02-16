// src/characters/characters.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Character } from './entities/character.entity';
import { Attributes } from './entities/attributes.entity';
import { Skills } from '../skills/entities/skills.entity';
import { CharacterSkills } from './entities/character-skills.entity';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { User } from '../user/entities/user.entity';
import { CreateCharacterDto } from './dto/create-character.dto';

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
  ) {}

  // Cria um novo personagem
  async create(createCharacterDto: CreateCharacterDto, user): Promise<Character> {
    const { name, money, health, attributes, selectedSkills } = createCharacterDto;

    const attr = this.attributesRepository.create({
      forca: String(attributes.forca),
      destreza: String(attributes.destreza),
      constituicao: String(attributes.constituicao),
      inteligencia: String(attributes.inteligencia),
      sabedoria: String(attributes.sabedoria),
      carisma: String(attributes.carisma),
    });
    await this.attributesRepository.save(attr);

    const character = this.characterRepository.create({
      name,
      money,
      health,
      idAttribute: attr,
      idUser: { id: user.userId },
    });

    await this.characterRepository.insert(character);

    if (selectedSkills.length > 0) {
      const characterSkills = selectedSkills.map(skillId => ({
        character,
        skill: { id: skillId },
      }));
    
      await this.characterSkillsRepository.insert(characterSkills);
    }

    return character;
  }

  // Atualiza um personagem existente
  async update(id: number, updateCharacterDto: UpdateCharacterDto): Promise<Character> {
    const character = await this.characterRepository.findOne({ where: { id }, relations: ['idAttribute', 'selectedSkills', 'characterSkills'] });
    if (!character) {
      throw new NotFoundException('Personagem não encontrado');
    }

    // Atualiza os atributos básicos
    if (updateCharacterDto.name) character.name = updateCharacterDto.name;
    if (updateCharacterDto.money) character.money = updateCharacterDto.money;
    if (updateCharacterDto.health) character.health = updateCharacterDto.health;
    if (updateCharacterDto.nivel) character.nivel = updateCharacterDto.nivel;

    // Atualiza os atributos
    if (updateCharacterDto.attributes) {
      Object.assign(character.idAttribute, updateCharacterDto.attributes);
      await this.attributesRepository.save(character.idAttribute);
    }

    // Atualiza as perícias selecionadas
    if (updateCharacterDto.selectedSkills) {
      const skills = await this.skillsRepository.findByIds(updateCharacterDto.selectedSkills);
      character.selectedSkills = skills;
    }

    // Atualiza as perícias proficientes
    // if (updateCharacterDto.proficientSkills) {
    //   // Remove todas as proficiências existentes
    //   await this.characterSkillsRepository.delete({ character: { id } });

    //   // Adiciona as novas proficiências
    //   for (const skillId of updateCharacterDto.proficientSkills) {
    //     const skill = await this.skillsRepository.findOne({ where: { id: skillId } });
    //     if (skill) {
    //       const characterSkill = this.characterSkillsRepository.create({ character, skill });
    //       await this.characterSkillsRepository.save(characterSkill);
    //     }
    //   }
    // }

    await this.characterRepository.save(character);
    return character;
  }

  async findAllByUser(userId: number): Promise<Character[]> {
    return this.characterRepository.find(
      { 
        where: { idUser: { id: userId } }
      }
    );
  }

  async findOne(id: number, userId: number): Promise<Character> {
    const character = await this.characterRepository.findOne({ where: { id, idUser: { id: userId } }, relations: ['idAttribute', 'selectedSkills', 'characterSkills'] });
    if (!character) {
      throw new NotFoundException('Personagem não encontrado');
    }
    return character;
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