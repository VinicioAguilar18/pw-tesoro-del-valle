/**
 * scripts/upload-activity-photos.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * Optimiza a WebP y sube las fotos reales de actividades ("fotos de
 * actividades/") al bucket "photos", bajo la-rana/recommendations/{slug}/.
 * Luego actualiza recommendations.photo_url para cada actividad.
 *
 * No borra ni mueve los archivos originales — solo lee y sube.
 * Ejecutar: node scripts/upload-activity-photos.mjs
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
const SOURCE_DIR = join(ROOT, 'fotos de actividades');

// slug -> { source folder, files a procesar, foto principal para recommendations.photo_url, name en BD }
const ACTIVITIES = [
  {
    slug: 'catarata-la-fortuna',
    folder: 'Catarata la Fortuna',
    recommendationName: 'Catarata La Fortuna',
    files: [{ src: 'Catarata.jpg', out: 'catarata-la-fortuna.webp' }],
    mainPhoto: 'catarata-la-fortuna.webp',
  },
  {
    slug: 'volcan-arenal',
    folder: 'Volcan',
    recommendationName: 'Volcán Arenal',
    files: [{ src: 'Volcan.jpg', out: 'volcan-arenal.webp' }],
    mainPhoto: 'volcan-arenal.webp',
  },
  {
    slug: 'termales-del-valle',
    folder: 'Termales del valle',
    recommendationName: 'Termales del Valle',
    files: [
      { src: 'Pisicinas.png', out: 'piscinas-01.webp' },
      { src: 'Psicinas 2.png', out: 'piscinas-02.webp' },
      { src: 'Paisaje.png', out: 'paisaje.webp' },
      { src: 'Ranchos.png', out: 'ranchos.webp' },
    ],
    mainPhoto: 'piscinas-01.webp',
  },
];

async function processAndUpload(activity) {
  console.log(`\n→ ${activity.recommendationName}`);
  let mainPhotoUrl = null;

  for (const file of activity.files) {
    const inputPath = join(SOURCE_DIR, activity.folder, file.src);
    const storagePath = `la-rana/recommendations/${activity.slug}/${file.out}`;

    const buffer = await sharp(inputPath)
      .resize({ width: 2000, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();

    const { error } = await supabase.storage.from(BUCKET).upload(storagePath, buffer, {
      contentType: 'image/webp',
      upsert: true,
    });

    if (error) {
      console.log(`  ❌ ${storagePath}: ${error.message}`);
      continue;
    }

    console.log(`  ✅ ${storagePath}`);

    if (file.out === activity.mainPhoto) {
      mainPhotoUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${storagePath}`;
    }
  }

  if (!mainPhotoUrl) {
    console.log(`  ⚠️  No se pudo determinar la foto principal para ${activity.recommendationName}`);
    return;
  }

  const { error: updateError } = await supabase
    .from('recommendations')
    .update({ photo_url: mainPhotoUrl })
    .eq('name', activity.recommendationName);

  if (updateError) {
    console.log(`  ❌ No se pudo actualizar recommendations.photo_url: ${updateError.message}`);
  } else {
    console.log(`  ✅ recommendations.photo_url actualizado → ${mainPhotoUrl}`);
  }
}

async function main() {
  console.log('📸 Procesando y subiendo fotos de actividades...');

  for (const activity of ACTIVITIES) {
    await processAndUpload(activity);
  }

  console.log('\n✅ Listo. Los archivos originales en "fotos de actividades/" no se modificaron ni se borraron.');
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
