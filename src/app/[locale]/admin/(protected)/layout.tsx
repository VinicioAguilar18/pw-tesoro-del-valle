// Layout de todas las páginas /admin excepto /admin/login. Verifica sesión
// (redirige a login si no hay) y muestra la navegación lateral. Sin
// animaciones — es una herramienta de trabajo, no la landing pública.
import { requireAdminSession } from '@/lib/admin-auth';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  await requireAdminSession();

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AdminSidebar />
      <main className="flex-1 px-4 py-8 md:px-8">{children}</main>
    </div>
  );
}
