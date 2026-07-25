// Directorio público de recomendaciones (restaurantes, tours, servicios).
// Lista simple agrupada por categoría; cada tarjeta linkea a /lugares/[slug].
import { getTranslations, getLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { getAllPlaces } from '@/lib/queries/places';
import { pickLocale } from '@/lib/pick-locale';
import { slugify } from '@/lib/slugify';

const CATEGORY_TO_GROUP: Record<string, 'food' | 'tours' | 'services'> = {
  restaurante: 'food',
  soda: 'food',
  chino: 'food',
  tour: 'tours',
  actividad: 'tours',
  servicio: 'services',
};

export default async function ServiciosPage() {
  const [locale, t, tGroups, places] = await Promise.all([
    getLocale(),
    getTranslations('Places'),
    getTranslations('Concierge.recommendations.groups'),
    getAllPlaces(),
  ]);

  const groupLabels = {
    food: tGroups('food'),
    tours: tGroups('tours'),
    services: tGroups('services'),
  };

  const groups: { key: 'food' | 'tours' | 'services'; items: typeof places }[] = (
    ['tours', 'food', 'services'] as const
  )
    .map((key) => ({
      key,
      items: places.filter((p) => (CATEGORY_TO_GROUP[p.category] ?? 'services') === key),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-serif text-3xl font-bold text-primary">{t('servicesTitle')}</h1>
      <p className="mt-1 font-sans text-text-secondary">{t('servicesSubtitle')}</p>

      {groups.map(({ key, items }) => (
        <section key={key} className="mt-8">
          <h2 className="font-serif text-xl font-bold text-primary">{groupLabels[key]}</h2>
          <ul className="mt-3 flex flex-col gap-2">
            {items.map((place) => (
              <li key={place.id} className="rounded-lg border border-primary/10 p-4">
                <Link href={`/lugares/${slugify(place.name)}`} className="font-sans font-semibold text-primary">
                  {place.name}
                </Link>
                {pickLocale(locale, place.description_es, place.description_en) && (
                  <p className="mt-1 font-sans text-sm text-text-secondary">
                    {pickLocale(locale, place.description_es, place.description_en)}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
