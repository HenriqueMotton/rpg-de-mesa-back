import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DndClass, ClassFeature, ClassSpellEntry } from './entities/dnd-class.entity';

// ─── Seed data ───────────────────────────────────────────────────────────────

type ClassSeed = {
  name: string;
  icon: string;
  tagline: string;
  description: string;
  imgGradient: string;
  equipment: string[];
  features: ClassFeature[];
  classSpells: ClassSpellEntry[];
};

function sp(
  name: string, level: number, school: string,
  castingTime: string, range: string, duration: string,
  v: boolean, s: boolean, m: boolean, material: string,
  description: string, unlockLevel: number,
): ClassSpellEntry {
  return { name, level, school, castingTime, range, duration,
    componentV: v, componentS: s, componentM: m,
    ...(material ? { materialComponent: material } : {}),
    description, unlockLevel };
}

// ─── Spell catalogs per class ────────────────────────────────────────────────

const MAGO_SPELLS: ClassSpellEntry[] = [
  sp('Mão Mágica',      0,'Conjuração', '1 ação',   '9 metros',  '1 minuto',    true,  false, false, '', 'Cria uma mão espectral que pode manipular objetos, abrir portas, entregar itens e fazer outras tarefas simples a distância.', 1),
  sp('Raio de Gelo',    0,'Evocação',   '1 ação',   '18 metros', 'Instantâneo', false, true,  false, '', 'Um raio azulado de energia fria atinge uma criatura. 1d8 de dano de frio e reduz 3m de velocidade até o próximo turno.', 1),
  sp('Projétil Ígneo',  0,'Evocação',   '1 ação',   '36 metros', 'Instantâneo', false, true,  false, '', 'Um projétil de fogo atinge uma criatura ou objeto. 1d10 de dano de fogo. Escala com o nível do conjurador.', 1),
  sp('Míssil Mágico',   1,'Evocação',   '1 ação',   '36 metros', 'Instantâneo', true,  false, false, '', 'Cria três dardos de força mágica que atingem automaticamente o alvo. Cada dardo causa 1d4+1 de dano de força.', 1),
  sp('Sono',            1,'Encantamento','1 ação',  '27 metros', 'Instantâneo', true,  false, true,  'Pétalas de flores', 'Coloca criaturas em sono mágico. Afeta 5d8 PV de criaturas, priorizando as mais fracas.', 1),
  sp('Escudo',          1,'Abjuração',  '1 reação', 'Pessoal',   '1 turno',     false, true,  false, '', 'Cria uma barreira mágica invisível. +5 na CA até o início do próximo turno e imunidade a Míssil Mágico.', 1),
  sp('Invisibilidade',  2,'Ilusão',     '1 ação',   'Toque',     'Concentração, 1h', true, false, true, 'Um cílio coberto de cola', 'Uma criatura se torna invisível até atacar ou conjurar uma magia.', 3),
  sp('Sugestão',        2,'Encantamento','1 ação',  '9 metros',  'Concentração, 8h', true, false, true, 'Uma língua de cobra e mel', 'Sugere magicamente um curso de ação razoável a uma criatura. Ela deve seguir a sugestão se falhar no teste.', 3),
  sp('Bola de Fogo',    3,'Evocação',   '1 ação',   '45 metros', 'Instantâneo', true,  false, true,  'Guano de morcego e enxofre', 'Uma explosão de chamas queima tudo em uma esfera de 6m de raio. 8d6 de dano de fogo, CD Destreza para metade.', 5),
  sp('Contrafeitiço',   3,'Abjuração',  '1 reação', '18 metros', 'Instantâneo', false, true,  false, '', 'Cancela automaticamente uma magia de 3º nível ou menos. Para magias maiores, teste de habilidade.', 5),
  sp('Banimento',       4,'Abjuração',  '1 ação',   '18 metros', 'Concentração, 1 min', true, false, true, 'Um item avesso ao alvo', 'Tenta banir uma criatura para outro plano. Criaturas nativas retornam ao fim da concentração.', 7),
  sp('Cone de Frio',    5,'Evocação',   '1 ação',   '18 metros', 'Instantâneo', true,  false, false, '', 'Um cone de ar ártico de 18m. 8d8 de dano de frio, CD Constituição para metade. Criaturas mortas se tornam estátuas de gelo.', 9),
];

