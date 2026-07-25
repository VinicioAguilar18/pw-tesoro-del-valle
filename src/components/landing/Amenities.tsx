'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Waves, ChefHat, Sun, Wifi, Car, Trees } from 'lucide-react';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import { useAutoRotate } from '@/lib/use-auto-rotate';

const AMENITY_CARDS = [
  { key: 'jacuzzi', Icon: Waves, photo: 'jacuzzi-01.webp' },
  { key: 'kitchen', Icon: ChefHat, photo: 'cocina-01.webp' },
  { key: 'terrace', Icon: Sun, photo: 'patio-01.webp' },
  { key: 'wifi', Icon: Wifi, photo: 'sala-01.webp' },
  { key: 'parking', Icon: Car, photo: 'casa-02.webp' },
  { key: 'nature', Icon: Trees, photo: 'jardin-piedra-01.webp' },
] as const;

const SWIPE_THRESHOLD = 60;
// Debe coincidir con el breakpoint `md` de Tailwind (768px).
const DESKTOP_QUERY = '(min-width: 768px)';

/** 1 tarjeta visible en móvil, 3 en tablet/desktop — sigue el breakpoint `md`. */
function useCardsPerPage() {
  const [perPage, setPerPage] = useState(1);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const update = () => setPerPage(mq.matches ? 3 : 1);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return perPage;
}

export default function Amenities({ photos }: { photos: Record<string, string> }) {
  const t = useTranslations('Landing.space');
  const tAmenities = useTranslations('Landing.space.amenities');
  const reduceMotion = useReducedMotion();
  const perPage = useCardsPerPage();

  const pages = useMemo(() => {
    const result: (typeof AMENITY_CARDS[number])[][] = [];
    for (let i = 0; i < AMENITY_CARDS.length; i += perPage) {
      result.push(AMENITY_CARDS.slice(i, i + perPage));
    }
    return result;
  }, [perPage]);

  const { index, next, prev } = useAutoRotate(pages.length, 4500, {
    paused: !!reduceMotion,
    resumeDelayMs: 6000,
  });

  const currentPage = pages[index % pages.length] ?? [];

  return (
    <section id="accommodation" className="w-full bg-background px-4 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <RevealOnScroll className="text-center">
          <h2 className="font-serif text-3xl font-bold text-primary md:text-4xl">{t('title')}</h2>
          <p className="mt-2 font-sans text-text-secondary">{t('subtitle')}</p>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1} className="mt-14 flex items-center justify-center gap-4 md:gap-8">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/20 text-primary transition-colors hover:bg-primary/5"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="w-full max-w-xs overflow-hidden md:max-w-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                className="flex h-96 cursor-grab gap-4 active:cursor-grabbing"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -SWIPE_THRESHOLD) next();
                  else if (info.offset.x > SWIPE_THRESHOLD) prev();
                }}
              >
                {currentPage.map((card) => (
                  <div
                    key={card.key}
                    className="flex h-full flex-1 flex-col overflow-hidden rounded-2xl border border-primary/10 bg-white shadow-sm"
                  >
                    <div className="flex flex-col items-center gap-2 px-4 pb-4 pt-6">
                      <h3 className="font-serif text-lg font-bold text-primary">{tAmenities(card.key)}</h3>
                      <card.Icon className="h-6 w-6 text-secondary" />
                    </div>
                    <div className="relative w-full flex-1">
                      <Image
                        src={photos[card.photo]}
                        alt={tAmenities(card.key)}
                        fill
                        sizes="(max-width: 768px) 320px, 240px"
                        draggable={false}
                        className="object-cover"
                      />
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={next}
            aria-label="Next"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/20 text-primary transition-colors hover:bg-primary/5"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </RevealOnScroll>
      </div>
    </section>
  );
}
