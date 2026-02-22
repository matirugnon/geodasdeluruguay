/**
 * Genera un slug URL-safe a partir de un texto.
 * "Geoda de Amatista Grande" → "geoda-de-amatista-grande"
 */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')                   // Descomponer tildes: á → a + ́
    .replace(/[\u0300-\u036f]/g, '')    // Remover marcas diacríticas
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')      // Remover caracteres especiales
    .replace(/[\s_]+/g, '-')            // Espacios/guiones bajos → guiones
    .replace(/-+/g, '-')               // Múltiples guiones → uno solo
    .replace(/^-+|-+$/g, '');          // Remover guiones al inicio/final
}

/**
 * Genera la URL del producto usando su slug almacenado en la DB.
 * Si no tiene slug, genera uno a partir del título.
 * "/producto/geoda-amatista-grande"
 */
export function productUrl(slug: string): string {
  return `/producto/${slug}`;
}

/**
 * Genera la URL del tip usando su slug almacenado en la DB.
 * Si no tiene slug, genera uno a partir del título.
 * "/tips/como-limpiar-cristales"
 */
export function tipUrl(slug: string): string {
  return `/tips/${slug}`;
}

/** Dominio canónico del sitio */
export const SITE_URL = 'https://geodasdeluruguay.vercel.app';
export const SITE_NAME = 'Geodas del Uruguay';
