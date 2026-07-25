// Editar el alojamiento: datos generales de `properties` + secretos de
// `property_secrets` en un solo formulario. Solo hay una propiedad hoy
// (La Rana), por eso no hay selector.
import { requireAdminSession } from '@/lib/admin-auth';
import { updateProperty } from './actions';

const PROPERTY_ID = '00000000-0000-0000-0000-000000000001';

export default async function AlojamientoPage() {
  const { supabase } = await requireAdminSession();

  const [{ data: property }, { data: secrets }] = await Promise.all([
    supabase.from('properties').select('*').eq('id', PROPERTY_ID).maybeSingle(),
    supabase.from('property_secrets').select('*').eq('property_id', PROPERTY_ID).maybeSingle(),
  ]);

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-primary">Alojamiento — {property?.name}</h1>

      <form action={updateProperty} className="mt-6 flex max-w-md flex-col gap-4">
        <Field label="Código de acceso (/g/[code])" name="access_code" defaultValue={property?.access_code} />
        <Field label="Check-in" name="checkin_time" defaultValue={property?.checkin_time} />
        <Field label="Check-out" name="checkout_time" defaultValue={property?.checkout_time} />
        <Field label="Teléfono del anfitrión" name="host_phone" defaultValue={property?.host_phone} />
        <Field label="Email del anfitrión (para notificaciones)" name="host_email" defaultValue={property?.host_email} />

        <hr className="border-primary/10" />
        <p className="font-sans text-sm font-semibold text-primary">Claves (solo visibles aquí)</p>
        <Field label="Código de la puerta" name="door_code" defaultValue={secrets?.door_code} />
        <Field label="Nombre de la red WiFi" name="wifi_name" defaultValue={secrets?.wifi_name} />
        <Field label="Contraseña del WiFi" name="wifi_password" defaultValue={secrets?.wifi_password} />

        <button
          type="submit"
          className="mt-2 w-fit rounded-lg bg-primary px-4 py-2 font-sans font-semibold text-background"
        >
          Guardar
        </button>
      </form>
    </div>
  );
}

function Field({
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
      <label htmlFor={name} className="mb-1 block font-sans text-sm font-semibold text-primary">
        {label}
      </label>
      <input
        id={name}
        name={name}
        defaultValue={defaultValue ?? ''}
        className="w-full rounded-lg border border-primary/20 px-3 py-2 font-sans text-sm"
      />
    </div>
  );
}
