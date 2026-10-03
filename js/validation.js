/**
 * Módulo de Sanitización y Validación (js/validation.js)
 * Conecta el esquema Zod compartido (shared/schema.js) con la interfaz de usuario.
 */

import { raceSchema, sanitizePlainText, VALID_DISCIPLINES } from '../shared/schema.js';
import { ALLOWED_CATEGORIES, normalizeCategories } from '../shared/categories.js';

export { VALID_DISCIPLINES, ALLOWED_CATEGORIES, normalizeCategories, sanitizePlainText };

/**
 * Escapa entidades HTML peligrosas para renderizado seguro en el DOM.
 * @param {*} str
 * @returns {string}
 */
export function escapeHTML(str) {
  if (typeof str !== 'string') return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return str.replace(/[&<>"']/g, match => map[match]);
}

// Mantener compatibilidad con llamadas anteriores a sanitizeHTML
export const sanitizeHTML = escapeHTML;

/**
 * Valida si una URL es sintácticamente válida con protocolo seguro.
 * @param {string} urlStr
 * @returns {boolean}
 */
export function isValidURL(urlStr) {
  if (!urlStr || typeof urlStr !== 'string') return true;
  let trimmed = urlStr.trim();
  if (trimmed === '') return true;
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = 'https://' + trimmed;
  }
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Valida y sanitiza el formulario de carrera usando el esquema Zod unificado.
 * @param {Object} data - Datos crudos del formulario.
 * @returns {{ isValid: boolean, errors: Record<string, string>, sanitizedData: Object }}
 */
export function validateRaceForm(data) {
  const parseResult = raceSchema.safeParse(data);

  if (parseResult.success) {
    return {
      isValid: true,
      errors: {},
      sanitizedData: parseResult.data
    };
  }

  const errors = {};
  for (const issue of parseResult.error.issues) {
    const field = issue.path[0] || 'general';
    if (!errors[field]) {
      errors[field] = issue.message;
    }
  }

  return {
    isValid: false,
    errors,
    sanitizedData: null
  };
}
