// Campos compartidos por el formulario de crear/editar una reseña.
type ReviewDefaults = {
  author_name?: string;
  rating?: number | null;
  text_es?: string | null;
  text_en?: string | null;
  review_date?: string | null;
  review_url?: string | null;
  sort_order?: number | null;
  is_published?: boolean | null;
};

export default function ReviewFields({ defaults = {} }: { defaults?: ReviewDefaults }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <TextField label="Autor" name="author_name" defaultValue={defaults.author_name} />
      <TextField label="Calificación (1-5)" name="rating" defaultValue={defaults.rating?.toString()} />
      <TextField label="Fecha (YYYY-MM-DD)" name="review_date" defaultValue={defaults.review_date} />
      <TextField label="URL a la reseña en Airbnb" name="review_url" defaultValue={defaults.review_url} />
      <TextField label="Orden" name="sort_order" defaultValue={defaults.sort_order?.toString()} />

      <div className="sm:col-span-2">
        <label className="mb-1 block font-sans text-sm font-semibold text-primary">Texto (ES)</label>
        <textarea
          name="text_es"
          defaultValue={defaults.text_es ?? ''}
          rows={3}
          className="w-full rounded-lg border border-primary/20 px-3 py-2 font-sans text-sm"
        />
      </div>
      <div className="sm:col-span-2">
        <label className="mb-1 block font-sans text-sm font-semibold text-primary">Texto (EN)</label>
        <textarea
          name="text_en"
          defaultValue={defaults.text_en ?? ''}
          rows={3}
          className="w-full rounded-lg border border-primary/20 px-3 py-2 font-sans text-sm"
        />
      </div>

      <label className="flex items-center gap-2 font-sans text-sm text-text-secondary">
        <input type="checkbox" name="is_published" defaultChecked={defaults.is_published ?? true} />
        Publicada
      </label>
    </div>
  );
}

function TextField({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
}) {
  return (
    <div>
      <label className="mb-1 block font-sans text-sm font-semibold text-primary">{label}</label>
      <input
        name={name}
        defaultValue={defaultValue ?? ''}
        className="w-full rounded-lg border border-primary/20 px-3 py-2 font-sans text-sm"
      />
    </div>
  );
}
