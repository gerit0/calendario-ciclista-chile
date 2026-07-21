/**
 * calendar-export.js
 * Utilidades para exportar eventos de carrera a Google Calendar, Apple Calendar (.ics) y Outlook (.ics).
 */

/**
 * Formatea una fecha YYYY-MM-DD a formato ICS YYYYMMDD (all-day event).
 * @param {string} dateStr - Fecha en formato YYYY-MM-DD
 * @returns {string}
 */
function toICSDate(dateStr) {
  if (!dateStr) return '';
  return dateStr.replace(/-/g, '').split('T')[0];
}

/**
 * Escapa caracteres especiales para contenido ICS.
 * @param {string} str
 * @returns {string}
 */
function escapeICS(str) {
  if (!str) return '';
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '');
}

/**
 * Genera el string completo de un archivo .ics para una carrera.
 * @param {Object} race - Objeto de carrera con campos del modelo
 * @returns {string} Contenido del archivo ICS
 */
export function generateICSContent(race) {
  const startStr = (race.startDate || race.fecha_inicio || race.date || '').split('T')[0].trim();
  const endStr = (race.endDate || race.fecha_fin || startStr).split('T')[0].trim();

  const dtstart = toICSDate(startStr);

  // DTEND para eventos de día completo debe ser el día siguiente (exclusive)
  let dtend = dtstart;
  if (endStr && endStr !== startStr) {
    dtend = toICSDate(endStr);
  } else {
    // Agregar un día al inicio para eventos de un día
    const d = new Date(startStr + 'T00:00:00');
    d.setDate(d.getDate() + 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    dtend = `${y}${m}${day}`;
  }

  const name = escapeICS(race.name || 'Carrera de Ciclismo');
  const location = escapeICS([race.city, race.region].filter(Boolean).join(', '));
  const description = escapeICS(
    [
      race.description || '',
      race.registrationUrl ? `Inscripción: ${race.registrationUrl}` : '',
      `Disciplina: ${race.discipline || ''}`,
      race.distance ? `Distancia: ${race.distance}` : '',
      race.elevation ? `Desnivel: ${race.elevation}` : '',
    ]
      .filter(Boolean)
      .join('\n')
  );
  const uid = `race-${race.id}@calendariociclista.vercel.app`;
  const now = new Date().toISOString().replace(/[-:.]/g, '').slice(0, 15) + 'Z';

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CalendarioCiclista Chile//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART;VALUE=DATE:${dtstart}`,
    `DTEND;VALUE=DATE:${dtend}`,
    `SUMMARY:${name}`,
    `LOCATION:${location}`,
    `DESCRIPTION:${description}`,
    `URL:https://calendariociclista.vercel.app/evento/${race.id}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

/**
 * Construye la URL de Google Calendar para agregar el evento.
 * @param {Object} race
 * @returns {string} URL de Google Calendar
 */
export function buildGoogleCalendarUrl(race) {
  const startStr = (race.startDate || race.fecha_inicio || race.date || '').split('T')[0].trim();
  const endStr = (race.endDate || race.fecha_fin || startStr).split('T')[0].trim();

  const dtstart = toICSDate(startStr);

  let dtend = dtstart;
  if (endStr && endStr !== startStr) {
    dtend = toICSDate(endStr);
  } else {
    const d = new Date(startStr + 'T00:00:00');
    d.setDate(d.getDate() + 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    dtend = `${y}${m}${day}`;
  }

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: race.name || 'Carrera de Ciclismo',
    dates: `${dtstart}/${dtend}`,
    location: [race.city, race.region].filter(Boolean).join(', '),
    details: [
      race.description || '',
      race.registrationUrl ? `\nInscripción: ${race.registrationUrl}` : '',
    ]
      .filter(Boolean)
      .join(''),
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Descarga un archivo .ics con el contenido dado.
 * @param {string} icsContent - Contenido ICS generado por generateICSContent
 * @param {string} filename - Nombre del archivo sin extensión
 */
export function downloadICS(icsContent, filename = 'evento') {
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Genera el HTML del botón "Añadir a mi calendario" con su dropdown.
 * @param {string} raceId - ID de la carrera
 * @param {'card' | 'detail'} context - Contexto de renderizado para estilos
 * @returns {string} HTML string del componente
 */
export function renderCalendarButtonHTML(raceId, context = 'card') {
  const isDetail = context === 'detail';

  const btnClass = isDetail
    ? 'px-4 py-2.5 rounded-xl bg-surface-container border border-outline-variant/50 text-primary font-display font-bold text-sm flex items-center gap-2 hover:bg-surface-container-high transition-all shadow-sm'
    : 'w-full py-2.5 rounded-xl bg-surface-container border border-outline-variant/40 text-primary font-display font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-surface-container-high transition-all';

  return `
    <div class="relative cal-export-wrapper" data-race-id="${raceId}">
      <button
        type="button"
        class="btn-cal-export ${btnClass}"
        aria-haspopup="true"
        aria-expanded="false"
        aria-label="Añadir al calendario"
      >
        <span class="material-symbols-outlined ${isDetail ? 'text-base' : 'text-sm'}">event</span>
        <span>${isDetail ? 'Añadir al calendario' : 'Al calendario'}</span>
        <span class="material-symbols-outlined ${isDetail ? 'text-sm' : 'text-xs'} transition-transform duration-200 cal-chevron">expand_more</span>
      </button>

      <!-- Dropdown menu -->
      <div
        class="cal-export-dropdown hidden absolute ${isDetail ? 'right-0' : 'left-0 right-0'} bottom-full mb-2 bg-white rounded-2xl border border-outline-variant/40 shadow-xl z-50 overflow-hidden min-w-[220px]"
        role="menu"
      >
        <div class="p-1.5 space-y-0.5">
          <button type="button" class="cal-option cal-google w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-container text-left transition-colors" role="menuitem" data-race-id="${raceId}">
            <span class="w-7 h-7 rounded-lg bg-[#4285F4]/10 flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </span>
            <div>
              <p class="font-display font-bold text-sm text-primary">Google Calendar</p>
              <p class="text-xs text-outline">Abre en nueva pestaña</p>
            </div>
          </button>

          <button type="button" class="cal-option cal-apple w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-container text-left transition-colors" role="menuitem" data-race-id="${raceId}">
            <span class="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
              <span class="material-symbols-outlined text-base text-gray-700">calendar_month</span>
            </span>
            <div>
              <p class="font-display font-bold text-sm text-primary">Apple Calendar</p>
              <p class="text-xs text-outline">Descarga archivo .ics</p>
            </div>
          </button>

          <button type="button" class="cal-option cal-outlook w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-container text-left transition-colors" role="menuitem" data-race-id="${raceId}">
            <span class="w-7 h-7 rounded-lg bg-[#0078D4]/10 flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" class="w-4 h-4" fill="#0078D4">
                <path d="M7.88 12.04q0 .45-.11.87-.1.41-.33.74-.22.33-.58.52-.37.2-.87.2t-.85-.2q-.35-.21-.57-.55-.22-.33-.33-.75-.1-.42-.1-.86t.1-.87q.1-.43.34-.76.22-.34.59-.54.36-.2.87-.2t.86.2q.35.21.57.55.22.34.31.77.1.43.1.88zM24 12v9.38q0 .46-.33.8-.33.32-.8.32H7.13q-.46 0-.8-.33-.32-.33-.32-.8V18H1q-.41 0-.7-.3-.3-.29-.3-.7V7q0-.41.3-.7Q.58 6 1 6h6.5V2.55q0-.44.3-.75.3-.3.75-.3h12.9q.44 0 .75.3.3.3.3.75V10.85l1.24.72q.06.04.06.1zm-2 1.3l-3.44-2V9.45l-8.42 4.9v7.08h11.86zm-7.3-5.19l3.44-2.01-3.44-2.01-3.44 2.01zm-8.56 1.7l.5.3V15.45q.37.16.71.43.33.27.55.62.23.35.35.75.12.4.12.84 0 .55-.19.99-.19.45-.53.77-.34.32-.8.5-.45.16-.97.16-.55 0-1-.17-.44-.18-.76-.5-.32-.3-.49-.72-.18-.42-.18-.93 0-.42.11-.83.11-.4.33-.74.23-.33.57-.56.34-.22.75-.3l.01-7.41-4.3-2.55v9.17H2.28V8.26z"/>
              </svg>
            </span>
            <div>
              <p class="font-display font-bold text-sm text-primary">Outlook</p>
              <p class="text-xs text-outline">Descarga archivo .ics</p>
            </div>
          </button>

          <div class="border-t border-outline-variant/30 my-1"></div>

          <button type="button" class="cal-option cal-copy w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-container text-left transition-colors" role="menuitem" data-race-id="${raceId}">
            <span class="w-7 h-7 rounded-lg bg-tertiary-fixed/30 flex items-center justify-center flex-shrink-0">
              <span class="material-symbols-outlined text-base text-primary">content_copy</span>
            </span>
            <div>
              <p class="font-display font-bold text-sm text-primary">Copiar fecha</p>
              <p class="text-xs text-outline">Copia al portapapeles</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  `;
}
