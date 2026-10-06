import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = process.env.SUPABASE_URL || 'https://mhzktzvxdmhanqkhhaqm.supabase.co';
export const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oemt0enZ4ZG1oYW5xa2hoYXFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ1NjAyMzMsImV4cCI6MjEwMDEzNjIzM30.WNC9F2xqRPk7Ry5Sxr53BloWaq1hZ09FDI7OItfQB8s';

let customClientFactory = null;

export function setCustomClientFactory(factory) {
  customClientFactory = factory;
}

/**
 * Crea una instancia de Supabase ligada al token JWT del usuario para respetar RLS.
 * @param {string|null} token
 */
export function getSupabaseClient(token = null) {
  if (customClientFactory) {
    return customClientFactory(token);
  }

  const options = {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  };

  if (token) {
    options.global = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  }

  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, options);
}

/**
 * Extrae el Bearer token de la cabecera Authorization
 * @param {Object} req
 * @returns {string|null}
 */
export function extractToken(req) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader || typeof authHeader !== 'string') return null;
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : null;
}

/**
 * Mapea los datos del esquema frontend (camelCase) al formato de base de datos Supabase
 */
export function mapFrontendToDb(data, userId = null) {
  const payload = {
    nombre: data.name,
    fecha: data.date || data.startDate,
    fecha_inicio: data.startDate || data.date,
    fecha_fin: data.endDate || data.startDate || data.date,
    disciplina: data.discipline,
    region: data.region,
    ubicacion: data.city,
    distancia: data.distance || 'N/A',
    desnivel: data.elevation || 'N/A',
    organizador: data.organizer,
    link_inscripcion: data.registrationUrl || null,
    link_bases: data.rulesUrl && data.rulesUrl.trim() ? data.rulesUrl.trim() : null,
    categoria: Array.isArray(data.categories) ? data.categories.join(', ') : (data.categories || null),
    precio: data.price != null ? Number(data.price) : 0,
    hero_image: data.heroImage || null,
    descripcion: data.description,
    status: data.status || 'Inscripciones Abiertas'
  };

  if (userId) {
    payload.creado_por = userId;
  }

  return payload;
}

/**
 * Mapea un registro de Supabase al formato frontend
 */
export function mapDbToFrontend(row) {
  if (!row) return null;
  const priceNum = row.precio != null ? Number(row.precio) : 0;
  const startDate = row.fecha_inicio || row.fecha || '';
  const endDate = row.fecha_fin || startDate;

  let categories = ['General'];
  if (Array.isArray(row.categoria)) {
    categories = row.categoria;
  } else if (typeof row.categoria === 'string' && row.categoria.trim()) {
    categories = row.categoria.split(',').map(s => s.trim()).filter(Boolean);
  }

  return {
    id: row.id,
    name: row.nombre || '',
    discipline: row.disciplina || '',
    date: startDate,
    startDate,
    endDate,
    region: row.region || '',
    city: row.ubicacion || '',
    distance: row.distancia || 'N/A',
    elevation: row.desnivel || 'N/A',
    price: priceNum,
    isFree: priceNum === 0,
    status: row.status || (row.estado === 'aprobada' ? 'Inscripciones Abiertas' : row.estado),
    organizer: row.organizador || '',
    registrationUrl: row.link_inscripcion || '',
    rulesUrl: row.link_bases || '',
    heroImage: row.hero_image || '',
    description: row.descripcion || '',
    categories,
    creadoPor: row.creado_por || null
  };
}
