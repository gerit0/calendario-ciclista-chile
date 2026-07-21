const fs = require('fs');
const path = require('path');
const https = require('https');

const SUPABASE_URL = 'https://oawjuhaykksksfuyptot.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hd2p1aGF5a2tza3NmdXlwdG90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwMDAwMDAsImV4cCI6MjA1NzU3NjAwMH0.placeholder';

function fetchRaceFromSupabase(id) {
  return new Promise((resolve) => {
    const url = `${SUPABASE_URL}/rest/v1/carreras?id=eq.${encodeURIComponent(id)}&select=*`;
    const options = {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    };

    const req = https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const rows = JSON.parse(data);
          if (Array.isArray(rows) && rows.length > 0) {
            resolve(rows[0]);
          } else {
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    });

    req.on('error', () => resolve(null));
    req.setTimeout(2500, () => {
      req.destroy();
      resolve(null);
    });
  });
}

module.exports = async (req, res) => {
  const eventId = req.query.id || (req.url.match(/\/evento\/([^/?]+)/) || [])[1];

  let htmlPath = path.join(__dirname, '../index.html');
  let html = '';

  try {
    html = fs.readFileSync(htmlPath, 'utf8');
  } catch (err) {
    return res.status(500).send('Error reading template');
  }

  if (!eventId) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(html);
  }

  const race = await fetchRaceFromSupabase(eventId);

  let title = "CalendarioCiclista Chile — Todas las carreras de ciclismo en Chile";
  let description = "Descubre y participa en las mejores carreras de Ciclismo de Ruta, MTB, Gravel, Pista y BMX de Chile.";
  let image = "https://calendariociclista.vercel.app/og-image.jpg";
  let pageUrl = `https://calendariociclista.vercel.app/evento/${eventId}`;

  if (race) {
    const raceName = race.nombre || race.name || 'Carrera de Ciclismo';
    const discipline = race.disciplina || race.discipline || 'Ciclismo';
    const region = race.region || 'Chile';
    const date = race.fecha || race.date || '';

    title = `${raceName} (${discipline}) — CalendarioCiclista Chile`;
    description = `Compite el ${date} en ${region}. Revisa los detalles, distancias, desnivel acumulado e inscríbete hoy en CalendarioCiclista Chile.`;
    if (race.hero_image || race.heroImage) {
      image = race.hero_image || race.heroImage;
    }
  }

  // Inyectar / Reemplazar Open Graph meta tags
  const ogTags = `
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <meta property="og:type" content="website">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:image" content="${escapeHtml(image)}">
    <meta property="og:url" content="${escapeHtml(pageUrl)}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(description)}">
    <meta name="twitter:image" content="${escapeHtml(image)}">
  `;

  // Reemplazar <title> original si existe
  if (html.includes('<title>')) {
    html = html.replace(/<title>.*?<\/title>/s, ogTags);
  } else {
    html = html.replace('</head>', `${ogTags}\n</head>`);
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
  return res.status(200).send(html);
};

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
