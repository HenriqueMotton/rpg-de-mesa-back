import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Character } from '../../characters/entities/character.entity';

@Entity()
export class InventoryItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Character, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'character_id' })
  character: Character;

  @Column()
  name: string;

  @Column('int', { default: 1 })
  quantity: number;

  @Column('float', { default: 0 })
  weight: number; // peso por unidade em lb (D&D 5e)

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  description: string;

  // ── CA / Armadura ────────────────────────────────────────────────────────
  // 'light' | 'medium' | 'heavy' | 'shield' | null
  @Column({ nullable: true })
  armorType: string;

  // CA base da armadura (ex: 11 para Couro, 16 para Cota de Malha, 2 para Escudo)
  @Column('int', { nullable: true })
  armorAc: number;

  // Se o item está equipado (usado no cálculo de CA)
  @Column({ default: false })
  isEquipped: boolean;
}
