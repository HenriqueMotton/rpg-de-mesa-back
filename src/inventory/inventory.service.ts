import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryItem } from './entities/inventory-item.entity';
import { Character } from '../characters/entities/character.entity';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryItem)
    private readonly inventoryRepository: Repository<InventoryItem>,
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,
  ) {}

  async findByCharacter(characterId: number, userId: number) {
    const character = await this.characterRepository.findOne({
      where: { id: characterId, idUser: { id: userId } },
      relations: ['idAttribute'],
    });
    if (!character) throw new NotFoundException('Personagem não encontrado');

    const items = await this.inventoryRepository.find({
      where: { character: { id: characterId } },
      order: { name: 'ASC' },
    });

    const totalWeight = Math.round(
      items.reduce((sum, item) => sum + item.weight * item.quantity, 0) * 100,
    ) / 100;

    // Capacidade de carga em kg: FOR × 6.8 kg (equivalente a FOR × 15 lb, D&D 5e)
    const carryingCapacity = Math.round(Number(character.idAttribute.forca) * 6.8 * 10) / 10;

    return { items, totalWeight, carryingCapacity };
  }

  async findByCharacterMaster(characterId: number) {
    const character = await this.characterRepository.findOne({
      where: { id: characterId },
      relations: ['idAttribute'],
    });
    if (!character) throw new NotFoundException('Personagem não encontrado');

    const items = await this.inventoryRepository.find({
      where: { character: { id: characterId } },
      order: { name: 'ASC' },
    });

    const totalWeight = Math.round(
      items.reduce((sum, item) => sum + item.weight * item.quantity, 0) * 100,
    ) / 100;

    const carryingCapacity = Math.round(Number(character.idAttribute?.forca ?? 10) * 6.8 * 10) / 10;

    return { items, totalWeight, carryingCapacity };
  }

  async create(characterId: number, userId: number, dto: CreateInventoryItemDto): Promise<InventoryItem> {
    const character = await this.characterRepository.findOne({
      where: { id: characterId, idUser: { id: userId } },
    });
    if (!character) throw new NotFoundException('Personagem não encontrado');

    const item = this.inventoryRepository.create({ ...dto, character });
    return this.inventoryRepository.save(item);
  }

  async update(id: number, userId: number, dto: UpdateInventoryItemDto): Promise<InventoryItem> {
    const item = await this.inventoryRepository.findOne({
      where: { id },
      relations: ['character', 'character.idUser'],
    });
    if (!item || item.character.idUser.id !== userId) {
      throw new NotFoundException('Item não encontrado');
    }
    Object.assign(item, dto);
    return this.inventoryRepository.save(item);
  }

  async remove(id: number, userId: number): Promise<void> {
    const item = await this.inventoryRepository.findOne({
      where: { id },
      relations: ['character', 'character.idUser'],
    });
    if (!item || item.character.idUser.id !== userId) {
      throw new NotFoundException('Item não encontrado');
    }
    await this.inventoryRepository.remove(item);
  }
}
