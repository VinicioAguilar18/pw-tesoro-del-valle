'use server';

import { revalidatePath } from 'next/cache';
import { requireAdminSession } from '@/lib/admin-auth';

const PROPERTY_ID = '00000000-0000-0000-0000-000000000001';

function fieldsFromForm(formData: FormData) {
  return {
    author_name: String(formData.get('author_name') ?? ''),
    rating: Number(formData.get('rating') ?? 5),
    text_es: String(formData.get('text_es') ?? '') || null,
    text_en: String(formData.get('text_en') ?? '') || null,
    review_date: String(formData.get('review_date') ?? '') || null,
    review_url: String(formData.get('review_url') ?? '') || null,
    sort_order: Number(formData.get('sort_order') ?? 0),
    is_published: formData.get('is_published') === 'on',
  };
}

export async function createReview(formData: FormData) {
  const { supabase } = await requireAdminSession();

  const { error } = await supabase.from('reviews').insert({ property_id: PROPERTY_ID, ...fieldsFromForm(formData) });

  if (error) throw new Error(error.message);
  revalidatePath('/admin/resenas');
}

export async function updateReview(formData: FormData) {
  const { supabase } = await requireAdminSession();
  const id = String(formData.get('id'));

  const { error } = await supabase.from('reviews').update(fieldsFromForm(formData)).eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/admin/resenas');
}

export async function deleteReview(formData: FormData) {
  const { supabase } = await requireAdminSession();
  const id = String(formData.get('id'));

  const { error } = await supabase.from('reviews').delete().eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/admin/resenas');
}
