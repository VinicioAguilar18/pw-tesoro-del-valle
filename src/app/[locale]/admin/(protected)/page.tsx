// Página raíz de /admin: solo enlaces a las secciones. Sin dashboard con
// métricas por ahora (fuera de alcance de la Fase 7).
import { Link } from '@/i18n/routing';

export default function AdminHomePage() {
  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-primary">Panel de administración</h1>
      <p className="mt-2 font-sans text-text-secondary">
        Elige una sección en el menú para empezar.
      </p>
      <ul className="mt-6 flex flex-col gap-2">
        <li>
          <Link href="/admin/alojamiento" className="font-sans text-primary underline">
            Alojamiento
          </Link>
        </li>
        <li>
          <Link href="/admin/guia" className="font-sans text-primary underline">
            Guía
          </Link>
        </li>
        <li>
          <Link href="/admin/recomendaciones" className="font-sans text-primary underline">
            Recomendaciones
          </Link>
        </li>
        <li>
          <Link href="/admin/resenas" className="font-sans text-primary underline">
            Reseñas
          </Link>
        </li>
        <li>
          <Link href="/admin/feedback" className="font-sans text-primary underline">
            Feedback
          </Link>
        </li>
      </ul>
    </div>
  );
}
