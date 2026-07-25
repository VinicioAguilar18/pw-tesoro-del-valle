// Galería de fotos reales del alojamiento La Rana. Grid simple, sin lightbox
// ni animaciones — solo las fotos del bucket en una cuadrícula responsive.
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { getGalleryPhotos } from '@/lib/queries/gallery';

export default async function GaleriaPage() {
  const [t, photos] = await Promise.all([
    getTranslations('Places'),
    getGalleryPhotos('la-rana'),
  ]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <Link href="/" className="font-sans text-sm text-primary">
        {t('galleryBack')}
      </Link>

      <h1 className="mt-4 font-serif text-3xl font-bold text-primary">{t('galleryTitle')}</h1>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {photos.map((url) => (
          <div key={url} className="relative aspect-square overflow-hidden rounded-lg">
            <Image src={url} alt="" fill sizes="(max-width: 640px) 50vw, 33vw" className="object-cover" />
          </div>
        ))}
      </div>
    </main>
  );
}
