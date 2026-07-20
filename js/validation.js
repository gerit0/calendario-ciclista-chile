/**
 * Módulo de Sanitización y Validación (js/validation.js)
 * Proporciona funciones para sanitizar cadenas HTML, validar URLs y validar formularios de eventos ciclistas.
 */

const VALID_DISCIPLINES = ['Ruta', 'MTB', 'Gravel', 'Pista', 'BMX', 'Virtual'];

/**
 * Sanitiza una cadena escapando entidades HTML peligrosas (&, <, >, ", ')
 * y eliminando espacios sobrantes en los extremos.
 * @param {*} str - Valor a sanitizar.
 * @returns {string} Cadena sanitizada o '' si no es una cadena de texto.
 */
export function sanitizeHTML(str) {
  if (typeof str !== 'string') return '';
  
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };

  return str.trim().replace(/[&<>"']/g, match => map[match]);
}

/**
 * Valida si una URL es válida y utiliza un protocolo seguro (http: o https:).
 * Permite cadenas vacías (URL opcional).
 * Retorna false para esquemas maliciosos como javascript:, data:, etc.
 * @param {string} urlStr - Cadena de URL a validar.
 * @returns {boolean} true si es vacía/opcional o es una URL válida con http/https.
 */
export function isValidURL(urlStr) {
  if (!urlStr || typeof urlStr !== 'string') return true;
  const trimmed = urlStr.trim();
  if (trimmed === '') return true;

  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Valida y sanitiza los datos introducidos en el formulario de creación/edición de carrera.
 * @param {Object} data - Objeto con los datos del formulario.
 * @returns {{ isValid: boolean, errors: Object, sanitizedData: Object }} Objeto con el resultado de la validación.
 */
export function validateRaceForm(data) {
  const raw = data || {};
  const errors = {};
  const sanitizedData = {};

  // 1. name (3 a 100 caracteres)
  const name = sanitizeHTML(raw.name);
  sanitizedData.name = name;
  if (!name || name.length < 3 || name.length > 100) {
    errors.name = 'El nombre de la carrera debe tener entre 3 y 100 caracteres.';
  }

  // 2. discipline (debe ser una de: 'Ruta', 'MTB', 'Gravel', 'Pista', 'BMX', 'Virtual')
  const discipline = typeof raw.discipline === 'string' ? raw.discipline.trim() : '';
  sanitizedData.discipline = discipline;
  if (!VALID_DISCIPLINES.includes(discipline)) {
    errors.discipline = 'Debe seleccionar una disciplina válida (Ruta, MTB, Gravel, Pista, BMX, Virtual).';
  }

  // 3. date (formato AAAA-MM-DD)
  const dateStr = typeof raw.date === 'string' ? raw.date.trim() : '';
  sanitizedData.date = dateStr;
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateStr || !dateRegex.test(dateStr) || isNaN(Date.parse(dateStr))) {
    errors.date = 'La fecha debe tener un formato válido (AAAA-MM-DD).';
  }

  // 4. region (obligatorio)
  const region = sanitizeHTML(raw.region);
  sanitizedData.region = region;
  if (!region) {
    errors.region = 'La región es obligatoria.';
  }

  // 5. organizador (2 a 100 caracteres)
  const organizador = sanitizeHTML(raw.organizador);
  sanitizedData.organizador = organizador;
  if (!organizador || organizador.length < 2 || organizador.length > 100) {
    errors.organizador = 'El organizador debe tener entre 2 y 100 caracteres.';
  }

  // 6. registrationUrl (valida con isValidURL)
  const registrationUrl = typeof raw.registrationUrl === 'string' ? raw.registrationUrl.trim() : '';
  sanitizedData.registrationUrl = registrationUrl;
  if (!isValidURL(registrationUrl)) {
    errors.registrationUrl = 'La URL de inscripción debe ser una URL válida con protocolo http: o https:.';
  }

  // 7. city (obligatorio, 1 a 100 caracteres)
  const city = sanitizeHTML(raw.city);
  sanitizedData.city = city;
  if (!city || city.length < 1 || city.length > 100) {
    errors.city = 'La ciudad / comuna es obligatoria (máximo 100 caracteres).';
  }

  // 8. distance (obligatorio, 1 a 30 caracteres)
  const distance = sanitizeHTML(raw.distance);
  sanitizedData.distance = distance;
  if (!distance || distance.length < 1 || distance.length > 30) {
    errors.distance = 'La distancia es obligatoria (ej: 120 km) y no puede superar 30 caracteres.';
  }

  // 9. description (obligatorio, 10 a 2000 caracteres)
  const description = sanitizeHTML(raw.description);
  sanitizedData.description = description;
  if (!description || description.length < 10 || description.length > 2000) {
    errors.description = 'La descripción es obligatoria (entre 10 y 2000 caracteres).';
  }

  // 10. Campos opcionales (elevation, price, heroImage)
  sanitizedData.elevation = sanitizeHTML(raw.elevation);
  sanitizedData.price = sanitizeHTML(raw.price);
  sanitizedData.heroImage = sanitizeHTML(raw.heroImage);

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData
  };
}
