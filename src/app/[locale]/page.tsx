import { getTranslations, getLocale } from 'next-intl/server';
import { getProperty, getFeaturedRecommendations, getPublishedReviews } from '@/lib/queries/landing';
import { getPhotoUrl } from '@/lib/photos';
import Hero from '@/components/landing/Hero';
import Amenities from '@/components/landing/Amenities';
import ActivitiesSection from '@/components/landing/ActivitiesSection';
import LocationSection from '@/components/landing/LocationSection';
import FeaturedAccommodations from '@/components/landing/FeaturedAccommodations';

// Fotos de la galería para el hero (cuadrícula de 3 columnas, crossfade con el scroll).
const HERO_GALLERY_PHOTOS = [
  'la-rana/gallery/hero-vista-dron.webp',
  'la-rana/gallery/casa-01.webp',
  'la-rana/gallery/jacuzzi-01.webp',
  'la-rana/gallery/patio-01.webp',
  'la-rana/gallery/jacuzzi-02.webp',
  'la-rana/gallery/habitacion-01.webp',
  'la-rana/gallery/cocina-01.webp',
  'la-rana/gallery/jardin-piedra-01.webp',
  'la-rana/gallery/casa-02.webp',
  'la-rana/gallery/jacuzzi-03.webp',
  'la-rana/gallery/jacuzzi-04.webp',
].map(getPhotoUrl);

// Fotos por amenidad para el carrusel de "El espacio" (filename -> URL pública).
const AMENITIES_PHOTOS: Record<string, string> = Object.fromEntries(
  ['jacuzzi-01.webp', 'cocina-01.webp', 'patio-01.webp', 'sala-01.webp', 'casa-02.webp', 'jardin-piedra-01.webp'].map(
    (file) => [file, getPhotoUrl(`la-rana/gallery/${file}`)]
  )
);

export default async function Home() {
  const [t, navT, tActivities, tLocation, tFeatured, locale] = await Promise.all([
    getTranslations('Landing.hero'),
    getTranslations('Layout.nav'),
    getTranslations('Landing.activities'),
    getTranslations('Landing.location'),
    getTranslations('Landing.featured'),
    getLocale(),
  ]);

  const property = await getProperty('la-rana');

  if (!property) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <p className="font-sans text-text-secondary">Alojamiento no disponible.</p>
      </main>
    );
  }

  const [recommendations, reviews] = await Promise.all([
    getFeaturedRecommendations(property.id),
    getPublishedReviews(property.id),
  ]);

  const heroPhotoForCard = property.hero_photo_url ?? getPhotoUrl('la-rana/gallery/hero-vista-dron.webp');

  return (
    <main className="flex-1">
      <Hero
        photos={HERO_GALLERY_PHOTOS}
        title={t('welcome')}
        subtitle={t('subtitle')}
        tagline={t('tagline')}
        bookLabel={navT('book')}
        bookHref={property.airbnb_url ?? '#'}
      />
      <Amenities photos={AMENITIES_PHOTOS} />
      <LocationSection
        property={property}
        locale={locale}
        title={tLocation('title')}
        subtitle={tLocation('subtitle')}
        openWazeLabel={tLocation('openWaze')}
        openGoogleMapsLabel={tLocation('openGoogleMaps')}
      />
      <ActivitiesSection
        recommendations={recommendations}
        locale={locale}
        title={tActivities('title')}
        subtitle={tActivities('subtitle')}
      />
      <FeaturedAccommodations
        property={property}
        reviews={reviews}
        heroPhoto={heroPhotoForCard}
        locale={locale}
        title={tFeatured('title')}
        subtitle={tFeatured('subtitle')}
        reviewsCtaLabel={tFeatured('reviewsCta')}
        bookLabel={navT('book')}
      />
    </main>
  );
}
