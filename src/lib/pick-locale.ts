/** Elige el campo bilingüe correcto según el locale activo (fallback al otro si falta). */
export function pickLocale(
  locale: string,
  es: string | null | undefined,
  en: string | null | undefined
): string {
  const value = locale === 'en' ? en : es;
  return value ?? es ?? en ?? '';
}
