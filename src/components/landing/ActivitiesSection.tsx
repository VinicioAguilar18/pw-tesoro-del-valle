import Image from 'next/image';
import { MapPin, Clock } from 'lucide-react';
import type { Recommendation } from '@/lib/queries/landing';
import { pickLocale } from '@/lib/pick-locale';
import RevealOnScroll from '@/components/ui/RevealOnScroll';

export default function ActivitiesSection({
  recommendations,
  locale,
  title,
  subtitle,
}: {
  recommendations: Recommendation[];
  locale: string;
  title: string;
  subtitle: string;
}) {
  if (recommendations.length === 0) return null;

  return (
    <section id="activities" className="w-full bg-white px-4 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <RevealOnScroll className="text-center">
          <h2 className="font-serif text-3xl font-bold text-primary md:text-4xl">{title}</h2>
          <p className="mt-2 font-sans text-text-secondary">{subtitle}</p>
        </RevealOnScroll>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          {recommendations.map((rec, i) => {
            const description = pickLocale(locale, rec.description_es, rec.description_en);

            return (
              <RevealOnScroll key={rec.id} delay={i * 0.1}>
                <div className="group relative flex h-72 flex-col justify-end overflow-hidden rounded-2xl border border-primary/10 shadow-sm">
                  {rec.photo_url ? (
                    <Image
                      src={rec.photo_url}
                      alt={rec.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  <div className="relative z-10 flex flex-col gap-2 p-6 text-white">
                    {(rec.duration_label || rec.distance_label) && (
                      <span className="flex w-fit items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                        {rec.duration_label ? (
                          <Clock className="h-3 w-3" />
                        ) : (
                          <MapPin className="h-3 w-3" />
                        )}
                        {rec.duration_label ?? rec.distance_label}
                      </span>
                    )}
                    <h3 className="font-serif text-xl font-bold">{rec.name}</h3>
                    {description && (
                      <p className="line-clamp-2 font-sans text-sm text-white/90">{description}</p>
                    )}
                  </div>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