const CLERIGO_SPELLS: ClassSpellEntry[] = [
  sp('Chama Sagrada',   0,'Evocação',   '1 ação',   '18 metros', 'Instantâneo', true,  false, false, '', 'Chamas de luz divina caem sobre uma criatura. 1d8 de dano radiante, CD Destreza. Sem cobertura.', 1),
  sp('Taumaturgia',     0,'Transmutação','1 ação',  '9 metros',  '1 minuto',    true,  false, false, '', 'Manifesta um sinal de poder sobrenatural: voz trovejante, chamas tremulando, tremor no chão e outros efeitos menores.', 1),
  sp('Cura Ferimentos', 1,'Evocação',   '1 ação',   'Toque',     'Instantâneo', true,  false, false, '', 'Uma criatura tocada recupera 1d8 + modificador de Sabedoria de pontos de vida.', 1),
  sp('Bênção',          1,'Encantamento','1 ação',  '9 metros',  'Concentração, 1 min', true, false, true, 'Água benta', 'Até 3 criaturas adicionam 1d4 em ataques e testes de resistência enquanto concentrado.', 1),
  sp('Palavra de Cura', 1,'Evocação',   '1 ação bônus','18 metros','Instantâneo',true, false, false, '', 'Uma criatura recupera 1d4 + mod Sabedoria PV. Pode ser usada como ação bônus, permitindo atacar no mesmo turno.', 1),
  sp('Arma Espiritual', 2,'Evocação',   '1 ação bônus','18 metros','Concentração, 1 min',true,false,false,'','Cria uma arma espiritual flutuante que ataca como ação bônus. 1d8 + mod Sabedoria de dano de força.', 3),
  sp('Silêncio',        2,'Ilusão',     '1 ação',   '45 metros', 'Concentração, 10 min', false, true, false, '', 'Cria uma esfera de 6m de raio de silêncio absoluto. Impede magias com componente verbal.', 3),
  sp('Revivificar',     3,'Necromancia','1 ação',   'Toque',     'Instantâneo', true,  false, true,  'Diamantes no valor de 300 po', 'Ressuscita uma criatura que morreu no último minuto. Retorna com 1 PV.', 5),
  sp('Guardiões Espirituais',3,'Conjuração','1 ação','Pessoal',  'Concentração, 10 min',true,false,true,'Nome sagrado','Espíritos evocados protegem a área ao redor. Criaturas hostis têm velocidade reduzida e sofrem 3d8 de dano sagrado ou necrótico.', 5),
  sp('Guardiã da Fé',   4,'Conjuração', '1 ação',   '9 metros',  '8 horas',     true,  false, false, '', 'Um guardião espectral de 3m vigia. Criaturas hostis sofrem 20 de dano radiante ao entrar na área guardada.', 7),
  sp('Cura em Massa',   5,'Evocação',   '1 ação',   '18 metros', 'Instantâneo', true,  false, false, '', 'Onda de energia cura até 6 criaturas escolhidas, cada uma recuperando 3d8 + mod Sabedoria PV.', 9),
];

const DRUIDA_SPELLS: ClassSpellEntry[] = [
  sp('Produzir Chama',  0,'Conjuração', '1 ação',   'Pessoal',   '10 minutos',  true,  false, false, '', 'Chama aparece na mão. Ilumina área de 3m. Pode arremessar como ataque: 1d8 de dano de fogo a 18m.', 1),
  sp('Orientação',      0,'Adivinhação','1 ação',   'Toque',     'Concentração, 1 min', true, false, false, '', 'Toca uma criatura disposta. Ela pode adicionar 1d4 em um teste de habilidade de sua escolha.', 1),
  sp('Cura Ferimentos', 1,'Evocação',   '1 ação',   'Toque',     'Instantâneo', true,  false, false, '', 'Uma criatura tocada recupera 1d8 + modificador de Sabedoria de pontos de vida.', 1),
  sp('Nuvem de Névoa',  1,'Conjuração', '1 ação',   '36 metros', 'Concentração, 1h', true, false, false, '', 'Cria uma esfera de névoa espessa de 6m de raio. A área é fortemente obscurecida. Vento pode dispersar.', 1),
  sp('Onda Trovejante', 1,'Transmutação','1 ação',  'Pessoal (cubo 4,5m)','Instantâneo',true,false,false,'','Uma onda de força trovejante varre a área. 2d8 de dano trovejante, CD Constituição ou é empurrado 3m.', 1),
  sp('Passar sem Rastro',2,'Abjuração', '1 ação',   'Pessoal',   'Concentração, 1h', true, false, false, '', 'Você e até 10 criaturas voluntárias se movem em silêncio absoluto. +10 em Furtividade, não deixa rastros.', 3),
  sp('Casca de Árvore', 2,'Transmutação','1 ação',  'Toque',     'Concentração, 1h', true, false, true, 'Um punhado de carvalho', 'A CA de uma criatura torna-se 16, se sua CA atual for menor. Não requer armadura.', 3),
  sp('Chamado do Relâmpago',3,'Conjuração','1 ação', '36 metros', 'Concentração, 10 min', true, false, false, '', 'Nuvem elétrica de 18m de raio aparece. Em cada turno, pode direcionar um raio: 3d10 de dano elétrico.', 5),
  sp('Tempestade de Gelo',3,'Conjuração','1 ação',  '90 metros', 'Instantâneo', true,  false, true,  'Pó de água e gelo', 'Chuva de granizo em cilindro de 6m de raio e 12m de altura. 2d8 gelo + 4d6 contundente, área difícil por 1 turno.', 5),
  sp('Polimorfar',      4,'Transmutação','1 ação',  '18 metros', 'Concentração, 1h', false, true, true, 'Um casulo', 'Transforma uma criatura em uma besta. PV são os da nova forma. Volta à forma original a 0 PV.', 7),
  sp('Convocar Animais',5,'Conjuração', '1 ação',   '18 metros', 'Concentração, 1h', true, false, false, '', 'Evoca espíritos feéricos em forma de bestiais para lutar. Escolha uma entre: 1 CR 2, 2 CR 1, 4 CR 1/2 ou 8 CR 1/4.', 9),
];

