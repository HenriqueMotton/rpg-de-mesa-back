/**
 * Gera um novo dnd-spells.seed.ts a partir dos dados atuais do banco.
 * Uso: npm run export:seed
 */

import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const db = new Client({
    host: 'localhost', port: 5432,
    user: 'admin', password: 'rpg@park', database: 'rpg-de-mesa',
  });
  await db.connect();

  const { rows } = await db.query(
    `SELECT * FROM dnd_spell ORDER BY level ASC, name ASC`,
  );
  await db.end();

  const lines = rows.map((r) => {
    const classes = (r.classes as string[]).map((c) => JSON.stringify(c)).join(', ');
    const mat = r.materialComponent ? r.materialComponent.replace(/'/g, "\\'") : '';
    const desc = r.description ? r.description.replace(/'/g, "\\'") : '';
    const higher = r.higherLevel ? r.higherLevel.replace(/'/g, "\\'") : '';
    return (
      `  sp(${JSON.stringify(r.name)}, ${r.level}, ${JSON.stringify(r.school)}, ` +
      `${JSON.stringify(r.castingTime)}, ${JSON.stringify(r.range)}, ${JSON.stringify(r.duration)}, ` +
      `${r.componentV}, ${r.componentS}, ${r.componentM}, ` +
      `${JSON.stringify(mat)}, ${JSON.stringify(desc)}, ` +
      `[${classes}], ${r.ritual}, ${r.concentration}, ${JSON.stringify(higher)})`
    );
  });

  const content = `// Catálogo D&D 5e — PT-BR (gerado via export-seed.ts)

type SpellSeed = {
  name: string; level: number; school: string;
  castingTime: string; range: string; duration: string;
  componentV: boolean; componentS: boolean; componentM: boolean;
  materialComponent?: string; description: string; classes: string[];
  ritual: boolean; concentration: boolean; higherLevel?: string;
};

function sp(
  name: string, level: number, school: string,
  castingTime: string, range: string, duration: string,
  v: boolean, s: boolean, m: boolean, material: string,
  description: string, classes: string[],
  ritual: boolean, concentration: boolean, higherLevel: string,
): SpellSeed {
  return { name, level, school, castingTime, range, duration,
    componentV: v, componentS: s, componentM: m,
    ...(material ? { materialComponent: material } : {}),
    description, classes, ritual, concentration,
    ...(higherLevel ? { higherLevel } : {}) };
}

export const DND_SPELLS_SEED: SpellSeed[] = [
${lines.join(',\n')},
];
`;

  const outPath = path.join(__dirname, '..', 'src', 'spells', 'dnd-spells.seed.ts');
  fs.writeFileSync(outPath, content, 'utf-8');
  console.log(`✅ Seed gerado com ${rows.length} magias em:\n   ${outPath}`);
}

main().catch(console.error);
