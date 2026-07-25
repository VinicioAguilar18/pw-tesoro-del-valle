'use server';

import { revalidatePath } from 'next/cache';
import { requireAdminSession } from '@/lib/admin-auth';

export async function updateGuideSection(formData: FormData) {
  const { supabase } = await requireAdminSession();

  const id = String(formData.get('id'));

  const { error } = await supabase
    .from('guide_sections')
    .update({
      title_es: String(formData.get('title_es') ?? ''),
      title_en: String(formData.get('title_en') ?? ''),
      content_es: String(formData.get('content_es') ?? ''),
      content_en: String(formData.get('content_en') ?? ''),
      is_published: formData.get('is_published') === 'on',
    })
    .eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/admin/guia');
}
