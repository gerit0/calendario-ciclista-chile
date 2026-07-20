/**
 * Módulo de Conexión a Supabase (js/supabase.js)
 * Maneja la inicialización del cliente de Supabase y las operaciones de datos para carreras.
 */

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Carga de credenciales desde window con fallback seguro
const DEFAULT_URL = '';
const DEFAULT_ANON_KEY = '';

let supabaseInstance = null;

/**
 * Obtiene las credenciales configuradas en window o sus fallbacks.
 * @returns {{ url: string, key: string }}
 */
function getCredentials() {
  const url = (typeof window !== 'undefined' && window.SUPABASE_URL)
    ? String(window.SUPABASE_URL).trim()
    : DEFAULT_URL;

  const key = (typeof window !== 'undefined' && window.SUPABASE_ANON_KEY)
    ? String(window.SUPABASE_ANON_KEY).trim()
    : DEFAULT_ANON_KEY;

  return { url, key };
}

/**
 * Verifica si Supabase está configurado con credenciales válidas.
 * @returns {boolean}
 */
export function isSupabaseConfigured() {
  const { url, key } = getCredentials();
  if (!url || !key) return false;
  if (url.includes('YOUR_SUPABASE_URL') || key.includes('YOUR_SUPABASE_ANON_KEY')) return false;

  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (e) {
    return false;
  }
}

/**
 * Inicializa o retorna el cliente singleton de Supabase.
 * Retorna null si las credenciales no son válidas.
 * @returns {Object|null}
 */
export function getSupabase() {
  if (supabaseInstance) return supabaseInstance;
  if (!isSupabaseConfigured()) return null;

  const { url, key } = getCredentials();
  try {
    supabaseInstance = createClient(url, key);
    return supabaseInstance;
  } catch (error) {
    console.error('Error al inicializar el cliente de Supabase:', error);
    return null;
  }
}

/**
 * Transforma un registro de la tabla `carreras` de Supabase al formato esperado por el frontend.
 * @param {Object} row 
 * @returns {Object}
 */
function mapSupabaseToFrontend(row) {
  const priceNum = row.precio != null ? Number(row.precio) : 0;

  let displayDate = row.fecha || '';
  let month = '';
  if (row.fecha) {
    try {
      const d = new Date(row.fecha + 'T00:00:00');
      if (!isNaN(d.getTime())) {
        const monthName = d.toLocaleDateString('es-CL', { month: 'long' });
        month = monthName.charAt(0).toUpperCase() + monthName.slice(1);
        displayDate = d.toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' });
      }
    } catch (e) {
      displayDate = row.fecha;
    }
  }

  let categories = [];
  if (Array.isArray(row.categoria)) {
    categories = row.categoria;
  } else if (typeof row.categoria === 'string' && row.categoria.trim() !== '') {
    categories = row.categoria.split(',').map(c => c.trim());
  } else {
    categories = ['General'];
  }

  return {
    id: row.id,
    name: row.nombre || '',
    discipline: row.disciplina || '',
    date: row.fecha || '',
    month: month,
    displayDate: displayDate,
    region: row.region || '',
    city: row.ubicacion || '',
    distance: row.distancia || 'N/A',
    elevation: row.desnivel || 'N/A',
    price: priceNum,
    isFree: priceNum === 0,
    status: row.status || (row.estado === 'aprobada' ? 'Inscripciones Abiertas' : row.estado),
    organizer: row.organizador || '',
    registrationUrl: row.link_inscripcion || '',
    heroImage: row.hero_image || '',
    description: row.descripcion || '',
    categories: categories,
    participants: row.participantes != null ? row.participantes : 0
  };
}

/**
 * Obtiene todas las carreras aprobadas desde Supabase.
 * @returns {Promise<Array>} Array de carreras en formato frontend.
 */
export async function fetchApprovedRacesSupabase() {
  const client = getSupabase();
  if (!client) {
    console.warn('Supabase no está configurado. Retornando array vacío.');
    return [];
  }

  try {
    // Limitar consulta a un rango de 2 años (actual y siguiente) y máximo 500 registros
    const hoy = new Date();
    const fechaDesde = `${hoy.getFullYear()}-01-01`;
    const fechaHasta = `${hoy.getFullYear() + 1}-12-31`;

    const { data, error } = await client
      .from('carreras')
      .select('*')
      .eq('estado', 'aprobada')
      .gte('fecha', fechaDesde)
      .lte('fecha', fechaHasta)
      .order('fecha', { ascending: true })
      .limit(500);

    if (error) {
      console.error('Error al consultar carreras aprobadas en Supabase:', error);
      return [];
    }

    if (!Array.isArray(data)) return [];

    return data.map(mapSupabaseToFrontend);
  } catch (err) {
    console.error('Excepción al consultar carreras en Supabase:', err);
    return [];
  }
}

/**
 * Registra una nueva propuesta de carrera con estado 'pendiente'.
 * @param {Object} raceData Datos de la carrera en formato frontend o formulario.
 * @returns {Promise<{ success: boolean, data?: Object, error?: any }>}
 */
export async function createPendingRaceSupabase(raceData) {
  const client = getSupabase();
  if (!client) {
    return {
      success: false,
      error: new Error('Supabase no está configurado.')
    };
  }

  try {
    const payload = {
      nombre: raceData.nombre || raceData.name,
      fecha: raceData.fecha || raceData.date,
      disciplina: raceData.disciplina || raceData.discipline,
      region: raceData.region || null,
      ubicacion: raceData.ubicacion || raceData.city || null,
      organizador: raceData.organizador || raceData.organizer || null,
      link_inscripcion: raceData.link_inscripcion || raceData.registrationUrl || null,
      categoria: Array.isArray(raceData.categories) 
        ? raceData.categories.join(', ') 
        : (raceData.categoria || raceData.categories || null),
      precio: raceData.precio != null ? raceData.precio : (raceData.price != null ? raceData.price : 0),
      hero_image: raceData.hero_image || raceData.heroImage || null,
      descripcion: raceData.descripcion || raceData.description || null,
      estado: 'pendiente'
    };

    const { data, error } = await client
      .from('carreras')
      .insert([payload])
      .select();

    if (error) {
      console.error('Error al insertar carrera pendiente en Supabase:', error);
      return { success: false, error: error.message || error };
    }

    return {
      success: true,
      data: (data && data.length > 0) ? data[0] : null
    };
  } catch (err) {
    console.error('Excepción al crear carrera pendiente en Supabase:', err);
    return { success: false, error: err.message || err };
  }
}
