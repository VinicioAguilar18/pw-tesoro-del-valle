'use client';

import { useRouter } from '@/i18n/routing';
import { createClient } from '@/lib/supabase/client';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="mt-2 rounded-lg px-3 py-2 text-left font-sans text-sm font-medium text-accent hover:bg-background md:mt-auto"
    >
      Salir
    </button>
  );
}
