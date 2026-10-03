import { z } from 'zod';
import { ALLOWED_CATEGORIES, normalizeCategories } from './categories.js';

export { ALLOWED_CATEGORIES };

export const VALID_DISCIPLINES = ['Ruta', 'MTB', 'Gravel', 'Pista', 'BMX', 'Virtual'];

export const VALID_STATUSES = [
  'Inscripciones Abiertas',
  'Próximamente',
  'Finalizada',
  'Cancelada'
];

/**
 * Limpia y normaliza texto plano eliminando caracteres invisibles y recortando espacios.
 * NO convierte caracteres a entidades HTML (se almacena texto plano en la base de datos).
 */
export function sanitizePlainText(str) {
  if (typeof str !== 'string') return '';
  return str.trim();
}

/**
 * Validador para distancias y desniveles: acepta números, texto con unidad (ej. "120 km", "1850 m") o "N/A".
 */
const distanceElevationSchema = z
  .string()
  .transform(sanitizePlainText)
  .refine(val => val.length <= 40, { message: 'El valor no puede superar 40 caracteres.' })
  .default('N/A');

/**
 * Esquema de validación principal con Zod para creación y edición de carreras.
 */
export const raceSchema = z.object({
  name: z
    .string()
    .transform(sanitizePlainText)
    .pipe(z.string().min(3, 'El nombre debe tener al menos 3 caracteres.').max(120, 'El nombre no puede superar 120 caracteres.')),

  discipline: z
    .string()
    .transform(sanitizePlainText)
    .refine(val => VALID_DISCIPLINES.includes(val), {
      message: `Disciplina inválida. Permitidas: ${VALID_DISCIPLINES.join(', ')}.`
    }),

  isMultiDay: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform(val => val === true || val === 'true' || val === 'on'),

  date: z
    .string()
    .transform(sanitizePlainText)
    .pipe(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha con formato inválido (AAAA-MM-DD).')),

  startDate: z
    .string()
    .optional()
    .transform(val => (val ? sanitizePlainText(val) : ''))
    .pipe(z.string().regex(/^(\d{4}-\d{2}-\d{2})?$/, 'Fecha de inicio inválida.')),

  endDate: z
    .string()
    .optional()
    .transform(val => (val ? sanitizePlainText(val) : ''))
    .pipe(z.string().regex(/^(\d{4}-\d{2}-\d{2})?$/, 'Fecha de término inválida.')),

  region: z
    .string()
    .transform(sanitizePlainText)
    .pipe(z.string().min(2, 'La región es obligatoria.').max(120, 'Región inválida.')),

  city: z
    .string()
    .transform(sanitizePlainText)
    .pipe(z.string().min(1, 'La ciudad / comuna es obligatoria.').max(120, 'Ciudad no puede superar 120 caracteres.')),

  organizer: z
    .string()
    .transform(sanitizePlainText)
    .pipe(z.string().min(2, 'El organizador debe tener al menos 2 caracteres.').max(120, 'Organizador no puede superar 120 caracteres.')),

  registrationUrl: z
    .string()
    .optional()
    .nullable()
    .transform(val => (val ? sanitizePlainText(val) : ''))
    .pipe(
      z.string().max(500, 'La URL de inscripción no puede superar 500 caracteres.')
    )
    .refine(val => {
      if (!val || val === '#') return true;
      try {
        const parsed = new URL(val.startsWith('http') ? val : `https://${val}`);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
      } catch {
        return false;
      }
    }, { message: 'La URL de inscripción debe ser una URL válida (http/https).' }),

  distance: distanceElevationSchema,
  elevation: distanceElevationSchema,

  price: z
    .union([z.number(), z.string()])
    .transform(val => {
      if (typeof val === 'number') return Math.max(0, Math.round(val));
      const parsed = parseInt(String(val).replace(/[^0-9]/g, ''), 10);
      return isNaN(parsed) ? 0 : Math.max(0, parsed);
    })
    .pipe(z.number().int().min(0, 'El precio debe ser un número mayor o igual a 0.')),

  isFree: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform(val => val === true || val === 'true' || val === 'on'),

  status: z
    .string()
    .optional()
    .transform(val => (val ? sanitizePlainText(val) : 'Inscripciones Abiertas'))
    .refine(val => VALID_STATUSES.includes(val), {
      message: `Estado no válido. Opciones: ${VALID_STATUSES.join(', ')}.`
    }),

  heroImage: z
    .string()
    .optional()
    .nullable()
    .transform(val => (val ? sanitizePlainText(val) : ''))
    .refine(val => {
      if (!val) return true;
      // Prohibición estricta de Base64 data URIs
      if (val.startsWith('data:')) return false;
      try {
        const parsed = new URL(val);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
      } catch {
        return false;
      }
    }, { message: 'La imagen debe ser una URL web directa válida (https://...). No se permiten imágenes en base64.' })
    .pipe(z.string().max(1000, 'La URL de la imagen no puede superar 1000 caracteres.')),

  categories: z
    .union([z.array(z.string()), z.string()])
    .optional()
    .transform(val => normalizeCategories(val)),

  description: z
    .string()
    .transform(sanitizePlainText)
    .pipe(
      z.string()
        .min(10, 'La descripción debe tener al menos 10 caracteres.')
        .max(20000, 'La descripción no puede superar 20.000 caracteres.')
    )
}).refine(data => {
  // Ajuste y validación de fechas
  const effectiveStart = data.startDate || data.date;
  const effectiveEnd = data.endDate || effectiveStart;
  return effectiveEnd >= effectiveStart;
}, {
  message: 'La fecha de término no puede ser anterior a la fecha de inicio.',
  path: ['endDate']
}).transform(data => {
  const effectiveStart = data.startDate || data.date;
  const effectiveEnd = data.endDate || effectiveStart;
  return {
    ...data,
    startDate: effectiveStart,
    endDate: effectiveEnd,
    date: effectiveStart,
    price: data.isFree ? 0 : data.price
  };
});