const BARDO_SPELLS: ClassSpellEntry[] = [
  sp('Zombaria Viciosa',0,'Encantamento','1 ação',  '18 metros', 'Instantâneo', true,  false, false, '', 'Insultos mágicos atormentam a mente do alvo. 1d4 de dano psíquico e desvantagem no próximo ataque se falhar em Sabedoria.', 1),
  sp('Luz',             0,'Evocação',   '1 ação',   'Toque',     '1 hora',      true,  false, true,  'Um vaga-lume', 'Um objeto toca emite luz em 6m e penumbra em mais 6m. A cor pode variar. Bloqueia escuridão mágica de mesmo nível.', 1),
  sp('Cura Ferimentos', 1,'Evocação',   '1 ação',   'Toque',     'Instantâneo', true,  false, false, '', 'Uma criatura tocada recupera 1d8 + modificador de Carisma de pontos de vida.', 1),
  sp('Sono',            1,'Encantamento','1 ação',  '27 metros', 'Instantâneo', true,  false, true,  'Pétalas de flores', 'Coloca criaturas em sono mágico. Afeta 5d8 PV de criaturas, priorizando as mais fracas.', 1),
  sp('Disfarce',        1,'Ilusão',     '1 ação',   'Pessoal',   '1 hora',      true,  false, false, '', 'Muda sua aparência: roupas, armadura, armas e outros itens. Não muda sua forma real.', 1),
  sp('Invisibilidade',  2,'Ilusão',     '1 ação',   'Toque',     'Concentração, 1h', true, false, true, 'Um cílio coberto de cola', 'Uma criatura se torna invisível até atacar ou conjurar uma magia.', 3),
  sp('Sugestão',        2,'Encantamento','1 ação',  '9 metros',  'Concentração, 8h', true, false, true, 'Língua de cobra e mel', 'Sugere magicamente um curso de ação razoável a uma criatura. Ela deve seguir se falhar no teste.', 3),
  sp('Padrão Hipnótico',3,'Ilusão',     '1 ação',   '36 metros', 'Concentração, 1 min', false, true, true, 'Uma vareta de incenso', 'Padrão scintilante enlouquece criaturas. CD Sabedoria ou fica incapacitada e velocidade 0 enquanto concentrado.', 5),
  sp('Enviar Mensagem', 3,'Transmutação','1 ação',  'Ilimitado', '1 rodada',    true,  false, true,  'Um fio de cobre', 'Envia mensagem telepática de 25 palavras a qualquer criatura familiar. Ela pode responder com igual número de palavras.', 5),
  sp('Grande Invisibilidade',4,'Ilusão','1 ação',   'Toque',     'Concentração, 1 min', true, false, false, '', 'Uma criatura se torna invisível e permanece assim mesmo ao atacar ou conjurar magias.', 7),
  sp('Dominar Pessoa',  5,'Encantamento','1 ação',  '18 metros', 'Concentração, 1 min', true, false, false, '', 'Assume controle telepático de um humanoide. Ele segue seus comandos como se fosse um aliado confiável.', 9),
];

