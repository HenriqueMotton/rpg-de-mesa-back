import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BugReport } from './entities/bug-report.entity';
import { CreateBugReportDto } from './dto/create-bug-report.dto';
import { UpdateBugReportDto } from './dto/update-bug-report.dto';

@Injectable()
export class BugReportsService {
  constructor(
    @InjectRepository(BugReport)
    private readonly repo: Repository<BugReport>,
  ) {}

  create(dto: CreateBugReportDto, userId?: number): Promise<BugReport> {
    const report = this.repo.create({
      title: dto.title,
      description: dto.description,
      page: dto.page ?? null,
      characterName: dto.characterName ?? null,
      userId: userId ?? null,
      status: 'open',
    });
    return this.repo.save(report);
  }

  findAll(): Promise<BugReport[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async update(id: number, dto: UpdateBugReportDto): Promise<BugReport> {
    const report = await this.repo.findOne({ where: { id } });
    if (!report) throw new NotFoundException('Bug report não encontrado');
    Object.assign(report, dto);
    return this.repo.save(report);
  }

  async remove(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
