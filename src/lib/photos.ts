/** Arma la URL pública de una foto del bucket `photos` en Supabase Storage. */
export function getPhotoUrl(path: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/${path}`;
}
