import { createServiceClient } from '@/lib/supabase/server';

export interface ConciergeProperty {
  id: string;
  name: string;
  hero_photo_url: string | null;
  checkin_time: string | null;
  checkout_time: string | null;
  host_phone: string | null;
}

export interface GuideSection {
  id: string;
  slug: string;
  title_es: string;
  title_en: string;
  content_es: string | null;
  content_en: string | null;
  icon: string | null;
  icon_color: string | null;
}

export interface ConciergeRecommendation {
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

/**
 * Valida el código del link y devuelve la propiedad — SIN tocar property_secrets.
 * Bypass RLS: uso exclusivo server-side (validación del Concierge Digital).
 */
export async function getPropertyByAccessCode(code: string): Promise<ConciergeProperty | null> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from('properties')
    .select('id, name, hero_photo_url, checkin_time, checkout_time, host_phone')
    .eq('access_code', code)
    .eq('is_active', true)
    .maybeSingle();

  return data;
}

/** Tarjetas del Concierge (guía), publicadas, en orden. */
export async function getGuideSections(propertyId: string): Promise<GuideSection[]> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from('guide_sections')
    .select('id, slug, title_es, title_en, content_es, content_en, icon, icon_color')
    .eq('property_id', propertyId)
    .eq('is_published', true)
    .order('sort_order', { ascending: true });

  return data ?? [];
}

/** Todas las recomendaciones publicadas (no solo destacadas) para el Concierge. */
export async function getAllRecommendations(propertyId: string): Promise<ConciergeRecommendation[]> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from('recommendations')
    .select(
      'id, category, name, description_es, description_en, distance_label, duration_label, price_label, maps_url, photo_url'
    )
    .eq('property_id', propertyId)
    .eq('is_published', true)
    .order('sort_order', { ascending: true });

  return data ?? [];
}
