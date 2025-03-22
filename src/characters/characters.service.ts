// src/characters/characters.service.ts
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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
    const character = await this.characterRepository.findOne({ 
        where: { id }, 
        relations: ['idAttribute', 'selectedSkills', 'characterSkills'] 
    });

    if (!character) {
        throw new NotFoundException('Personagem não encontrado');
    }

    Object.assign(character, updateCharacterDto);

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
    return this.characterRepository.find(
      { 
        where: { idUser: { id: userId } }
      }
    );
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
          'characterSkills.skill'
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
        attribute: characterSkill.skill.attribute
      })),
    };
    
    return formattedCharacter;
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