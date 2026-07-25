/**
 * Lecturas públicas de "lugares" (recommendations) para las páginas
 * /lugares/[slug] y /servicios. No están atadas a un código de huésped,
 * por eso usan el service client (RLS bloquea anon en recommendations).
 */
import { createServiceClient } from '@/lib/supabase/server';
import { slugify } from '@/lib/slugify';

export interface Place {
  id: string;
  category: string;
  name: string;
  description_es: string | null;
  description_en: string | null;
  distance_label: string | null;
  duration_label: string | null;
  price_label: string | null;
  maps_url: string | null;
  photo_url: string | null;
}

/** Todas las recomendaciones publicadas, de cualquier alojamiento. */
export async function getAllPlaces(): Promise<Place[]> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from('recommendations')
    .select(
      'id, category, name, description_es, description_en, distance_label, duration_label, price_label, maps_url, photo_url'
    )
    .eq('is_published', true)
    .order('sort_order', { ascending: true });

  return data ?? [];
}

/** Busca un lugar por su slug (derivado del nombre, no hay columna slug). */
export async function getPlaceBySlug(slug: string): Promise<Place | null> {
  const places = await getAllPlaces();
  return places.find((p) => slugify(p.name) === slug) ?? null;
}
