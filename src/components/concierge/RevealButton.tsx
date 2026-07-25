'use client';

import { useState, useTransition } from 'react';
import { Lock, Copy, Check } from 'lucide-react';

interface Field {
  key: string;
  label: string;
}

/**
 * Tap-to-reveal genérico. El valor real NUNCA llega al cliente hasta que
 * `onReveal` se ejecuta (Server Action) — antes de eso, este componente
 * no tiene ningún dato sensible en memoria ni en props.
 */
export default function RevealButton({
  triggerLabel,
  fields,
  onReveal,
  copyLabel,
  copiedLabel,
  unavailableLabel,
}: {
  triggerLabel: string;
  fields: Field[];
  onReveal: () => Promise<Record<string, string> | null>;
  copyLabel: string;
  copiedLabel: string;
  unavailableLabel: string;
}) {
  const [values, setValues] = useState<Record<string, string> | null>(null);
  const [attempted, setAttempted] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleReveal = () => {
    startTransition(async () => {
      const result = await onReveal();
      setValues(result);
      setAttempted(true);
    });
  };

  const handleCopy = async (key: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 2000);
  };

  if (attempted && !values) {
    return (
      <p className="rounded-xl bg-white/50 px-4 py-4 text-center font-sans text-sm text-text-secondary">
        {unavailableLabel}
      </p>
    );
  }

  if (!values) {
    return (
      <button
        type="button"
        onClick={handleReveal}
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-primary/30 bg-white/50 px-4 py-4 font-sans font-semibold text-primary transition-colors hover:bg-white disabled:opacity-60"
      >
        <Lock className="h-4 w-4" />
        {isPending ? '…' : triggerLabel}
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {fields.map(({ key, label }) => {
        const value = values[key];
        if (!value) return null;

        return (
          <div
            key={key}
            className="flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-3 shadow-sm"
          >
            <div className="min-w-0">
              <p className="text-xs font-sans text-text-secondary">{label}</p>
              <p className="truncate font-serif text-lg font-bold text-primary">{value}</p>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(key, value)}
              aria-label={copyLabel}
              className="flex shrink-0 items-center gap-1.5 rounded-full bg-primary/10 px-3 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
            >
              {copiedKey === key ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  {copiedLabel}
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  {copyLabel}
                </>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}
