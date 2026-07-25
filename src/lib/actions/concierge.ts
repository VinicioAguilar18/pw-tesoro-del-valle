'use server';

import { z } from 'zod';
import { createServiceClient } from '@/lib/supabase/server';

const codeSchema = z.string().min(1).max(64);

/**
 * Revalida el código de forma independiente en cada acción — no confía en
 * que la página ya lo validó al cargar. Si el anfitrión desactiva el código
 * entre que el huésped abre el link y toca "revelar", esto falla igual que
 * un código inválido.
 */
async function getValidPropertyId(code: string): Promise<string | null> {
  const parsed = codeSchema.safeParse(code);
  if (!parsed.success) return null;

  const supabase = createServiceClient();
  const { data } = await supabase
    .from('properties')
    .select('id')
    .eq('access_code', parsed.data)
    .eq('is_active', true)
    .maybeSingle();

  return data?.id ?? null;
}

/** Server Action: solo devuelve door_code. Nunca wifi_name/wifi_password. */
export async function revealDoorCode(code: string): Promise<{ doorCode: string } | null> {
  const propertyId = await getValidPropertyId(code);
  if (!propertyId) return null;

  const supabase = createServiceClient();
  const { data } = await supabase
    .from('property_secrets')
    .select('door_code')
    .eq('property_id', propertyId)
    .maybeSingle();

  return data?.door_code ? { doorCode: data.door_code } : null;
}

/** Server Action: solo devuelve wifi_name/wifi_password. Nunca door_code. */
export async function revealWifi(
  code: string
): Promise<{ wifiName: string; wifiPassword: string } | null> {
  const propertyId = await getValidPropertyId(code);
  if (!propertyId) return null;

  const supabase = createServiceClient();
  const { data } = await supabase
    .from('property_secrets')
    .select('wifi_name, wifi_password')
    .eq('property_id', propertyId)
    .maybeSingle();

  if (!data?.wifi_name || !data?.wifi_password) return null;

  return { wifiName: data.wifi_name, wifiPassword: data.wifi_password };
}