const BRUXO_SPELLS: ClassSpellEntry[] = [
  sp('Explosão Eldritch',0,'Evocação',  '1 ação',   '36 metros', 'Instantâneo', true,  false, false, '', 'Um raio de energia sinistra atinge uma criatura. 1d10 de dano de força. Escala com o nível do conjurador.', 1),
  sp('Ilusão Menor',    0,'Ilusão',     '1 ação',   '9 metros',  '1 minuto',    false, true,  true,  'Um fragmento de lã', 'Cria um som ou imagem inanimada de um objeto menor que 1,5m. Som pode ser voz, animal ou outro ruído.', 1),
  sp('Maldição Sombria',1,'Encantamento','1 ação bônus','18 metros','Concentração, 1h',true,false,true,'Olho de víbora petrificado','Amaldiçoa um alvo. Causa 1d6 extra de dano necrótico em ataques contra ele e tem vantagem em testes de Percepção.', 1),
  sp('Armadura de Agathys',1,'Abjuração','1 ação',  'Pessoal',   '1 hora',      true,  false, true,  'Uma xícara de água', 'Ganha 5 PV temporários e causa 5 de dano frio a criaturas que te acertam em combate corpo a corpo.', 1),
  sp('Escuridão',       2,'Evocação',   '1 ação',   '18 metros', 'Concentração, 10 min', false, true, true, 'Gordura de ratos', 'Esfera de escuridão mágica de 4,5m que bloqueia visão de qualquer tipo, incluindo visão no escuro.', 3),
  sp('Espelho do Medo', 2,'Ilusão',     '1 ação',   '18 metros', 'Concentração, 1 min', true, false, false, '', 'Projeta o maior medo do alvo. CD Sabedoria ou fica amedrontado e deve fugir pelo tempo de concentração.', 3),
  sp('Padrão Hipnótico',3,'Ilusão',     '1 ação',   '36 metros', 'Concentração, 1 min', false, true, true, 'Uma vareta de incenso', 'Padrão scintilante enlouquece criaturas. CD Sabedoria ou fica incapacitada e velocidade 0.', 5),
  sp('Voo',             3,'Transmutação','1 ação',  'Toque',     'Concentração, 10 min', false, false, true, 'Uma pena de asa', 'Uma criatura tocada ganha velocidade de voo de 18m. Cai ao final da concentração.', 5),
  sp('Grande Invisibilidade',4,'Ilusão','1 ação',   'Toque',     'Concentração, 1 min', true, false, false, '', 'Uma criatura se torna invisível e permanece assim mesmo ao atacar ou conjurar magias.', 7),
  sp('Sonho',           5,'Ilusão',     '1 minuto', 'Especial',  '8 horas',     true,  false, true,  'Areia de sandman', 'Entra no sonho de uma criatura familiar e pode moldar a experiência, enviar mensagens ou causar pesadelos (3d6 psíquico).', 9),
];

const FEITICEIRO_SPELLS: ClassSpellEntry[] = [
  sp('Projétil Ígneo',  0,'Evocação',   '1 ação',   '36 metros', 'Instantâneo', false, true,  false, '', 'Um projétil de fogo atinge uma criatura ou objeto. 1d10 de dano de fogo. Escala com o nível.', 1),
  sp('Raio de Gelo',    0,'Evocação',   '1 ação',   '18 metros', 'Instantâneo', false, true,  false, '', 'Um raio azulado de energia fria. 1d8 de dano de frio e reduz 3m de velocidade até o próximo turno.', 1),
  sp('Onda Trovejante', 1,'Transmutação','1 ação',  'Pessoal (cubo 4,5m)','Instantâneo',true,false,false,'','Onda de força trovejante varre a área. 2d8 trovejante, CD Constituição ou empurrado 3m.', 1),
  sp('Sono',            1,'Encantamento','1 ação',  '27 metros', 'Instantâneo', true,  false, true,  'Pétalas de flores', 'Coloca criaturas em sono mágico. Afeta 5d8 PV de criaturas, priorizando as mais fracas.', 1),
  sp('Escudo',          1,'Abjuração',  '1 reação', 'Pessoal',   '1 turno',     false, true,  false, '', '+5 na CA até o início do próximo turno e imunidade a Míssil Mágico como reação.', 1),
  sp('Invisibilidade',  2,'Ilusão',     '1 ação',   'Toque',     'Concentração, 1h', true, false, true, 'Um cílio coberto de cola', 'Uma criatura se torna invisível até atacar ou conjurar uma magia.', 3),
  sp('Sugestão',        2,'Encantamento','1 ação',  '9 metros',  'Concentração, 8h', true, false, true, 'Língua de cobra e mel', 'Sugere magicamente um curso de ação razoável a uma criatura.', 3),
  sp('Bola de Fogo',    3,'Evocação',   '1 ação',   '45 metros', 'Instantâneo', true,  false, true,  'Guano de morcego e enxofre', 'Explosão em esfera de 6m de raio. 8d6 de dano de fogo, CD Destreza para metade.', 5),
  sp('Contrafeitiço',   3,'Abjuração',  '1 reação', '18 metros', 'Instantâneo', false, true,  false, '', 'Cancela automaticamente uma magia de 3º nível ou menos. Para magias maiores, teste de habilidade.', 5),
  sp('Grande Invisibilidade',4,'Ilusão','1 ação',   'Toque',     'Concentração, 1 min', true, false, false, '', 'Uma criatura se torna invisível e permanece assim mesmo ao atacar ou conjurar magias.', 7),
  sp('Cone de Frio',    5,'Evocação',   '1 ação',   'Pessoal',   'Instantâneo', true,  false, false, '', 'Cone de ar ártico de 18m. 8d8 de dano de frio, CD Constituição para metade.', 9),
];

