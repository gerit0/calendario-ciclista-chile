import { raceSchema } from '../../shared/schema.js';
import {
  getSupabaseClient,
  extractToken,
  mapFrontendToDb,
  mapDbToFrontend
} from '../lib/supabase-server.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const token = extractToken(req);
  const supabase = getSupabaseClient(token);

  // 1. GET /api/races (Listar carreras)
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('carreras')
        .select('*')
        .eq('estado', 'aprobada')
        .order('fecha', { ascending: true })
        .limit(500);

      if (error) {
        return res.status(500).json({ error: 'Error al consultar carreras.', details: error.message });
      }

      return res.status(200).json({
        success: true,
        data: (data || []).map(mapDbToFrontend)
      });
    } catch (err) {
      return res.status(500).json({ error: 'Error interno del servidor.', details: err.message });
    }
  }

  // 2. POST /api/races (Crear nueva carrera)
  if (req.method === 'POST') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const parseResult = raceSchema.safeParse(body);
    if (!parseResult.success) {
      const issues = parseResult.error.issues.map(iss => ({
        field: iss.path.join('.'),
        message: iss.message
      }));
      return res.status(422).json({
        error: 'Los datos de la carrera no son válidos.',
        issues
      });
    }

    if (!token) {
      return res.status(401).json({ error: 'Se requiere una cuenta de organizador para publicar una carrera.' });
    }

    let user = null;
    try {
      const { data: { user: authUser }, error: authErr } = await supabase.auth.getUser();
      if (authErr || !authUser) {
        return res.status(401).json({ error: 'Sesión no válida o expirada.' });
      }
      user = authUser;
    } catch {
      return res.status(401).json({ error: 'Error al autenticar usuario.' });
    }

    try {
      const dbPayload = mapFrontendToDb(parseResult.data, user.id);
      dbPayload.estado = 'aprobada'; // Auto-publicación según política RLS actual

      let { data, error } = await supabase
        .from('carreras')
        .insert([dbPayload])
        .select('*')
        .maybeSingle();

      // Fallback defensivo si la BD no tiene columnas distancia/desnivel
      if (error && (error.code === 'PGRST204' || String(error.message || error).includes('column'))) {
        delete dbPayload.distancia;
        delete dbPayload.desnivel;
        delete dbPayload.fecha_inicio;
        delete dbPayload.fecha_fin;
        delete dbPayload.status;

        const retry = await supabase
          .from('carreras')
          .insert([dbPayload])
          .select('*')
          .maybeSingle();

        data = retry.data;
        error = retry.error;
      }

      if (error) {
        return res.status(500).json({ error: 'Error al registrar la carrera en la base de datos.', details: error.message });
      }

      return res.status(201).json({
        success: true,
        data: mapDbToFrontend(data || dbPayload)
      });
    } catch (err) {
      return res.status(500).json({ error: 'Excepción al registrar carrera.', details: err.message });
    }
  }

  return res.status(405).json({ error: 'Método no permitido.' });
}
