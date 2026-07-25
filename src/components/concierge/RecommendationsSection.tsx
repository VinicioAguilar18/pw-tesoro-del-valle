import { MapPin, Clock, Utensils, Compass, Fuel, type LucideIcon } from 'lucide-react';
import type { ConciergeRecommendation } from '@/lib/queries/concierge';
import { pickLocale } from '@/lib/pick-locale';

type GroupKey = 'food' | 'tours' | 'services';

const CATEGORY_TO_GROUP: Record<string, GroupKey> = {
  restaurante: 'food',
  soda: 'food',
  chino: 'food',
  tour: 'tours',
  actividad: 'tours',
  servicio: 'services',
};

const GROUP_ICON: Record<GroupKey, LucideIcon> = {
  food: Utensils,
  tours: Compass,
  services: Fuel,
};

const GROUP_COLOR: Record<GroupKey, string> = {
  food: '#FCE7F3',
  tours: '#DBEAFE',
  services: '#FDE68A',
};

const GROUP_ORDER: GroupKey[] = ['tours', 'food', 'services'];

export default function RecommendationsSection({
  recommendations,
  locale,
  title,
  subtitle,
  howToGetThereLabel,
  groupLabels,
}: {
  recommendations: ConciergeRecommendation[];
  locale: string;
  title: string;
  subtitle: string;
  howToGetThereLabel: string;
  groupLabels: Record<GroupKey, string>;
}) {
  if (recommendations.length === 0) return null;

  const groups = GROUP_ORDER.map((key) => ({
    key,
    items: recommendations.filter((rec) => (CATEGORY_TO_GROUP[rec.category] ?? 'services') === key),
  })).filter((g) => g.items.length > 0);

  return (
    <section className="w-full px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <h2 className="font-serif text-2xl font-bold text-primary">{title}</h2>
          <p className="mt-1 font-sans text-sm text-text-secondary">{subtitle}</p>
        </div>

        <div className="flex flex-col gap-10">
          {groups.map(({ key, items }) => {
            const GroupIcon = GROUP_ICON[key];

            return (
              <div key={key}>
                <div className="mb-4 flex flex-col items-center gap-2 text-center">
                  <h3 className="font-serif text-lg font-bold text-primary">{groupLabels[key]}</h3>
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-full"
                    style={{ backgroundColor: GROUP_COLOR[key] }}
                  >
                    <GroupIcon className="h-5 w-5 text-primary" />
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {items.map((rec) => {
                    const description = pickLocale(locale, rec.description_es, rec.description_en);

                    return (
                      <div
                        key={rec.id}
                        className="flex flex-col gap-2 rounded-2xl border border-primary/10 bg-white p-5 shadow-sm"
                      >
                        <h4 className="font-serif text-lg font-bold text-primary">{rec.name}</h4>
                        {description && (
                          <p className="font-sans text-sm text-text-secondary">{description}</p>
                        )}

                        {(rec.distance_label || rec.duration_label || rec.price_label) && (
                          <div className="flex flex-wrap gap-3 pt-1 font-sans text-xs text-text-secondary">
                            {rec.distance_label && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />
                                {rec.distance_label}
                              </span>
                            )}
                            {rec.duration_label && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {rec.duration_label}
                              </span>
                            )}
                            {rec.price_label && <span>{rec.price_label}</span>}
                          </div>
                        )}

                        {rec.maps_url && (
                          <a
                            href={rec.maps_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 w-fit rounded-full border border-primary/20 px-4 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/5"
                          >
                            {howToGetThereLabel}
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
