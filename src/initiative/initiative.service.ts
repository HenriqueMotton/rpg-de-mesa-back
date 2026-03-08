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

  async updateEntryHp(entryIndex: number, currentHp: number): Promise<InitiativeSession | null> {
    const session = await this.getActive();
    if (!session) return null;
    if (entryIndex < 0 || entryIndex >= session.entries.length) return session;
    const entry = session.entries[entryIndex];
    entry.currentHp = Math.max(0, currentHp);
    entry.dead = entry.currentHp === 0;
    return this.repo.save(session);
  }

  async getXpSummary(): Promise<{ total: number; defeated: { name: string; xp: number; cr: string }[] }> {
    const session = await this.getActive();
    if (!session) return { total: 0, defeated: [] };
    const defeated = session.entries
      .filter((e) => e.isMonster && e.dead && e.xp)
      .map((e) => ({ name: e.name, xp: e.xp!, cr: e.cr ?? '?' }));
    const total = defeated.reduce((sum, d) => sum + d.xp, 0);
    return { total, defeated };
  }
}
