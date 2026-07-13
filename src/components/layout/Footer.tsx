import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('Layout.footer');
  const siteName = useTranslations('Layout')('siteName');

  return (
    <footer className="w-full border-t border-primary/10 bg-white py-8 px-4 mt-auto">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4 md:px-8">
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="text-lg font-serif font-bold text-primary">
            {siteName} <span className="text-sm">🐸</span>
          </span>
          <p className="text-sm text-text-secondary text-center md:text-left font-sans italic">
            &ldquo;{t('tagline')}&rdquo;
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-text-secondary">
          <a
            href={t('airbnbUrl')}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-accent hover:text-accent/80 transition-colors border-b border-accent/25 hover:border-accent"
          >
            {t('airbnbLabel')}
          </a>
          <span>&middot;</span>
          <p className="font-sans">
            &copy; {new Date().getFullYear()} {siteName}. {t('rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
