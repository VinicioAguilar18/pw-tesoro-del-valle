import { Navigation, Map } from 'lucide-react';
import type { Property } from '@/lib/queries/landing';
import { pickLocale } from '@/lib/pick-locale';
import RevealOnScroll from '@/components/ui/RevealOnScroll';

export default function LocationSection({
  property,
  locale,
  title,
  subtitle,
  openWazeLabel,
  openGoogleMapsLabel,
}: {
  property: Property;
  locale: string;
  title: string;
  subtitle: string;
  openWazeLabel: string;
  openGoogleMapsLabel: string;
}) {
  const address = pickLocale(locale, property.address_es, property.address_en);
  // Coordenadas exactas del pin (no geolocalización por texto de dirección).
  const embedSrc = 'https://maps.google.com/maps?q=10.3333961,-84.5596783&z=16&output=embed';

  return (
    <section id="location" className="w-full bg-background px-4 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        <RevealOnScroll className="text-center">
          <h2 className="font-serif text-3xl font-bold text-primary md:text-4xl">{title}</h2>
          <p className="mt-2 font-sans text-text-secondary">{address || subtitle}</p>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1} className="mt-10">
          <div className="overflow-hidden rounded-2xl border border-primary/10 shadow-sm">
            <iframe
              title={title}
              src={embedSrc}
              className="h-80 w-full md:h-96"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row">
            {property.waze_url && (
              <a
                href={property.waze_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 font-semibold text-background shadow-md transition-all hover:scale-105 hover:bg-primary/90"
              >
                <Navigation className="h-4 w-4" />
                {openWazeLabel}
              </a>
            )}
            {property.gmaps_url && (
              <a
                href={property.gmaps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full border border-primary/20 px-6 py-3.5 font-semibold text-primary transition-all hover:bg-primary/5"
              >
                <Map className="h-4 w-4" />
                {openGoogleMapsLabel}
              </a>
            )}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
