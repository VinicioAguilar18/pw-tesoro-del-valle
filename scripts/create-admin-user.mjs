/**
 * scripts/create-admin-user.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * Crea (o actualiza la contraseña de) el único usuario de /admin.
 * Lee EXCLUSIVAMENTE desde .env.local — nunca hardcodea valores.
 *
 * Requiere en .env.local: HOST_ADMIN_EMAIL, HOST_ADMIN_PASSWORD
 * Ejecutar: node scripts/create-admin-user.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '..', '.env.local') });

const required = ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'HOST_ADMIN_EMAIL', 'HOST_ADMIN_PASSWORD'];
const missing = required.filter((k) => !process.env[k]);
if (missing.length > 0) {
  console.error(`❌ Variables faltantes en .env.local: ${missing.join(', ')}`);
  process.exit(1);
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

async function main() {
  const email = process.env.HOST_ADMIN_EMAIL;
  const password = process.env.HOST_ADMIN_PASSWORD;

  const { data: existing } = await supabase.auth.admin.listUsers();
  const found = existing?.users.find((u) => u.email === email);

  if (found) {
    const { error } = await supabase.auth.admin.updateUserById(found.id, { password });
    if (error) {
      console.error('❌', error.message);
      process.exit(1);
    }
    console.log('✅ Usuario ya existía — contraseña actualizada.');
    return;
  }

  const { error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    console.error('❌', error.message);
    process.exit(1);
  }

  console.log('✅ Usuario admin creado.');
}

main();
