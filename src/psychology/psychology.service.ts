import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trauma } from './entities/trauma.entity';
import { Character } from '../characters/entities/character.entity';
import { CreateTraumaDto } from './dto/create-trauma.dto';
import { UpdateTraumaDto } from './dto/update-trauma.dto';

@Injectable()
export class PsychologyService {
  constructor(
    @InjectRepository(Trauma)
    private readonly traumaRepo: Repository<Trauma>,
    @InjectRepository(Character)
    private readonly characterRepo: Repository<Character>,
  ) {}

  async create(characterId: number, dto: CreateTraumaDto): Promise<Trauma> {
    const character = await this.characterRepo.findOne({
      where: { id: characterId },
      relations: ['dndClass', 'race'],
    });
    if (!character) throw new NotFoundException('Personagem não encontrado');

    const trauma = this.traumaRepo.create({
      character,
      title: dto.title,
      description: dto.description ?? null,
      severity: dto.severity ?? 'mild',
      isActive: true,
    });
    return this.traumaRepo.save(trauma);
  }

  findByCharacter(characterId: number): Promise<Trauma[]> {
    return this.traumaRepo.find({
      where: { character: { id: characterId } },
      order: { createdAt: 'DESC' },
    });
  }

  // For the master overview: all traumas grouped by character
  async findAll(): Promise<Trauma[]> {
    return this.traumaRepo.find({
      relations: ['character', 'character.dndClass', 'character.race'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: number, dto: UpdateTraumaDto): Promise<Trauma> {
    const trauma = await this.traumaRepo.findOne({
      where: { id },
      relations: ['character', 'character.dndClass', 'character.race'],
    });
    if (!trauma) throw new NotFoundException('Trauma não encontrado');
    Object.assign(trauma, dto);
    return this.traumaRepo.save(trauma);
  }

  async remove(id: number): Promise<void> {
    await this.traumaRepo.delete(id);
  }
}
