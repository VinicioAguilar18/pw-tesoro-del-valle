import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Frown } from 'lucide-react';

export default async function ConciergeNotFound() {
  const t = await getTranslations('Concierge.notFound');

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <Frown className="h-10 w-10 text-primary/40" />
      <h1 className="font-serif text-2xl font-bold text-primary">{t('title')}</h1>
      <p className="max-w-sm font-sans text-text-secondary">{t('message')}</p>
      <Link
        href="/"
        className="mt-4 rounded-full bg-primary px-6 py-3 font-sans font-semibold text-background transition-colors hover:bg-primary/90"
      >
        {t('backHome')}
      </Link>
    </main>
  );
}
