'use client';

import { useState } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import {
  ChevronRight,
  Waves,
  ChefHat,
  BookOpen,
  CircleHelp,
  LogOut,
  Phone,
  X,
  type LucideIcon,
} from 'lucide-react';
import type { GuideSection } from '@/lib/queries/concierge';
import { pickLocale } from '@/lib/pick-locale';
import { getPhotoUrl } from '@/lib/photos';

const ICONS: Record<string, LucideIcon> = {
  Waves,
  ChefHat,
  BookOpen,
  CircleHelp,
  LogOut,
  Phone,
};

// Foto real opcional por sección — se agrega según haya material disponible.
const SECTION_PHOTOS: Record<string, string> = {
  cocina: getPhotoUrl('la-rana/gallery/cocina-01.webp'),
};

export default function SectionGrid({
  sections,
  locale,
  closeLabel,
}: {
  sections: GuideSection[];
  locale: string;
  closeLabel: string;
}) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const openSection = sections.find((s) => s.slug === openSlug) ?? null;

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        {sections.map((section) => {
          const Icon = (section.icon && ICONS[section.icon]) || CircleHelp;
          const title = pickLocale(locale, section.title_es, section.title_en);

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => setOpenSlug(section.slug)}
              className="flex items-center justify-between gap-2 rounded-2xl border border-primary/10 bg-white p-4 text-left shadow-sm transition-colors hover:bg-background"
            >
              <span className="flex items-center gap-3">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: section.icon_color ?? '#DBEAFE' }}
                >
                  <Icon className="h-5 w-5 text-primary" />
                </span>
                <span className="font-sans font-semibold text-primary">{title}</span>
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-text-secondary" />
            </button>
          );
        })}
      </div>

      {openSection && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpenSlug(null)}
        >
          <div
            className="max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-serif text-xl font-bold text-primary">
                {pickLocale(locale, openSection.title_es, openSection.title_en)}
              </h3>
              <button
                type="button"
                onClick={() => setOpenSlug(null)}
                aria-label={closeLabel}
                className="rounded-full p-1.5 text-text-secondary transition-colors hover:bg-background"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {SECTION_PHOTOS[openSection.slug] && (
              <div className="relative mb-4 h-48 w-full overflow-hidden rounded-xl">
                <Image
                  src={SECTION_PHOTOS[openSection.slug]}
                  alt={pickLocale(locale, openSection.title_es, openSection.title_en)}
                  fill
                  sizes="512px"
                  className="object-cover"
                />
              </div>
            )}

            <div className="flex flex-col gap-3 font-sans text-base leading-relaxed text-text-secondary [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5">
              <ReactMarkdown
                components={{
                  h2: ({ ...props }) => (
                    <h4 className="font-serif text-lg font-bold text-primary" {...props} />
                  ),
                  h3: ({ ...props }) => (
                    <h5 className="font-serif text-base font-bold text-primary" {...props} />
                  ),
                  p: ({ ...props }) => <p className="leading-relaxed" {...props} />,
                  strong: ({ ...props }) => <strong className="text-primary" {...props} />,
                  blockquote: ({ ...props }) => (
                    <blockquote
                      className="border-l-2 border-accent/40 pl-3 italic text-text-secondary"
                      {...props}
                    />
                  ),
                  a: ({ ...props }) => (
                    <a
                      className="font-semibold text-accent underline decoration-accent/40 underline-offset-2"
                      target="_blank"
                      rel="noopener noreferrer"
                      {...props}
                    />
                  ),
                }}
              >
                {pickLocale(locale, openSection.content_es, openSection.content_en)}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
