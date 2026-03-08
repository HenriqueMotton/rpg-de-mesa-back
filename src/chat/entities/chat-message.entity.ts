import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ChatMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @Column()
  senderId: number;

  @Column()
  senderName: string;

  @Column({ default: false })
  isMasterSender: boolean;

  @Column({ default: false })
  isPrivate: boolean;

  @Column({ nullable: true, type: 'int' })
  targetUserId: number | null;

  @Column({ nullable: true, type: 'varchar' })
  targetUserName: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
