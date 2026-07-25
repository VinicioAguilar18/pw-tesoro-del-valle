'use server';

import { revalidatePath } from 'next/cache';
import { requireAdminSession } from '@/lib/admin-auth';

const PROPERTY_ID = '00000000-0000-0000-0000-000000000001';

function fieldsFromForm(formData: FormData) {
  return {
    category: String(formData.get('category') ?? ''),
    name: String(formData.get('name') ?? ''),
    description_es: String(formData.get('description_es') ?? '') || null,
    description_en: String(formData.get('description_en') ?? '') || null,
    distance_label: String(formData.get('distance_label') ?? '') || null,
    duration_label: String(formData.get('duration_label') ?? '') || null,
    price_label: String(formData.get('price_label') ?? '') || null,
    maps_url: String(formData.get('maps_url') ?? '') || null,
    photo_url: String(formData.get('photo_url') ?? '') || null,
    sort_order: Number(formData.get('sort_order') ?? 0),
    is_featured: formData.get('is_featured') === 'on',
    is_published: formData.get('is_published') === 'on',
  };
}

export async function createRecommendation(formData: FormData) {
  const { supabase } = await requireAdminSession();

  const { error } = await supabase
    .from('recommendations')
    .insert({ property_id: PROPERTY_ID, ...fieldsFromForm(formData) });

  if (error) throw new Error(error.message);
  revalidatePath('/admin/recomendaciones');
}

export async function updateRecommendation(formData: FormData) {
  const { supabase } = await requireAdminSession();
  const id = String(formData.get('id'));

  const { error } = await supabase.from('recommendations').update(fieldsFromForm(formData)).eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/admin/recomendaciones');
}

export async function deleteRecommendation(formData: FormData) {
  const { supabase } = await requireAdminSession();
  const id = String(formData.get('id'));

  const { error } = await supabase.from('recommendations').delete().eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/admin/recomendaciones');
}
