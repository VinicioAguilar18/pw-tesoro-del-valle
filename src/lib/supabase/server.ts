/**
 * src/lib/supabase/server.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Cliente Supabase para uso SERVER-SIDE:
 *   - Server Components
 *   - Server Actions
 *   - Route Handlers
 *
 * Usa cookies() de next/headers (async en Next.js 16).
 * Lee sesión del anfitrión autenticado para el panel /admin.
 *
 * Para acceso sin autenticación (Concierge Digital, scripts):
 * usar createServiceClient() que utiliza service_role y bypass RLS.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/** Cliente estándar (anon key + sesión de usuario autenticado) */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // setAll puede fallar en Server Components durante rendering.
            // Es seguro ignorar en ese contexto.
          }
        },
      },
    }
  );
}

/**
 * Cliente con service_role (bypass RLS).
 * SOLO para Server Actions/Route Handlers que requieran acceso completo
 * (e.g. leer property_secrets en /g/[code]).
 * ¡Nunca usar en Client Components!
 */
export function createServiceClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        // service_role no necesita sesión de cookies
        getAll: () => [],
        setAll: () => {},
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}
