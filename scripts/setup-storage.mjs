/**
 * scripts/setup-storage.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * Crea el bucket "photos" en Supabase Storage (público solo lectura)
 * y sube las fotos del ZIP fotos-la-rana-supabase.zip
 *
 * Ejecutar: npm run setup:storage
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { config } from 'dotenv';
import { resolve, dirname, join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import { createReadStream, existsSync } from 'fs';
import { readdir, readFile } from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

config({ path: resolve(ROOT, '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

const BUCKET = 'photos';
const ZIP_PATH = join(ROOT, 'fotos-la-rana-supabase.zip');
const EXTRACT_DIR = join(ROOT, '.tmp-photos');

const MIME_MAP = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
};

async function createBucket() {
  const { data: existing } = await supabase.storage.getBucket(BUCKET);
  if (existing) {
    console.log(`  ℹ️  Bucket "${BUCKET}" ya existe.`);
    return;
  }

  const { error } = await supabase.storage.createBucket(BUCKET, {
    public: true,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
    fileSizeLimit: 10 * 1024 * 1024, // 10MB
  });

  if (error) throw new Error(`No se pudo crear el bucket: ${error.message}`);
  console.log(`  ✅ Bucket "${BUCKET}" creado (público, solo lectura).`);
}

async function extractZip() {
  if (!existsSync(ZIP_PATH)) {
    console.log(`  ⚠️  ZIP no encontrado: ${ZIP_PATH}`);
    console.log('     Sáltate la subida de fotos o coloca el ZIP en la raíz del proyecto.');
    return false;
  }

  console.log(`  → Extrayendo ${basename(ZIP_PATH)}...`);
  await execAsync(`powershell -Command "Expand-Archive -Path '${ZIP_PATH}' -DestinationPath '${EXTRACT_DIR}' -Force"`);
  console.log('  ✅ ZIP extraído.');
  return true;
}

async function getAllFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await getAllFiles(full)));
    } else {
      files.push(full);
    }
  }
  return files;
}

async function uploadPhotos() {
  const files = await getAllFiles(EXTRACT_DIR);
  const imageFiles = files.filter((f) => MIME_MAP[extname(f).toLowerCase()]);

  if (imageFiles.length === 0) {
    console.log('  ⚠️  No se encontraron imágenes en el ZIP.');
    return;
  }

  console.log(`  → Subiendo ${imageFiles.length} fotos al bucket "${BUCKET}"...`);

  for (const filePath of imageFiles) {
    // Construir el path en el bucket: la-rana/gallery/nombre.jpg
    const relative = filePath
      .replace(EXTRACT_DIR, '')
      .replace(/\\/g, '/')
      .replace(/^\//, '');

    // Si ya tiene estructura de carpetas en el ZIP, la respetamos;
    // si no, la ponemos bajo la-rana/gallery/
    const storagePath = relative.includes('/')
      ? relative
      : `la-rana/gallery/${relative}`;

    const mimeType = MIME_MAP[extname(filePath).toLowerCase()];
    const fileBuffer = await readFile(filePath);

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, fileBuffer, {
        contentType: mimeType,
        upsert: true,
      });

    if (error) {
      console.log(`  ❌ Error subiendo ${storagePath}: ${error.message}`);
    } else {
      console.log(`  ✅ ${storagePath}`);
    }
  }
}

async function main() {
  console.log('📁 Configurando Storage de Supabase...\n');

  await createBucket();

  const extracted = await extractZip();
  if (extracted) {
    await uploadPhotos();
  }

  console.log('\n✅ Setup de Storage completado.');
  console.log('   Las URLs públicas tienen el formato:');
  console.log(`   ${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/la-rana/gallery/[foto.jpg]`);
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
