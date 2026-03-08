export type MonsterAttack = {
  name: string;
  bonus: number;
  reach: string;
  damage: string;
  damageType: string;
  notes?: string;
};

export type MonsterTrait = {
  name: string;
  description: string;
};

export type DndMonster = {
  id: string;
  name: string;
  type: string;
  size: string;
  cr: string;
  xp: number;
  ac: number;
  acType?: string;
  hp: number;
  speed: string;
  attacks: MonsterAttack[];
  traits?: MonsterTrait[];
};

export const DND_MONSTERS_SEED: DndMonster[] = [
  // ── CR 0 ──────────────────────────────────────────────────────────────
  {
    id: 'rato', name: 'Rato', type: 'Fera', size: 'Minúsculo', cr: '0', xp: 10,
    ac: 10, hp: 1, speed: '6 m',
    attacks: [{ name: 'Mordida', bonus: 0, reach: '1,5 m', damage: '1', damageType: 'Perfurante' }],
  },
  {
    id: 'corvo', name: 'Corvo', type: 'Fera', size: 'Minúsculo', cr: '0', xp: 10,
    ac: 12, hp: 1, speed: '3 m / Voo 15 m',
    attacks: [{ name: 'Bico', bonus: 4, reach: '1,5 m', damage: '1', damageType: 'Perfurante' }],
  },

  // ── CR 1/8 ────────────────────────────────────────────────────────────
  {
    id: 'kobold', name: 'Kobold', type: 'Humanoide', size: 'Pequeno', cr: '1/8', xp: 25,
    ac: 12, hp: 5, speed: '9 m',
    attacks: [
      { name: 'Adaga', bonus: 4, reach: '1,5 m', damage: '1d4+2', damageType: 'Perfurante' },
      { name: 'Funda', bonus: 4, reach: '9/36 m', damage: '1d4+2', damageType: 'Contundente' },
    ],
    traits: [{ name: 'Tática de Enxame', description: 'Vantagem em ataques quando um aliado não incapacitado estiver adjacente ao alvo.' }],
  },
  {
    id: 'cultista', name: 'Cultista', type: 'Humanoide', size: 'Médio', cr: '1/8', xp: 25,
    ac: 12, acType: 'Armadura de Couro', hp: 9, speed: '9 m',
    attacks: [{ name: 'Cimitarra', bonus: 3, reach: '1,5 m', damage: '1d6+1', damageType: 'Cortante' }],
    traits: [{ name: 'Fervor Sombrio', description: 'Vantagem em testes de resistência contra ser enfeitiçado ou amedrontado.' }],
  },
  {
    id: 'guarda', name: 'Guarda', type: 'Humanoide', size: 'Médio', cr: '1/8', xp: 25,
    ac: 16, acType: 'Cota de Malha + Escudo', hp: 11, speed: '9 m',
    attacks: [{ name: 'Lança', bonus: 3, reach: '1,5 m / 6/18 m', damage: '1d6+1', damageType: 'Perfurante' }],
  },

  // ── CR 1/4 ────────────────────────────────────────────────────────────
  {
    id: 'goblin', name: 'Goblin', type: 'Humanoide', size: 'Pequeno', cr: '1/4', xp: 50,
    ac: 15, acType: 'Armadura de Couro + Escudo', hp: 7, speed: '9 m',
    attacks: [
      { name: 'Cimitarra', bonus: 4, reach: '1,5 m', damage: '1d6+2', damageType: 'Cortante' },
      { name: 'Arco Curto', bonus: 4, reach: '24/96 m', damage: '1d6+2', damageType: 'Perfurante' },
    ],
    traits: [{ name: 'Fuga Ágil', description: 'Pode Desengajar ou Esconder como ação bônus em cada turno.' }],
  },
  {
    id: 'esqueleto', name: 'Esqueleto', type: 'Morto-vivo', size: 'Médio', cr: '1/4', xp: 50,
    ac: 13, acType: 'Restos de Armadura', hp: 13, speed: '9 m',
    attacks: [
      { name: 'Cimitarra', bonus: 4, reach: '1,5 m', damage: '1d6+2', damageType: 'Cortante' },
      { name: 'Arco Curto', bonus: 4, reach: '24/96 m', damage: '1d6+2', damageType: 'Perfurante' },
    ],
    traits: [{ name: 'Vulnerabilidade', description: 'Vulnerável a dano contundente.' }],
  },
  {
    id: 'zumbi', name: 'Zumbi', type: 'Morto-vivo', size: 'Médio', cr: '1/4', xp: 50,
    ac: 8, hp: 22, speed: '6 m',
    attacks: [{ name: 'Soco Podre', bonus: 3, reach: '1,5 m', damage: '1d6+1', damageType: 'Contundente' }],
    traits: [{ name: 'Tenacidade do Morto-vivo', description: 'Se receber dano que o reduziria a 0 HP, rola CD 5+dano recebido de Constituição. Sucesso = fica com 1 HP.' }],
  },
  {
    id: 'lobo', name: 'Lobo', type: 'Fera', size: 'Médio', cr: '1/4', xp: 50,
    ac: 13, acType: 'Natural', hp: 11, speed: '12 m',
    attacks: [{ name: 'Mordida', bonus: 4, reach: '1,5 m', damage: '2d4+2', damageType: 'Perfurante', notes: 'CD 11 For ou cai prostrado' }],
    traits: [{ name: 'Tática de Matilha', description: 'Vantagem em ataques quando aliado não incapacitado estiver adjacente ao alvo.' }],
  },
  {
    id: 'javali', name: 'Javali', type: 'Fera', size: 'Médio', cr: '1/4', xp: 50,
    ac: 11, acType: 'Natural', hp: 11, speed: '12 m',
    attacks: [{ name: 'Marrada', bonus: 3, reach: '1,5 m', damage: '1d6+1', damageType: 'Cortante' }],
    traits: [{ name: 'Carga', description: 'Se mover 6 m em linha reta e acertar, alvo sofre +3 (1d6) extra e CD 11 For ou cai prostrado.' }],
  },

  // ── CR 1/2 ────────────────────────────────────────────────────────────
  {
    id: 'orc', name: 'Orc', type: 'Humanoide', size: 'Médio', cr: '1/2', xp: 100,
    ac: 13, acType: 'Armadura de Couro', hp: 15, speed: '9 m',
    attacks: [
      { name: 'Machadão', bonus: 5, reach: '1,5 m', damage: '1d12+3', damageType: 'Cortante' },
      { name: 'Lança', bonus: 5, reach: '1,5 m / 6/18 m', damage: '1d6+3', damageType: 'Perfurante' },
    ],
    traits: [{ name: 'Agressivo', description: 'Como ação bônus, pode se mover até sua velocidade em direção a um inimigo visível.' }],
  },
  {
    id: 'hobgoblin', name: 'Hobgoblin', type: 'Humanoide', size: 'Médio', cr: '1/2', xp: 100,
    ac: 18, acType: 'Armadura de Placa', hp: 11, speed: '9 m',
    attacks: [
      { name: 'Espada Longa', bonus: 3, reach: '1,5 m', damage: '1d8+1', damageType: 'Cortante' },
      { name: 'Arco Longo', bonus: 3, reach: '45/180 m', damage: '1d8+1', damageType: 'Perfurante' },
    ],
    traits: [{ name: 'Formação Marcial', description: 'Quando acerta com uma arma, causa +3 (1d6) de dano extra (1× por turno).' }],
  },
  {
    id: 'gnoll', name: 'Gnoll', type: 'Humanoide', size: 'Médio', cr: '1/2', xp: 100,
    ac: 15, acType: 'Cota de Cota de Malha', hp: 22, speed: '9 m',
    attacks: [
      { name: 'Mordida', bonus: 4, reach: '1,5 m', damage: '1d4+2', damageType: 'Perfurante' },
      { name: 'Lança', bonus: 4, reach: '1,5 m / 6/18 m', damage: '1d6+2', damageType: 'Perfurante' },
    ],
    traits: [{ name: 'Rampage', description: 'Quando reduz um inimigo a 0 HP, pode se mover metade da velocidade e fazer ataque de mordida como ação bônus.' }],
  },
  {
    id: 'urso-negro', name: 'Urso Negro', type: 'Fera', size: 'Médio', cr: '1/2', xp: 100,
    ac: 11, acType: 'Natural', hp: 19, speed: '12 m / Escalar 9 m',
    attacks: [
      { name: 'Mordida', bonus: 3, reach: '1,5 m', damage: '1d6+2', damageType: 'Perfurante' },
      { name: 'Garras (Multiataques × 2)', bonus: 3, reach: '1,5 m', damage: '1d6+2', damageType: 'Cortante' },
    ],
  },

  // ── CR 1 ──────────────────────────────────────────────────────────────
  {
    id: 'bugbear', name: 'Bugbear', type: 'Humanoide', size: 'Médio', cr: '1', xp: 200,
    ac: 16, acType: 'Couro + Escudo', hp: 27, speed: '9 m',
    attacks: [
      { name: 'Maça', bonus: 4, reach: '1,5 m', damage: '2d6+2', damageType: 'Contundente' },
      { name: 'Dardo', bonus: 4, reach: '9/18 m', damage: '1d4+2', damageType: 'Perfurante' },
    ],
    traits: [
      { name: 'Surpresa Brutal', description: 'Causa +7 (2d6) de dano extra no primeiro turno de combate se a vítima não agiu ainda.' },
      { name: 'Furtividade', description: 'Bônus de +3 em testes de Furtividade.' },
    ],
  },
  {
    id: 'aranha-gigante', name: 'Aranha Gigante', type: 'Fera', size: 'Grande', cr: '1', xp: 200,
    ac: 14, acType: 'Natural', hp: 26, speed: '9 m / Escalar 9 m',
    attacks: [
      { name: 'Mordida', bonus: 5, reach: '1,5 m', damage: '1d8+3', damageType: 'Perfurante', notes: 'CD 11 Con ou sofre 2d8 de veneno' },
      { name: 'Teia', bonus: 5, reach: '9/18 m', damage: '—', damageType: '—', notes: 'Alvo fica aprisionado (CD 12 For para escapar)' },
    ],
    traits: [{ name: 'Sentido de Teia', description: 'Conhece a localização de tudo em contato com sua teia.' }],
  },
  {
    id: 'harpia', name: 'Harpia', type: 'Monstruosidade', size: 'Médio', cr: '1', xp: 200,
    ac: 11, hp: 38, speed: '6 m / Voo 12 m',
    attacks: [
      { name: 'Garras', bonus: 3, reach: '1,5 m', damage: '2d4+1', damageType: 'Cortante' },
      { name: 'Clava', bonus: 3, reach: '1,5 m', damage: '1d4+1', damageType: 'Contundente' },
    ],
    traits: [{ name: 'Canção Atrativa', description: 'Criaturas em 90 m devem CD 11 Sab ou ficam enfeitiçadas (movimento em direção à harpia).' }],
  },
  {
    id: 'goblin-chefe', name: 'Goblin Chefe', type: 'Humanoide', size: 'Pequeno', cr: '1', xp: 200,
    ac: 17, acType: 'Cota + Escudo', hp: 21, speed: '9 m',
    attacks: [
      { name: 'Cimitarra (×2)', bonus: 4, reach: '1,5 m', damage: '1d6+2', damageType: 'Cortante' },
      { name: 'Arco Curto', bonus: 4, reach: '24/96 m', damage: '1d6+2', damageType: 'Perfurante' },
    ],
    traits: [
      { name: 'Fuga Ágil', description: 'Pode Desengajar ou Esconder como ação bônus.' },
      { name: 'Redirecionar Ataque', description: 'Quando acertado por ataque, escolhe outro goblin em 1,5 m para receber o ataque no lugar.' },
    ],
  },

  // ── CR 2 ──────────────────────────────────────────────────────────────
  {
    id: 'ogro', name: 'Ogro', type: 'Gigante', size: 'Grande', cr: '2', xp: 450,
    ac: 11, acType: 'Couro', hp: 59, speed: '12 m',
    attacks: [
      { name: 'Clava Grande', bonus: 6, reach: '1,5 m', damage: '2d8+4', damageType: 'Contundente' },
      { name: 'Dardo', bonus: 3, reach: '9/36 m', damage: '2d6+1', damageType: 'Perfurante' },
    ],
  },
  {
    id: 'gargula', name: 'Gárgula', type: 'Elemental', size: 'Médio', cr: '2', xp: 450,
    ac: 15, acType: 'Natural', hp: 52, speed: '9 m / Voo 15 m',
    attacks: [
      { name: 'Mordida', bonus: 4, reach: '1,5 m', damage: '1d6+2', damageType: 'Perfurante' },
      { name: 'Garras (×2)', bonus: 4, reach: '1,5 m', damage: '1d6+2', damageType: 'Cortante' },
    ],
    traits: [{ name: 'Forma Falsa', description: 'Permanece imóvel e idêntica a uma estátua de pedra.' }],
  },
  {
    id: 'grifo', name: 'Grifo', type: 'Monstruosidade', size: 'Grande', cr: '2', xp: 450,
    ac: 12, acType: 'Natural', hp: 59, speed: '9 m / Voo 24 m',
    attacks: [
      { name: 'Picada', bonus: 6, reach: '1,5 m', damage: '1d8+4', damageType: 'Perfurante' },
      { name: 'Garras (×2)', bonus: 6, reach: '1,5 m', damage: '2d6+4', damageType: 'Cortante' },
    ],
  },

  // ── CR 3 ──────────────────────────────────────────────────────────────
  {
    id: 'basilisco', name: 'Basilisco', type: 'Monstruosidade', size: 'Médio', cr: '3', xp: 700,
    ac: 15, acType: 'Natural', hp: 52, speed: '6 m',
    attacks: [{ name: 'Mordida', bonus: 5, reach: '1,5 m', damage: '2d8+3', damageType: 'Perfurante', notes: 'CD 12 Con ou petrificado em 24h' }],
    traits: [{ name: 'Olhar Petrificante', description: 'Criaturas que olham para o basilisco podem ser petrificadas progressivamente.' }],
  },
  {
    id: 'manticora', name: 'Manticora', type: 'Monstruosidade', size: 'Grande', cr: '3', xp: 700,
    ac: 14, acType: 'Natural', hp: 68, speed: '9 m / Voo 15 m',
    attacks: [
      { name: 'Mordida', bonus: 5, reach: '1,5 m', damage: '1d8+3', damageType: 'Perfurante' },
      { name: 'Garras (×2)', bonus: 5, reach: '1,5 m', damage: '1d6+3', damageType: 'Cortante' },
      { name: 'Cauda de Espinhos (×3)', bonus: 5, reach: '30/60 m', damage: '1d8+3', damageType: 'Perfurante' },
    ],
  },
  {
    id: 'lobisomem', name: 'Lobisomem', type: 'Humanoide (Metamorfo)', size: 'Médio', cr: '3', xp: 700,
    ac: 12, hp: 58, speed: '9 m (12 m forma de lobo)',
    attacks: [
      { name: 'Mordida (lobo/híbrido)', bonus: 4, reach: '1,5 m', damage: '2d8+2', damageType: 'Perfurante', notes: 'CD 12 Con ou vira lobisomem (humanos)' },
      { name: 'Garras (híbrido)', bonus: 4, reach: '1,5 m', damage: '2d4+2', damageType: 'Cortante' },
    ],
    traits: [{ name: 'Imunidade', description: 'Imune a dano de armas não-prateadas ou não-mágicas.' }],
  },

  // ── CR 4 ──────────────────────────────────────────────────────────────
  {
    id: 'banshee', name: 'Banshee', type: 'Morto-vivo', size: 'Médio', cr: '4', xp: 1100,
    ac: 12, hp: 58, speed: '0 m / Voo 12 m (flutua)',
    attacks: [{ name: 'Toque Corruptor', bonus: 4, reach: '1,5 m', damage: '3d6', damageType: 'Necrótico' }],
    traits: [
      { name: 'Lamento', description: 'Ação: Todas as criaturas em 9 m: CD 13 Con ou vai a 0 HP. Não afeta mortos-vivos e constructos.' },
      { name: 'Incorporal', description: 'Pode atravessar objetos sólidos. Sofre 5 de dano por turno se terminar dentro.' },
    ],
  },

  // ── CR 5 ──────────────────────────────────────────────────────────────
  {
    id: 'troll', name: 'Troll', type: 'Gigante', size: 'Grande', cr: '5', xp: 1800,
    ac: 15, acType: 'Natural', hp: 84, speed: '9 m',
    attacks: [
      { name: 'Mordida', bonus: 7, reach: '1,5 m', damage: '1d6+4', damageType: 'Perfurante' },
      { name: 'Garras (×2)', bonus: 7, reach: '1,5 m', damage: '2d6+4', damageType: 'Cortante' },
    ],
    traits: [{ name: 'Regeneração', description: 'Recupera 10 HP no início de cada turno. Ácido ou fogo impedem a regeneração naquele turno. Morre só se começar turno com 0 HP sem regenerar.' }],
  },
  {
    id: 'vampiro-spawn', name: 'Vampiro Spawn', type: 'Morto-vivo', size: 'Médio', cr: '5', xp: 1800,
    ac: 15, acType: 'Natural', hp: 82, speed: '9 m / Escalar 9 m',
    attacks: [
      { name: 'Garras (×2)', bonus: 6, reach: '1,5 m', damage: '2d4+4', damageType: 'Cortante' },
      { name: 'Mordida', bonus: 6, reach: '1,5 m', damage: '1d6+4', damageType: 'Perfurante', notes: '+3 (1d6) necrótico; HP máximo do alvo reduz pelo mesmo valor' },
    ],
    traits: [
      { name: 'Regeneração', description: 'Recupera 10 HP por turno; não funciona sob luz solar ou em água corrente.' },
      { name: 'Escalador de Aranha', description: 'Pode escalar superfícies difíceis sem testes.' },
    ],
  },
  {
    id: 'gigante-colinas', name: 'Gigante das Colinas', type: 'Gigante', size: 'Enorme', cr: '5', xp: 1800,
    ac: 13, acType: 'Natural', hp: 105, speed: '12 m',
    attacks: [
      { name: 'Clava Grande (×2)', bonus: 8, reach: '3 m', damage: '3d8+5', damageType: 'Contundente' },
      { name: 'Arremessar Rocha', bonus: 8, reach: '18/72 m', damage: '3d10+5', damageType: 'Contundente' },
    ],
  },

  // ── CR 6 ──────────────────────────────────────────────────────────────
  {
    id: 'medusa', name: 'Medusa', type: 'Monstruosidade', size: 'Médio', cr: '6', xp: 2300,
    ac: 15, acType: 'Natural', hp: 127, speed: '9 m',
    attacks: [
      { name: 'Cabelos Serpente (×3)', bonus: 5, reach: '1,5 m', damage: '1d4+3', damageType: 'Perfurante', notes: '+4 (1d8) veneno' },
      { name: 'Arco Curto (×3)', bonus: 5, reach: '24/96 m', damage: '1d6+3', damageType: 'Perfurante', notes: '+4 (1d8) veneno' },
    ],
    traits: [{ name: 'Olhar Petrificante', description: 'No início de cada turno de criaturas que possam ver a Medusa em 9 m: CD 14 Con ou petrificada progressivamente.' }],
  },
  {
    id: 'quimera', name: 'Quimera', type: 'Monstruosidade', size: 'Grande', cr: '6', xp: 2300,
    ac: 14, acType: 'Natural', hp: 114, speed: '9 m / Voo 18 m',
    attacks: [
      { name: 'Chifres', bonus: 6, reach: '1,5 m', damage: '2d12+4', damageType: 'Perfurante' },
      { name: 'Garras', bonus: 6, reach: '1,5 m', damage: '2d6+4', damageType: 'Cortante' },
      { name: 'Mordida', bonus: 6, reach: '1,5 m', damage: '2d6+4', damageType: 'Perfurante' },
    ],
    traits: [{ name: 'Sopro de Fogo', description: 'Cone de 4,5 m: CD 13 Des, 7d8 de fogo (metade no sucesso). Recarga 5-6.' }],
  },
  {
    id: 'wyverna', name: 'Wyverna', type: 'Dragão', size: 'Grande', cr: '6', xp: 2300,
    ac: 13, acType: 'Natural', hp: 110, speed: '6 m / Voo 24 m',
    attacks: [
      { name: 'Mordida', bonus: 7, reach: '3 m', damage: '2d6+4', damageType: 'Perfurante' },
      { name: 'Ferrão', bonus: 7, reach: '3 m', damage: '2d6+4', damageType: 'Perfurante', notes: '+7 (2d6) veneno; CD 15 Con' },
      { name: 'Garras', bonus: 7, reach: '1,5 m', damage: '2d8+4', damageType: 'Cortante' },
    ],
  },

  // ── CR 7 ──────────────────────────────────────────────────────────────
  {
    id: 'gigante-pedras', name: 'Gigante das Pedras', type: 'Gigante', size: 'Enorme', cr: '7', xp: 2900,
    ac: 17, acType: 'Natural', hp: 126, speed: '12 m',
    attacks: [
      { name: 'Maça Grande (×2)', bonus: 9, reach: '3 m', damage: '3d8+6', damageType: 'Contundente' },
      { name: 'Arremessar Rocha', bonus: 9, reach: '18/72 m', damage: '4d10+6', damageType: 'Contundente' },
    ],
  },
  {
    id: 'dragao-negro-jovem', name: 'Dragão Negro Jovem', type: 'Dragão', size: 'Grande', cr: '7', xp: 2900,
    ac: 18, acType: 'Natural', hp: 127, speed: '12 m / Voo 24 m / Nado 12 m',
    attacks: [
      { name: 'Mordida', bonus: 7, reach: '3 m', damage: '2d10+4', damageType: 'Perfurante', notes: '+4 (1d8) ácido' },
      { name: 'Garras (×2)', bonus: 7, reach: '1,5 m', damage: '2d6+4', damageType: 'Cortante' },
    ],
    traits: [{ name: 'Sopro Ácido', description: 'Linha de 9 m × 1,5 m: CD 14 Des, 11d8 ácido. Recarga 5-6.' }],
  },

  // ── CR 8 ──────────────────────────────────────────────────────────────
  {
    id: 'hidra', name: 'Hidra', type: 'Monstruosidade', size: 'Enorme', cr: '8', xp: 3900,
    ac: 15, acType: 'Natural', hp: 172, speed: '9 m / Nado 9 m',
    attacks: [{ name: 'Mordida (×5)', bonus: 8, reach: '3 m', damage: '1d10+5', damageType: 'Perfurante' }],
    traits: [
      { name: 'Regeneração de Cabeças', description: 'Se uma cabeça for cortada, crescem 2 no próximo turno (a não ser que receba dano de fogo naquele turno).' },
      { name: 'Múltiplas Cabeças', description: 'Tem vantagem em testes de resistência contra ser cego, enfeitiçado, ensurdecido, amedrontado, atordoado e inconsciente.' },
    ],
  },
  {
    id: 'dragao-verde-jovem', name: 'Dragão Verde Jovem', type: 'Dragão', size: 'Grande', cr: '8', xp: 3900,
    ac: 18, acType: 'Natural', hp: 136, speed: '12 m / Voo 24 m / Nado 12 m',
    attacks: [
      { name: 'Mordida', bonus: 7, reach: '3 m', damage: '2d10+4', damageType: 'Perfurante', notes: '+4 (1d8) veneno' },
      { name: 'Garras (×2)', bonus: 7, reach: '1,5 m', damage: '2d6+4', damageType: 'Cortante' },
    ],
    traits: [{ name: 'Sopro de Veneno', description: 'Cone de 9 m: CD 14 Con, 12d6 veneno. Recarga 5-6.' }],
  },

  // ── CR 9 ──────────────────────────────────────────────────────────────
  {
    id: 'gigante-gelo', name: 'Gigante do Gelo', type: 'Gigante', size: 'Enorme', cr: '9', xp: 5000,
    ac: 15, acType: 'Cota de Malha + Escudo', hp: 138, speed: '12 m',
    attacks: [
      { name: 'Machado Grande (×2)', bonus: 9, reach: '3 m', damage: '3d12+6', damageType: 'Cortante' },
      { name: 'Arremessar Rocha', bonus: 9, reach: '18/72 m', damage: '4d10+6', damageType: 'Contundente' },
    ],
  },
  {
    id: 'dragao-azul-jovem', name: 'Dragão Azul Jovem', type: 'Dragão', size: 'Grande', cr: '9', xp: 5000,
    ac: 17, acType: 'Natural', hp: 152, speed: '12 m / Voo 24 m / Escavar 6 m',
    attacks: [
      { name: 'Mordida', bonus: 8, reach: '3 m', damage: '2d10+5', damageType: 'Perfurante', notes: '+4 (1d8) elétrico' },
      { name: 'Garras (×2)', bonus: 8, reach: '1,5 m', damage: '2d6+5', damageType: 'Cortante' },
    ],
    traits: [{ name: 'Sopro de Raio', description: 'Linha de 18 m × 1,5 m: CD 16 Des, 12d10 elétrico. Recarga 5-6.' }],
  },

  // ── CR 10 ─────────────────────────────────────────────────────────────
  {
    id: 'dragao-vermelho-jovem', name: 'Dragão Vermelho Jovem', type: 'Dragão', size: 'Grande', cr: '10', xp: 5900,
    ac: 18, acType: 'Natural', hp: 178, speed: '12 m / Voo 24 m / Escalar 12 m',
    attacks: [
      { name: 'Mordida', bonus: 10, reach: '3 m', damage: '2d10+6', damageType: 'Perfurante', notes: '+4 (1d8) fogo' },
      { name: 'Garras (×2)', bonus: 10, reach: '1,5 m', damage: '2d6+6', damageType: 'Cortante' },
    ],
    traits: [{ name: 'Sopro de Fogo', description: 'Cone de 9 m: CD 17 Des, 16d6 fogo. Recarga 5-6.' }],
  },

  // ── CR 13 ─────────────────────────────────────────────────────────────
  {
    id: 'vampiro', name: 'Vampiro', type: 'Morto-vivo', size: 'Médio', cr: '13', xp: 10000,
    ac: 16, acType: 'Natural', hp: 144, speed: '9 m / Escalar 9 m',
    attacks: [
      { name: 'Garras (Mãos)', bonus: 9, reach: '1,5 m', damage: '2d8+5', damageType: 'Cortante', notes: 'Alvo fica agarrado (CD 18 For para escapar)' },
      { name: 'Mordida', bonus: 9, reach: '1,5 m', damage: '1d6+5', damageType: 'Perfurante', notes: '+7 (2d6) necrótico; HP máximo reduzido pelo mesmo valor' },
    ],
    traits: [
      { name: 'Regeneração', description: 'Recupera 20 HP por turno; não funciona sob luz solar ou água corrente.' },
      { name: 'Encantar', description: 'CD 17 Sab ou encantado por 24h.' },
      { name: 'Crianças da Noite', description: 'Pode invocar 2d4 ratos/morcegos ou 3d6 lobos (1× por dia).' },
    ],
  },
  {
    id: 'dragao-negro-adulto', name: 'Dragão Negro Adulto', type: 'Dragão', size: 'Enorme', cr: '14', xp: 11500,
    ac: 19, acType: 'Natural', hp: 195, speed: '12 m / Voo 24 m / Nado 12 m',
    attacks: [
      { name: 'Mordida', bonus: 11, reach: '3 m', damage: '2d10+7', damageType: 'Perfurante', notes: '+4 (1d8) ácido' },
      { name: 'Garras (×2)', bonus: 11, reach: '1,5 m', damage: '2d6+7', damageType: 'Cortante' },
      { name: 'Cauda', bonus: 11, reach: '4,5 m', damage: '2d8+7', damageType: 'Contundente' },
    ],
    traits: [
      { name: 'Sopro Ácido', description: 'Linha de 18 m × 1,5 m: CD 19 Des, 15d8 ácido. Recarga 5-6.' },
      { name: 'Ações Lendárias (3)', description: 'Detectar / Cauda / Ataque de Asa (CD 19 Des ou prostrado).' },
    ],
  },

  // ── CR 15 ─────────────────────────────────────────────────────────────
  {
    id: 'dragao-vermelho-adulto', name: 'Dragão Vermelho Adulto', type: 'Dragão', size: 'Enorme', cr: '17', xp: 18000,
    ac: 19, acType: 'Natural', hp: 256, speed: '12 m / Voo 24 m / Escalar 12 m',
    attacks: [
      { name: 'Mordida', bonus: 13, reach: '3 m', damage: '2d10+8', damageType: 'Perfurante', notes: '+4 (1d8) fogo' },
      { name: 'Garras (×2)', bonus: 13, reach: '1,5 m', damage: '2d6+8', damageType: 'Cortante' },
      { name: 'Cauda', bonus: 13, reach: '4,5 m', damage: '2d8+8', damageType: 'Contundente' },
    ],
    traits: [
      { name: 'Sopro de Fogo', description: 'Cone de 18 m: CD 21 Des, 18d6 fogo. Recarga 5-6.' },
      { name: 'Ações Lendárias (3)', description: 'Detectar / Cauda / Ataque de Asa.' },
    ],
  },

  // ── CR 21+ ────────────────────────────────────────────────────────────
  {
    id: 'dragao-vermelho-anciao', name: 'Dragão Vermelho Ancião', type: 'Dragão', size: 'Colossal', cr: '24', xp: 62000,
    ac: 22, acType: 'Natural', hp: 546, speed: '12 m / Voo 24 m / Escalar 12 m',
    attacks: [
      { name: 'Mordida', bonus: 17, reach: '4,5 m', damage: '2d10+10', damageType: 'Perfurante', notes: '+4 (1d8) fogo' },
      { name: 'Garras (×2)', bonus: 17, reach: '3 m', damage: '2d6+10', damageType: 'Cortante' },
      { name: 'Cauda', bonus: 17, reach: '6 m', damage: '2d8+10', damageType: 'Contundente' },
    ],
    traits: [
      { name: 'Sopro de Fogo', description: 'Cone de 27 m: CD 24 Des, 26d6 fogo. Recarga 5-6.' },
      { name: 'Presença Assustadora', description: 'CD 21 Sab ou amedrontado por 1 minuto (9 m).' },
      { name: 'Ações Lendárias (3)', description: 'Detectar / Cauda / Ataque de Asa.' },
    ],
  },
  {
    id: 'lich', name: 'Lich', type: 'Morto-vivo', size: 'Médio', cr: '21', xp: 33000,
    ac: 17, acType: 'Armadura Natural', hp: 135, speed: '9 m',
    attacks: [
      { name: 'Toque Paralisante', bonus: 7, reach: '1,5 m', damage: '3d6', damageType: 'Frio', notes: 'CD 18 Con ou paralisado por 1 minuto' },
    ],
    traits: [
      { name: 'Conjurador (Nível 18)', description: 'Magias de até 9° círculo. CD de magia 20, +12 ao ataque.' },
      { name: 'Resistências', description: 'Resistente a dano contundente/cortante/perfurante não-mágico.' },
      { name: 'Imunidades', description: 'Imune a veneno, exaustão, paralisação, envenenamento, prostrado.' },
      { name: 'Filactério', description: 'Se destruído, reconstitui-se em 1d10 dias (enquanto o filactério existir).' },
    ],
  },
  {
    id: 'tarrasque', name: 'Tarrasque', type: 'Monstruosidade', size: 'Colossal', cr: '30', xp: 155000,
    ac: 25, acType: 'Natural', hp: 676, speed: '12 m',
    attacks: [
      { name: 'Mordida', bonus: 19, reach: '3 m', damage: '4d12+10', damageType: 'Perfurante' },
      { name: 'Garras (×2)', bonus: 19, reach: '3 m', damage: '4d8+10', damageType: 'Cortante' },
      { name: 'Chifres', bonus: 19, reach: '3 m', damage: '4d10+10', damageType: 'Perfurante' },
      { name: 'Cauda', bonus: 19, reach: '6 m', damage: '4d6+10', damageType: 'Contundente', notes: 'CD 20 For ou prostrado' },
    ],
    traits: [
      { name: 'Refletir Magia', description: 'Imune a magias e efeitos mágicos. Absorve raios e projéteis de magia, refletindo-os.' },
      { name: 'Regeneração', description: 'Recupera 30 HP por turno.' },
      { name: 'Lendário (5)', description: 'Ataque / Movimento / Intimidação / Devorar / Cauda.' },
    ],
  },
];
