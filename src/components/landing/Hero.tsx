'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

/** Avanza el índice cada `intervalMs`. Se congela en el índice inicial si `paused`. */
function useIntervalPhotoIndex(count: number, intervalMs: number, startAt: number, paused: boolean) {
  const [index, setIndex] = useState(startAt % Math.max(count, 1));

  useEffect(() => {
    if (paused || count <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), intervalMs);
    return () => clearInterval(id);
  }, [count, intervalMs, paused]);

  return index;
}

function PhotoSlot({
  photos,
  index,
  alt,
  priority,
}: {
  photos: string[];
  index: number;
  alt: string;
  priority?: boolean;
}) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <AnimatePresence mode="sync">
        <motion.div
          key={photos[index]}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
        >
          <Image
            src={photos[index]}
            alt={alt}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/** Cuadrícula de 3 columnas que rota de foto por columna cada pocos segundos. */
function PhotoGrid({ photos, paused }: { photos: string[]; paused: boolean }) {
  const slots = [photos.slice(0, 4), photos.slice(4, 8), photos.slice(8, 11)];

  // Offsets e intervalos ligeramente distintos por columna para que no roten en sincronía.
  const slot0Index = useIntervalPhotoIndex(slots[0].length, 5000, 0, paused);
  const slot1Index = useIntervalPhotoIndex(slots[1].length, 4500, 1, paused);
  const slot2Index = useIntervalPhotoIndex(slots[2].length, 5500, 2, paused);
  const slotIndexes = [slot0Index, slot1Index, slot2Index];

  // priority solo debe marcar la imagen del primer pintado (candidata a LCP),
  // no cada foto que rota después — por eso se apaga tras el primer render.
  const [isInitialPaint, setIsInitialPaint] = useState(true);
  useEffect(() => {
    const id = requestAnimationFrame(() => setIsInitialPaint(false));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="grid h-full grid-cols-1 md:grid-cols-3">
      {slots.map((slotPhotos, i) => (
        <PhotoSlot
          key={i}
          photos={slotPhotos}
          index={slotIndexes[i]}
          alt="Alojamiento La Rana, Tesoro del Valle"
          priority={i === 0 && isInitialPaint}
        />
      ))}
    </div>
  );
}

export default function Hero({
  photos,
  title,
  subtitle,
  tagline,
  bookLabel,
  bookHref,
}: {
  photos: string[];
  title: string;
  subtitle: string;
  tagline: string;
  bookLabel: string;
  bookHref: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <section id="home" className="relative h-screen">
      <div className="absolute inset-0">
        <PhotoGrid photos={photos} paused={!!reduceMotion} />
      </div>

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 bg-black/35 px-4 text-center">
        <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-semibold uppercase tracking-widest text-white backdrop-blur-sm">
          Valle Azul &middot; San Carlos &middot; Costa Rica
        </span>
        <h1 className="max-w-2xl font-serif text-4xl font-bold leading-tight text-white md:text-6xl">
          {title}
        </h1>
        <p className="max-w-xl font-sans text-lg text-white/90 md:text-xl">{subtitle}</p>
        <p className="max-w-2xl px-4 font-serif text-xl italic text-white/90 md:text-2xl">
          &ldquo;{tagline}&rdquo;
        </p>
        <a
          href={bookHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 rounded-full bg-accent px-8 py-3.5 font-semibold text-white shadow-md transition-all hover:scale-105 hover:bg-accent/90"
        >
          {bookLabel}
        </a>
      </div>
    </section>
  );
}
