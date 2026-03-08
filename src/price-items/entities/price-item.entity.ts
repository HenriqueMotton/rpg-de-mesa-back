import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export type PriceCategory = 'food' | 'weapon' | 'armor' | 'potion' | 'transport';

@Entity('price_item')
export class PriceItem {
  @PrimaryGeneratedColumn()
  id: number;

  /** Stable slug for seeded items (null for custom) */
  @Column({ type: 'varchar', nullable: true, unique: true })
  slug: string | null;

  @Column()
  name: string;

  @Column()
  category: string; // PriceCategory

  /** Price in gold pieces (decimal) — used for sorting */
  @Column('decimal', { precision: 14, scale: 4 })
  priceGp: number;

  /** Human-readable label, e.g. "50 po", "4 pc", "2 pp/dia" */
  @Column()
  priceLabel: string;

  /** Optional notes, e.g. "por garrafa", "por dia" */
  @Column({ type: 'varchar', nullable: true })
  notes: string | null;

  /** false = seeded from PHB (read-only); true = created by master */
  @Column({ default: false })
  isCustom: boolean;
}
