import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Background, BackgroundFeature } from './entities/background.entity';

type BackgroundSeed = {
  name: string;
  icon: string;
  description: string;
  skillGrants: string[];
  feature: BackgroundFeature;
  equipment: string[];
};

const BACKGROUND_SEED: BackgroundSeed[] = [
  {
    name: 'Acólito',
    icon: '✝️',
    description: 'Você passou anos servindo em um templo ou organização religiosa. Aprendeu a canalizar a devoção e a interpretar textos sagrados, ganhando a confiança de sacerdotes e fiéis.',
    skillGrants: ['Intuição', 'Religião'],
    feature: {
      name: 'Abrigo dos Fiéis',
      description: 'Como acólito, você recebe respeito de clérigos e sacerdotes da sua fé. Pode realizar cerimônias religiosas e encontrar abrigo, comida e cura gratuita em templos da sua religião.',
    },
    equipment: ['Símbolo sagrado', 'Livro de orações', 'Incenso (5 varetas)', 'Vestes', '15 po'],
  },
  {
    name: 'Artista',
    icon: '🎭',
    description: 'Você prospera diante de uma plateia. A música, a dança ou o teatro são a sua linguagem nativa. Você viajou por vilas e cidades encantando multidões e conhecendo pessoas de todas as esferas.',
    skillGrants: ['Acrobacia', 'Atuação'],
    feature: {
      name: 'Abrigo de Admiradores',
      description: 'Em qualquer lugar onde você se apresente, pode sempre encontrar um lugar para se hospedar, comida simples e pequenas doações do público — suficientes para uma vida modesta.',
    },
    equipment: ['Fantasia de artista', 'Instrumento musical', 'Presente de fã admirador', '15 po'],
  },
  {
    name: 'Bandido de Guildas',
    icon: '⚒️',
    description: 'Você cresceu aprendendo um ofício dentro de uma guilda de artesãos, mercadores ou negociantes. Conhece os códigos não escritos do comércio e as conexões que mantêm os negócios funcionando.',
    skillGrants: ['Intuição', 'Persuasão'],
    feature: {
      name: 'Membro da Guilda',
      description: 'Sua guilda oferece apoio quando necessário: alojamento, ferramentas de trabalho e acesso a colegas de ofício. Em troca, você pode ser chamado a cumprir tarefas para a organização.',
    },
    equipment: ['Ferramentas de artesão', 'Carta de apresentação da guilda', 'Roupas finas', '15 po'],
  },
  {
    name: 'Charlatão',
    icon: '🃏',
    description: 'Você sempre teve dom para manipular, enganar e se passar por quem não é. Viveu usando disfarces e histórias convincentes para tirar proveito dos ingênuos — e de vez em quando dos espertos.',
    skillGrants: ['Enganação', 'Prestidigitação'],
    feature: {
      name: 'Identidade Falsa',
      description: 'Você possui uma segunda identidade completa, incluindo documentos, nome estabelecido e contatos. Também sabe criar identidades falsas para outros, desde que tenha uma semana e os materiais necessários.',
    },
    equipment: ['Roupas finas', 'Kit de disfarce', 'Ferramentas de jogo de azar', '15 po'],
  },
  {
    name: 'Criminoso',
    icon: '🗝️',
    description: 'Você tem experiência com o mundo do crime. Seja como ladrão, assassino de aluguel ou contrabandista, aprendeu a sobreviver nas sombras da sociedade e a nunca confiar em ninguém completamente.',
    skillGrants: ['Enganação', 'Furtividade'],
    feature: {
      name: 'Contato Criminal',
      description: 'Você tem um contato de confiança no submundo que atua como intermediário em redes criminosas. Através dele, pode passar ou receber mensagens e acionar favores no mundo ilegal.',
    },
    equipment: ['Alavanca de pé de cabra', 'Roupas escuras com capuz', 'Ferramentas de ladrão', '15 po'],
  },
  {
    name: 'Ermitão',
    icon: '🕯️',
    description: 'Você viveu em reclusão voluntária — num mosteiro, caverna ou floresta distante — dedicado à contemplação, meditação ou estudo de um grande mistério. O isolamento moldou profundamente sua visão de mundo.',
    skillGrants: ['Medicina', 'Religião'],
    feature: {
      name: 'Descoberta',
      description: 'Seu tempo de reclusão rendeu uma descoberta única: um segredo de grande poder, uma verdade oculta sobre o cosmos, ou uma epifania que poucos mortais conhecem. Trabalhe com o Mestre para definir os detalhes.',
    },
    equipment: ['Estojo de ervas medicinais', 'Diário de jornada', 'Roupas comuns', '5 po'],
  },
  {
    name: 'Forasteiro',
    icon: '🌲',
    description: 'Você cresceu nas terras selvagens, longe das cidades e das multidões. A floresta, a estepe ou as montanhas eram sua casa. Você aprendeu a sobreviver com o que a natureza oferece e a ler o ambiente como um livro.',
    skillGrants: ['Atletismo', 'Sobrevivência'],
    feature: {
      name: 'Caminhante do Mundo',
      description: 'Você tem um excelente senso de direção e conhece os territórios selvagens. Mesmo em regiões desconhecidas, sempre consegue encontrar alimento, água e abrigo — e raramente se perde.',
    },
    equipment: ['Cajado', 'Armadilha de caça', 'Roupas de viajante', '10 po'],
  },
  {
    name: 'Herói do Povo',
    icon: '🌻',
    description: 'Você veio do povo comum e fez algo extraordinário que o tornou um herói local. Pode ter salvo uma aldeia, desafiado um tirano ou simplesmente agido com uma coragem que as pessoas comuns admiram e invejam.',
    skillGrants: ['Adestramento', 'Sobrevivência'],
    feature: {
      name: 'Hospitalidade Rústica',
      description: 'Como herói do povo, aldeões e fazendeiros comuns te recebem com simpatia. Você pode sempre encontrar um lugar para descansar, esconder-se ou receber informações entre as pessoas humildes.',
    },
    equipment: ['Ferramentas de artesão', 'Pá', 'Panela de ferro', 'Roupas comuns', '10 po'],
  },
  {
    name: 'Marinheiro',
    icon: '⚓',
    description: 'Você passou anos no mar, enfrentando tempestades, piratas e o desconhecido. O convés de um navio era seu lar. Você aprendeu a trabalhar em equipe sob pressão e a confiar nos seus instintos quando o horizonte some.',
    skillGrants: ['Atletismo', 'Percepção'],
    feature: {
      name: 'Passagem Segura',
      description: 'Quando você precisar, pode garantir passagem gratuita em um navio para você e seus companheiros, em troca de trabalho durante a viagem. Você também conhece portos, tripulações e rotas marítimas.',
    },
    equipment: ['Corda de seda (15m)', 'Amuleto da sorte', 'Roupas comuns', '10 po'],
  },
  {
    name: 'Nobre',
    icon: '👑',
    description: 'Você nasceu ou foi criado entre a nobreza, rodeado de privilégios, intrigas políticas e etiqueta refinada. Aprendeu a manejar palavras e alianças tão bem quanto uma espada — talvez melhor.',
    skillGrants: ['História', 'Persuasão'],
    feature: {
      name: 'Privilégio de Posição',
      description: 'Sua posição social te garante acesso a locais e pessoas que a maioria não pode alcançar. A maioria dos nobres, comerciantes ricos e figuras de autoridade te recebem com respeito e te dão audiência.',
    },
    equipment: ['Roupas finas', 'Anel com sinete', 'Pergaminho de linhagem', '25 po'],
  },
  {
    name: 'Sábio',
    icon: '📜',
    description: 'Você dedicou anos ao estudo em uma academia, biblioteca ou sob a tutela de um mestre. Sua sede pelo conhecimento é insaciável — seja ele mágico, histórico ou filosófico. Você sabe que há sempre mais a aprender.',
    skillGrants: ['Arcanismo', 'História'],
    feature: {
      name: 'Pesquisador',
      description: 'Quando você não conhece um fato, sabe onde e como descobri-lo. Pode localizar informações em arquivos, bibliotecas ou com estudiosos — embora às vezes o conhecimento tenha um preço ou segredos perigosos.',
    },
    equipment: ['Frasco de tinta', 'Caneta', 'Faca de carta', 'Grimório pessoal', '10 po'],
  },
  {
    name: 'Soldado',
    icon: '⚔️',
    description: 'Você serviu em um exército, milícia ou grupo mercenário. A disciplina militar moldou seu corpo e sua mente. Você conhece bem a crueldade da guerra e também a camaradagem que só os campos de batalha forjam.',
    skillGrants: ['Atletismo', 'Intimidação'],
    feature: {
      name: 'Patente Militar',
      description: 'Sua patente e reputação abrem portas com outros soldados e hierarquias militares. Você consegue acesso a acampamentos, fortins e equipamentos militares que civis normalmente não teriam.',
    },
    equipment: ['Insígnia de patente', 'Troféu de batalha', 'Conjunto de osso e dado', 'Roupas comuns', '10 po'],
  },
];

@Injectable()
export class BackgroundsService implements OnModuleInit {
  constructor(
    @InjectRepository(Background)
    private readonly backgroundRepository: Repository<Background>,
  ) {}

  async onModuleInit() {
    const count = await this.backgroundRepository.count();
    if (count === 0) {
      await this.backgroundRepository.save(
        BACKGROUND_SEED.map((s) => this.backgroundRepository.create(s)),
      );
      return;
    }

    // Atualiza antecedentes existentes com novos campos
    for (const seed of BACKGROUND_SEED) {
      const existing = await this.backgroundRepository.findOne({ where: { name: seed.name } });
      if (!existing) {
        await this.backgroundRepository.save(this.backgroundRepository.create(seed));
        continue;
      }
      const update: Partial<Background> = {};
      if (!existing.feature)                             update.feature     = seed.feature;
      if (!existing.skillGrants || existing.skillGrants.length === 0) update.skillGrants = seed.skillGrants;
      if (Object.keys(update).length > 0) {
        await this.backgroundRepository.update({ name: seed.name }, update);
      }
    }
  }

  async findAll(): Promise<Background[]> {
    return this.backgroundRepository.find({ order: { name: 'ASC' } });
  }
}
