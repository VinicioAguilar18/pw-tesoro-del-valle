/**
 * scripts/apply-migrations.mjs
 * Aplica las migraciones SQL al proyecto Supabase vía Management API.
 * Usa el Access Token del anfitrión (no guarda secretos).
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_REF = 'cpqluvdlirhxxlzvmdoo';
const SUPABASE_ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;

if (!SUPABASE_ACCESS_TOKEN) {
  console.error('❌ Falta SUPABASE_ACCESS_TOKEN en el entorno.');
  process.exit(1);
}

const migrations = [
  '20260708_001_create_tables.sql',
  '20260708_002_enable_rls.sql',
  '20260708_003_seed_property.sql',
  '20260712_004_create_reviews.sql',
  '20260712_005_seed_reviews.sql',
];

async function runSQL(sql, name) {
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SUPABASE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: sql }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Migration ${name} failed (${res.status}): ${err}`);
  }

  return res.json();
}

async function main() {
  console.log('🚀 Aplicando migraciones...\n');

  for (const file of migrations) {
    const filePath = join(__dirname, '..', 'supabase', 'migrations', file);
    const sql = readFileSync(filePath, 'utf-8');

    process.stdout.write(`  → ${file} ... `);
    try {
      await runSQL(sql, file);
      console.log('✅');
    } catch (err) {
      console.log('❌');
      console.error(`\n${err.message}\n`);
      process.exit(1);
    }
  }

  console.log('\n✅ Todas las migraciones aplicadas correctamente.');
}

main();
