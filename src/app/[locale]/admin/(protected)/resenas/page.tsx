// CRUD de reviews — para pegar aquí las reseñas reales copiadas de Airbnb
// y reemplazar los placeholders de la semilla.
import { requireAdminSession } from '@/lib/admin-auth';
import ReviewFields from '@/components/admin/ReviewFields';
import { createReview, updateReview, deleteReview } from './actions';

const PROPERTY_ID = '00000000-0000-0000-0000-000000000001';

export default async function ResenasPage() {
  const { supabase } = await requireAdminSession();

  const { data: items } = await supabase
    .from('reviews')
    .select('*')
    .eq('property_id', PROPERTY_ID)
    .order('sort_order');

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-primary">Reseñas</h1>

      <form action={createReview} className="mt-6 flex flex-col gap-3 rounded-lg border border-primary/10 p-4">
        <p className="font-sans text-sm font-semibold text-primary">Nueva reseña</p>
        <ReviewFields />
        <button
          type="submit"
          className="w-fit rounded-lg bg-primary px-4 py-2 font-sans text-sm font-semibold text-background"
        >
          Crear
        </button>
      </form>

      <div className="mt-8 flex flex-col gap-6">
        {(items ?? []).map((item) => (
          <div key={item.id} className="rounded-lg border border-primary/10 p-4">
            <form action={updateReview} className="flex flex-col gap-3">
              <input type="hidden" name="id" value={item.id} />
              <ReviewFields defaults={item} />
              <button
                type="submit"
                className="w-fit rounded-lg bg-primary px-4 py-2 font-sans text-sm font-semibold text-background"
              >
                Guardar
              </button>
            </form>

            <form action={deleteReview} className="mt-2">
              <input type="hidden" name="id" value={item.id} />
              <button type="submit" className="font-sans text-sm text-accent">
                Eliminar
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
