// Navegación lateral simple del panel /admin. Enlaces planos, sin estado
// activo animado ni iconos decorativos — solo texto y links.
import { Link } from '@/i18n/routing';
import LogoutButton from './LogoutButton';

const LINKS = [
  { href: '/admin/alojamiento', label: 'Alojamiento' },
  { href: '/admin/guia', label: 'Guía' },
  { href: '/admin/recomendaciones', label: 'Recomendaciones' },
  { href: '/admin/resenas', label: 'Reseñas' },
  { href: '/admin/feedback', label: 'Feedback' },
] as const;

export default function AdminSidebar() {
  return (
    <nav className="flex shrink-0 flex-row flex-wrap gap-2 border-b border-primary/10 bg-white p-4 md:w-56 md:flex-col md:border-b-0 md:border-r">
      <p className="mb-2 hidden font-serif text-lg font-bold text-primary md:block">Admin</p>
      {LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="rounded-lg px-3 py-2 font-sans text-sm font-medium text-text-secondary hover:bg-background hover:text-primary"
        >
          {link.label}
        </Link>
      ))}
      <LogoutButton />
    </nav>
  );
}
