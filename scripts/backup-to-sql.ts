/**
 * Gera scripts/spells-import.sql a partir do backup JSON.
 * Uso: npm run backup:to-sql
 */

import * as fs from 'fs';
import * as path from 'path';

const BACKUP_PATH = path.join(__dirname, 'spells-translated.json');
const SQL_PATH = path.join(__dirname, 'spells-import.sql');

const SCHOOL_MAP: Record<string, string> = {
  Abjuration: 'Abjuração', Conjuration: 'Conjuração', Divination: 'Adivinhação',
  Enchantment: 'Encantamento', Evocation: 'Evocação', Illusion: 'Ilusão',
  Necromancy: 'Necromancia', Transmutation: 'Transmutação',
};
const CLASS_MAP: Record<string, string> = {
  Bard: 'Bardo', Cleric: 'Clérico', Druid: 'Druida', Fighter: 'Guerreiro',
  Monk: 'Monge', Paladin: 'Paladino', Ranger: 'Patrulheiro', Rogue: 'Ladino',
  Sorcerer: 'Feiticeiro', Warlock: 'Bruxo', Wizard: 'Mago', Barbarian: 'Bárbaro',
};

function esc(v: string | null | undefined): string {
  if (v == null) return 'NULL';
  return `'${String(v).replace(/'/g, "''")}'`;
}

const entries = JSON.parse(fs.readFileSync(BACKUP_PATH, 'utf-8'));
const lines: string[] = ['TRUNCATE TABLE dnd_spell RESTART IDENTITY CASCADE;'];

for (const { translated: t, original: o } of entries) {
  const school = esc(SCHOOL_MAP[o.school.name] ?? o.school.name);
  const classes = JSON.stringify(o.classes.map((c: { name: string }) => CLASS_MAP[c.name] ?? c.name));
  lines.push(
    `INSERT INTO dnd_spell (name,level,school,"castingTime",range,duration,"componentV","componentS","componentM","materialComponent",description,classes,ritual,concentration,"higherLevel") VALUES (` +
    `${esc(t.name)},${o.level},${school},${esc(t.castingTime)},${esc(t.range)},${esc(t.duration)},` +
    `${o.components.includes('V')},${o.components.includes('S')},${o.components.includes('M')},` +
    `${esc(t.material)},${esc(t.description)},'${classes.replace(/'/g, "''")}',` +
    `${o.ritual},${o.concentration},${esc(t.higherLevel)});`
  );
}

fs.writeFileSync(SQL_PATH, lines.join('\n'), 'utf-8');
console.log(`✅ SQL gerado: ${SQL_PATH} (${entries.length} magias)`);
