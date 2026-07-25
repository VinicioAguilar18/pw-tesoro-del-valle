import { useEffect, useRef, useState } from 'react';

/**
 * Índice que avanza solo cada `intervalMs`. Cualquier navegación manual
 * (next/prev/goTo) pausa el auto-avance por `resumeDelayMs` y luego retoma.
 * `paused` (ej. prefers-reduced-motion) desactiva el auto-avance por completo,
 * sin afectar la navegación manual.
 */
export function useAutoRotate(
  count: number,
  intervalMs: number,
  options?: { paused?: boolean; resumeDelayMs?: number }
) {
  const [index, setIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pauseTemporarily = () => {
    setUserPaused(true);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setUserPaused(false), options?.resumeDelayMs ?? 6000);
  };

  const goTo = (i: number) => {
    setIndex(((i % count) + count) % count);
    pauseTemporarily();
  };

  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  useEffect(() => {
    if (options?.paused || userPaused || count <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), intervalMs);
    return () => clearInterval(id);
  }, [count, intervalMs, options?.paused, userPaused]);

  useEffect(() => {
    return () => {
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    };
  }, []);

  return { index, next, prev, goTo };
}
