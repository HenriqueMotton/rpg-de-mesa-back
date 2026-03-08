import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from './entities/chat-message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatMessage)
    private readonly repo: Repository<ChatMessage>,
  ) {}

  async save(msg: Partial<ChatMessage>): Promise<ChatMessage> {
    return this.repo.save(msg);
  }

  /** Conversa entre dois usuários específicos */
  async getConversation(userId1: number, userId2: number): Promise<ChatMessage[]> {
    return this.repo
      .createQueryBuilder('m')
      .where(
        '(m.senderId = :u1 AND m.targetUserId = :u2) OR (m.senderId = :u2 AND m.targetUserId = :u1)',
        { u1: userId1, u2: userId2 },
      )
      .orderBy('m.createdAt', 'ASC')
      .take(100)
      .getMany();
  }

  /** Todas as mensagens de/para um jogador (para a visão do jogador) */
  async getPlayerHistory(playerId: number): Promise<ChatMessage[]> {
    return this.repo
      .createQueryBuilder('m')
      .where('m.senderId = :pid OR m.targetUserId = :pid', { pid: playerId })
      .orderBy('m.createdAt', 'ASC')
      .take(100)
      .getMany();
  }

  /** Lista de jogadores que já conversaram com o mestre, com última mensagem */
  async getConversationPartners(
    masterUserId: number,
  ): Promise<{ userId: number; userName: string; lastMessage: string; lastMessageAt: Date }[]> {
    const messages = await this.repo
      .createQueryBuilder('m')
      .where('m.senderId = :mid OR m.targetUserId = :mid', { mid: masterUserId })
      .orderBy('m.createdAt', 'DESC')
      .getMany();

    const seen = new Map<
      number,
      { userId: number; userName: string; lastMessage: string; lastMessageAt: Date }
    >();

    for (const msg of messages) {
      const partnerId = msg.senderId === masterUserId ? msg.targetUserId! : msg.senderId;
      const partnerName =
        msg.senderId === masterUserId
          ? (msg.targetUserName ?? 'Jogador')
          : msg.senderName;
      if (!seen.has(partnerId)) {
        seen.set(partnerId, {
          userId: partnerId,
          userName: partnerName,
          lastMessage: msg.content,
          lastMessageAt: msg.createdAt,
        });
      }
    }

    return Array.from(seen.values());
  }
}
