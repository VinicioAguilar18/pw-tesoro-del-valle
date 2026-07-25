import { Star } from 'lucide-react';
import type { Review } from '@/lib/queries/landing';
import { pickLocale } from '@/lib/pick-locale';

export default function ReviewCard({ review, locale }: { review: Review; locale: string }) {
  const text = pickLocale(locale, review.text_es, review.text_en);

  const content = (
    <>
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < review.rating ? 'fill-accent text-accent' : 'text-primary/15'}`}
          />
        ))}
      </div>
      <p className="mt-3 font-sans text-sm text-text-secondary">&ldquo;{text}&rdquo;</p>
      <p className="mt-4 font-serif text-sm font-bold text-primary">{review.author_name}</p>
    </>
  );

  const className =
    'flex h-full flex-col rounded-2xl border border-primary/10 bg-white p-6 shadow-sm';

  if (review.review_url) {
    return (
      <a
        href={review.review_url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${className} transition-shadow hover:shadow-md`}
      >
        {content}
      </a>
    );
  }

  return <div className={className}>{content}</div>;
}
