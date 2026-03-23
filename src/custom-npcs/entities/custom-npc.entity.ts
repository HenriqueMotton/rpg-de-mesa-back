import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export type NpcStatus = 'alive' | 'dead' | 'missing';

@Entity('custom_npc')
export class CustomNpc {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true, type: 'varchar' })
  race: string | null;

  @Column({ nullable: true, type: 'varchar' })
  role: string | null; // profissão/papel

  @Column({ nullable: true, type: 'varchar' })
  location: string | null; // onde encontrá-lo

  @Column({ nullable: true, type: 'text' })
  appearance: string | null; // aparência física

  @Column({ nullable: true, type: 'text' })
  personality: string | null; // personalidade e maneirismos

  @Column({ nullable: true, type: 'text' })
  motivation: string | null; // o que quer/busca

  @Column({ nullable: true, type: 'text' })
  secret: string | null; // segredo oculto

  @Column({ nullable: true, type: 'varchar' })
  faction: string | null; // guilda, facção, etc.

  @Column({ nullable: true, type: 'text' })
  notes: string | null; // notas livres

  @Column({ nullable: true, type: 'int' })
  maxHp: number | null;

  @Column({ nullable: true, type: 'int' })
  currentHp: number | null;

  @Column({ type: 'varchar', default: 'alive' })
  status: string; // 'alive' | 'dead' | 'missing'

  @CreateDateColumn()
  createdAt: Date;
}
