// Campos compartidos por el formulario de crear y de editar una
// recomendación — evita repetir el mismo bloque de inputs dos veces.
type RecommendationDefaults = {
  category?: string;
  name?: string;
  description_es?: string | null;
  description_en?: string | null;
  distance_label?: string | null;
  duration_label?: string | null;
  price_label?: string | null;
  maps_url?: string | null;
  photo_url?: string | null;
  sort_order?: number | null;
  is_featured?: boolean | null;
  is_published?: boolean | null;
};

export default function RecommendationFields({ defaults = {} }: { defaults?: RecommendationDefaults }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <Field label="Categoría" name="category" defaultValue={defaults.category} placeholder="restaurante / tour / actividad / servicio" />
      <Field label="Nombre" name="name" defaultValue={defaults.name} />
      <Field label="Descripción (ES)" name="description_es" defaultValue={defaults.description_es} />
      <Field label="Descripción (EN)" name="description_en" defaultValue={defaults.description_en} />
      <Field label="Distancia" name="distance_label" defaultValue={defaults.distance_label} />
      <Field label="Duración" name="duration_label" defaultValue={defaults.duration_label} />
      <Field label="Precio" name="price_label" defaultValue={defaults.price_label} />
      <Field label="URL de mapa / cómo llegar" name="maps_url" defaultValue={defaults.maps_url} />
      <Field label="URL de foto" name="photo_url" defaultValue={defaults.photo_url} />
      <Field label="Orden" name="sort_order" defaultValue={defaults.sort_order?.toString()} />

      <label className="flex items-center gap-2 font-sans text-sm text-text-secondary">
        <input type="checkbox" name="is_featured" defaultChecked={!!defaults.is_featured} />
        Destacada (aparece en la landing)
      </label>
      <label className="flex items-center gap-2 font-sans text-sm text-text-secondary">
        <input type="checkbox" name="is_published" defaultChecked={defaults.is_published ?? true} />
        Publicada
      </label>
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block font-sans text-sm font-semibold text-primary">{label}</label>
      <input
        name={name}
        defaultValue={defaultValue ?? ''}
        placeholder={placeholder}
        className="w-full rounded-lg border border-primary/20 px-3 py-2 font-sans text-sm"
      />
    </div>
  );
}
