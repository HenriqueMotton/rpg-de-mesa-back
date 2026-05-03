import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DndClass, ClassFeature, ClassSpellEntry, ClassProficiencies, ClassSkillOptions } from './entities/dnd-class.entity';

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
  proficiencies: ClassProficiencies;
  skillOptions: ClassSkillOptions;
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
      { name: 'Fúria', unlockLevel: 1, description: 'Como ação bônus, entra em Fúria por 1 minuto. Vantagem em testes de Força, bônus de dano em ataques corps a corps (+2 até nível 8, +3 até 11, +4 até 15, +5 até 19, +6 no 20) e resistência a dano cortante, perfurante e contundente. Termina se ficar inconsciente ou não atacar/sofrer dano por um turno. Usos: 2 (nível 1), 3 (3°), 4 (6°), 5 (12°), 6 (17°).' },
      { name: 'Defesa Sem Armadura', unlockLevel: 1, description: 'Sem armadura equipada, sua CA = 10 + modificador de Destreza + modificador de Constituição. Pode usar escudo normalmente.' },
      { name: 'Ataque Descuidado', unlockLevel: 2, description: 'Pode jogar com tudo ao atacar: vantagem em todas as rolagens de ataque de Força nesse turno, mas até o início do seu próximo turno qualquer um tem vantagem em ataques corpo a corpo contra você.' },
      { name: 'Sentido de Perigo', unlockLevel: 2, description: 'Vantagem em testes de resistência de Destreza contra efeitos que você pode ver (armadilhas, magias). Não funciona se estiver incapacitado.' },
      { name: 'Caminho Primitivo', unlockLevel: 3, description: 'Escolha sua especialização: Berserker (ataques adicionais em Fúria, imunidade a encantamentos), Totem de Guerreiro (poderes espirituais de urso, águia ou lobo) ou outro caminho do suplemento.' },
      { name: 'Ataques Extras', unlockLevel: 5, description: 'Pode atacar duas vezes, em vez de uma, sempre que usar a ação Atacar no seu turno.' },
      { name: 'Movimento Rápido', unlockLevel: 5, description: 'Sua velocidade aumenta em 3 metros enquanto você não estiver usando armadura pesada.' },
      { name: 'Instinto Selvagem', unlockLevel: 7, description: 'Vantagem em rolagens de iniciativa. Se for surpreendido no início do combate, pode entrar em Fúria na mesma reação e age normalmente nesse turno.' },
      { name: 'Crítico Brutal', unlockLevel: 9, description: 'Em um acerto crítico com ataque corpo a corpo, role um dado de dano extra além dos dados normais do crítico. Dois dados extras a partir do nível 13 e três a partir do nível 17.' },
      { name: 'Fúria Implacável', unlockLevel: 11, description: 'Se cair a 0 PV enquanto em Fúria, pode fazer um teste de Constituição CD 10. Se passar, volta a 1 PV. Cada uso subsequente aumenta a CD em 5 (resetada em descanso longo).' },
      { name: 'Destruição Persistente', unlockLevel: 15, description: 'Sua Fúria não termina mais prematuramente — ela só encerra se você ficar inconsciente ou escolher encerrá-la.' },
      { name: 'Resistência Inquebrável', unlockLevel: 18, description: 'Se seu modificador de Força com bônus estiver abaixo de 25 ao rolar iniciativa, você pode tratar o resultado do dado como 25.' },
      { name: 'Campeão Primitivo', unlockLevel: 20, description: 'Sua Força e Constituição aumentam em 4 cada. O máximo para esses atributos é agora 24.' },
    ],
    proficiencies: {
      armor: ['Leve', 'Média', 'Escudos'],
      weapons: ['Simples', 'Marciais'],
      tools: [],
      savingThrows: ['Força', 'Constituição'],
    },
    skillOptions: {
      skills: ['Adestramento', 'Atletismo', 'Intimidação', 'Natureza', 'Percepção', 'Sobrevivência'],
      count: 2,
    },
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
      { name: 'Conjuração', unlockLevel: 1, description: 'Conjurador completo que usa Carisma como atributo de conjuração. Conhece número fixo de magias (não precisa prepará-las). Pode aprender magias de outras classes ao subir de nível.' },
      { name: 'Inspiração Bardística', unlockLevel: 1, description: 'Como ação bônus, concede um dado de inspiração a uma criatura que possa ouvir você (60 m). Ela pode usar o dado em uma rolagem de ataque, habilidade ou resistência nos próximos 10 minutos. Dado: d6 (nível 1), d8 (5°), d10 (10°), d12 (15°). Usos = modificador de Carisma, recuperados em descanso longo (ou curto a partir do nível 5 — Fonte de Inspiração).' },
      { name: 'Especialização', unlockLevel: 1, description: 'Escolha 2 proficiências de perícia ou Ferramentas de Ladrão. Dobra o bônus de proficiência para elas. Escolhe mais 2 no nível 10.' },
      { name: 'Canção de Repouso', unlockLevel: 2, description: 'Durante um descanso curto, você e aliados que ouviram sua música recuperam PV extras ao gastar Dados de Vida: 1d6 (nível 2), 1d8 (9°), 1d10 (13°), 1d12 (17°).' },
      { name: 'Colégio Bardístico', unlockLevel: 3, description: 'Escolha sua especialização: Colégio do Conhecimento (perícias extras e Palavras Cortantes), Colégio da Bravura (proficiência com armas/armaduras e inspiração em combate) ou outro colégio.' },
      { name: 'Expertise em Perícias', unlockLevel: 3, description: 'A partir do nível 3, suas Especializações do nível 1 já dobram o bônus de proficiência.' },
      { name: 'Contramagia', unlockLevel: 6, description: 'Pode usar Reação de Contramagia gastando Inspiração Bardística — impõe desvantagem em um teste de concentração de uma criatura.' },
      { name: 'Segredos Mágicos', unlockLevel: 10, description: 'Aprende 2 magias de qualquer lista de classes. Repete nos níveis 14 e 18 (6 magias extras no total).' },
      { name: 'Inspiração Superior', unlockLevel: 20, description: 'Ao rolar iniciativa com 0 dados de Inspiração Bardística, você recupera 1.' },
    ],
    classSpells: BARDO_SPELLS,
    proficiencies: {
      armor: ['Leve'],
      weapons: ['Simples', 'Arco longo', 'Arco curto', 'Balhadora longa', 'Rapieira', 'Espada curta', 'Espada longa'],
      tools: ['3 instrumentos musicais (à escolha)'],
      savingThrows: ['Destreza', 'Carisma'],
    },
    skillOptions: {
      skills: ['Acrobacia', 'Adestramento', 'Arcanismo', 'Atletismo', 'Atuação', 'Enganação', 'Furtividade', 'História', 'Intimidação', 'Intuição', 'Investigação', 'Medicina', 'Natureza', 'Percepção', 'Persuasão', 'Prestidigitação', 'Religião', 'Sobrevivência'],
      count: 3,
    },
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
      { name: 'Patrono Sobrenatural', unlockLevel: 1, description: 'Você fez um pacto com uma entidade poderosa que lhe concede poderes únicos. Escolha: Arquidemônio (magia infernal e explosão de fogo), Arquifada (encantamento e glamour), Grande Antigo (telepatia e conhecimento proibido) ou outro patrono.' },
      { name: 'Magia de Pacto', unlockLevel: 1, description: 'Poucos slots de magia (1-4), mas todos recuperados em descanso curto ou longo. Todos os slots são do mesmo nível (o mais alto disponível). Usa Carisma como atributo de conjuração.' },
      { name: 'Invocações Sobrenaturais', unlockLevel: 2, description: 'Aprende 2 Invocações (passivas ou ativas com custo de Ki). Exemplos: Visão do Diabo (visão no escuro perfeita), Máscara de Muitas Rostos (Disfarce à vontade), Sede de Conhecimento (Identificar à vontade), Armadura das Sombras (+2 CA sem armadura). Aprende mais a cada nível ímpar.' },
      { name: 'Dom do Pacto', unlockLevel: 3, description: 'Escolha seu dom: Lâmina do Pacto (arma mágica que pode ser invocada), Corrente do Pacto (familiar mais poderoso) ou Tomo do Pacto (grimório com truques e rituais extras).' },
      { name: 'Melhoramento de Atributo', unlockLevel: 4, description: 'Aumente um atributo em 2 ou dois atributos em 1 cada. Repetido nos níveis 8, 12, 16 e 19.' },
      { name: 'Misticismo Sobrenatural', unlockLevel: 11, description: 'Aprende uma magia de 6° nível ou superior do seu patrono. Pode conjurá-la uma vez entre descansos longos sem gastar slot (e com slots de nível máximo disponível).' },
      { name: 'Arcano Supremo', unlockLevel: 17, description: 'Aprende uma magia de 7°, 8° e 9° nível (uma a cada nível 17, 19 e 20). Cada uma pode ser conjurada uma vez entre descansos longos sem gastar slot.' },
    ],
    classSpells: BRUXO_SPELLS,
    proficiencies: {
      armor: ['Leve'],
      weapons: ['Simples'],
      tools: [],
      savingThrows: ['Sabedoria', 'Carisma'],
    },
    skillOptions: {
      skills: ['Arcanismo', 'Enganação', 'História', 'Intimidação', 'Investigação', 'Natureza', 'Religião'],
      count: 2,
    },
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
      { name: 'Conjuração Divina', unlockLevel: 1, description: 'Usa Sabedoria como atributo de conjuração. Prepara magias da lista do Clérigo após descanso longo (quantidade = nível + mod Sabedoria). Conjurador completo. Pode usar rituais sem gastar slot.' },
      { name: 'Domínio Divino', unlockLevel: 1, description: 'Escolha a área de especialização do seu deus: Vida (cura potencializada), Luz (feitiços radiantes), Guerra (combate e divindade marcial), Morte (necromancia), Tempestade (trovão e relâmpago), Natureza ou outros. Cada domínio fornece magias extras sempre preparadas e poderes exclusivos.' },
      { name: 'Canalizar Divindade', unlockLevel: 2, description: 'Use o poder do seu deus 1x por descanso curto (2x no nível 6, 3x no 18). Todos os Clérigos podem Expulsar Mortos-Vivos (CD Sabedoria ou ficam apavorados e em fuga). Seu domínio adiciona opções extras.' },
      { name: 'Melhoramento de Atributo', unlockLevel: 4, description: 'Aumente um atributo em 2 ou dois atributos em 1 cada. Repetido nos níveis 8, 12, 16 e 19.' },
      { name: 'Destruição de Mortos-Vivos', unlockLevel: 5, description: 'Quando usa Expulsar Mortos-Vivos, criaturas com CR baixo (1/2 no nível 5, CR 1 no 8, CR 2 no 11, CR 3 no 14, CR 4 no 17) são destruídas instantaneamente ao falhar no teste.' },
      { name: 'Intervenção Divina', unlockLevel: 10, description: 'Implora auxílio ao seu deus. Role 1d100: se o resultado for igual ou menor que seu nível de Clérigo, a divindade intervém (efeito de qualquer magia do domínio ou lista). No nível 20, sempre funciona.' },
    ],
    classSpells: CLERIGO_SPELLS,
    proficiencies: {
      armor: ['Leve', 'Média', 'Escudos'],
      weapons: ['Simples'],
      tools: [],
      savingThrows: ['Sabedoria', 'Carisma'],
    },
    skillOptions: {
      skills: ['História', 'Intuição', 'Medicina', 'Persuasão', 'Religião'],
      count: 2,
    },
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
      { name: 'Conjuração Natural', unlockLevel: 1, description: 'Usa Sabedoria como atributo de conjuração. Prepara magias da lista do Druida após descanso longo (nível + mod Sab). Conjurador completo. Pode usar rituais. Não pode usar armaduras metálicas.' },
      { name: 'Forma Selvagem', unlockLevel: 2, description: 'Como ação, transforma-se em uma besta que já observou. 2 usos por descanso curto. CR máximo: 1/4 (nível 2), 1/2 (4°), 1 (8°). Mantém Inteligência e Sabedoria. PV temporários iguais ao máximo da forma — se chegarem a 0, você retorna. Pode conjurar magias em Forma Selvagem a partir do nível 18.' },
      { name: 'Círculo Druídico', unlockLevel: 2, description: 'Escolha sua tradição: Círculo da Terra (magias temáticas extras sempre preparadas por bioma), Círculo da Lua (Forma Selvagem com CR até 1 no nível 2, combate em forma animal) ou outro círculo.' },
      { name: 'Melhoramento de Atributo', unlockLevel: 4, description: 'Aumente um atributo em 2 ou dois atributos em 1 cada. Repetido nos níveis 8, 12, 16 e 19.' },
      { name: 'Corpo Intemporal', unlockLevel: 18, description: 'Não mais envelhece e não pode ser envelhecido magicamente. Também não precisa de comida ou água.' },
      { name: 'Feitiço da Besta', unlockLevel: 18, description: 'Pode conjurar magias mesmo em Forma Selvagem, incluindo manter concentração durante a transformação.' },
      { name: 'Forma Arquidruida', unlockLevel: 20, description: 'Pode usar Forma Selvagem sem limite de usos.' },
    ],
    classSpells: DRUIDA_SPELLS,
    proficiencies: {
      armor: ['Leve', 'Média', 'Escudos (não-metálicos)'],
      weapons: ['Clava', 'Adaga', 'Dardo', 'Azagaia', 'Maça', 'Cajado', 'Cimitarra', 'Foice', 'Funda', 'Lança'],
      tools: ['Suprimentos de herbalista'],
      savingThrows: ['Inteligência', 'Sabedoria'],
    },
    skillOptions: {
      skills: ['Adestramento', 'Arcanismo', 'Intuição', 'Medicina', 'Natureza', 'Percepção', 'Religião', 'Sobrevivência'],
      count: 2,
    },
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
      { name: 'Origem de Feitiçaria', unlockLevel: 1, description: 'A magia nasceu em você. Escolha a fonte: Linhagem Dracônica (resistência a um tipo de dano, CA sem armadura = 13+DES, asas no nível 14), Alma Selvagem (magia imprevisível com tabela aleatória), Sombra Divina (magia das trevas, teleporte nas sombras) ou outra origem.' },
      { name: 'Conjuração Inata', unlockLevel: 1, description: 'Conjurador completo usando Carisma. Conhece número fixo de magias (não precisa preparar). A magia flui naturalmente — sem estudo.' },
      { name: 'Pontos de Feitiçaria', unlockLevel: 2, description: 'Recurso exclusivo para alimentar Metamagias e criar slots de magia extras. Pontos = nível de Feiticeiro. Recuperados em descanso longo. Pode converter slots em pontos (1 por nível do slot) ou pontos em slots (custo progressivo).' },
      { name: 'Metamagia', unlockLevel: 3, description: 'Torna suas magias mais eficazes gastando Pontos de Feitiçaria. Aprende 2 opções no nível 3, mais 2 no 10° e 17°. Exemplos: Magia Cuidadosa (exclui aliados da área), Magia Distante (dobra alcance), Magia Empoderada (rerola dados de dano), Magia Rápida (bonus action ao invés de ação), Magia Silenciosa (sem componente verbal), Magia Gêmea (atinge dois alvos).' },
      { name: 'Melhoramento de Atributo', unlockLevel: 4, description: 'Aumente um atributo em 2 ou dois atributos em 1 cada. Repetido nos níveis 8, 12, 16 e 19.' },
      { name: 'Restauração de Feitiçaria', unlockLevel: 20, description: 'Ao rolar iniciativa com menos de 4 Pontos de Feitiçaria, você recupera 4 Pontos de Feitiçaria.' },
    ],
    classSpells: FEITICEIRO_SPELLS,
    proficiencies: {
      armor: [],
      weapons: ['Adaga', 'Dardo', 'Funda', 'Cajado', 'Balhadora leve'],
      tools: [],
      savingThrows: ['Constituição', 'Carisma'],
    },
    skillOptions: {
      skills: ['Arcanismo', 'Enganação', 'Intuição', 'Intimidação', 'Persuasão', 'Religião'],
      count: 2,
    },
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
      { name: 'Estilo de Combate', unlockLevel: 1, description: 'Escolha uma especialidade de combate permanente: Arqueria (+2 em ataques de alcance), Defesa (+1 CA com armadura), Duelo (+2 dano com arma de uma mão e mão livre), Luta com Duas Armas (adiciona mod de atributo ao dano da arma secundária), Proteção (reação para impor desvantagem em ataque contra aliado adjacente) ou Armas de Duas Mãos (re-role 1s e 2s no dano de armas de duas mãos).' },
      { name: 'Retomar Fôlego', unlockLevel: 1, description: 'Como ação bônus, recupera PV iguais a 1d10 + nível de Guerreiro. 1 uso, recuperado em descanso curto ou longo.' },
      { name: 'Surto de Ação', unlockLevel: 2, description: 'Uma vez por descanso curto, pode realizar uma ação adicional no seu turno (além da ação normal e bônus). Ganha um segundo uso no nível 17.' },
      { name: 'Arquétipo Marcial', unlockLevel: 3, description: 'Escolha sua especialização: Campeão (críticos em 19-20, nível 15: 18-20), Mestre de Batalha (manobras táticas com Dados de Superioridade d8), Cavaleiro Élfico (magia de ilusão e encantamento combinada com esgrima) ou outro arquétipo.' },
      { name: 'Melhoramento de Atributo', unlockLevel: 4, description: 'Aumente um atributo em 2 ou dois atributos em 1 cada. Guerreiros ganham essa habilidade nos níveis 4, 6, 8, 12, 14, 16 e 19 — mais oportunidades que qualquer outra classe.' },
      { name: 'Ataques Extras', unlockLevel: 5, description: 'Ataca duas vezes ao usar a ação Atacar (nível 5). Três ataques no nível 11. Quatro ataques no nível 20 — mais que qualquer outra classe.' },
      { name: 'Indomável', unlockLevel: 9, description: 'Pode rerrolar um teste de resistência que falhou, sendo obrigado a usar o segundo resultado. 1 uso por descanso longo (2 usos no nível 13, 3 no 17).' },
    ],
    classSpells: [],
    proficiencies: {
      armor: ['Todas', 'Escudos'],
      weapons: ['Simples', 'Marciais'],
      tools: [],
      savingThrows: ['Força', 'Constituição'],
    },
    skillOptions: {
      skills: ['Acrobacia', 'Adestramento', 'Atletismo', 'História', 'Intuição', 'Intimidação', 'Percepção', 'Sobrevivência'],
      count: 2,
    },
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
      { name: 'Especialização', unlockLevel: 1, description: 'Escolha 2 proficiências de perícia ou Ferramentas de Ladrão. Dobra o bônus de proficiência para elas. Escolhe mais 2 perícias no nível 6.' },
      { name: 'Ataque Furtivo', unlockLevel: 1, description: 'Causa dano extra uma vez por turno ao acertar com arma sutil ou de alcance quando tem vantagem no ataque OU há um aliado não incapacitado adjacente ao alvo. Dano: 1d6 (nível 1), escalando +1d6 a cada 2 níveis até 10d6 no nível 19.' },
      { name: 'Jargão dos Ladrões', unlockLevel: 1, description: 'Conhece a linguagem secreta da comunidade criminosa. Pode deixar mensagens codificadas em lugares públicos e se comunicar discretamente com outros falantes, passando despercebido para não iniciados.' },
      { name: 'Ação Ardilosa', unlockLevel: 2, description: 'Como ação bônus em qualquer turno: Disparar (mover velocidade total sem provocar ataques de oportunidade), Desviar (próximo ataque contra você tem desvantagem) ou Esconder (entra furtivamente).' },
      { name: 'Arquétipo de Ladino', unlockLevel: 3, description: 'Escolha sua especialização: Assassino (personagens sorpreendidos sofrem dano crítico automático no primeiro turno), Ladrão (uso mágico de itens, escalar sem mãos livres, item bônus de golpe), Trapaceiro Arcano (magias de ilusão e encantamento do Mago) ou outro arquétipo.' },
      { name: 'Esquiva Incrivelmente Rápida', unlockLevel: 5, description: 'Quando um atacante que você pode ver te acerta, pode usar a Reação para reduzir o dano pela metade.' },
      { name: 'Evasão', unlockLevel: 7, description: 'Em efeitos de área que permitem teste de resistência de Destreza: sucesso = nenhum dano (normalmente metade), falha = metade do dano (normalmente total).' },
      { name: 'Habilidade Confiável', unlockLevel: 11, description: 'Ao rolar qualquer perícia com proficiência, se o resultado do dado for menor que 10, trate-o como 10. Você nunca falha feio em algo que domina.' },
      { name: 'Mente Escorregadia', unlockLevel: 15, description: 'Ganha proficiência em testes de resistência de Sabedoria.' },
      { name: 'Esquivo', unlockLevel: 18, description: 'Nenhum ataque tem vantagem contra você enquanto não estiver incapacitado.' },
      { name: 'Golpe de Sorte', unlockLevel: 20, description: 'Se errar um ataque ou falhar em um teste de habilidade, pode optar por acertar/ter sucesso. Recuperado em descanso curto ou longo.' },
    ],
    classSpells: [],
    proficiencies: {
      armor: ['Leve'],
      weapons: ['Simples', 'Balhadora longa', 'Arco longo', 'Arco curto', 'Rapieira', 'Espada curta', 'Espada longa'],
      tools: ['Ferramentas de ladrão'],
      savingThrows: ['Destreza', 'Inteligência'],
    },
    skillOptions: {
      skills: ['Acrobacia', 'Atletismo', 'Atuação', 'Enganação', 'Furtividade', 'Intuição', 'Intimidação', 'Investigação', 'Percepção', 'Persuasão', 'Prestidigitação'],
      count: 4,
    },
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
      { name: 'Conjuração Arcana', unlockLevel: 1, description: 'Usa Inteligência como atributo de conjuração. Conjurador completo com o maior número de magias conhecidas. Aprende 6 magias de 1° nível ao criar o personagem e mais 2 por nível seguinte.' },
      { name: 'Grimório de Magias', unlockLevel: 1, description: 'Seu grimório contém as magias que você conhece. Pode copiar magias de pergaminhos e outros grimórios (custo de ouro e tempo). Todos os rituais do seu grimório podem ser conjurados sem gastar slot, apenas com tempo extra.' },
      { name: 'Recuperação Arcana', unlockLevel: 1, description: 'Uma vez por dia durante descanso curto, recupera slots de magia com nível total igual a metade do nível de Mago (arredondado para cima). Não pode recuperar slots de 6° nível ou superior.' },
      { name: 'Tradição Arcana', unlockLevel: 2, description: 'Escolha a escola que define sua abordagem à magia: Evocação (maximiza dano, exclui aliados da área), Ilusão (ilusões persistentes), Necromancia (mortos-vivos mais fortes), Abjuração (campos de proteção mágica), Adivinhação (rerrolar dados com Presságio) ou outras escolas.' },
      { name: 'Melhoramento de Atributo', unlockLevel: 4, description: 'Aumente um atributo em 2 ou dois atributos em 1 cada. Repetido nos níveis 8, 12, 16 e 19.' },
      { name: 'Maestria de Magia', unlockLevel: 18, description: 'Escolha uma magia de 1° e uma de 2° nível. Pode conjurá-las à vontade, sem gastar slot.' },
      { name: 'Assinatura de Magia', unlockLevel: 20, description: 'Escolha 2 magias de 3° nível no seu grimório como assinaturas. Elas sempre estão preparadas (não contam no limite) e pode conjurá-las uma vez cada sem gastar slot. Recuperado em descanso curto.' },
    ],
    classSpells: MAGO_SPELLS,
    proficiencies: {
      armor: [],
      weapons: ['Adaga', 'Dardo', 'Funda', 'Cajado', 'Balhadora leve'],
      tools: [],
      savingThrows: ['Inteligência', 'Sabedoria'],
    },
    skillOptions: {
      skills: ['Arcanismo', 'História', 'Intuição', 'Investigação', 'Medicina', 'Religião'],
      count: 2,
    },
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
      { name: 'Defesa Sem Armadura', unlockLevel: 1, description: 'Sem armadura e sem escudo, sua CA = 10 + modificador de Destreza + modificador de Sabedoria.' },
      { name: 'Artes Marciais', unlockLevel: 1, description: 'Com armas de monge ou desarmado: use Destreza em vez de Força nos ataques e no dano. Dano desarmado: 1d4 (níveis 1-4), 1d6 (5-10), 1d8 (11-16), 1d10 (17-20). Após atacar com ação (arma de monge ou desarmado), pode fazer um golpe desarmado bônus como ação bônus.' },
      { name: 'Ki', unlockLevel: 2, description: 'Pontos de Ki = nível de Monge, recuperados em descanso curto. Técnicas básicas: Redemoinhos de Golpes (2 Ki — ação bônus: dois socos), Passo do Vento (1 Ki — ação bônus: Disparar ou Desviar), Paciência do Pacifista (1 Ki — reação: impõe desvantagem em ataque contra você). Sua tradição monástica adiciona técnicas exclusivas.' },
      { name: 'Movimento Desarmado', unlockLevel: 2, description: 'Velocidade extra de movimento enquanto não usa armadura: +3m (níveis 2-5), +4,5m (6-9), +6m (10-13), +7,5m (14-17), +9m (18+). A partir do nível 9, pode correr sobre superfícies verticais e sobre a água (sem parar).' },
      { name: 'Tradição Monástica', unlockLevel: 3, description: 'Escolha o estilo que define seu monge: Caminho da Mão Aberta (domínio das Artes Marciais, empurrar ou derrubar em Redemoinhos, cura de Ki), Caminho das Sombras (magia de ilusão, teleporte entre sombras), Caminho dos Quatro Elementos (dobre natureza com Ki — fogo, água, terra, ar) ou outra tradição.' },
      { name: 'Queda Lenta', unlockLevel: 4, description: 'Como reação ao cair, reduz o dano de queda em quantidade igual a 5 × nível de Monge.' },
      { name: 'Ataques Extras', unlockLevel: 5, description: 'Pode atacar duas vezes ao usar a ação Atacar.' },
      { name: 'Golpe Atordoante', unlockLevel: 5, description: 'Ao acertar um ataque com arma, gasta 1 Ki. O alvo deve passar em um teste de Constituição (CD = 8 + bônus de proficiência + mod Sabedoria) ou fica atordoado até o início do seu próximo turno (todos têm vantagem, ele falha em FOR e DES, não pode agir ou se mover).' },
      { name: 'Golpes Potencializados por Ki', unlockLevel: 6, description: 'Seus ataques desarmados são considerados mágicos para fins de superar resistências e imunidades a dano não mágico.' },
      { name: 'Evasão', unlockLevel: 7, description: 'Em efeitos de área com teste de Destreza: sucesso = nenhum dano, falha = metade do dano.' },
      { name: 'Quietude de Mente', unlockLevel: 7, description: 'Como ação, encerra automaticamente qualquer efeito de encantamento ou medo ativo em si mesmo.' },
      { name: 'Pureza de Corpo', unlockLevel: 10, description: 'Imunidade a doenças e ao estado envenenado.' },
      { name: 'Língua do Sol e da Lua', unlockLevel: 13, description: 'Pode se comunicar com qualquer criatura que tenha uma linguagem, mesmo sem falar o mesmo idioma.' },
      { name: 'Alma Diamante', unlockLevel: 14, description: 'Proficiência em todos os testes de resistência. Ao falhar em um, pode gastar 1 Ki para rerrolar e usar o segundo resultado.' },
      { name: 'Corpo Intemporal', unlockLevel: 15, description: 'Não mais envelhece nem pode ser envelhecido magicamente. Não precisa de comida ou água para sobreviver.' },
      { name: 'Corpo Vazio', unlockLevel: 18, description: 'Gasta 4 Ki como ação: fica invisível por 1 minuto e ganha resistência a todo dano exceto psíquico. Gasta 8 Ki: conjura Projeção Astral sem precisar de componentes materiais.' },
      { name: 'Perfeição do Ser', unlockLevel: 20, description: 'Ao rolar iniciativa com 0 pontos de Ki, você recupera imediatamente 4 pontos de Ki.' },
    ],
    classSpells: [],
    proficiencies: {
      armor: [],
      weapons: ['Simples', 'Espada curta'],
      tools: ['1 ferramenta de artesão ou instrumento musical (à escolha)'],
      savingThrows: ['Força', 'Destreza'],
    },
    skillOptions: {
      skills: ['Acrobacia', 'Atletismo', 'Furtividade', 'História', 'Intuição', 'Religião'],
      count: 2,
    },
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
      { name: 'Sentido Divino', unlockLevel: 1, description: 'Como ação, detecta auras de celestiais, infernais, mortos-vivos e locais consagrados/profanados em 18 metros até o fim do seu próximo turno. Usos = 1 + modificador de Carisma por descanso longo.' },
      { name: 'Imposição de Mãos', unlockLevel: 1, description: 'Pool de cura = 5 × nível de Paladino, recuperada em descanso longo. Como ação, pode curar PV de uma criatura tocada (qualquer quantidade) ou gastar 5 PV do pool para curar uma doença ou neutralizar um veneno.' },
      { name: 'Estilo de Combate', unlockLevel: 2, description: 'Escolha uma especialidade: Defesa (+1 CA), Duelo (+2 dano com uma mão), Proteção (reação contra ataque a aliado) ou Grandes Armas (rerole 1s e 2s no dano).' },
      { name: 'Conjuração Divina', unlockLevel: 2, description: 'Semimágico: usa Carisma, conjura metade dos slots de um conjurador completo. Prepara magias = nível ÷ 2 + mod Carisma. Tem acesso às magias do Juramento e da lista do Paladino.' },
      { name: 'Golpe Divino', unlockLevel: 2, description: 'Antes de atacar, gasta um slot de magia como ação bônus. O próximo ataque adiciona 2d8 por nível do slot (1° slot = 2d8, 2° = 4d8, etc.) de dano radiante ou necrótico.' },
      { name: 'Juramento Sagrado', unlockLevel: 3, description: 'Você faz um juramento que define seus poderes: Devoção (proteção contra o mal, aura sagrada), Anciãos (natureza e encantamento), Vingança (caçador implacável), Redenção (pacifista que converte inimigos) ou outro juramento. Inclui magias sempre preparadas e dois poderes de Canalizar Divindade.' },
      { name: 'Canalizar Divindade', unlockLevel: 3, description: '1 uso por descanso curto. Todos os Paladinos têm Consagrar Armas (+1d4 radiante por ataque por 1 minuto). Seu juramento adiciona opções específicas.' },
      { name: 'Melhoramento de Atributo', unlockLevel: 4, description: 'Aumente um atributo em 2 ou dois atributos em 1 cada. Repetido nos níveis 8, 12, 16 e 19.' },
      { name: 'Ataques Extras', unlockLevel: 5, description: 'Ataca duas vezes ao usar a ação Atacar.' },
      { name: 'Aura de Proteção', unlockLevel: 6, description: 'Você e aliados a 3 metros adicionam seu modificador de Carisma (mínimo +1) em todos os testes de resistência. O alcance aumenta para 9 metros no nível 18.' },
      { name: 'Aura de Coragem', unlockLevel: 10, description: 'Você e aliados a 3 metros (9m no nível 18) são imunes ao estado amedrontado enquanto você não estiver inconsciente.' },
      { name: 'Melhoria de Golpe Divino', unlockLevel: 11, description: 'Todos os ataques com arma causam 1d8 extra de dano radiante (ou necrótico, dependendo do juramento), mesmo sem gastar slot de magia.' },
      { name: 'Cura Limpa', unlockLevel: 14, description: 'Ao usar Imposição de Mãos, pode gastar slots de magia extras (1d6 por nível do slot) junto com a cura de PV.' },
    ],
    classSpells: PALADINO_SPELLS,
    proficiencies: {
      armor: ['Todas', 'Escudos'],
      weapons: ['Simples', 'Marciais'],
      tools: [],
      savingThrows: ['Sabedoria', 'Carisma'],
    },
    skillOptions: {
      skills: ['Atletismo', 'Intuição', 'Intimidação', 'Medicina', 'Persuasão', 'Religião'],
      count: 2,
    },
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
      { name: 'Inimigo Favorito', unlockLevel: 1, description: 'Escolha 1 tipo de criatura (aberração, besta, celestial, constructo, dragão, elemental, fada, infernal, gigante, humanóide, lodo, planta ou morto-vivo). Vantagem em testes de Sobrevivência para rastrear e de Inteligência para se lembrar de informações. +2 de dano contra eles. Ganha um segundo tipo no nível 6 e um terceiro no 14.' },
      { name: 'Explorador Natural', unlockLevel: 1, description: 'Escolha 1 tipo de terreno favorito (ártico, litoral, deserto, floresta, planície, montanha, pântano ou Submundo). Bônus em Inteligência e Sabedoria ligados ao ambiente, velocidade dupla ao rastrear e sem penalidade em terreno difícil. Ganha um segundo terreno no nível 6 e um terceiro no 10.' },
      { name: 'Conjuração de Patrulheiro', unlockLevel: 2, description: 'Semimágico: conjura com Sabedoria, metade dos slots de um conjurador completo. Prepara magias = nível ÷ 2 + mod Sabedoria.' },
      { name: 'Estilo de Combate', unlockLevel: 2, description: 'Escolha uma especialidade: Arqueria (+2 em ataques de alcance), Defesa (+1 CA), Duelo (+2 dano com uma mão) ou Luta com Duas Armas (mod de atributo no dano da arma secundária).' },
      { name: 'Conclave Primordial', unlockLevel: 3, description: 'Escolha sua especialização: Caçador (destruição em área, ataques múltiplos, reflexos extremos), Mestre das Bestas (familiar ou companheiro animal de combate) ou outro conclave.' },
      { name: 'Melhoramento de Atributo', unlockLevel: 4, description: 'Aumente um atributo em 2 ou dois atributos em 1 cada. Repetido nos níveis 8, 12, 16 e 19.' },
      { name: 'Ataques Extras', unlockLevel: 5, description: 'Ataca duas vezes ao usar a ação Atacar.' },
      { name: 'Terreno Escondido', unlockLevel: 10, description: 'Pode se esconder de criaturas mesmo quando estiver apenas levemente obscurecido pela natureza (folhagem, chuva, neblina, neve, luz de estrelas).' },
      { name: 'Sentido Primitivo', unlockLevel: 18, description: 'Como ação bônus, ativa sentidos sobrenaturais por 1 minuto. Pode detectar localização de criaturas invisíveis ou etéreas em 9 metros.' },
      { name: 'Inimigo Supremo', unlockLevel: 20, description: 'Escolha um tipo de inimigo favorito. Dano bônus dobra contra eles e nunca falha em rastrear ou lembrar informações sobre esse tipo.' },
    ],
    classSpells: PATRULHEIRO_SPELLS,
    proficiencies: {
      armor: ['Leve', 'Média', 'Escudos'],
      weapons: ['Simples', 'Marciais'],
      tools: [],
      savingThrows: ['Força', 'Destreza'],
    },
    skillOptions: {
      skills: ['Adestramento', 'Atletismo', 'Furtividade', 'Intuição', 'Investigação', 'Natureza', 'Percepção', 'Sobrevivência'],
      count: 3,
    },
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

    // Garante que cada classe tem todos os campos do seed
    for (const seed of CLASS_SEED) {
      const existing = await this.classRepository.findOne({ where: { name: seed.name } });
      if (!existing) continue;
      const update: Partial<DndClass> = {};
      if (!existing.classSpells || existing.classSpells.length === 0) update.classSpells   = seed.classSpells;
      if (!existing.proficiencies)                                     update.proficiencies = seed.proficiencies;
      if (!existing.skillOptions)                                      update.skillOptions  = seed.skillOptions;
      // Atualiza features sempre que o seed tem mais features ou quando falta o campo unlockLevel
      const existingHasUnlockLevel = existing.features?.length > 0 && (existing.features[0] as any).unlockLevel != null;
      if (!existing.features || existing.features.length < seed.features.length || !existingHasUnlockLevel) {
        update.features = seed.features;
      }
      if (Object.keys(update).length > 0) {
        await this.classRepository.update({ name: seed.name }, update);
      }
    }
  }

  async findAll(): Promise<DndClass[]> {
    return this.classRepository.find({ order: { name: 'ASC' } });
  }
}