const PALADINO_SPELLS: ClassSpellEntry[] = [
  sp('Bênção',          1,'Encantamento','1 ação',  '9 metros',  'Concentração, 1 min', true, false, true, 'Água benta', 'Até 3 criaturas adicionam 1d4 em ataques e testes de resistência enquanto concentrado.', 2),
  sp('Cura Ferimentos', 1,'Evocação',   '1 ação',   'Toque',     'Instantâneo', true,  false, false, '', 'Uma criatura tocada recupera 1d8 + modificador de Carisma de pontos de vida.', 2),
  sp('Proteção contra o Mal',1,'Abjuração','1 ação','Toque',     'Concentração, 10 min',true,false,true,'Água benta ou pó de prata','Proteção contra aberrações, celestiais, demônios, elementais, fadas e mortos-vivos. Eles têm desvantagem em ataques contra o alvo.', 2),
  sp('Auxílio',         2,'Abjuração',  '1 ação',   'Toque',     '8 horas',     true,  false, true,  'Uma fita de tecido branco', 'Até 3 criaturas ganham 5 PV temporários adicionais. Reforça a coragem e resistência ao medo.', 5),
  sp('Zona de Verdade', 2,'Encantamento','1 ação',  '18 metros', '10 minutos',  true,  false, false, '', 'Esfera de 4,5m onde criaturas que falharem no teste não podem mentir conscientemente.', 5),
  sp('Guardiões Espirituais',3,'Conjuração','1 ação','Pessoal',  'Concentração, 10 min',true,false,true,'Nome sagrado','Espíritos divinos protegem a área. Criaturas hostis têm velocidade reduzida e sofrem 3d8 sagrado.', 9),
  sp('Revivificar',     3,'Necromancia','1 ação',   'Toque',     'Instantâneo', true,  false, true,  'Diamantes no valor de 300 po', 'Ressuscita uma criatura que morreu no último minuto. Retorna com 1 PV.', 9),
];

const PATRULHEIRO_SPELLS: ClassSpellEntry[] = [
  sp('Marca do Caçador',1,'Adivinhação','1 ação bônus','18 metros','Concentração, 1h',true,false,false,'','Marca um alvo: causa 1d6 extra de dano ao acertá-lo e tem vantagem em testes de Percepção e Sobrevivência contra ele.', 2),
  sp('Nuvem de Névoa',  1,'Conjuração', '1 ação',   '36 metros', 'Concentração, 1h', true, false, false, '', 'Cria esfera de névoa espessa de 6m de raio. A área é fortemente obscurecida.', 2),
  sp('Golpe Enredador', 1,'Conjuração', '1 ação bônus','Pessoal','Concentração, 1 min',true,false,false,'','Próximo ataque bem-sucedido enrola o alvo em cipós. CD Força ou fica paralisado até o fim da concentração.', 2),
  sp('Passar sem Rastro',2,'Abjuração', '1 ação',   'Pessoal',   'Concentração, 1h', true, false, false, '', 'Você e até 10 criaturas se movem silenciosamente. +10 em Furtividade, sem deixar rastros.', 5),
  sp('Espinhos',        2,'Transmutação','1 ação',  '45 metros', 'Concentração, 10 min',false,true,true,'Sete espinhos','Espinhos brotam do solo em raio de 6m. O terreno fica difícil e criaturas que entram sofrem 2d4 perfurante.', 5),
  sp('Flecha Relâmpago',3,'Transmutação','1 ação bônus','Pessoal','Concentração, 1 min',true,false,false,'','Próximo ataque de arma de alcance libera relâmpago. 4d8 elétrico no alvo, 2d8 em criaturas a 3m.', 9),
  sp('Convocar Animais',3,'Conjuração', '1 ação',   '18 metros', 'Concentração, 1h', true, false, false, '', 'Evoca espíritos animais para lutar ao seu lado. 1 CR 2, 2 CR 1, 4 CR 1/2, ou 8 CR 1/4.', 9),
];

