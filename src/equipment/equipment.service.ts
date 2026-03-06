import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CharacterEquipment } from './entities/character-equipment.entity';
import { Character } from '../characters/entities/character.entity';
import { CreateCharacterEquipmentDto } from './dto/create-character-equipment.dto';

@Injectable()
export class EquipmentService {
  constructor(
    @InjectRepository(CharacterEquipment)
    private readonly equipmentRepository: Repository<CharacterEquipment>,
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,
  ) {}

  async findByCharacter(characterId: number, userId: number): Promise<CharacterEquipment[]> {
    const character = await this.characterRepository.findOne({
      where: { id: characterId, idUser: { id: userId } },
    });
    if (!character) throw new NotFoundException('Personagem não encontrado');

    return this.equipmentRepository.find({
      where: { character: { id: characterId } },
      order: { name: 'ASC' },
    });
  }

  async create(characterId: number, userId: number, dto: CreateCharacterEquipmentDto): Promise<CharacterEquipment> {
    const character = await this.characterRepository.findOne({
      where: { id: characterId, idUser: { id: userId } },
    });
    if (!character) throw new NotFoundException('Personagem não encontrado');

    const item = this.equipmentRepository.create({ ...dto, character });
    return this.equipmentRepository.save(item);
  }

  async remove(id: number, userId: number): Promise<void> {
    const item = await this.equipmentRepository.findOne({
      where: { id },
      relations: ['character', 'character.idUser'],
    });
    if (!item || item.character.idUser.id !== userId) {
      throw new NotFoundException('Item não encontrado');
    }
    await this.equipmentRepository.remove(item);
  }
}
