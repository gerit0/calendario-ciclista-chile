/**
 * Lista cerrada y canónica de categorías para el Calendario Ciclista.
 * Este archivo es la única fuente de verdad compartida entre frontend, API y migraciones.
 */

export const ALLOWED_CATEGORIES = [
  "Todo Competidor",
  "Elite",
  "Sub 23",
  "Junior",
  "Juvenil",
  "Infantil",
  "Peneca",
  "Escuelitas",
  "Master A",
  "Master B",
  "Master C",
  "Master D",
  "Master",
  "Damas",
  "Intermedia",
  "General"
];

const NORMALIZATION_MAP = {
  'tc': 'Todo Competidor',
  'todo competidor': 'Todo Competidor',
  'elite': 'Elite',
  'sub 23': 'Sub 23',
  'sub-23': 'Sub 23',
  'sub23': 'Sub 23',
  'junior': 'Junior',
  'juvenil': 'Juvenil',
  'infantil': 'Infantil',
  'peneca': 'Peneca',
  'escuelitas': 'Escuelitas',
  'escuelita': 'Escuelitas',
  'master a': 'Master A',
  'master b': 'Master B',
  'master c': 'Master C',
  'master d': 'Master D',
  'master': 'Master',
  'damas': 'Damas',
  'intermedia': 'Intermedia',
  'intemedia': 'Intermedia', // typo común presente en datos históricos
  'general': 'General'
};

/**
 * Normaliza un array o string de categorías al conjunto cerrado permitido.
 * @param {string|string[]} raw
 * @returns {string[]}
 */
export function normalizeCategories(raw) {
  if (!raw) return ['General'];
  const items = Array.isArray(raw)
    ? raw
    : String(raw).split(',').map(s => s.trim()).filter(Boolean);

  const matched = [];
  for (const item of items) {
    const clean = item.trim().toLowerCase();
    const canon = NORMALIZATION_MAP[clean];
    if (canon && !matched.includes(canon)) {
      matched.push(canon);
    }
  }

  return matched.length > 0 ? matched : ['General'];
}
