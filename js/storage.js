/**
 * Módulo de Almacenamiento y Estado (js/storage.js)
 */

import { INITIAL_RACES } from './data.js';
import { 
  isSupabaseConfigured, 
  fetchApprovedRacesSupabase, 
  createPendingRaceSupabase,
  deleteRaceSupabase,
  updateRaceSupabase
} from './supabase.js';

export const BOOKMARKS_KEY = 'calendariociclista_bookmarks';
export const CUSTOM_RACES_KEY = 'calendariociclista_custom_races';

/**
 * Retorna el array de IDs de carreras guardadas en favoritas desde localStorage.
 * Retorna [] si está vacío, no existe o falla la lectura/parsing.
 * @returns {string[]}
 */
export function getBookmarkedIds() {
  try {
    const data = localStorage.getItem(BOOKMARKS_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error leyendo bookmarks de localStorage:', error);
    return [];
  }
}

/**
 * Alterna la presencia de un raceId en las carreras favoritas y actualiza localStorage.
 * @param {string} raceId 
 * @returns {string[]} Array actualizado de IDs marcados como favoritos.
 */
export function toggleBookmark(raceId) {
  if (!raceId) return getBookmarkedIds();
  const bookmarks = getBookmarkedIds();
  const index = bookmarks.indexOf(raceId);

  if (index >= 0) {
    bookmarks.splice(index, 1);
  } else {
    bookmarks.push(raceId);
  }

  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  } catch (error) {
    console.error('Error guardando bookmarks en localStorage:', error);
  }

  return bookmarks;
}

/**
 * Indica si una carrera específica está guardada en favoritas.
 * @param {string} raceId 
 * @returns {boolean}
 */
export function isBookmarked(raceId) {
  if (!raceId) return false;
  const bookmarks = getBookmarkedIds();
  return bookmarks.includes(raceId);
}

/**
 * Retorna el array de carreras personalizadas creadas por usuarios en localStorage.
 * @returns {Array}
 */
