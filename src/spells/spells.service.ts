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

  async findAllForMaster() {
    return this.spellsRepository.find({
      relations: ['character', 'character.dndClass', 'character.race'],
      order: { level: 'ASC', name: 'ASC' },
    });
  }

  async bulkCreate(characterId: number, userId: number, spells: CreateCharacterSpellDto[]): Promise<CharacterSpell[]> {
    const character = await this.characterRepository.findOne({
      where: { id: characterId, idUser: { id: userId } },
    });
    if (!character) throw new NotFoundException('Personagem não encontrado');

    const entities = spells.map((dto) => this.spellsRepository.create({ ...dto, character }));
    return this.spellsRepository.save(entities);
  }

  async bulkSetPrepared(characterId: number, userId: number, preparedIds: number[]): Promise<void> {
    const character = await this.characterRepository.findOne({
      where: { id: characterId, idUser: { id: userId } },
    });
    if (!character) throw new NotFoundException('Personagem não encontrado');

    await this.spellsRepository
      .createQueryBuilder()
      .update()
      .set({ prepared: false })
      .where('character_id = :characterId AND "isRacial" = false AND "isCustom" = false', { characterId })
      .execute();

    if (preparedIds.length > 0) {
      await this.spellsRepository
        .createQueryBuilder()
        .update()
        .set({ prepared: true })
        .where('id IN (:...ids) AND character_id = :characterId', { ids: preparedIds, characterId })
        .execute();
    }
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
