'use server';

// Escribe properties + property_secrets. Usa el cliente CON SESIÓN (RLS
// "authenticated" de la migración 009), no service_role — service_role
// se reserva para el Concierge anónimo en /g/[code].
import { revalidatePath } from 'next/cache';
import { requireAdminSession } from '@/lib/admin-auth';

const PROPERTY_ID = '00000000-0000-0000-0000-000000000001'; // La Rana (única propiedad hoy)

export async function updateProperty(formData: FormData) {
  const { supabase } = await requireAdminSession();

  const { error: propError } = await supabase
    .from('properties')
    .update({
      access_code: String(formData.get('access_code') ?? ''),
      checkin_time: String(formData.get('checkin_time') ?? ''),
      checkout_time: String(formData.get('checkout_time') ?? ''),
      host_phone: String(formData.get('host_phone') ?? ''),
      host_email: String(formData.get('host_email') ?? ''),
    })
    .eq('id', PROPERTY_ID);

  if (propError) {
    throw new Error(propError.message);
  }

  const { error: secretsError } = await supabase
    .from('property_secrets')
    .update({
      door_code: String(formData.get('door_code') ?? ''),
      wifi_name: String(formData.get('wifi_name') ?? ''),
      wifi_password: String(formData.get('wifi_password') ?? ''),
    })
    .eq('property_id', PROPERTY_ID);

  if (secretsError) {
    throw new Error(secretsError.message);
  }

  revalidatePath('/admin/alojamiento');
}
