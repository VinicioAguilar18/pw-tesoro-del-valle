/**
 * scripts/verify-rls.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * Verifica que el cliente anónimo NO puede leer datos sensibles.
 * Ejecutar: npm run verify:rls
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '..', '.env.local') });

// Cliente ANÓNIMO (como lo usaría un atacante desde el browser)
const anonClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Cliente service_role (acceso servidor)
const serviceClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

let passed = 0;
let failed = 0;

async function check(name, fn, expectEmpty) {
  const { data, error } = await fn();
  const isEmpty = !data || data.length === 0;
  const ok = expectEmpty ? isEmpty : !isEmpty;

  const icon = ok ? '✅' : '❌';
  const label = expectEmpty ? 'debe estar vacío' : 'debe tener datos';
  console.log(`  ${icon} [${name}] ${label}: ${ok ? 'CORRECTO' : 'FALLO'}`);

  if (!ok) {
    console.log(`     Datos recibidos:`, JSON.stringify(data)?.slice(0, 200));
    failed++;
  } else {
    passed++;
  }
}

async function main() {
  console.log('🔍 Verificando RLS...\n');

  console.log('── Cliente ANÓNIMO (debe ver cero datos) ──');
  await check('anon → properties', () => anonClient.from('properties').select('*'), true);
  await check('anon → property_secrets', () => anonClient.from('property_secrets').select('*'), true);
  await check('anon → guide_sections', () => anonClient.from('guide_sections').select('*'), true);
  await check('anon → recommendations', () => anonClient.from('recommendations').select('*'), true);
  // feedback: anón puede insertar pero no seleccionar
  await check('anon → feedback (select)', () => anonClient.from('feedback').select('*'), true);

  console.log('\n── Cliente SERVICE_ROLE (debe ver datos) ──');
  await check('service → properties', () => serviceClient.from('properties').select('*'), false);
  await check('service → property_secrets', () => serviceClient.from('property_secrets').select('*'), false);
  await check('service → guide_sections', () => serviceClient.from('guide_sections').select('*'), false);
  await check('service → recommendations', () => serviceClient.from('recommendations').select('*'), false);

  console.log(`\n${'─'.repeat(50)}`);
  if (failed === 0) {
    console.log(`✅ RLS verificado correctamente: ${passed}/${passed + failed} checks pasaron.`);
  } else {
    console.log(`❌ ${failed} check(s) fallaron. Revisar RLS policies.`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('❌ Error inesperado:', err.message);
  process.exit(1);
});
