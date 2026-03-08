import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('bug_report')
export class BugReport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  /** Page/context where the bug happened */
  @Column({ type: 'varchar', nullable: true })
  page: string | null;

  /** Character name at time of report */
  @Column({ type: 'varchar', nullable: true })
  characterName: string | null;

  /** User id who reported */
  @Column({ type: 'int', nullable: true })
  userId: number | null;

  @Column({ default: 'open' }) // 'open' | 'in_progress' | 'resolved'
  status: string;

  @Column({ type: 'varchar', nullable: true })
  resolution: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
