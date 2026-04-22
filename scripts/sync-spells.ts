/**
 * Sincroniza magias do dnd5-srd (inglês) para o banco de dados em PT-BR
 * usando Claude API para tradução.
 *
 * - Salva backup em scripts/spells-translated.json após traduzir
 * - Se o backup já existir, pula a tradução e usa o backup direto
 *
 * Uso: npm run sync:spells
 */

import Anthropic from '@anthropic-ai/sdk';
import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

// Lê o .env manualmente
const envPath = path.join(__dirname, '..', '.env');
const env: Record<string, string> = {};
for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
  const idx = line.indexOf('=');
  if (idx > 0) env[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
}

const BACKUP_PATH = path.join(__dirname, 'spells-translated.json');

// ── Mapeamentos fixos ────────────────────────────────────────────────────────

const SCHOOL_MAP: Record<string, string> = {
  Abjuration: 'Abjuração',
  Conjuration: 'Conjuração',
  Divination: 'Adivinhação',
  Enchantment: 'Encantamento',
  Evocation: 'Evocação',
  Illusion: 'Ilusão',
  Necromancy: 'Necromancia',
  Transmutation: 'Transmutação',
};

const CLASS_MAP: Record<string, string> = {
  Bard: 'Bardo',
  Cleric: 'Clérico',
  Druid: 'Druida',
  Fighter: 'Guerreiro',
  Monk: 'Monge',
  Paladin: 'Paladino',
  Ranger: 'Patrulheiro',
  Rogue: 'Ladino',
  Sorcerer: 'Feiticeiro',
  Warlock: 'Bruxo',
  Wizard: 'Mago',
  Barbarian: 'Bárbaro',
};

// ── Tipos ────────────────────────────────────────────────────────────────────

interface SrdSpell {
  name: string;
  desc: string[];
  higher_level: string[];
  range: string;
  components: string[];
  material?: string;
  ritual: boolean;
  duration: string;
  concentration: boolean;
  casting_time: string;
  level: number;
  school: { name: string };
  classes: { name: string }[];
}

interface Translated {
  name: string;
  description: string;
  higherLevel: string | null;
  castingTime: string;
  range: string;
  duration: string;
  material: string | null;
}

interface BackupEntry {
  translated: Translated;
  original: SrdSpell;
}

// ── Tradução em lote ─────────────────────────────────────────────────────────

async function translateBatch(
  anthropic: Anthropic,
  batch: SrdSpell[],
): Promise<Translated[]> {
  const input = batch.map((s) => ({
    name: s.name,
    desc: s.desc.join(' '),
    higher_level: s.higher_level?.join(' ') || null,
    casting_time: s.casting_time,
    range: s.range,
    duration: s.duration,
    material: s.material || null,
  }));

  const msg = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 8192,
    messages: [
      {
        role: 'user',
        content: `Traduza estas ${batch.length} magias do D&D 5e do inglês para português brasileiro (PT-BR), usando as traduções oficiais do D&D quando existirem (ex: Fireball→Bola de Fogo, Magic Missile→Míssil Mágico, Charm Person→Enfeitiçar Pessoa).

Retorne APENAS um array JSON válido, sem markdown, sem texto fora do JSON.

Cada elemento deve ter exatamente estas chaves:
{ "name": "", "description": "", "higherLevel": "" ou null, "castingTime": "", "range": "", "duration": "", "material": "" ou null }

Dados de entrada:
${JSON.stringify(input)}`,
      },
    ],
  });

  const raw = (msg.content[0] as { text: string }).text.trim();
  const json = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  return JSON.parse(json) as Translated[];
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const srdSpells: SrdSpell[] = (require('dnd5-srd') as { data: { spells: SrdSpell[] } }).data.spells;

  let allTranslated: BackupEntry[];

  // ── Usa backup se já existir ──────────────────────────────────────────────
  if (fs.existsSync(BACKUP_PATH)) {
    console.log(`📦 Backup encontrado — pulando tradução e usando ${BACKUP_PATH}\n`);
    allTranslated = JSON.parse(fs.readFileSync(BACKUP_PATH, 'utf-8')) as BackupEntry[];
    console.log(`   ${allTranslated.length} magias carregadas do backup.\n`);
  } else {
    console.log(`📚 ${srdSpells.length} magias carregadas do dnd5-srd\n`);
    const anthropic = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
    allTranslated = [];

    const BATCH_SIZE = 6;
    const total = Math.ceil(srdSpells.length / BATCH_SIZE);

    for (let i = 0; i < srdSpells.length; i += BATCH_SIZE) {
      const batch = srdSpells.slice(i, i + BATCH_SIZE);
      const num = Math.floor(i / BATCH_SIZE) + 1;
      process.stdout.write(`  Traduzindo lote ${num}/${total} (${batch[0].name}…)  `);

      try {
        const results = await translateBatch(anthropic, batch);
        for (let j = 0; j < results.length; j++) {
          allTranslated.push({ translated: results[j], original: batch[j] });
        }
        console.log('✓');
      } catch (err) {
        console.log(`✗  ERRO: ${(err as Error).message}`);
        try {
          process.stdout.write(`    Retentativa...  `);
          const results = await translateBatch(anthropic, batch);
          for (let j = 0; j < results.length; j++) {
            allTranslated.push({ translated: results[j], original: batch[j] });
          }
          console.log('✓');
        } catch {
          console.log('✗ falhou, pulando lote');
        }
      }
    }

    // Salva backup ANTES de qualquer operação no banco
    fs.writeFileSync(BACKUP_PATH, JSON.stringify(allTranslated, null, 2), 'utf-8');
    console.log(`\n💾 Backup salvo em: ${BACKUP_PATH}`);
  }

  // ── Conecta ao banco ───────────────────────────────────────────────────────
  console.log(`\n🔌 Conectando ao banco de dados...`);
  const db = new Client({
    host: '172.31.226.11', port: 5432,
    user: 'admin', password: 'rpg@park', database: 'rpg-de-mesa',
  });
  await db.connect();

  await db.query('TRUNCATE TABLE dnd_spell RESTART IDENTITY CASCADE');

  for (const entry of allTranslated) {
    const { translated: t, original: o } = entry;
    await db.query(
      `INSERT INTO dnd_spell
        (name, level, school, "castingTime", range, duration,
         "componentV", "componentS", "componentM", "materialComponent",
         description, classes, ritual, concentration, "higherLevel")
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
      [
        t.name, o.level, SCHOOL_MAP[o.school.name] ?? o.school.name,
        t.castingTime, t.range, t.duration,
        o.components.includes('V'), o.components.includes('S'), o.components.includes('M'),
        t.material ?? null, t.description,
        JSON.stringify(o.classes.map((c) => CLASS_MAP[c.name] ?? c.name)),
        o.ritual, o.concentration, t.higherLevel ?? null,
      ],
    );
  }

  console.log(`✅ ${allTranslated.length} magias inseridas com sucesso!`);
  await db.end();
}

main().catch((err) => {
  console.error('Erro fatal:', err);
  process.exit(1);
});
