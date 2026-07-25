// Página de detalle de un lugar (restaurante/tour/actividad). Slug derivado
// del nombre porque `recommendations` no tiene columna slug. Sin animaciones,
// layout simple: foto, categoría, descripción, datos, botón "Cómo llegar".
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations, getLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { getPlaceBySlug } from '@/lib/queries/places';
import { pickLocale } from '@/lib/pick-locale';

export default async function PlacePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const place = await getPlaceBySlug(slug);
  if (!place) notFound();

  const [locale, t] = await Promise.all([getLocale(), getTranslations('Places')]);
  const description = pickLocale(locale, place.description_es, place.description_en);

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <Link href="/servicios" className="font-sans text-sm text-primary">
        {t('backToServices')}
      </Link>

      {place.photo_url && (
        <div className="relative mt-4 h-64 w-full overflow-hidden rounded-lg">
          <Image src={place.photo_url} alt={place.name} fill sizes="672px" className="object-cover" />
        </div>
      )}

      <span className="mt-4 inline-block rounded-full bg-secondary/15 px-3 py-1 font-sans text-xs font-semibold uppercase text-primary">
        {place.category}
      </span>

      <h1 className="mt-2 font-serif text-3xl font-bold text-primary">{place.name}</h1>

      {description && <p className="mt-4 font-sans text-base text-text-secondary">{description}</p>}

      <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1 font-sans text-sm text-text-secondary">
        {place.distance_label && (
          <div>
            <dt className="inline font-semibold">Distancia: </dt>
            <dd className="inline">{place.distance_label}</dd>
          </div>
        )}
        {place.duration_label && (
          <div>
            <dt className="inline font-semibold">Duración: </dt>
            <dd className="inline">{place.duration_label}</dd>
          </div>
        )}
        {place.price_label && (
          <div>
            <dt className="inline font-semibold">Precio: </dt>
            <dd className="inline">{place.price_label}</dd>
          </div>
        )}
      </dl>

      {place.maps_url && (
        <a
          href={place.maps_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block rounded-full border border-primary/20 px-5 py-2.5 font-sans text-sm font-semibold text-primary"
        >
          {t('howToGetThere')}
        </a>
      )}
    </main>
  );
}
