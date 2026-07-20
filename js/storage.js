/**
 * Módulo de Almacenamiento y Estado (js/storage.js)
 */

import { INITIAL_RACES } from './data.js';
import { isSupabaseConfigured, fetchApprovedRacesSupabase, createPendingRaceSupabase } from './supabase.js';

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
 * asegurando que no existan duplicados por ID.
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
  const combined = [...supabaseRaces, ...customRaces, ...INITIAL_RACES];

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
    } catch (error) {
      console.error('Error al enviar carrera a Supabase. Realizando fallback a localStorage:', error);
    }
  }

  const savedLocal = saveCustomRace(newRace);
  return { success: true, source: 'localStorage', data: savedLocal };
}
