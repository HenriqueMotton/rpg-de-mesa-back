import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Race } from './entities/race.entity';
import { SubRace, RaceTrait } from './entities/sub-race.entity';

// ─── Seed data ───────────────────────────────────────────────────────────────

type RaceSeed = {
  name: string;
  description: string;
  bonuses: Race['bonuses'];
  traits: RaceTrait[];
};

const ZERO = { forca: 0, destreza: 0, constituicao: 0, inteligencia: 0, sabedoria: 0, carisma: 0 };

const RACE_SEED: RaceSeed[] = [
  {
    name: 'Anão',
    description: 'Robustos e resistentes, os anões são conhecidos por sua teimosia e profunda lealdade. Forjados nas entranhas das montanhas, dominam como ninguém a arte da pedra e do metal. Vivem por séculos e guardam rancores com a mesma tenacidade com que guardam amizades.',
    bonuses: { ...ZERO, constituicao: 2 },
    traits: [
      { name: 'Visão no Escuro', description: 'Acostumado às profundezas, você pode ver no escuro até 18 metros como se fosse luz fraca, e em luz fraca como se fosse luz plena.' },
      { name: 'Resistência Anã', description: 'Vantagem em testes de resistência contra veneno e resistência ao tipo de dano veneno.' },
      { name: 'Treinamento em Armas Anãs', description: 'Proficiência em machadinhas, machados de batalha, martelos leves e martelos de guerra.' },
      { name: 'Proficiência em Ferramentas', description: 'Proficiência em ferramentas de ferreiro, ferramentas de cervejeiro ou ferramentas de pedreiro (à sua escolha).' },
      { name: 'Sentido de Pedra', description: 'Dobro do bônus de proficiência em testes de História relacionados à origem de trabalho em pedra.' },
    ],
  },
  {
    name: 'Elfo',
    description: 'Graciosos e de vida longa, os elfos carregam séculos de sabedoria e uma afinidade natural com a magia. Seus sentidos aguçados e reflexos precisos os tornam aliados e adversários formidáveis. Não dormem, mas entram em transe meditativo.',
    bonuses: { ...ZERO, destreza: 2 },
    traits: [
      { name: 'Visão no Escuro', description: 'Você pode ver no escuro até 18 metros como se fosse luz fraca, e em luz fraca como se fosse luz plena.' },
      { name: 'Sentidos Aguçados', description: 'Proficiência na perícia Percepção.' },
      { name: 'Ancestralidade Feérica', description: 'Vantagem em testes de resistência contra ser enfeitiçado, e magia não pode fazer você adormecer.' },
      { name: 'Transe', description: 'Elfos não precisam dormir. Em vez disso, meditam profundamente por 4 horas por dia. Após esse descanso, obtém os mesmos benefícios que um humano teria após 8 horas de sono.' },
    ],
  },
  {
    name: 'Meio-Elfo',
    description: 'Com um pé em dois mundos, os meio-elfos reúnem a adaptabilidade humana e o charme élfico. Diplomatas natos, transitam com facilidade entre culturas e raramente passam despercebidos. Muitos sentem que não pertencem completamente a nenhum dos dois mundos.',
    bonuses: { ...ZERO, forca: 1, constituicao: 1, carisma: 2 },
    traits: [
      { name: 'Visão no Escuro', description: 'Você pode ver no escuro até 18 metros como se fosse luz fraca, e em luz fraca como se fosse luz plena.' },
      { name: 'Ancestralidade Feérica', description: 'Vantagem em testes de resistência contra ser enfeitiçado, e magia não pode fazer você adormecer.' },
      { name: 'Versatilidade de Perícias', description: 'Proficiência em duas perícias à sua escolha.' },
    ],
  },
  {
    name: 'Humano',
    description: 'Versáteis e ambiciosos, os humanos são a raça mais numerosa e adaptável de todas. Sua vida relativamente curta os impulsiona a grandes feitos — constroem reinos, escrevem histórias e mudam o mundo em uma única geração.',
    bonuses: { forca: 1, destreza: 1, constituicao: 1, inteligencia: 1, sabedoria: 1, carisma: 1 },
    traits: [
      { name: 'Versatilidade de Atributos', description: '+1 em todos os seis atributos. Os humanos se adaptam rapidamente a qualquer desafio.' },
      { name: 'Idiomas Extras', description: 'Fala, lê e escreve Comum e um idioma adicional à sua escolha.' },
    ],
  },
  {
    name: 'Draconato',
    description: 'Descendentes orgulhosos de dragões, os draconatos carregam herança dracônica no sangue. Possuidores de sopro elemental e uma presença imponente, vivem por um rígido código de honra e clã. Sua aparência intimidante raramente passa despercebida.',
    bonuses: { ...ZERO, forca: 2, carisma: 1 },
    traits: [
      { name: 'Ancestralidade Dracônica', description: 'Você tem herança dracônica de um tipo de dragão, determinando o tipo de dano do seu sopro e a resistência que você obtém.' },
      { name: 'Sopro', description: 'Ação: você exala energia destrutiva com base na sua ancestralidade. A CD de resistência = 8 + modificador de Constituição + bônus de proficiência.' },
      { name: 'Resistência a Dano', description: 'Resistência ao tipo de dano associado à sua ancestralidade dracônica.' },
    ],
  },
  {
    name: 'Gnomo',
    description: 'Curiosos e inventivos, os gnomos são movidos por entusiasmo irresistível pelo conhecimento. Especialistas em ilusionismo e engenho, encontram maravilha em cada detalhe do mundo ao redor. Vivem entre 350 e 500 anos.',
    bonuses: { ...ZERO, constituicao: 1, inteligencia: 2 },
    traits: [
      { name: 'Visão no Escuro', description: 'Acostumado às tocas subterrâneas, você pode ver no escuro até 18 metros como se fosse luz fraca.' },
      { name: 'Esperteza Gnômica', description: 'Vantagem em todos os testes de resistência de Inteligência, Sabedoria e Carisma contra magia.' },
    ],
  },
  {
    name: 'Meio-Orc',
    description: 'Forjados entre dois mundos, os meio-orcs carregam a força bruta orc temperada pela inteligência humana. Guerreiros temíveis que superam qualquer obstáculo com pura determinação. Muitos carregam cicatrizes — físicas e emocionais — de uma vida difícil.',
    bonuses: { ...ZERO, forca: 2, constituicao: 1 },
    traits: [
      { name: 'Visão no Escuro', description: 'Graças ao seu sangue orc, você pode ver no escuro até 18 metros como se fosse luz fraca.' },
      { name: 'Ameaçador', description: 'Proficiência na perícia Intimidação.' },
      { name: 'Resistência Implacável', description: 'Uma vez por descanso longo, quando reduzido a 0 pontos de vida, você cai a 1 ponto de vida em vez disso.' },
      { name: 'Ataques Selvagens', description: 'Quando você causa um acerto crítico com uma arma corpo a corpo, pode rolar um dos dados de dano da arma mais uma vez e adicioná-lo ao dano extra do acerto crítico.' },
    ],
  },
  {
    name: 'Hobbit',
    description: 'Pequenos em estatura mas enormes em coragem, os hobbits prezam conforto, boa comida e o lar. Surpreendentemente ágeis e sortudos, revelam resiliência extraordinária quando a aventura os chama. Vivem geralmente até 150 anos.',
    bonuses: { ...ZERO, destreza: 2 },
    traits: [
      { name: 'Sortudo', description: 'Ao rolar um 1 natural num dado de ataque, teste de habilidade ou teste de resistência, você pode relançar o dado e deve usar o novo resultado.' },
      { name: 'Bravura', description: 'Vantagem em testes de resistência contra o efeito amedrontado.' },
      { name: 'Agilidade Hobbit', description: 'Você pode se mover pelo espaço de qualquer criatura de tamanho maior do que o seu.' },
    ],
  },
];

