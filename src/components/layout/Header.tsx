'use client';

import { useState } from 'react';
import { usePathname, useRouter } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { Menu, X, Globe } from 'lucide-react';

export default function Header() {
  const t = useTranslations('Layout.nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLanguageChange = (newLocale: 'es' | 'en') => {
    router.replace(pathname, { locale: newLocale });
    setIsMenuOpen(false);
  };

  const navItems = [
    { label: t('home'), href: '#home' },
    { label: t('accommodation'), href: '#accommodation' },
    { label: t('zone'), href: '#zone' },
    { label: t('location'), href: '#location' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-4 md:px-8">
        {/* Logo / Brand Name */}
        <div className="flex items-center gap-2">
          <span className="text-xl md:text-2xl font-serif font-bold text-primary tracking-wide">
            Tesoro del Valle <span className="text-sm align-middle">🐸</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-text-secondary hover:text-primary transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Language selector and CTAs (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-1 border border-primary/20 rounded-full p-1 bg-white">
            <button
              onClick={() => handleLanguageChange('es')}
              className={`px-3 py-1 text-xs font-semibold rounded-full cursor-pointer transition-colors ${
                locale === 'es'
                  ? 'bg-primary text-background'
                  : 'text-text-secondary hover:text-primary'
              }`}
            >
              ES
            </button>
            <button
              onClick={() => handleLanguageChange('en')}
              className={`px-3 py-1 text-xs font-semibold rounded-full cursor-pointer transition-colors ${
                locale === 'en'
                  ? 'bg-primary text-background'
                  : 'text-text-secondary hover:text-primary'
              }`}
            >
              EN
            </button>
          </div>
          <a
            href="https://airbnb.com/h/luxuryrainforestretreat"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accent/90 transition-colors"
          >
            {t('book')}
          </a>
        </div>

        {/* Hamburger Menu Icon (Mobile) */}
        <div className="flex md:hidden items-center gap-3">
          {/* Quick Language Toggle */}
          <button
            onClick={() => handleLanguageChange(locale === 'es' ? 'en' : 'es')}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold border border-primary/20 rounded-full text-primary bg-white cursor-pointer"
          >
            <Globe className="h-3 w-3" />
            {locale.toUpperCase()}
          </button>
          <button
            onClick={toggleMenu}
            className="text-primary hover:text-secondary focus:outline-none cursor-pointer"
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-primary/10 bg-background py-4 px-6 shadow-lg">
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-base font-medium text-text-secondary hover:text-primary transition-colors py-2 border-b border-primary/5"
              >
                {item.label}
              </a>
            ))}
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-text-secondary">{locale === 'es' ? 'Idioma' : 'Language'}</span>
              <div className="flex items-center gap-1 border border-primary/20 rounded-full p-1 bg-white">
                <button
                  onClick={() => handleLanguageChange('es')}
                  className={`px-3 py-1 text-xs font-semibold rounded-full cursor-pointer transition-colors ${
                    locale === 'es' ? 'bg-primary text-background' : 'text-text-secondary'
                  }`}
                >
                  ES
                </button>
                <button
                  onClick={() => handleLanguageChange('en')}
                  className={`px-3 py-1 text-xs font-semibold rounded-full cursor-pointer transition-colors ${
                    locale === 'en' ? 'bg-primary text-background' : 'text-text-secondary'
                  }`}
                >
                  EN
                </button>
              </div>
            </div>
            <a
              href="https://airbnb.com/h/luxuryrainforestretreat"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block text-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-accent/90 transition-colors"
            >
              {t('book')}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
