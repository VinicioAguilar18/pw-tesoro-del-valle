/** Convierte un nombre a slug de URL: minusculas, sin acentos, espacios -> guiones. */
export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(new RegExp('[\\u0300-\\u036f]', 'g'), '') // quita acentos (marcas de combinacion tras NFD)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
