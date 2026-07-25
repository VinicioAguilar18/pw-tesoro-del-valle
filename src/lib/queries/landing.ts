import { createServiceClient } from '@/lib/supabase/server';

export interface Property {
  id: string;
  slug: string;
  name: string;
  tagline_es: string | null;
  tagline_en: string | null;
  hero_photo_url: string | null;
  airbnb_url: string | null;
  waze_url: string | null;
  gmaps_url: string | null;
  address_es: string | null;
  address_en: string | null;
}

export interface Recommendation {
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

export interface Review {
  id: string;
  author_name: string;
  rating: number;
  text_es: string | null;
  text_en: string | null;
  review_url: string | null;
}

/** Lee una propiedad publicada por slug. Bypass RLS: uso exclusivo server-side. */
export async function getProperty(slug: string): Promise<Property | null> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from('properties')
    .select(
      'id, slug, name, tagline_es, tagline_en, hero_photo_url, airbnb_url, waze_url, gmaps_url, address_es, address_en'
    )
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  return data;
}

/** Recomendaciones destacadas y publicadas de un alojamiento, para "Actividades". */
export async function getFeaturedRecommendations(propertyId: string): Promise<Recommendation[]> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from('recommendations')
    .select(
      'id, category, name, description_es, description_en, distance_label, duration_label, price_label, maps_url, photo_url'
    )
    .eq('property_id', propertyId)
    .eq('is_featured', true)
    .eq('is_published', true)
    .order('sort_order', { ascending: true });

  return data ?? [];
}

/** Reseñas publicadas de un alojamiento, para "Alojamientos destacados". */
export async function getPublishedReviews(propertyId: string): Promise<Review[]> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from('reviews')
    .select('id, author_name, rating, text_es, text_en, review_url')
    .eq('property_id', propertyId)
    .eq('is_published', true)
    .order('sort_order', { ascending: true });

  return data ?? [];
}
