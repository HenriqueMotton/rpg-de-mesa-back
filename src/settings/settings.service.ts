import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GlobalSettings } from './entities/global-settings.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(GlobalSettings)
    private readonly repo: Repository<GlobalSettings>,
  ) {}

  async get(): Promise<GlobalSettings> {
    let settings = await this.repo.findOne({ where: { id: 1 } });
    if (!settings) {
      settings = this.repo.create({ id: 1, sanidadeEnabled: false });
      await this.repo.save(settings);
    }
    return settings;
  }

  async update(dto: Partial<Pick<GlobalSettings, 'sanidadeEnabled'>>): Promise<GlobalSettings> {
    await this.get(); // garante que o registro existe
    await this.repo.update(1, dto);
    return this.get();
  }
}
