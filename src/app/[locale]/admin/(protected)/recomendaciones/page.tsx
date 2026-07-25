// CRUD de recommendations: formulario de "nueva" arriba, luego un
// formulario de edición + botón borrar por cada fila existente.
import { requireAdminSession } from '@/lib/admin-auth';
import RecommendationFields from '@/components/admin/RecommendationFields';
import { createRecommendation, updateRecommendation, deleteRecommendation } from './actions';

const PROPERTY_ID = '00000000-0000-0000-0000-000000000001';

export default async function RecomendacionesPage() {
  const { supabase } = await requireAdminSession();

  const { data: items } = await supabase
    .from('recommendations')
    .select('*')
    .eq('property_id', PROPERTY_ID)
    .order('sort_order');

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-primary">Recomendaciones</h1>

      <form action={createRecommendation} className="mt-6 flex flex-col gap-3 rounded-lg border border-primary/10 p-4">
        <p className="font-sans text-sm font-semibold text-primary">Nueva recomendación</p>
        <RecommendationFields />
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
            <form action={updateRecommendation} className="flex flex-col gap-3">
              <input type="hidden" name="id" value={item.id} />
              <RecommendationFields defaults={item} />
              <button
                type="submit"
                className="w-fit rounded-lg bg-primary px-4 py-2 font-sans text-sm font-semibold text-background"
              >
                Guardar
              </button>
            </form>

            <form action={deleteRecommendation} className="mt-2">
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
