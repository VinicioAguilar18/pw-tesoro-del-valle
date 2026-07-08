/**
 * scripts/seed-secrets.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * Inserta/actualiza los datos SENSIBLES de La Rana en Supabase:
 *   - property_secrets (wifi_name, wifi_password, door_code)
 *   - properties.access_code (código del link /g/[code])
 *
 * Lee EXCLUSIVAMENTE desde .env.local — NUNCA hardcodea valores.
 * Ejecutar: npm run seed:secrets
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Cargar .env.local desde la raíz del proyecto
config({ path: resolve(__dirname, '..', '.env.local') });

// ── Validar variables requeridas ──────────────────────────────────────────────
const required = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'WIFI_NAME',
  'WIFI_PASSWORD',
  'CONCIERGE_ACCESS_CODE',
];

const missing = required.filter((k) => !process.env[k]);
if (missing.length > 0) {
  console.error(`❌ Variables faltantes en .env.local: ${missing.join(', ')}`);
  process.exit(1);
}

// ── Cliente Supabase con service_role (bypass RLS) ────────────────────────────
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

const PROPERTY_ID = '00000000-0000-0000-0000-000000000001'; // La Rana

async function main() {
  console.log('🔐 Insertando secrets de La Rana...\n');

  // 1. Actualizar access_code en properties
  process.stdout.write('  → properties.access_code ... ');
  const { error: propErr } = await supabase
    .from('properties')
    .update({ access_code: process.env.CONCIERGE_ACCESS_CODE })
    .eq('id', PROPERTY_ID);

  if (propErr) {
    console.log('❌');
    console.error(`\n${propErr.message}\n`);
    process.exit(1);
  }
  console.log('✅');

  // 2. Upsert en property_secrets
  process.stdout.write('  → property_secrets (wifi + puerta) ... ');
  const { error: secretErr } = await supabase
    .from('property_secrets')
    .upsert(
      {
        property_id: PROPERTY_ID,
        wifi_name: process.env.WIFI_NAME,
        wifi_password: process.env.WIFI_PASSWORD,
        door_code: process.env.DOOR_CODE || null,
      },
      { onConflict: 'property_id' }
    );

  if (secretErr) {
    console.log('❌');
    console.error(`\n${secretErr.message}\n`);
    process.exit(1);
  }
  console.log('✅');

  console.log('\n✅ Secrets insertados correctamente.');
  console.log('   • Access code: [REDACTED - ver .env.local]');
  console.log('   • WiFi name: [REDACTED]');
  console.log('   • WiFi password: [REDACTED]');
  console.log('   • Door code:', process.env.DOOR_CODE ? '[REDACTED]' : '(vacío — pendiente)');
}

main();
