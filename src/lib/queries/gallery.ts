/** Lista las fotos reales del bucket (no hardcodea nombres de archivo). */
import { createServiceClient } from '@/lib/supabase/server';
import { getPhotoUrl } from '@/lib/photos';

export async function getGalleryPhotos(propertySlug: string): Promise<string[]> {
  const supabase = createServiceClient();
  const { data } = await supabase.storage.from('photos').list(`${propertySlug}/gallery`);

  return (data ?? [])
    .filter((f) => f.name.endsWith('.webp'))
    .map((f) => getPhotoUrl(`${propertySlug}/gallery/${f.name}`));
}