export function getCustomRaces() {
  try {
    const data = localStorage.getItem(CUSTOM_RACES_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error leyendo custom races de localStorage:', error);
    return [];
  }
}

/**
 * Agrega una nueva carrera personalizada al inicio del array y guarda en localStorage.
 * @param {Object} newRace 
 * @returns {Array} Array actualizado de carreras personalizadas.
 */
export function saveCustomRace(newRace) {
  if (!newRace) return getCustomRaces();
  const customRaces = getCustomRaces();
  customRaces.unshift(newRace);

  try {
    localStorage.setItem(CUSTOM_RACES_KEY, JSON.stringify(customRaces));
  } catch (error) {
    console.error('Error guardando custom race en localStorage:', error);
  }

  return customRaces;
}

/**
 * Combina las carreras aprobadas devueltas por Supabase (si está configurado),
 * las carreras guardadas en localStorage (getCustomRaces()) y las iniciales (INITIAL_RACES),
 * asegurando que no existan duplicados por ID y filtrando las carreras iniciales eliminadas localmente.
 * @returns {Promise<Array>}
 */
export async function getAllRaces() {
  let supabaseRaces = [];
  if (isSupabaseConfigured()) {
    try {
      supabaseRaces = await fetchApprovedRacesSupabase();
    } catch (error) {
      console.error('Error al obtener carreras desde Supabase:', error);
    }
  }

  const customRaces = getCustomRaces();
  
  // Filtrado de carreras iniciales borradas localmente
  const DELETED_INITIAL_KEY = 'calendariociclista_deleted_initial_races';
  let deletedInitialIds = [];
  try {
    const deletedStr = localStorage.getItem(DELETED_INITIAL_KEY);
    if (deletedStr) deletedInitialIds = JSON.parse(deletedStr);
  } catch (err) {
    console.error('Error leyendo deleted_initial_races:', err);
  }

  const filteredInitial = INITIAL_RACES.filter(r => !deletedInitialIds.includes(r.id));
  const combined = [...supabaseRaces, ...customRaces, ...filteredInitial];

  const seenIds = new Set();
  const uniqueRaces = [];

  for (const race of combined) {
    if (race && race.id && !seenIds.has(race.id)) {
      seenIds.add(race.id);
      uniqueRaces.push(race);
    }
  }

  return uniqueRaces;
}

/**
 * Intenta enviar una nueva carrera a Supabase en estado 'pendiente'.
 * Si Supabase no está configurado o si falla la conexión/inserción,
 * guarda la carrera en localStorage con saveCustomRace(newRace).
 * @param {Object} newRace 
 * @returns {Promise<{ success: boolean, source: string, data?: Object, error?: any }>}
 */
export async function saveRace(newRace) {
  if (!newRace) return { success: false, source: 'none' };

  if (isSupabaseConfigured()) {
    try {
      const res = await createPendingRaceSupabase(newRace);
      if (res && res.success) {
        return { success: true, source: 'supabase', data: res.data };
      }
      // Si Supabase responde con error explícito de inserción, retornar la falla
      if (res && res.error) {
        return { success: false, source: 'supabase', error: res.error };
      }
    } catch (error) {
      console.error('Error al enviar carrera a Supabase:', error);
      return { success: false, source: 'supabase', error: error.message || error };
    }
  }

  const savedLocal = saveCustomRace(newRace);
  return { success: true, source: 'localStorage', data: savedLocal };
}

/**
 * Elimina una carrera de Supabase o localmente según el formato de ID.
 * @param {string} raceId 
 * @returns {Promise<{ success: boolean, source: string, error?: any }>}
 */
export async function deleteRace(raceId) {
  if (!raceId) return { success: false, error: 'ID de carrera inválido' };

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const isUUID = uuidRegex.test(raceId);

  if (isUUID && isSupabaseConfigured()) {
    try {
      const res = await deleteRaceSupabase(raceId);
      if (res.success) return { success: true, source: 'supabase' };
      return { success: false, error: res.error };
    } catch (err) {
      return { success: false, error: err.message || err };
    }
  }

  // Eliminar localmente
  // 1. Eliminar de custom races de localStorage
  const customRaces = getCustomRaces();
  const updatedCustom = customRaces.filter(r => r.id !== raceId);
  if (customRaces.length !== updatedCustom.length) {
    try {
      localStorage.setItem(CUSTOM_RACES_KEY, JSON.stringify(updatedCustom));
      return { success: true, source: 'localStorage' };
    } catch (err) {
      return { success: false, error: 'Error al actualizar localStorage: ' + err.message };
    }
  }

  // 2. Si es una carrera inicial (INITIAL_RACES), lo guardamos en la lista de eliminadas
  const DELETED_INITIAL_KEY = 'calendariociclista_deleted_initial_races';
  try {
    const deletedStr = localStorage.getItem(DELETED_INITIAL_KEY);
    const deletedIds = deletedStr ? JSON.parse(deletedStr) : [];
    if (!deletedIds.includes(raceId)) {
      deletedIds.push(raceId);
      localStorage.setItem(DELETED_INITIAL_KEY, JSON.stringify(deletedIds));
    }
    return { success: true, source: 'localStorage_initial' };
  } catch (err) {
    return { success: false, error: 'Error al eliminar carrera inicial localmente: ' + err.message };
  }
}

/**
 * Modifica los datos de una carrera en Supabase o localmente según el formato de ID.
 * @param {string} raceId 
 * @param {Object} raceData 
 * @returns {Promise<{ success: boolean, source: string, error?: any }>}
 */
export async function updateRace(raceId, raceData) {
  if (!raceId) return { success: false, error: 'ID de carrera inválido' };

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const isUUID = uuidRegex.test(raceId);

  if (isUUID && isSupabaseConfigured()) {
    try {
      const res = await updateRaceSupabase(raceId, raceData);
      if (res.success) return { success: true, source: 'supabase' };
      return { success: false, error: res.error };
    } catch (err) {
      return { success: false, error: err.message || err };
    }
  }

  // Modificar localmente
  const customRaces = getCustomRaces();
  const existingIndex = customRaces.findIndex(r => r.id === raceId);

  let updatedRace = { ...raceData, id: raceId };
  // Formatear categorías para coincidir con el formato del frontend (array de categorías)
  if (raceData.categories && typeof raceData.categories === 'string') {
    updatedRace.categories = raceData.categories.split(',').map(c => c.trim()).filter(Boolean);
  }

  if (existingIndex >= 0) {
    // Si ya existe en custom races
    customRaces[existingIndex] = { ...customRaces[existingIndex], ...updatedRace };
  } else {
    // Si es una carrera de INITIAL_RACES, combinamos los datos originales y los nuevos
    const original = INITIAL_RACES.find(r => r.id === raceId) || {};
    customRaces.unshift({ ...original, ...updatedRace });
  }

  try {
    localStorage.setItem(CUSTOM_RACES_KEY, JSON.stringify(customRaces));
    return { success: true, source: 'localStorage' };
  } catch (err) {
    return { success: false, error: 'Error al actualizar localStorage: ' + err.message };
  }
}

