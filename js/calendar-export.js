/**
 * Módulo de Exportación a Calendario (js/calendar-export.js)
 * Proporciona utilidades para generar archivos .ics y enlaces a Google Calendar.
 */

/**
 * Formatea una fecha YYYY-MM-DD o ISO a formato YYYYMMDD para iCalendar todo el día.
 * @param {string} dateStr 
 * @returns {string} Ej: "20261025"
 */
export function formatDateForICS(dateStr) {
  if (!dateStr) return '';
  const clean = String(dateStr).trim().split('T')[0].replace(/-/g, '');
  return clean;
}

/**
 * Calcula la fecha de fin (el día siguiente para eventos de 1 día, o end_date + 1 día).
 * @param {string} startDateStr 
 * @param {string} [endDateStr] 
 * @returns {string} Ej: "20261026"
 */
export function calculateEndDateICS(startDateStr, endDateStr) {
  const startClean = (startDateStr || '').trim().split('T')[0];
  const endClean = (endDateStr || startClean).trim().split('T')[0];
  if (!endClean) return '';

  const parts = endClean.split('-').map(Number);
  if (parts.length < 3 || isNaN(parts[0]) || isNaN(parts[1]) || isNaN(parts[2])) return '';

  // Crear objeto Date y agregar 1 día (estándar iCalendar para eventos VALUE=DATE)
  const d = new Date(parts[0], parts[1] - 1, parts[2] + 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

/**
 * Genera el contenido de un archivo .ics (RFC 5545) para una carrera.
 * @param {Object} race 
 * @returns {string}
 */
export function generateICSContent(race) {
  if (!race) return '';
  const title = race.name || race.nombre || 'Carrera de Ciclismo';
  const startStr = formatDateForICS(race.startDate || race.fecha_inicio || race.date || race.fecha);
  const endStr = calculateEndDateICS(
    race.startDate || race.fecha_inicio || race.date || race.fecha,
    race.endDate || race.fecha_fin
  );

  const city = race.city || race.ubicacion || '';
  const region = race.region || '';
  const location = [city, region].filter(Boolean).join(', ') || 'Chile';
  
  const discipline = race.discipline || race.disciplina || 'Ciclismo';
  const dist = race.distance || race.distancia || 'N/A';
  const elev = race.elevation || race.desnivel || 'N/A';
  const rawDesc = race.description || race.descripcion || '';
  
  const fullDesc = `Disciplina: ${discipline}\nDistancia: ${dist} | Desnivel: ${elev}\n${rawDesc}\n\nMás información en CalendarioCiclista Chile: https://calendariociclista.vercel.app/evento/${race.id}`;
  
  // Escapar caracteres iCalendar según RFC 5545
  const escapeICS = (str) => String(str || '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CalendarioCiclista Chile//NONSGML v1.0//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:carrera-${race.id}@calendariociclista.vercel.app`,
    `DTSTAMP:${formatDateForICS(new Date().toISOString())}T000000Z`,
    `DTSTART;VALUE=DATE:${startStr}`,
    `DTEND;VALUE=DATE:${endStr}`,
    `SUMMARY:${escapeICS(title)}`,
    `DESCRIPTION:${escapeICS(fullDesc)}`,
    `LOCATION:${escapeICS(location)}`,
    `URL:https://calendariociclista.vercel.app/evento/${race.id}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

/**
 * Genera una URL de redirección directa a Google Calendar para una carrera.
 * @param {Object} race 
 * @returns {string}
 */
export function buildGoogleCalendarUrl(race) {
  if (!race) return '#';
  const title = race.name || race.nombre || 'Carrera de Ciclismo';
  const startStr = formatDateForICS(race.startDate || race.fecha_inicio || race.date || race.fecha);
  const endStr = calculateEndDateICS(
    race.startDate || race.fecha_inicio || race.date || race.fecha,
    race.endDate || race.fecha_fin
  );

  const city = race.city || race.ubicacion || '';
  const region = race.region || '';
  const location = [city, region].filter(Boolean).join(', ') || 'Chile';

  const discipline = race.discipline || race.disciplina || 'Ciclismo';
  const dist = race.distance || race.distancia || 'N/A';
  const elev = race.elevation || race.desnivel || 'N/A';
  const rawDesc = race.description || race.descripcion || '';
  
  const details = `Disciplina: ${discipline}\nDistancia: ${dist} | Desnivel: ${elev}\n${rawDesc}\n\nMás información: https://calendariociclista.vercel.app/evento/${race.id}`;

  const baseUrl = 'https://calendar.google.com/calendar/render';
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${startStr}/${endStr}`,
    details: details,
    location: location
  });

  return `${baseUrl}?${params.toString()}`;
}

/**
 * Inicia la descarga del archivo .ics en el navegador.
 * @param {Object} race 
 */
export function downloadICSFile(race) {
  const content = generateICSContent(race);
  if (!content) return;
  
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  const safeName = (race.name || race.nombre || 'carrera')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
    
  link.href = url;
  link.download = `${safeName}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