type SubRaceSeed = {
  name: string;
  description: string;
  bonuses: SubRace['bonuses'];
  traits: RaceTrait[];
  raceName: string;
};

const SUB_RACE_SEED: SubRaceSeed[] = [
  // ── Anão ──────────────────────────────────────────────────────────────────
  {
    raceName: 'Anão',
    name: 'Anão da Colina',
    description: 'Com os sentidos especialmente aguçados, o Anão da Colina possui intuição aguçada e tenacidade sobre-humana. São os mais comuns de se encontrar fora das fortalezas montanhosas.',
    bonuses: { ...ZERO, sabedoria: 1 },
    traits: [
      { name: 'Resiliência Anã', description: 'Seus pontos de vida máximos aumentam em 1, e continuam aumentando em 1 cada vez que você ganha um nível.' },
    ],
  },
  {
    raceName: 'Anão',
    name: 'Anão da Montanha',
    description: 'Forte e resistente, o Anão da Montanha é adaptado para uma vida de batalha constante nas profundezas. Possuem a força mais bruta entre os anões.',
    bonuses: { ...ZERO, forca: 2 },
    traits: [
      { name: 'Treinamento com Armaduras Anãs', description: 'Você tem proficiência com armaduras leves e médias.' },
    ],
  },

  // ── Elfo ──────────────────────────────────────────────────────────────────
  {
    raceName: 'Elfo',
    name: 'Alto Elfo',
    description: 'O Alto Elfo possui uma mente afiada e domínio sobre os rudimentos da magia. São geralmente arrogantes e se consideram superiores às outras raças.',
    bonuses: { ...ZERO, inteligencia: 1 },
    traits: [
      { name: 'Treinamento em Armas Élvicas', description: 'Proficiência em espadas longas, espadas curtas, arcos curtos e arcos longos.' },
      { name: 'Truque', description: 'Você conhece um truque à sua escolha da lista de magias do mago. Inteligência é seu atributo para conjuração.' },
      { name: 'Idioma Extra', description: 'Você pode falar, ler e escrever um idioma extra à sua escolha.' },
    ],
  },
  {
    raceName: 'Elfo',
    name: 'Elfo da Floresta',
    description: 'O Elfo da Floresta tem percepção aguçada e pés ágeis, tornando-se mestre em se esconder e sobreviver na natureza. Vivem em harmonia com o mundo natural.',
    bonuses: { ...ZERO, sabedoria: 1 },
    traits: [
      { name: 'Treinamento em Armas Élvicas', description: 'Proficiência em espadas longas, espadas curtas, arcos curtos e arcos longos.' },
      { name: 'Passo Ligeiro', description: 'Sua velocidade base de caminhada aumenta para 10,5 metros.' },
      { name: 'Máscara da Natureza', description: 'Você pode tentar se esconder mesmo quando está apenas levemente obscurecido por folhagem, chuva forte, neve, névoa e outros fenômenos naturais.' },
    ],
  },
  {
    raceName: 'Elfo',
    name: 'Elfo Negro (Drow)',
    description: 'Exilados nas profundezas da terra, os Drow desenvolveram habilidades únicas de sobrevivência nos Underdark. Temidos e desconfiados por muitos, carregam uma reputação sombria.',
    bonuses: { ...ZERO, carisma: 1 },
    traits: [
      { name: 'Visão no Escuro Superior', description: 'Sua visão no escuro tem alcance de 36 metros em vez dos habituais 18.' },
      { name: 'Sensibilidade à Luz Solar', description: 'Desvantagem em testes de ataque e em testes de Percepção baseados em visão quando você ou o alvo estão sob luz solar direta.' },
      { name: 'Magia Drow', description: 'Você conhece o truque Luz Dançante. Ao atingir o 3° nível, pode lançar Fogo das Fadas uma vez por dia. Ao atingir o 5°, pode lançar Escuridão uma vez por dia. Carisma é seu atributo de conjuração.' },
      { name: 'Treinamento em Armas Drow', description: 'Proficiência em rapieiras, espadas curtas e bestas de mão.' },
    ],
  },

  // ── Gnomo ─────────────────────────────────────────────────────────────────
  {
    raceName: 'Gnomo',
    name: 'Gnomo da Floresta',
    description: 'O Gnomo da Floresta tem talento natural para ilusionismo e se comunica facilmente com animais. São tímidos, mas profundamente curiosos sobre a natureza ao redor.',
    bonuses: { ...ZERO, destreza: 1 },
    traits: [
      { name: 'Ilusão Natural', description: 'Você conhece o truque Ilusão Menor. Inteligência é seu atributo de conjuração para ele.' },
      { name: 'Falar com Pequenas Bestas', description: 'Você pode se comunicar conceitos simples com bestas de tamanho Pequeno ou menor por meio de sons e gestos.' },
    ],
  },
  {
    raceName: 'Gnomo',
    name: 'Gnomo das Rochas',
    description: 'O Gnomo das Rochas tem curiosidade e inventividade inatas para construção mecânica. São os mais comuns entre os gnomos e adoram inventar engenhocas.',
    bonuses: { ...ZERO, constituicao: 1 },
    traits: [
      { name: 'Conhecimento de Artesão', description: 'Sempre que você fizer um teste de Investigação ou História sobre itens mágicos, objetos alquímicos ou dispositivos tecnológicos, pode adicionar o dobro do seu bônus de proficiência.' },
      { name: 'Descobridor', description: 'Você tem proficiência com ferramentas de artesão (ferramentas de tinker). Usando essas ferramentas, você pode gastar 1 hora e 10 po de materiais para construir um mecanismo Miúdo (CA 5, 1 pv).' },
    ],
  },

  // ── Hobbit ────────────────────────────────────────────────────────────────
  {
    raceName: 'Hobbit',
    name: 'Pés Leves',
    description: 'O Hobbit de Pés Leves é excepcionalmente furtivo e capaz de se esconder com facilidade. São os mais andarilhos entre os hobbits e tendem a se aventurar mais longe de casa.',
    bonuses: { ...ZERO, carisma: 1 },
    traits: [
      { name: 'Furtividade Natural', description: 'Você pode tentar se esconder quando estiver obscurecido apenas por uma criatura que seja pelo menos um tamanho maior que você.' },
    ],
  },
  {
    raceName: 'Hobbit',
    name: 'Robusto',
    description: 'O Hobbit Robusto é surpreendentemente resistente para seu tamanho. Mais resistentes fisicamente, têm sangue de hobbit das terras áridas correndo em suas veias.',
    bonuses: { ...ZERO, constituicao: 1 },
    traits: [
      { name: 'Resistência Robusta', description: 'Vantagem em testes de resistência contra veneno, e resistência ao tipo de dano veneno.' },
    ],
  },
];

