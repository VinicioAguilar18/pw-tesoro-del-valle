// Listado de respuestas de feedback — solo lectura, más reciente primero.
import { requireAdminSession } from '@/lib/admin-auth';

const PROPERTY_ID = '00000000-0000-0000-0000-000000000001';

export default async function FeedbackPage() {
  const { supabase } = await requireAdminSession();

  const { data: items } = await supabase
    .from('feedback')
    .select('*')
    .eq('property_id', PROPERTY_ID)
    .order('created_at', { ascending: false });

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-primary">Feedback de huéspedes</h1>

      {(items ?? []).length === 0 && (
        <p className="mt-4 font-sans text-text-secondary">Aún no hay respuestas.</p>
      )}

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse font-sans text-sm">
          <thead>
            <tr className="border-b border-primary/10 text-left text-text-secondary">
              <th className="py-2 pr-4">Fecha</th>
              <th className="py-2 pr-4">Nombre</th>
              <th className="py-2 pr-4">★</th>
              <th className="py-2 pr-4">Disfrutó</th>
              <th className="py-2 pr-4">Mejorar</th>
              <th className="py-2 pr-4">Guía clara</th>
              <th className="py-2 pr-4">Volvería</th>
            </tr>
          </thead>
          <tbody>
            {(items ?? []).map((row) => (
              <tr key={row.id} className="border-b border-primary/5 align-top">
                <td className="py-2 pr-4 whitespace-nowrap">
                  {new Date(row.created_at).toLocaleDateString()}
                </td>
                <td className="py-2 pr-4">{row.guest_name ?? '—'}</td>
                <td className="py-2 pr-4">{row.rating}</td>
                <td className="py-2 pr-4">{row.liked_most ?? '—'}</td>
                <td className="py-2 pr-4">{row.to_improve ?? '—'}</td>
                <td className="py-2 pr-4">{row.guide_clarity}</td>
                <td className="py-2 pr-4">{row.would_return}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
