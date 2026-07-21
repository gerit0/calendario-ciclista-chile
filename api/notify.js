const nodemailer = require('nodemailer');

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

module.exports = async (req, res) => {
  // Configurar CORS / Method Check
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Utiliza POST.' });
  }

  let race = req.body || {};
  if (typeof race === 'string') {
    try {
      race = JSON.parse(race);
    } catch (e) {
      race = {};
    }
  }

  const raceName = race.nombre || race.name || 'Nueva Carrera de Ciclismo';
  const discipline = race.disciplina || race.discipline || 'Ruta';
  const date = race.fecha || race.date || 'Fecha por confirmar';
  const region = race.region || 'Chile';
  const city = race.ubicacion || race.city || '';
  const distance = race.distancia || race.distance || 'N/A';
  const elevation = race.desnivel || race.elevation || 'N/A';
  const organizer = race.organizador || race.organizer || 'No especificado';
  const description = race.descripcion || race.description || 'Sin descripción adicional.';

  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = Number(process.env.SMTP_PORT) || 465;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const notifyEmail = process.env.NOTIFY_EMAIL || smtpUser;

  if (!smtpUser || !smtpPass) {
    console.warn('[api/notify] Advertencia: SMTP_USER o SMTP_PASS no están configurados en Vercel.');
    return res.status(200).json({
      success: false,
      message: 'Email de notificación no enviado: Faltan credenciales SMTP_USER / SMTP_PASS en las variables de entorno de Vercel.'
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc; border-radius: 16px; border: 1px solid #e2e8f0;">
        <div style="background-color: #181919; padding: 20px; border-radius: 12px; text-align: center; margin-bottom: 20px;">
          <h2 style="color: #d8ef00; margin: 0; font-size: 22px;">🚴 Nueva Carrera Pendiente de Moderación</h2>
          <p style="color: #ffffff; margin: 5px 0 0 0; font-size: 14px;">CalendarioCiclista Chile</p>
        </div>

        <div style="background-color: #ffffff; padding: 20px; border-radius: 12px; border: 1px solid #cbd5e1; margin-bottom: 20px;">
          <h3 style="color: #0f172a; margin-top: 0; font-size: 18px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">
            ${escapeHtml(raceName)}
          </h3>
          
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #334155;">
            <tr>
              <td style="padding: 6px 0; font-weight: bold; width: 120px;">Disciplina:</td>
              <td style="padding: 6px 0;">${escapeHtml(discipline)}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Fecha:</td>
              <td style="padding: 6px 0;">${escapeHtml(date)}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Ubicación:</td>
              <td style="padding: 6px 0;">${escapeHtml(city ? city + ', ' : '')}${escapeHtml(region)}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Especificaciones:</td>
              <td style="padding: 6px 0;">Distancia: ${escapeHtml(distance)} | Desnivel: ${escapeHtml(elevation)}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Organiza:</td>
              <td style="padding: 6px 0;">${escapeHtml(organizer)}</td>
            </tr>
          </table>

          <div style="margin-top: 15px; padding-top: 12px; border-top: 1px dashed #cbd5e1;">
            <p style="margin: 0; font-weight: bold; color: #475569; font-size: 13px;">Descripción:</p>
            <p style="margin: 5px 0 0 0; color: #64748b; font-size: 13px; white-space: pre-line;">${escapeHtml(description)}</p>
          </div>
        </div>

        <div style="text-align: center;">
          <a href="https://calendariociclista.vercel.app/admin" target="_blank" style="display: inline-block; background-color: #d8ef00; color: #181919; font-weight: bold; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-size: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            Ir al Panel de Moderación
          </a>
        </div>

        <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 20px;">
          Notificación automática enviada por CalendarioCiclista Chile
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: `"CalendarioCiclista Bot" <${smtpUser}>`,
      to: notifyEmail,
      subject: `🚴 Nueva Carrera Propuesta: ${raceName} (${discipline})`,
      html: htmlContent
    });

    return res.status(200).json({ success: true, message: 'Notificación de correo enviada exitosamente.' });
  } catch (err) {
    console.error('[api/notify] Error al enviar email:', err);
    return res.status(200).json({ success: false, error: err.message || err });
  }
};
