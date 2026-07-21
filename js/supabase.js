/**
 * Módulo de Conexión a Supabase (js/supabase.js)
 * Maneja la inicialización del cliente de Supabase y las operaciones de datos para carreras.
 */

import { createClient } from '@supabase/supabase-js';

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

  const startDate = row.fecha_inicio || row.fecha || '';
  const endDate = row.fecha_fin || row.fecha_inicio || row.fecha || '';

  return {
    id: row.id,
    name: row.nombre || '',
    discipline: row.disciplina || '',
    date: startDate || row.fecha || '',
    startDate: startDate,
    endDate: endDate,
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
 * Obtiene una carrera específica por su ID desde Supabase.
 * @param {string} id 
 * @returns {Promise<Object|null>}
 */
export async function fetchRaceByIdSupabase(id) {
  const client = getSupabase();
  if (!client || !id) return null;

  try {
    const { data, error } = await client
      .from('carreras')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) return null;
    return mapSupabaseToFrontend(data);
  } catch (err) {
    console.error('Error al obtener carrera por ID en Supabase:', err);
    return null;
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
      distancia: raceData.distancia || raceData.distance || null,
      desnivel: raceData.desnivel || raceData.elevation || null,
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

    const insertPromise = client
      .from('carreras')
      .insert([payload]);

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('TIMEOUT_EXCEEDED')), 6000)
    );

    const { data, error } = await Promise.race([insertPromise, timeoutPromise]);

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
    throw err;
  }
}

/**
 * Inicia sesión de administrador con correo y contraseña.
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<{ success: boolean, session?: Object, error?: any }>}
 */
export async function loginAdmin(email, password) {
  const client = getSupabase();
  if (!client) return { success: false, error: 'Supabase no está configurado.' };

  try {
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return { success: true, session: data.session, user: data.user };
  } catch (err) {
    console.error('Error al iniciar sesión de admin:', err);
    return { success: false, error: err.message || err };
  }
}

/**
 * Cierra la sesión activa.
 * @returns {Promise<{ success: boolean, error?: any }>}
 */
export async function logoutAdmin() {
  const client = getSupabase();
  if (!client) return { success: false, error: 'Supabase no está configurado.' };

  try {
    const { error } = await client.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('Error al cerrar sesión:', err);
    return { success: false, error: err.message || err };
  }
}

/**
 * Obtiene el usuario autenticado actual.
 * @returns {Promise<Object|null>}
 */
export async function getCurrentUser() {
  const client = getSupabase();
  if (!client) return null;

  try {
    const { data: { user } } = await client.auth.getUser();
    return user;
  } catch {
    return null;
  }
}

/**
 * Verifica si un usuario tiene rol de administrador en la tabla `usuarios_admin`.
 * @param {string} userId 
 * @returns {Promise<boolean>}
 */
export async function checkIsAdmin(userId) {
  const client = getSupabase();
  if (!client || !userId) return false;

  try {
    const { data, error } = await client
      .from('usuarios_admin')
      .select('user_id')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  } catch (err) {
    console.error('Error al verificar rol de admin:', err);
    return false;
  }
}

/**
 * Obtiene todas las carreras pendientes (solo accesible para administradores).
 * @returns {Promise<Array>} Array de carreras pendientes en formato frontend.
 */
export async function fetchPendingRacesSupabase() {
  const client = getSupabase();
  if (!client) return { success: false, error: 'Supabase no está configurado.' };

  try {
    const { data, error } = await client
      .from('carreras')
      .select('*')
      .eq('estado', 'pendiente')
      .order('fecha', { ascending: true });

    if (error) {
      console.error('Error al consultar carreras pendientes:', error);
      return { success: false, error: error.message || String(error) };
    }

    if (!Array.isArray(data)) return { success: true, data: [] };

    return { success: true, data: data.map(mapSupabaseToFrontend) };
  } catch (err) {
    console.error('Excepción al consultar carreras pendientes:', err);
    return { success: false, error: err.message || String(err) };
  }
}

/**
 * Actualiza el estado de una carrera (ej. 'aprobada', 'rechazada').
 * @param {string} raceId 
 * @param {'aprobada'|'rechazada'|'pendiente'} status 
 * @returns {Promise<{ success: boolean, error?: any }>}
 */
export async function updateRaceStatusSupabase(raceId, status) {
  const client = getSupabase();
  if (!client) return { success: false, error: 'Supabase no está configurado.' };

  try {
    const { error } = await client
      .from('carreras')
      .update({ estado: status })
      .eq('id', raceId);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('Error al actualizar estado de carrera:', err);
    return { success: false, error: err.message || err };
  }
}

/**
 * Elimina físicamente una carrera de la base de datos.
 * @param {string} raceId 
 * @returns {Promise<{ success: boolean, error?: any }>}
 */
export async function deleteRaceSupabase(raceId) {
  const client = getSupabase();
  if (!client) return { success: false, error: 'Supabase no está configurado.' };

  try {
    const { error } = await client
      .from('carreras')
      .delete()
      .eq('id', raceId);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('Error al eliminar carrera de Supabase:', err);
    return { success: false, error: err.message || err };
  }
}

/**
 * Modifica los datos de una carrera existente.
 * @param {string} raceId 
 * @param {Object} raceData 
 * @returns {Promise<{ success: boolean, error?: any }>}
 */
export async function updateRaceSupabase(raceId, raceData) {
  const client = getSupabase();
  if (!client) return { success: false, error: 'Supabase no está configurado.' };

  try {
    const payload = {
      nombre: raceData.name || raceData.nombre,
      fecha: raceData.date || raceData.fecha,
      disciplina: raceData.discipline || raceData.disciplina,
      region: raceData.region,
      ubicacion: raceData.city || raceData.ubicacion,
      distancia: raceData.distance || raceData.distancia || null,
      desnivel: raceData.elevation || raceData.desnivel || null,
      organizador: raceData.organizer || raceData.organizador,
      link_inscripcion: raceData.registrationUrl || raceData.link_inscripcion,
      categoria: Array.isArray(raceData.categories) 
        ? raceData.categories.join(', ') 
        : (raceData.categoria || raceData.categories),
      precio: raceData.price != null ? Number(raceData.price) : 0,
      hero_image: raceData.heroImage || raceData.hero_image,
      descripcion: raceData.description || raceData.descripcion
    };

    const { error } = await client
      .from('carreras')
      .update(payload)
      .eq('id', raceId);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('Error al actualizar carrera en Supabase:', err);
    return { success: false, error: err.message || err };
  }
}

/**
 * Sube una imagen al Storage de Supabase en el bucket 'race-images'.
 * @param {File} file Objeto File a subir.
 * @returns {Promise<{ success: boolean, url?: string, error?: any }>}
 */
export async function uploadRaceImageSupabase(file) {
  const client = getSupabase();
  if (!client) return { success: false, error: 'Supabase no está configurado.' };

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `hero-images/${fileName}`;

    const { data, error } = await client.storage
      .from('race-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: publicUrlData } = client.storage
      .from('race-images')
      .getPublicUrl(filePath);

    return {
      success: true,
      url: publicUrlData.publicUrl
    };
  } catch (err) {
    console.error('Error en uploadRaceImageSupabase:', err);
    return { success: false, error: err.message || err };
  }
}

