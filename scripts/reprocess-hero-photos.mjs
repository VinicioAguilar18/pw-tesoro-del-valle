/**
 * scripts/reprocess-hero-photos.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * Reescribe en el bucket las fotos que rotan en el Hero a calidad WebP más
 * alta (90 en vez de 82). Usa las fuentes locales ya en .tmp-photos/la-rana
 * (no se puede recuperar detalle perdido de un WebP ya comprimido, pero
 * evita compresión adicional innecesaria en las fotos más visibles del sitio).
 * El resto de la galería (bano-01, comedor-01, sala-01) queda igual.
 *
 * Ejecutar: node scripts/reprocess-hero-photos.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { config } from 'dotenv';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

config({ path: resolve(ROOT, '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

const BUCKET = 'photos';
const SOURCE_DIR = join(ROOT, '.tmp-photos', 'la-rana', 'gallery');

const HERO_PHOTOS = [
  'hero-vista-dron.webp',
  'casa-01.webp',
  'casa-02.webp',
  'jacuzzi-01.webp',
  'jacuzzi-02.webp',
  'jacuzzi-03.webp',
  'jacuzzi-04.webp',
  'patio-01.webp',
  'habitacion-01.webp',
  'cocina-01.webp',
  'jardin-piedra-01.webp',
];

async function main() {
  console.log('🎞️  Re-procesando fotos del hero a calidad 90...\n');

  for (const file of HERO_PHOTOS) {
    const inputPath = join(SOURCE_DIR, file);
    const storagePath = `la-rana/gallery/${file}`;

    const buffer = await sharp(inputPath).webp({ quality: 90 }).toBuffer();

    const { error } = await supabase.storage.from(BUCKET).upload(storagePath, buffer, {
      contentType: 'image/webp',
      upsert: true,
    });

    if (error) {
      console.log(`  ❌ ${storagePath}: ${error.message}`);
    } else {
      console.log(`  ✅ ${storagePath} (${(buffer.length / 1024).toFixed(0)} KB)`);
    }
  }

  console.log('\n✅ Listo. Mismas rutas/URLs — no hace falta tocar el código.');
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
