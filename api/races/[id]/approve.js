import crypto from 'crypto';
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

    // 4. Procesamiento de imagen: Garantizar que NUNCA quede Base64
    let finalHeroImage = race.hero_image;
    let imageWarning = null;

    if (race.hero_image && typeof race.hero_image === 'string' && race.hero_image.startsWith('data:')) {
      const match = race.hero_image.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/s);
      if (!match) {
        finalHeroImage = null;
        imageWarning = 'La imagen en Base64 estaba corrupta; se aprobó sin imagen.';
      } else {
        const rawExt = match[1].toLowerCase();
        const ext = rawExt === 'jpeg' ? 'jpg' : rawExt;
        const allowedExts = ['png', 'jpg', 'webp'];

        if (!allowedExts.includes(ext)) {
          finalHeroImage = null;
          imageWarning = 'El formato de imagen no es compatible; se aprobó sin imagen.';
        } else {
          const rawBase64 = match[2].trim();
          const isValidBase64 = /^[A-Za-z0-9+/]+={0,2}$/.test(rawBase64) && (rawBase64.length % 4 === 0);
          if (!isValidBase64) {
            finalHeroImage = null;
            imageWarning = 'La imagen en Base64 estaba corrupta; se aprobó sin imagen.';
          } else {
            try {
              const buffer = Buffer.from(rawBase64, 'base64');
              if (buffer.length > 5 * 1024 * 1024) {
                finalHeroImage = null;
                imageWarning = 'La imagen superaba los 5MB; se aprobó sin imagen.';
              } else {
                const filename = `races/${crypto.randomUUID()}.${ext}`;
              const { error: uploadErr } = await supabase.storage
                .from('race-images')
                .upload(filename, buffer, {
                  contentType: `image/${rawExt}`,
                  upsert: true
                });

              if (uploadErr) {
                console.error('Error al subir imagen convertida a Storage:', uploadErr);
                finalHeroImage = null;
                imageWarning = 'No se pudo subir la imagen al almacenamiento; se aprobó sin imagen.';
              } else {
                const { data: pubData } = supabase.storage
                  .from('race-images')
                  .getPublicUrl(filename);

                const publicUrl = pubData.publicUrl;

                // Verificación de salud HTTP 200 de la imagen
                try {
                  const checkRes = await fetch(publicUrl, { method: 'HEAD' });
                  if (checkRes.ok) {
                    finalHeroImage = publicUrl;
                  } else {
                    finalHeroImage = null;
                    imageWarning = 'La URL de la imagen no respondió correctamente; se aprobó sin imagen.';
                  }
                } catch {
                  // Si fetch falla en el entorno de pruebas o red, mantenemos la publicUrl si no es base64
                  finalHeroImage = publicUrl;
                }
              }
            }
          } catch (decodeErr) {
            console.error('Error al decodificar base64:', decodeErr);
            finalHeroImage = null;
            imageWarning = 'Error al decodificar la imagen; se aprobó sin imagen.';
          }
        }
      }
    }
  }

    // Doble candado: Si por alguna razón finalHeroImage sigue siendo data:, anularla
    if (finalHeroImage && finalHeroImage.startsWith('data:')) {
      finalHeroImage = null;
    }

    // 5. Actualización atómica en la base de datos
    const updatePayload = {
      estado: 'aprobada',
      hero_image: finalHeroImage
    };

    if (!race.status || race.status === 'Pendiente') {
      updatePayload.status = 'Inscripciones Abiertas';
    }

    const { data: updatedRace, error: updateErr } = await supabase
      .from('carreras')
      .update(updatePayload)
      .eq('id', raceId)
      .select()
      .maybeSingle();

    if (updateErr) {
      console.error('Error al aprobar carrera en Supabase:', updateErr);
      return res.status(500).json({
        success: false,
        error: 'Error al actualizar el estado de la carrera: ' + updateErr.message
      });
    }

    return res.status(200).json({
      success: true,
      message: imageWarning ? `Carrera aprobada con éxito. (${imageWarning})` : 'Carrera aprobada con éxito.',
      warning: imageWarning,
      data: mapDbToFrontend(updatedRace || { ...race, ...updatePayload })
    });
  } catch (err) {
    console.error('Excepción al aprobar carrera:', err);
    return res.status(500).json({ success: false, error: 'Error interno del servidor al procesar la aprobación.' });
  }
}
