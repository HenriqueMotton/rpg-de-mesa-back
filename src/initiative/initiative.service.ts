import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InitiativeSession, InitiativeEntry } from './entities/initiative-session.entity';

@Injectable()
export class InitiativeService {
  constructor(
    @InjectRepository(InitiativeSession)
    private readonly repo: Repository<InitiativeSession>,
  ) {}

  async getActive(): Promise<InitiativeSession | null> {
    return this.repo.findOne({ where: { isActive: true }, order: { updatedAt: 'DESC' } });
  }

  async publish(entries: InitiativeEntry[]): Promise<InitiativeSession> {
    // Deactivate any existing session
    await this.repo.update({ isActive: true }, { isActive: false });

    // Sort by initiative descending (highest goes first)
    const sorted = [...entries].sort((a, b) => b.initiative - a.initiative);

    const session = this.repo.create({ isActive: true, entries: sorted, currentTurnIndex: 0 });
    return this.repo.save(session);
  }

  async setTurn(index: number): Promise<InitiativeSession | null> {
    const session = await this.getActive();
    if (!session) return null;
    const clamped = Math.max(0, Math.min(index, session.entries.length - 1));
    session.currentTurnIndex = clamped;
    return this.repo.save(session);
  }

  async deactivate(): Promise<void> {
    await this.repo.update({ isActive: true }, { isActive: false });
  }
}
