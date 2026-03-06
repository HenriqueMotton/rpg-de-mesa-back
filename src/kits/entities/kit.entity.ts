import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export type KitItem = {
  name: string;
  quantity: number;
  weight: number; // kg por unidade
};

@Entity('kit')
export class Kit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'jsonb', default: '[]' })
  items: KitItem[];
}
