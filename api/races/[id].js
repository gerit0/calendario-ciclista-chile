import { raceSchema } from '../../shared/schema.js';
import {
  getSupabaseClient,
  extractToken,
  mapFrontendToDb,
  mapDbToFrontend
} from '../lib/supabase-server.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const raceId = req.query.id;
  if (!raceId || typeof raceId !== 'string') {
    return res.status(400).json({ error: 'ID de carrera no proporcionado o inválido.' });
  }

  const token = extractToken(req);
  const supabase = getSupabaseClient(token);

  // 1. GET /api/races/:id
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('carreras')
        .select('*')
        .eq('id', raceId)
        .maybeSingle();

      if (error) {
        return res.status(500).json({ error: 'Error al consultar la carrera.', details: error.message });
      }
      if (!data) {
        return res.status(404).json({ error: 'Carrera no encontrada.' });
      }

      return res.status(200).json({ success: true, data: mapDbToFrontend(data) });
    } catch (err) {
      return res.status(500).json({ error: 'Error interno del servidor.', details: err.message });
    }
  }

  // 2. PATCH /api/races/:id
  if (req.method === 'PATCH') {
    // 1. Validar payload con Zod (fail-fast)
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

    // 2. Verificar autenticación
    if (!token) {
      return res.status(401).json({ error: 'Autenticación requerida para editar carreras.' });
    }

    let user = null;
    try {
      const { data: { user: authUser }, error: authErr } = await supabase.auth.getUser();
      if (authErr || !authUser) {
        return res.status(401).json({ error: 'Sesión no válida o expirada.' });
      }
      user = authUser;
    } catch {
      return res.status(401).json({ error: 'Error al verificar credenciales de autenticación.' });
    }

    try {
      // Verificar existencia y permisos
      const { data: existingRace, error: fetchErr } = await supabase
        .from('carreras')
        .select('*')
        .eq('id', raceId)
        .maybeSingle();

      if (fetchErr) {
        return res.status(500).json({ error: 'Error al verificar la carrera.', details: fetchErr.message });
      }
      if (!existingRace) {
        return res.status(404).json({ error: 'Carrera no encontrada para editar.' });
      }

      // Verificar rol admin en public.usuarios_admin
      const { data: adminRecord } = await supabase
        .from('usuarios_admin')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle();

      const isAdmin = !!adminRecord;
      const isOwner = existingRace.creado_por === user.id;

      if (!isAdmin && !isOwner) {
        return res.status(403).json({ error: 'No tienes permisos para modificar esta carrera.' });
      }

      const dbPayload = mapFrontendToDb(parseResult.data);

      let { data: updatedData, error: updateErr } = await supabase
        .from('carreras')
        .update(dbPayload)
        .eq('id', raceId)
        .select('*')
        .maybeSingle();

      // Fallback defensivo si la base de datos aún no tiene columnas adicionales de distancia/desnivel
      if (updateErr && (updateErr.code === 'PGRST204' || String(updateErr.message || updateErr).includes('column'))) {
        delete dbPayload.distancia;
        delete dbPayload.desnivel;
        delete dbPayload.fecha_inicio;
        delete dbPayload.fecha_fin;
        delete dbPayload.status;

        const retry = await supabase
          .from('carreras')
          .update(dbPayload)
          .eq('id', raceId)
          .select('*')
          .maybeSingle();

        updatedData = retry.data;
        updateErr = retry.error;
      }

      if (updateErr) {
        return res.status(500).json({ error: 'Error al guardar los cambios en la base de datos.', details: updateErr.message });
      }

      return res.status(200).json({
        success: true,
        data: mapDbToFrontend(updatedData || { id: raceId, ...dbPayload })
      });
    } catch (err) {
      return res.status(500).json({ error: 'Excepción durante la actualización.', details: err.message });
    }
  }

  // 3. DELETE /api/races/:id
  if (req.method === 'DELETE') {
    if (!token) {
      return res.status(401).json({ error: 'Autenticación requerida para eliminar carreras.' });
    }

    try {
      const { data: { user }, error: authErr } = await supabase.auth.getUser();
      if (authErr || !user) {
        return res.status(401).json({ error: 'Sesión no válida o expirada.' });
      }

      const { data: existingRace } = await supabase
        .from('carreras')
        .select('id, creado_por')
        .eq('id', raceId)
        .maybeSingle();

      if (!existingRace) {
        return res.status(404).json({ error: 'Carrera no encontrada para eliminar.' });
      }

      const { data: adminRecord } = await supabase
        .from('usuarios_admin')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle();

      const isAdmin = !!adminRecord;
      const isOwner = existingRace.creado_por === user.id;

      if (!isAdmin && !isOwner) {
        return res.status(403).json({ error: 'No tienes permisos para eliminar esta carrera.' });
      }

      const { error: delErr } = await supabase
        .from('carreras')
        .delete()
        .eq('id', raceId);

      if (delErr) {
        return res.status(500).json({ error: 'Error al eliminar la carrera.', details: delErr.message });
      }

      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: 'Excepción durante la eliminación.', details: err.message });
    }
  }

  return res.status(405).json({ error: 'Método no permitido.' });
}
