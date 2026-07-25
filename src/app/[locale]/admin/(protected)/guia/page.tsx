// Editar las tarjetas del Concierge (guide_sections). Solo edición — las
// secciones (entrada, wifi, jacuzzi...) son fijas, no se crean ni borran.
import { requireAdminSession } from '@/lib/admin-auth';
import { updateGuideSection } from './actions';

const PROPERTY_ID = '00000000-0000-0000-0000-000000000001';

export default async function GuiaPage() {
  const { supabase } = await requireAdminSession();

  const { data: sections } = await supabase
    .from('guide_sections')
    .select('*')
    .eq('property_id', PROPERTY_ID)
    .order('sort_order');

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-primary">Guía del Concierge</h1>

      <div className="mt-6 flex flex-col gap-6">
        {(sections ?? []).map((section) => (
          <form
            key={section.id}
            action={updateGuideSection}
            className="flex flex-col gap-3 rounded-lg border border-primary/10 p-4"
          >
            <input type="hidden" name="id" value={section.id} />
            <p className="font-sans text-xs font-semibold uppercase text-text-secondary">{section.slug}</p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block font-sans text-sm font-semibold text-primary">Título (ES)</label>
                <input
                  name="title_es"
                  defaultValue={section.title_es}
                  className="w-full rounded-lg border border-primary/20 px-3 py-2 font-sans text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block font-sans text-sm font-semibold text-primary">Título (EN)</label>
                <input
                  name="title_en"
                  defaultValue={section.title_en}
                  className="w-full rounded-lg border border-primary/20 px-3 py-2 font-sans text-sm"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block font-sans text-sm font-semibold text-primary">
                Contenido (ES, markdown)
              </label>
              <textarea
                name="content_es"
                defaultValue={section.content_es ?? ''}
                rows={4}
                className="w-full rounded-lg border border-primary/20 px-3 py-2 font-sans text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block font-sans text-sm font-semibold text-primary">
                Contenido (EN, markdown)
              </label>
              <textarea
                name="content_en"
                defaultValue={section.content_en ?? ''}
                rows={4}
                className="w-full rounded-lg border border-primary/20 px-3 py-2 font-sans text-sm"
              />
            </div>

            <label className="flex items-center gap-2 font-sans text-sm text-text-secondary">
              <input type="checkbox" name="is_published" defaultChecked={section.is_published} />
              Publicada
            </label>

            <button
              type="submit"
              className="w-fit rounded-lg bg-primary px-4 py-2 font-sans text-sm font-semibold text-background"
            >
              Guardar
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}