const CLASS_SEED: ClassSeed[] = [
  {
    name: 'Bárbaro',
    classSpells: [],
    icon: '⚔️',
    tagline: 'Fúria selvagem e resistência brutal',
    imgGradient: 'linear-gradient(160deg, #3a0a0a 0%, #7a1a1a 50%, #2a0505 100%)',
    description: 'Guerreiros primitivos que canalizam emoções brutas em força devastadora. No calor da batalha entram em Fúria, tornando-se quase imparáveis — resistindo a danos e golpeando mais forte do que qualquer armadura poderia compensar.',
    equipment: [
      'Machado grande ou 2 machadinhas',
      '4 azagaias',
      'Kit de explorador ou kit de dungeon',
    ],
    features: [
      { name: 'Fúria', description: 'Bônus de dano em ataques corpo a corpo e resistência a dano físico. Usos limitados por descanso longo.' },
      { name: 'Defesa Sem Armadura', description: 'Quando sem armadura, sua CA = 10 + modificador de DES + modificador de CON.' },
      { name: 'Ataques Reckless', description: 'Pode atacar imprudentemente para ter vantagem, mas inimigos também têm vantagem contra você.' },
    ],
  },
  {
    name: 'Bardo',
    icon: '🎵',
    tagline: 'Arte, magia e palavras que moldam o mundo',
    imgGradient: 'linear-gradient(160deg, #2a0a3a 0%, #6a2a7a 50%, #1a0528 100%)',
    description: 'Artistas versáteis que usam música, poesia e performance para conjurar magia arcana. Mestres da persuasão e da inspiração, adaptam-se a qualquer grupo — curando aliados, encantando inimigos ou desferindo feitiços letais.',
    equipment: [
      'Rapieira ou espada longa ou adaga',
      'Kit de diplomata ou kit de artista',
      'Instrumento musical',
    ],
    features: [
      { name: 'Inspiração Bardística', description: 'Concede dados de bônus a aliados para rolagens de ataque, habilidade ou resistência.' },
      { name: 'Conjuração Arcana', description: 'Lista ampla de magias de múltiplas classes. Pode aprender qualquer magia de qualquer lista.' },
      { name: 'Especialização', description: 'Dobra o bônus de proficiência em duas perícias escolhidas.' },
    ],
    classSpells: BARDO_SPELLS,
  },
  {
    name: 'Bruxo',
    icon: '🌑',
    tagline: 'Poder concedido por um patrono sombrio',
    imgGradient: 'linear-gradient(160deg, #0d0520 0%, #3a1060 50%, #080212 100%)',
    description: 'Mortais que selaram pactos com entidades além da compreensão mortal — demônios, fadas, grandes antigos. Possuem poucas magias, mas regeneram slots rapidamente e personalizam seus poderes com Invocações únicas.',
    equipment: [
      'Balhadora leve ou arma simples',
      'Foco arcano ou bolsa de componentes',
      'Couro, 2 adagas',
    ],
    features: [
      { name: 'Patrono Sobrenatural', description: 'Entidade que lhe concede poderes únicos: Senhor Arquidemônio, Arquifada, Grande Antigo, etc.' },
      { name: 'Invocações Sobrenaturais', description: 'Habilidades permanentes e rituais únicos que moldam seu estilo de conjuração.' },
      { name: 'Magia de Pacto', description: 'Slots de magia recuperados em descanso curto — únicos entre todos os conjuradores.' },
    ],
    classSpells: BRUXO_SPELLS,
  },
  {
    name: 'Clérico',
    icon: '✝️',
    tagline: 'Canal divino da vontade dos deuses',
    imgGradient: 'linear-gradient(160deg, #2a2000 0%, #7a6010 50%, #1a1500 100%)',
    description: 'Campeões dos deuses que canalizam poder divino para curar aliados e destruir inimigos. Versáteis entre apoio e combate, seu Domínio Divino define se serão curandeiros, guerreiros sagrados ou mestres da morte.',
    equipment: [
      'Maça ou martelo de guerra',
      'Escudo e cota de malha ou couro',
      'Símbolo sagrado, kit de sacerdote',
    ],
    features: [
      { name: 'Conjuração Divina', description: 'Acesso a lista poderosa de magias de cura, proteção e destruição. Prepara magias após descanso longo.' },
      { name: 'Canalizar Divindade', description: 'Expulsar mortos-vivos ou usar poder especial do seu domínio divino.' },
      { name: 'Domínio Divino', description: 'Especialização temática: Vida, Luz, Guerra, Morte, Natureza, Tempestade e outros.' },
    ],
    classSpells: CLERIGO_SPELLS,
  },
  {
    name: 'Druida',
    icon: '🌿',
    tagline: 'Guardião da natureza e das estações',
    imgGradient: 'linear-gradient(160deg, #041a08 0%, #0f5520 50%, #020d04 100%)',
    description: 'Guardiões ancestrais que falam a língua das árvores e dos trovões. Conjuram magia natural poderosa e se transformam em animais para explorar, rastrear ou lutar — fundindo-se com o mundo natural.',
    equipment: [
      'Cajado de madeira ou cimitarra',
      'Escudo de couro, armadura de couro',
      'Kit de herbalista, símbolo sagrado',
    ],
    features: [
      { name: 'Forma Selvagem', description: 'Transforma-se em animais conhecidos com PV e habilidades próprias. Usos por descanso curto.' },
      { name: 'Conjuração Natural', description: 'Magias de controle climático, cura, invocação de criaturas e manipulação do terreno.' },
      { name: 'Círculo Druídico', description: 'Círculo da Terra (magias extras), Círculo da Lua (formas bestiárias poderosas), entre outros.' },
    ],
    classSpells: DRUIDA_SPELLS,
  },
  {
    name: 'Feiticeiro',
    icon: '✨',
    tagline: 'Magia inata que flui pelo seu sangue',
    imgGradient: 'linear-gradient(160deg, #0a0820 0%, #2a2080 50%, #050410 100%)',
    description: 'A magia não foi aprendida — nasceu com você. Seja por herança dracônica, exposição a uma tempestade mágica ou toque de entidade divina, você conjura instintivamente e pode torcer a realidade com Metamagia.',
    equipment: [
      'Balhadora leve ou adaga',
      'Foco arcano ou bolsa de componentes',
      '2 adagas, kit de dungeon',
    ],
    features: [
      { name: 'Origem de Feitiçaria', description: 'Linhagem Dracônica, Alma Selvagem, Sombra Divina, etc. Concede magias e traços únicos.' },
      { name: 'Metamagia', description: 'Torce feitiços em tempo real: dobrar alcance, conjurar silenciosamente, maximizar dano e muito mais.' },
      { name: 'Pontos de Feitiçaria', description: 'Recurso exclusivo para criar slots de magia e alimentar metamagias. Recuperado em descanso longo.' },
    ],
    classSpells: FEITICEIRO_SPELLS,
  },
  {
    name: 'Guerreiro',
    icon: '🛡️',
    tagline: 'Mestre das armas e das táticas de combate',
    imgGradient: 'linear-gradient(160deg, #1a1008 0%, #5a4020 50%, #0d0804 100%)',
    description: 'A classe mais versátil e confiável no campo de batalha. Guerreiros dominam todas as armas e armaduras, suportam mais ataques do que qualquer outro e podem usar Retomar Fôlego para sobreviver ao que mataria outros.',
    equipment: [
      'Cota de malha ou couro + arco longo',
      'Arma marcial e escudo ou 2 armas marciais',
      'Kit de dungeon ou kit de explorador',
    ],
    features: [
      { name: 'Estilo de Combate', description: 'Arqueria, Defesa, Duelo, Luta com Duas Armas, Proteção ou Armas de Duas Mãos.' },
      { name: 'Retomar Fôlego', description: 'Recupera PV iguais a 1d10 + nível de guerreiro como ação bônus. Usos por descanso curto.' },
      { name: 'Ação Extra', description: 'Ataca mais vezes por turno do que qualquer outra classe — até 4 ataques no nível 20.' },
    ],
    classSpells: [],
  },
  {
    name: 'Ladino',
    icon: '🗡️',
    tagline: 'Furtividade, esperteza e golpes certeiros',
    imgGradient: 'linear-gradient(160deg, #040e18 0%, #103050 50%, #020609 100%)',
    description: 'Especialistas na arte do golpe preciso e da sobrevivência nas sombras. Não precisam de força bruta — um único ataque com posicionamento certo causa mais dano do que vários golpes de um guerreiro.',
    equipment: [
      'Rapieira ou espada curta',
      'Arco curto com 20 flechas ou espada curta',
      'Couro, 2 adagas, ferramentas de ladrão',
    ],
    features: [
      { name: 'Especialização', description: 'Dobra o bônus de proficiência em 2 perícias ou ferramentas escolhidas.' },
      { name: 'Ataque Furtivo', description: 'Dano extra massivo quando tem vantagem ou aliado adjacente ao alvo. Escala com o nível.' },
      { name: 'Ação Ardilosa', description: 'Dash, Desvio ou Esconder como ação bônus em qualquer turno — mobilidade incomparável.' },
    ],
    classSpells: [],
  },
  {
    name: 'Mago',
    icon: '📚',
    tagline: 'Estudioso do arcano, mestre dos feitiços',
    imgGradient: 'linear-gradient(160deg, #040a20 0%, #102060 50%, #020510 100%)',
    description: 'O conjurador mais poderoso da existência. Fracos no corpo, incomparáveis em versatilidade mágica. Com o Grimório em mãos, podem aprender virtualmente qualquer feitiço arcano e reconfigurar o arsenal a cada dia.',
    equipment: [
      'Cajado arcano ou adaga',
      'Bolsa de componentes ou foco arcano',
      'Grimório, kit de estudioso',
    ],
    features: [
      { name: 'Grimório de Magias', description: 'Registra magias aprendidas — pode copiar pergaminhos e grimórios de outros magos.' },
      { name: 'Recuperação Arcana', description: 'Recupera slots de magia gastos durante um descanso curto.' },
      { name: 'Tradição Arcana', description: 'Evocação, Ilusão, Necromancia, Abjuração, Adivinhação, entre outras escolas.' },
    ],
    classSpells: MAGO_SPELLS,
  },
  {
    name: 'Monge',
    icon: '👊',
    tagline: 'Corpo como arma, ki como força interior',
    imgGradient: 'linear-gradient(160deg, #180e00 0%, #604020 50%, #0c0700 100%)',
    description: 'Através de anos de disciplina, o monge transcende os limites do corpo humano. Usa Ki — energia espiritual — para feitos impossíveis: andar pelas paredes, desviar flechas com as mãos e paralisar com um toque.',
    equipment: [
      'Adaga ou dardo',
      'Kit de dungeon ou kit de explorador',
    ],
    features: [
      { name: 'Artes Marciais', description: 'Golpes desarmados causam dano crescente. Pode usar DES em vez de FOR nos ataques.' },
      { name: 'Ki', description: 'Pontos que alimentam técnicas especiais: Redemoinhos de Golpes, Passo do Vento, Paciência do Pacifista.' },
      { name: 'Movimento Desarmado', description: 'Velocidade extra crescente. Eventualmente corre sobre água e paredes.' },
    ],
    classSpells: [],
  },
  {
    name: 'Paladino',
    icon: '⚜️',
    tagline: 'Cavaleiro sagrado ungido pelo juramento',
    imgGradient: 'linear-gradient(160deg, #1a1400 0%, #705020 50%, #0d0a00 100%)',
    description: 'Guerreiros sagrados que selaram um juramento divino e receberam poderes celestiais em troca. Combinam combate marcial de elite com curas e auras protetoras — os melhores tanques e suportes em um só.',
    equipment: [
      'Arma marcial e escudo ou 2 armas marciais',
      '5 azagaias',
      'Cota de malha, símbolo sagrado, kit de sacerdote',
    ],
    features: [
      { name: 'Sentido Divino', description: 'Detecta a presença de criaturas celestiais, infernais ou mortos-vivos ao redor.' },
      { name: 'Imposição de Mãos', description: 'Cura total de PV por descanso longo igual a 5 × nível. Pode curar doenças e venenos.' },
      { name: 'Juramento Sagrado', description: 'Devoção, Anciãos, Vingança, Redenção — define seus poderes e código de honra.' },
    ],
    classSpells: PALADINO_SPELLS,
  },
  {
    name: 'Patrulheiro',
    icon: '🏹',
    tagline: 'Explorador e caçador das terras selvagens',
    imgGradient: 'linear-gradient(160deg, #041408 0%, #184d20 50%, #020a04 100%)',
    description: 'Caçadores e rastreadores adaptados a qualquer ambiente hostil. Especialistas no combate contra tipos específicos de inimigos e em exploração de terrenos perigosos, combinam habilidades marciais com magia da natureza.',
    equipment: [
      'Cota de escamas ou couro + arco longo',
      'Espada curta ou arma simples',
      'Kit de dungeon ou kit de explorador',
    ],
    features: [
      { name: 'Inimigo Favorito', description: 'Bônus de dano, rastreamento e conhecimento contra um tipo de criatura escolhida.' },
      { name: 'Explorador Natural', description: 'Vantagens em rastreamento, forrageamento e navegação em terreno favorito escolhido.' },
      { name: 'Magia de Patrulheiro', description: 'Conjuração divina focada em natureza, rastreamento e combate ao ar livre.' },
    ],
    classSpells: PATRULHEIRO_SPELLS,
  },
];

// ─── Service ─────────────────────────────────────────────────────────────────

@Injectable()
export class ClassesService implements OnModuleInit {
  constructor(
    @InjectRepository(DndClass)
    private readonly classRepository: Repository<DndClass>,
  ) {}

  async onModuleInit() {
    const count = await this.classRepository.count();
    if (count === 0) {
      await this.classRepository.save(
        CLASS_SEED.map((s) => this.classRepository.create(s)),
      );
      return;
    }

    // Migra registros existentes que ainda não têm classSpells
    const sample = await this.classRepository.findOne({ where: {} });
    if (sample && (!sample.classSpells || sample.classSpells.length === 0)) {
      for (const seed of CLASS_SEED) {
        await this.classRepository.update(
          { name: seed.name },
          { classSpells: seed.classSpells },
        );
      }
    }
  }

  async findAll(): Promise<DndClass[]> {
    return this.classRepository.find({ order: { name: 'ASC' } });
  }
}
