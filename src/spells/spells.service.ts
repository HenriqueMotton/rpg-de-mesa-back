import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CharacterSpell } from './entities/character-spell.entity';
import { Character } from '../characters/entities/character.entity';
import { CreateCharacterSpellDto } from './dto/create-character-spell.dto';
import { UpdateCharacterSpellDto } from './dto/update-character-spell.dto';

@Injectable()
export class SpellsService {
  constructor(
    @InjectRepository(CharacterSpell)
    private readonly spellsRepository: Repository<CharacterSpell>,
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,
  ) {}

  async findByCharacter(characterId: number, userId: number) {
    const character = await this.characterRepository.findOne({
      where: { id: characterId, idUser: { id: userId } },
    });
    if (!character) throw new NotFoundException('Personagem não encontrado');

    const spells = await this.spellsRepository.find({
      where: { character: { id: characterId } },
      order: { level: 'ASC', name: 'ASC' },
    });

    return spells;
  }

  async create(characterId: number, userId: number, dto: CreateCharacterSpellDto): Promise<CharacterSpell> {
    const character = await this.characterRepository.findOne({
      where: { id: characterId, idUser: { id: userId } },
    });
    if (!character) throw new NotFoundException('Personagem não encontrado');

    const spell = this.spellsRepository.create({ ...dto, character });
    return this.spellsRepository.save(spell);
  }

  async update(id: number, userId: number, dto: UpdateCharacterSpellDto): Promise<CharacterSpell> {
    const spell = await this.spellsRepository.findOne({
      where: { id },
      relations: ['character', 'character.idUser'],
    });
    if (!spell || spell.character.idUser.id !== userId) {
      throw new NotFoundException('Magia não encontrada');
    }
    Object.assign(spell, dto);
    return this.spellsRepository.save(spell);
  }

  async remove(id: number, userId: number): Promise<void> {
    const spell = await this.spellsRepository.findOne({
      where: { id },
      relations: ['character', 'character.idUser'],
    });
    if (!spell || spell.character.idUser.id !== userId) {
      throw new NotFoundException('Magia não encontrada');
    }
    await this.spellsRepository.remove(spell);
  }
}
