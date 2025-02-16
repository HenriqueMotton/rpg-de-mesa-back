import { Injectable } from '@nestjs/common';
import { Skills } from './entities/skills.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skills)
    private readonly skillsRepository: Repository<Skills>,
  ) {}

  // async findAllByUser(userId: number): Promise<Skills[]> {
  //   return this.skillsRepository.find({ where: { idUser: { id: userId } }, relations: ['idAttribute', 'selectedSkills', 'characterSkills'] });
  // }

  async findAll(): Promise<Skills[]>{
    return await this.skillsRepository.find({ order: { name: 'ASC' }});
  }
}