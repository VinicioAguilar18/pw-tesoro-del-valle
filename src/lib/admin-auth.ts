// Helper de sesión para /admin. Se usa en el layout (gate de página) y de
// nuevo dentro de cada Server Action de escritura (no confiar solo en el
// gate de UI — ver server-actions.md de Next: "render-time gating is not
// a security boundary").
import { getLocale } from 'next-intl/server';
import { redirect } from '@/i18n/routing';
import { createClient } from '@/lib/supabase/server';

export async function requireAdminSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const locale = await getLocale();
    redirect({ href: '/admin/login', locale });
  }

  return { supabase, user: user! };
}
