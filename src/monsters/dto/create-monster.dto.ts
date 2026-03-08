export class CreateMonsterDto {
  name: string;
  type: string;
  size: string;
  cr: string;
  xp: number;
  ac: number;
  acType?: string;
  hp: number;
  speed: string;
  attacks: { name: string; bonus: number; reach: string; damage: string; damageType: string; notes?: string }[];
  traits?: { name: string; description: string }[];
}
