/**
 * src/lib/supabase/client.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Cliente Supabase para uso BROWSER (Client Components).
 *
 * Usa la anon key pública — nunca contiene datos sensibles.
 * Solo sirve para: auth del anfitrión en /admin, inserción de feedback.
 * Los datos del Concierge siempre se sirven server-side.
 * ─────────────────────────────────────────────────────────────────────────────
 */
'use client';

import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
