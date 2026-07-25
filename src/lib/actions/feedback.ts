'use server';

import { z } from 'zod';
import { createServiceClient } from '@/lib/supabase/server';
import { getPropertyByAccessCode } from '@/lib/queries/concierge';

const feedbackSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  likedMost: z.string().trim().max(2000).optional(),
  toImprove: z.string().trim().max(2000).optional(),
  guideClarity: z.enum(['si', 'mas_o_menos', 'no']),
  wouldReturn: z.enum(['si', 'tal_vez', 'no']),
  guestName: z.string().trim().max(200).optional(),
});

export type FeedbackState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
};

/**
 * Insert server-side con service_role — nunca insert anónimo directo desde
 * el cliente (RLS bloquea a `anon` en `feedback`, ver migración 002).
 * `property_id` se resuelve del `code` server-side, nunca se confía en un
 * id que venga del formulario.
 *
 * Envío de correo al anfitrión: PENDIENTE. Falta RESEND_API_KEY y
 * HOST_NOTIFICATION_EMAIL en .env.local — el feedback ya queda guardado
 * en la tabla `feedback`, solo falta la notificación por correo.
 */
export async function submitFeedback(code: string, formData: FormData): Promise<FeedbackState> {
  const property = await getPropertyByAccessCode(code);
  if (!property) {
    return { status: 'error', message: 'invalid_code' };
  }

  const parsed = feedbackSchema.safeParse({
    rating: formData.get('rating'),
    likedMost: formData.get('likedMost') || undefined,
    toImprove: formData.get('toImprove') || undefined,
    guideClarity: formData.get('guideClarity'),
    wouldReturn: formData.get('wouldReturn'),
    guestName: formData.get('guestName') || undefined,
  });

  if (!parsed.success) {
    return { status: 'error', message: 'invalid_input' };
  }

  const supabase = createServiceClient();
  const { error } = await supabase.from('feedback').insert({
    property_id: property.id,
    rating: parsed.data.rating,
    liked_most: parsed.data.likedMost ?? null,
    to_improve: parsed.data.toImprove ?? null,
    guide_clarity: parsed.data.guideClarity,
    would_return: parsed.data.wouldReturn,
    guest_name: parsed.data.guestName ?? null,
  });

  if (error) {
    return { status: 'error', message: 'db_error' };
  }

  // TODO(Fase 6 - correo): enviar notificación al anfitrión vía Resend una
  // vez existan RESEND_API_KEY y HOST_NOTIFICATION_EMAIL en el entorno.

  return { status: 'success' };
}
