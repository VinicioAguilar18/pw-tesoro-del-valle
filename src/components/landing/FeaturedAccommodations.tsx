import Image from 'next/image';
import type { Property, Review } from '@/lib/queries/landing';
import { pickLocale } from '@/lib/pick-locale';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import ReviewCard from './ReviewCard';

export default function FeaturedAccommodations({
  property,
  reviews,
  heroPhoto,
  locale,
  title,
  subtitle,
  reviewsCtaLabel,
  bookLabel,
}: {
  property: Property;
  reviews: Review[];
  heroPhoto: string;
  locale: string;
  title: string;
  subtitle: string;
  reviewsCtaLabel: string;
  bookLabel: string;
}) {
  const tagline = pickLocale(locale, property.tagline_es, property.tagline_en);

  return (
    <section className="w-full bg-white px-4 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <RevealOnScroll className="text-center">
          <h2 className="font-serif text-3xl font-bold text-primary md:text-4xl">{title}</h2>
          <p className="mt-2 font-sans text-text-secondary">{subtitle}</p>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1} className="mt-14">
          <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-primary/10 shadow-sm md:grid-cols-2">
            <div className="relative h-64 md:h-full">
              <Image
                src={heroPhoto}
                alt={property.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center gap-4 p-8 md:p-10">
              <h3 className="font-serif text-2xl font-bold text-primary">
                {property.name} <span className="text-lg">🐸</span>
              </h3>
              {tagline && (
                <p className="font-serif text-lg italic text-text-secondary">&ldquo;{tagline}&rdquo;</p>
              )}
              {property.airbnb_url && (
                <a
                  href={property.airbnb_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 w-fit rounded-full bg-accent px-6 py-3 font-semibold text-white shadow-md transition-all hover:scale-105 hover:bg-accent/90"
                >
                  {bookLabel}
                </a>
              )}
            </div>
          </div>
        </RevealOnScroll>

        {reviews.length > 0 && (
          <div className="mt-10">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {reviews.map((review, i) => (
                <RevealOnScroll key={review.id} delay={i * 0.1}>
                  <ReviewCard review={review} locale={locale} />
                </RevealOnScroll>
              ))}
            </div>

            {property.airbnb_url && (
              <div className="mt-8 text-center">
                <a
                  href={`${property.airbnb_url}/reviews`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:text-accent/80"
                >
                  {reviewsCtaLabel}
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
