# Notificaciones por Correo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement automated email notifications via Vercel Serverless Function (`api/notify.js`) and `nodemailer` whenever a new race proposal is submitted for moderation.

**Architecture:** Create `api/notify.js` to parse submitted pending race data and dispatch an HTML email using Nodemailer with SMTP credentials from Vercel Environment Variables. Update `js/supabase.js` to call `/api/notify` upon successful pending race submission.

**Tech Stack:** Node.js, Nodemailer, Vercel Serverless Functions, JavaScript ES Modules.

---

### File Structure

- `package.json`: [MODIFY] Add `nodemailer` dependency.
- `api/notify.js`: [NEW] Vercel Serverless Function that sends HTML notification emails using Nodemailer.
- `js/supabase.js`: [MODIFY] Call `/api/notify` after successful insertion in `createPendingRaceSupabase`.
- `scratch/qa_test.js`: [MODIFY] Add test assertions for `api/notify.js` and notification trigger.

---

### Task 1: Add `nodemailer` dependency & Create `api/notify.js`

**Files:**
- Modify: `package.json`
- Create: `api/notify.js`
- Modify: `scratch/qa_test.js`

- [ ] **Step 1: Install `nodemailer`**

Run: `npm install nodemailer`

- [ ] **Step 2: Create `api/notify.js`**

```javascript
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
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Utiliza POST.' });
  }

  const race = req.body || {};
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
```

- [ ] **Step 3: Add assertions to `scratch/qa_test.js`**

```javascript
// AREA 10 — Notificaciones por Correo
const notifyApiSrc = fs.readFileSync('api/notify.js', 'utf8');

test('10.1a', 'api/notify.js usa nodemailer', () =>
  notifyApiSrc.includes("require('nodemailer')") ? true : 'Falta require nodemailer'
);
test('10.1b', 'api/notify.js maneja variables de entorno SMTP_USER y SMTP_PASS', () => {
  const hasUser = notifyApiSrc.includes('process.env.SMTP_USER');
  const hasPass = notifyApiSrc.includes('process.env.SMTP_PASS');
  return (hasUser && hasPass) ? true : 'Faltan env vars en api/notify.js';
});
```

- [ ] **Step 4: Run QA tests**

Run: `node "C:\Users\gerit\.gemini\antigravity\brain\3604f2a2-81a1-4697-aafb-d1a49e42ec5e\scratch\qa_test.js"`
Expected: PASS all 31 tests.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json api/notify.js scratch/qa_test.js
git commit -m "feat: add api/notify.js serverless function with nodemailer"
```

---

### Task 2: Trigger Notification in `js/supabase.js` and Deploy

**Files:**
- Modify: `js/supabase.js`
- Modify: `scratch/qa_test.js`

- [ ] **Step 1: Update `createPendingRaceSupabase` in `js/supabase.js`**

After successful race insertion in `createPendingRaceSupabase`:
```javascript
    // Disparar notificación por correo en segundo plano (sin bloquear)
    fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(err => console.warn('Notificación de correo omitida o no disponible:', err));
```

- [ ] **Step 2: Add test assertion in `scratch/qa_test.js`**

```javascript
test('10.2a', 'supabase.js llama a /api/notify al crear carrera pendiente', () =>
  supabaseSrc.includes('/api/notify') ? true : 'No se encontró llamada a /api/notify en supabase.js'
);
```

- [ ] **Step 3: Run QA test suite**

Run: `node "C:\Users\gerit\.gemini\antigravity\brain\3604f2a2-81a1-4697-aafb-d1a49e42ec5e\scratch\qa_test.js"`
Expected: PASS all 32 tests.

- [ ] **Step 4: Commit, Push and Deploy**

```bash
git commit -am "feat: trigger email notification upon race creation and deploy to Vercel"
git push origin main
npx vercel --prod --yes
npx vercel alias set https://<deploy-url> calendariociclista.vercel.app
```
