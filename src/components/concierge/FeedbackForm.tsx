'use client';

import { useActionState, useState } from 'react';
import { Star } from 'lucide-react';
import { submitFeedback, type FeedbackState } from '@/lib/actions/feedback';

const initialState: FeedbackState = { status: 'idle' };

export default function FeedbackForm({
  code,
  copy,
}: {
  code: string;
  copy: {
    title: string;
    subtitle: string;
    rating: string;
    likedMost: string;
    toImprove: string;
    guideClarity: string;
    wouldReturn: string;
    optionYes: string;
    optionSomewhat: string;
    optionNo: string;
    optionMaybe: string;
    name: string;
    submit: string;
    submitting: string;
    successTitle: string;
    successMessage: string;
    error: string;
  };
}) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [state, formAction, isPending] = useActionState(
    async (_prev: FeedbackState, formData: FormData) => submitFeedback(code, formData),
    initialState
  );

  if (state.status === 'success') {
    return (
      <section className="w-full px-4 py-16">
        <div className="mx-auto max-w-md rounded-2xl border border-primary/10 bg-white p-8 text-center shadow-sm">
          <h2 className="font-serif text-xl font-bold text-primary">{copy.successTitle}</h2>
          <p className="mt-2 font-sans text-sm text-text-secondary">{copy.successMessage}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full px-4 py-16">
      <div className="mx-auto max-w-md">
        <div className="mb-6 text-center">
          <h2 className="font-serif text-2xl font-bold text-primary">{copy.title}</h2>
          <p className="mt-1 font-sans text-sm text-text-secondary">{copy.subtitle}</p>
        </div>

        <form action={formAction} className="flex flex-col gap-5 rounded-2xl border border-primary/10 bg-white p-6 shadow-sm">
          <div>
            <label className="mb-2 block font-sans text-sm font-semibold text-primary">
              {copy.rating}
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHoverRating(n)}
                  onMouseLeave={() => setHoverRating(0)}
                  aria-label={`${n}`}
                >
                  <Star
                    className={`h-8 w-8 ${
                      n <= (hoverRating || rating) ? 'fill-accent text-accent' : 'text-primary/15'
                    }`}
                  />
                </button>
              ))}
            </div>
            <input type="hidden" name="rating" value={rating} required />
          </div>

          <div>
            <label htmlFor="likedMost" className="mb-1 block font-sans text-sm font-semibold text-primary">
              {copy.likedMost}
            </label>
            <textarea
              id="likedMost"
              name="likedMost"
              rows={2}
              className="w-full rounded-xl border border-primary/15 px-3 py-2 font-sans text-sm text-text-secondary focus:border-primary/40 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="toImprove" className="mb-1 block font-sans text-sm font-semibold text-primary">
              {copy.toImprove}
            </label>
            <textarea
              id="toImprove"
              name="toImprove"
              rows={2}
              className="w-full rounded-xl border border-primary/15 px-3 py-2 font-sans text-sm text-text-secondary focus:border-primary/40 focus:outline-none"
            />
          </div>

          <fieldset>
            <legend className="mb-2 font-sans text-sm font-semibold text-primary">
              {copy.guideClarity}
            </legend>
            <div className="flex gap-4">
              {[
                { value: 'si', label: copy.optionYes },
                { value: 'mas_o_menos', label: copy.optionSomewhat },
                { value: 'no', label: copy.optionNo },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-1.5 font-sans text-sm text-text-secondary">
                  <input type="radio" name="guideClarity" value={opt.value} required />
                  {opt.label}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2 font-sans text-sm font-semibold text-primary">
              {copy.wouldReturn}
            </legend>
            <div className="flex gap-4">
              {[
                { value: 'si', label: copy.optionYes },
                { value: 'tal_vez', label: copy.optionMaybe },
                { value: 'no', label: copy.optionNo },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-1.5 font-sans text-sm text-text-secondary">
                  <input type="radio" name="wouldReturn" value={opt.value} required />
                  {opt.label}
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor="guestName" className="mb-1 block font-sans text-sm font-semibold text-primary">
              {copy.name}
            </label>
            <input
              id="guestName"
              name="guestName"
              type="text"
              className="w-full rounded-xl border border-primary/15 px-3 py-2 font-sans text-sm text-text-secondary focus:border-primary/40 focus:outline-none"
            />
          </div>

          {state.status === 'error' && (
            <p className="font-sans text-sm text-accent">{copy.error}</p>
          )}

          <button
            type="submit"
            disabled={isPending || rating === 0}
            className="rounded-full bg-primary px-6 py-3 font-sans font-semibold text-background shadow-md transition-all hover:bg-primary/90 disabled:opacity-50"
          >
            {isPending ? copy.submitting : copy.submit}
          </button>
        </form>
      </div>
    </section>
  );
}
