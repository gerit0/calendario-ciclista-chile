const fs = require('fs');
const path = require('path');
const https = require('https');

const SUPABASE_URL = 'https://mhzktzvxdmhanqkhhaqm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oemt0enZ4ZG1oYW5xa2hoYXFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ1NjAyMzMsImV4cCI6MjEwMDEzNjIzM30.WNC9F2xqRPk7Ry5Sxr53BloWaq1hZ09FDI7OItfQB8s';

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

function renderDetailHtmlSSR(race) {
  if (!race) return '';

  const raceName = escapeHtml(race.nombre || race.name || 'Carrera de Ciclismo');
  const discipline = escapeHtml(race.disciplina || race.discipline || 'Ruta');
  const date = escapeHtml(race.fecha || race.date || '');
  const region = escapeHtml(race.region || 'Chile');
  const city = escapeHtml(race.ubicacion || race.city || '');
  const distance = escapeHtml(race.distancia || race.distance || 'N/A');
  const elevation = escapeHtml(race.desnivel || race.elevation || 'N/A');
  const organizer = escapeHtml(race.organizador || race.organizer || 'Organizador Oficial');
  const regUrl = escapeHtml(race.link_inscripcion || race.registrationUrl || '#');
  const heroImg = escapeHtml(race.hero_image || race.heroImage || 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=1200&q=80');
  const description = escapeHtml(race.descripcion || race.description || 'Detalles del evento por confirmar.');
  const price = race.precio != null ? Number(race.precio) : 0;
  const isFree = price === 0;
  const priceText = isFree ? 'Gratuita' : `$${price.toLocaleString('es-CL')}`;

  return `
    <div class="space-y-8 animate-fadeIn">
      <div class="flex items-center justify-between flex-wrap gap-4">
        <a href="/" id="btn-back-to-calendar" class="px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-display font-bold text-sm flex items-center gap-2 transition-colors">
          <span class="material-symbols-outlined text-lg">arrow_back</span>
          Volver a Carreras
        </a>
      </div>

      <div class="relative rounded-3xl bg-primary text-white overflow-hidden shadow-2xl">
        <div class="absolute inset-0 z-0">
          <img src="${heroImg}" alt="${raceName}" class="w-full h-full object-cover opacity-35 filter brightness-90">
          <div class="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-transparent"></div>
        </div>

        <div class="relative z-10 p-6 sm:p-10 lg:p-12 space-y-6">
          <div class="flex flex-wrap items-center gap-3">
            <span class="px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/30">
              ${discipline}
            </span>
            <span class="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-tertiary-fixed text-primary shadow-md">
              Inscripciones Abiertas
            </span>
            <span class="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white/10 backdrop-blur-md text-white border border-white/20">
              ${priceText}
            </span>
          </div>

          <h1 class="font-display font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-none max-w-4xl text-white">
            ${raceName}
          </h1>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-white/15">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-tertiary-fixed">
                <span class="material-symbols-outlined">calendar_month</span>
              </div>
              <div>
                <p class="text-[10px] font-bold uppercase tracking-wider text-gray-300">Fecha</p>
                <p class="font-display font-bold text-sm text-white">${date}</p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-tertiary-fixed">
                <span class="material-symbols-outlined">location_on</span>
              </div>
              <div>
                <p class="text-[10px] font-bold uppercase tracking-wider text-gray-300">Ubicación</p>
                <p class="font-display font-bold text-sm text-white">${city ? city + ', ' : ''}${region}</p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-tertiary-fixed">
                <span class="material-symbols-outlined">straighten</span>
              </div>
              <div>
                <p class="text-[10px] font-bold uppercase tracking-wider text-gray-300">Distancia</p>
                <p class="font-display font-bold text-sm text-white">${distance}</p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-tertiary-fixed">
                <span class="material-symbols-outlined">landscape</span>
              </div>
              <div>
                <p class="text-[10px] font-bold uppercase tracking-wider text-gray-300">Desnivel</p>
                <p class="font-display font-bold text-sm text-white">${elevation}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white rounded-3xl p-6 sm:p-8 border border-outline-variant/40 shadow-sm space-y-4">
            <h3 class="font-display font-bold text-xl text-primary flex items-center gap-2">
              <span class="material-symbols-outlined text-secondary">description</span>
              Descripción del Evento
            </h3>
            <div class="text-gray-700 leading-relaxed space-y-4 text-sm sm:text-base whitespace-pre-line">
              ${description}
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="bg-white rounded-3xl p-6 border border-outline-variant/40 shadow-sm space-y-6">
            <div class="space-y-2">
              <p class="text-xs font-bold uppercase tracking-wider text-outline">Organiza</p>
              <p class="font-display font-bold text-lg text-primary flex items-center gap-2">
                <span class="material-symbols-outlined text-secondary">groups</span>
                ${organizer}
              </p>
            </div>

            ${regUrl && regUrl !== '#' ? `
              <a href="${regUrl}" target="_blank" rel="noopener noreferrer" class="w-full py-4 rounded-2xl bg-tertiary-fixed text-primary font-display font-bold text-center text-base hover:brightness-105 transition-all shadow-lg flex items-center justify-center gap-2 block">
                <span class="material-symbols-outlined">open_in_new</span>
                Ir al Sitio de Inscripción
              </a>
            ` : ''}
          </div>
        </div>
      </div>
    </div>
  `;
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

    // SSR: Ocultar sección de calendario y mostrar sección de detalle con el contenido pre-renderizado
    html = html.replace('<section id="view-calendar">', '<section id="view-calendar" class="hidden">');
    html = html.replace('<section id="view-detail" class="hidden">', '<section id="view-detail">');
    
    const detailHtml = renderDetailHtmlSSR(race);
    html = html.replace('<div id="detail-content"></div>', `<div id="detail-content">${detailHtml}</div>`);
  }

  // Limpiar etiquetas meta de head existentes para evitar duplicados con los genéricos
  html = html
    .replace(/<title>.*?<\/title>/gi, '')
    .replace(/<meta\s+name=["']description["'][^>]*>/gi, '')
    .replace(/<meta\s+property=["']og:[^"']+["'][^>]*>/gi, '')
    .replace(/<meta\s+name=["']twitter:[^"']+["'][^>]*>/gi, '')
    .replace(/<link\s+rel=["']canonical["'][^>]*>/gi, '');

  const metaTags = `
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <link rel="canonical" href="${escapeHtml(pageUrl)}">
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

  html = html.replace('</head>', `${metaTags}\n</head>`);

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
