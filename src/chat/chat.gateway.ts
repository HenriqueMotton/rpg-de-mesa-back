import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';

interface AuthenticatedSocket extends Socket {
  userId: number;
  userName: string;
  isMaster: boolean;
}

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<number, AuthenticatedSocket>();
  private masterUserId: number | null = null;
  private masterUserName: string | null = null;

  constructor(
    private readonly jwtService: JwtService,
    private readonly chatService: ChatService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token as string;
      if (!token) { client.disconnect(); return; }

      const payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
      const authClient = client as AuthenticatedSocket;
      authClient.userId = payload.sub;
      authClient.userName = payload.name ?? payload.email;
      authClient.isMaster = payload.isMaster ?? false;

      this.connectedUsers.set(authClient.userId, authClient);
      authClient.join(`user:${authClient.userId}`);

      if (authClient.isMaster) {
        this.masterUserId = authClient.userId;
        this.masterUserName = authClient.userName;
      }

      this.server.emit('chat:userConnected', {
        userId: authClient.userId,
        userName: authClient.userName,
        isMaster: authClient.isMaster,
      });
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const authClient = client as AuthenticatedSocket;
    if (authClient.userId) {
      this.connectedUsers.delete(authClient.userId);
      if (authClient.isMaster && authClient.userId === this.masterUserId) {
        this.masterUserId = null;
        this.masterUserName = null;
      }
      this.server.emit('chat:userDisconnected', { userId: authClient.userId });
    }
  }

  /** Jogador → Mestre ou Mestre → Jogador específico */
  @SubscribeMessage('chat:send')
  async handleSend(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { content: string; targetUserId?: number },
  ) {
    const content = data.content?.trim();
    if (!content) return;

    if (client.isMaster) {
      const { targetUserId } = data;
      if (!targetUserId) return;
      const targetSocket = this.connectedUsers.get(targetUserId);
      const saved = await this.chatService.save({
        content,
        senderId: client.userId,
        senderName: client.userName,
        isMasterSender: true,
        isPrivate: true,
        targetUserId,
        targetUserName: targetSocket?.userName ?? null,
      });
      client.emit('chat:message', saved);
      this.server.to(`user:${targetUserId}`).emit('chat:message', saved);
    } else {
      if (!this.masterUserId) return;
      const saved = await this.chatService.save({
        content,
        senderId: client.userId,
        senderName: client.userName,
        isMasterSender: false,
        isPrivate: true,
        targetUserId: this.masterUserId,
        targetUserName: this.masterUserName,
      });
      client.emit('chat:message', saved);
      this.server.to(`user:${this.masterUserId}`).emit('chat:message', saved);
    }
  }

  /** Jogador carrega seu histórico com o mestre */
  @SubscribeMessage('chat:getMyHistory')
  async handleGetMyHistory(@ConnectedSocket() client: AuthenticatedSocket) {
    if (client.isMaster) return;
    const history = await this.chatService.getPlayerHistory(client.userId);
    client.emit('chat:myHistory', history);
  }

  /** Mestre carrega conversa com um jogador específico */
  @SubscribeMessage('chat:getConversation')
  async handleGetConversation(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { playerId: number },
  ) {
    if (!client.isMaster) return;
    const messages = await this.chatService.getConversation(client.userId, data.playerId);
    client.emit('chat:conversation', { playerId: data.playerId, messages });
  }

  /** Mestre carrega lista de jogadores com última mensagem */
  @SubscribeMessage('chat:getConversations')
  async handleGetConversations(@ConnectedSocket() client: AuthenticatedSocket) {
    if (!client.isMaster) return;
    const partners = await this.chatService.getConversationPartners(client.userId);
    client.emit('chat:conversations', partners);
  }

  @SubscribeMessage('chat:getOnlineUsers')
  handleGetOnlineUsers(@ConnectedSocket() client: AuthenticatedSocket) {
    const users = Array.from(this.connectedUsers.values()).map((s) => ({
      userId: s.userId,
      userName: s.userName,
      isMaster: s.isMaster,
    }));
    client.emit('chat:onlineUsers', users);
  }
}