// ─── Service ─────────────────────────────────────────────────────────────────

@Injectable()
export class RaceService implements OnModuleInit {
  constructor(
    @InjectRepository(Race)
    private readonly raceRepository: Repository<Race>,
    @InjectRepository(SubRace)
    private readonly subRaceRepository: Repository<SubRace>,
  ) {}

  async onModuleInit() {
    const raceCount = await this.raceRepository.count();

    if (raceCount === 0) {
      // Seed fresh
      const saved = await this.raceRepository.save(
        RACE_SEED.map((s) => this.raceRepository.create(s)),
      );
      await this.seedSubRaces(saved);
    } else {
      // Update traits on existing races (migração)
      const races = await this.raceRepository.find();
      for (const race of races) {
        const seed = RACE_SEED.find((s) => s.name === race.name);
        if (seed && (!race.traits || race.traits.length === 0)) {
          await this.raceRepository.update(race.id, { traits: seed.traits });
        }
      }

      // Seed sub-races if missing
      const subRaceCount = await this.subRaceRepository.count();
      if (subRaceCount === 0) {
        const allRaces = await this.raceRepository.find();
        await this.seedSubRaces(allRaces);
      }
    }
  }

  private async seedSubRaces(races: Race[]) {
    const byName = Object.fromEntries(races.map((r) => [r.name, r]));
    const toSave = SUB_RACE_SEED
      .filter((s) => byName[s.raceName])
      .map((s) => this.subRaceRepository.create({
        name: s.name,
        description: s.description,
        bonuses: s.bonuses,
        traits: s.traits,
        race: byName[s.raceName],
      }));
    await this.subRaceRepository.save(toSave);
  }

  async findAll(): Promise<Race[]> {
    return this.raceRepository.find({
      relations: ['subRaces'],
      order: { name: 'ASC' },
    });
  }
}
