import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(){
    return this.userRepository.find({
      select: [
        'name'
      ]
    });
  }

  async create(email: string, password: string, name?: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({ email, password: hashedPassword, name });
    return this.userRepository.save(user);
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findOneById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async update(id: number, attrs: Partial<User>): Promise<User> {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    Object.assign(user, attrs);
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    await this.userRepository.remove(user);
  }
}