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
  '20260713_006_add_review_url.sql',
  '20260713_007_dedupe_and_constrain.sql',
  '20260713_008_split_volcan_catarata.sql',
  '20260723_009_admin_host_email_and_secrets_rls.sql',
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

  // IMPORTANTE: la Management API puede responder 200 con un cuerpo que
  // señala un error o una ejecución parcial del batch de statements.
  // Un fetch "ok" (2xx) NO significa que el SQL corrió como se esperaba
  // — hay que leer el body siempre, nunca confiar solo en res.ok.
  const text = await res.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = text;
  }

  if (!res.ok) {
    throw new Error(`Migration ${name} failed (${res.status}): ${text}`);
  }

  if (body && typeof body === 'object' && 'error' in body) {
    throw new Error(`Migration ${name} returned an error in the response body: ${JSON.stringify(body.error)}`);
  }

  return body;
}

/** Confirma contra information_schema/pg_policies que la migración 009 sí aplicó. */
async function verifyMigration009() {
  const columnRows = await runSQL(
    `select column_name from information_schema.columns
     where table_schema = 'public' and table_name = 'properties' and column_name = 'host_email';`,
    'verify:host_email column'
  );
  if (!Array.isArray(columnRows) || columnRows.length === 0) {
    throw new Error(
      'properties.host_email no existe en information_schema a pesar de que la migración no reportó error.'
    );
  }
  console.log('  ✅ properties.host_email existe.');

  const policyRows = await runSQL(
    `select policyname from pg_policies
     where schemaname = 'public' and tablename = 'property_secrets';`,
    'verify:property_secrets policies'
  );
  if (!Array.isArray(policyRows) || policyRows.length < 2) {
    throw new Error(
      `property_secrets debería tener 2 policies "authenticated" y tiene ${Array.isArray(policyRows) ? policyRows.length : 0}.`
    );
  }
  console.log(`  ✅ property_secrets tiene ${policyRows.length} policy(s): ${policyRows.map((p) => p.policyname).join(', ')}`);
}

async function main() {
  console.log('🚀 Aplicando migraciones...\n');

  for (const file of migrations) {
    const filePath = join(__dirname, '..', 'supabase', 'migrations', file);
    const sql = readFileSync(filePath, 'utf-8');

    process.stdout.write(`  → ${file} ... `);
    try {
      const result = await runSQL(sql, file);
      console.log('✅');
      if (process.env.DEBUG_MIGRATIONS) {
        console.log('     respuesta:', JSON.stringify(result).slice(0, 300));
      }
    } catch (err) {
      console.log('❌');
      console.error(`\n${err.message}\n`);
      process.exit(1);
    }
  }

  console.log('\n🔍 Verificando que los cambios de esquema quedaron aplicados de verdad...');
  try {
    await verifyMigration009();
  } catch (err) {
    console.error(`\n❌ ${err.message}\n`);
    process.exit(1);
  }

  console.log('\n✅ Todas las migraciones aplicadas y verificadas correctamente.');
}

main();
