import {
  getSupabaseClient,
  extractToken,
  mapDbToFrontend
} from '../../lib/supabase-server.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Método no permitido. Utiliza POST.' });
  }

  const raceId = req.query.id;
  if (!raceId || typeof raceId !== 'string') {
    return res.status(400).json({ success: false, error: 'ID de carrera inválido o no proporcionado.' });
  }

  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ success: false, error: 'No autorizado: se requiere token de autenticación Bearer.' });
  }

  const supabase = getSupabaseClient(token);

  try {
    // 1. Validar usuario autenticado
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      return res.status(401).json({ success: false, error: 'Sesión inválida o expirada.' });
    }

    // 2. Validar rol de administrador en tabla usuarios_admin
    const { data: adminRow, error: adminErr } = await supabase
      .from('usuarios_admin')
      .select('user_id')
      .eq('user_id', userData.user.id)
      .maybeSingle();

    if (adminErr || !adminRow) {
      return res.status(403).json({ success: false, error: 'Acceso denegado: se requieren permisos de administrador.' });
    }

    // 3. Consultar la carrera objetivo
    const { data: race, error: fetchErr } = await supabase
      .from('carreras')
      .select('*')
      .eq('id', raceId)
      .maybeSingle();

    if (fetchErr) {
      return res.status(500).json({ success: false, error: 'Error al consultar la carrera en la base de datos.' });
    }

    if (!race) {
      return res.status(404).json({ success: false, error: 'Carrera no encontrada.' });
    }

    // 4. Si la carrera contiene hero_image en base64, limpiarla para evitar violar check_no_base64_hero_image
    const updatePayload = {
      estado: 'rechazada'
    };

    if (race.hero_image && typeof race.hero_image === 'string' && race.hero_image.startsWith('data:')) {
      updatePayload.hero_image = null;
    }

    // 5. Actualizar estado
    const { data: updatedRace, error: updateErr } = await supabase
      .from('carreras')
      .update(updatePayload)
      .eq('id', raceId)
      .select()
      .maybeSingle();

    if (updateErr) {
      console.error('Error al rechazar carrera en Supabase:', updateErr);
      return res.status(500).json({
        success: false,
        error: 'Error al actualizar el estado de la carrera: ' + updateErr.message
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Carrera rechazada con éxito.',
      data: mapDbToFrontend(updatedRace || { ...race, ...updatePayload })
    });
  } catch (err) {
    console.error('Excepción al rechazar carrera:', err);
    return res.status(500).json({ success: false, error: 'Error interno del servidor al procesar el rechazo.' });
  }
}
