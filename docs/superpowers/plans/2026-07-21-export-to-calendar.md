# Exportar a Calendario Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a 100% client-side "Añadir a mi calendario" dropdown component in race cards and detail view, supporting Google Calendar, Apple Calendar (.ics), Outlook (.ics), and date copying.

**Architecture:** A new pure utility module `js/calendar-export.js` generates iCalendar RFC 5545 `.ics` data and Google Calendar Web URLs. `js/ui.js` renders the dropdown trigger and menu markup in race cards and the detail view. `js/app.js` handles delegated click events to show/hide dropdowns and trigger file downloads/navigation.

**Tech Stack:** Vanilla JavaScript ES Modules, Tailwind CSS, Material Symbols Outlined, esbuild.

---

### File Structure

- `js/calendar-export.js`: [NEW] Pure functions `generateICSContent(race)`, `buildGoogleCalendarUrl(race)`, `downloadICSFile(race)`, `copyRaceDateToClipboard(race)`.
- `js/ui.js`: [MODIFY] Add dropdown trigger button and menu to `renderRaceCard` and `renderDetailView`.
- `js/app.js`: [MODIFY] Handle dropdown toggle, backdrop click, and action clicks for Google Calendar, ICS download, and date copy.
- `scratch/qa_test.js`: [MODIFY] Add test assertions for `calendar-export.js` exports and UI triggers.

---

### Task 1: Create `js/calendar-export.js` and test suite assertions

**Files:**
- Create: `js/calendar-export.js`
- Modify: `C:\Users\gerit\.gemini\antigravity\brain\3604f2a2-81a1-4697-aafb-d1a49e42ec5e\scratch\qa_test.js`

- [ ] **Step 1: Write `js/calendar-export.js`**

```javascript
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
  if (parts.length < 3) return '';

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
```

- [ ] **Step 2: Add QA assertions in `scratch/qa_test.js`**

Add tests checking `js/calendar-export.js` functions and exports:
```javascript
// AREA 9 — Exportar a Calendario
const calendarExportSrc = fs.readFileSync('js/calendar-export.js', 'utf8');

test('9.1a', 'calendar-export.js exporta generateICSContent', () =>
  calendarExportSrc.includes('export function generateICSContent') ? true : 'Falta generateICSContent'
);
test('9.1b', 'calendar-export.js exporta buildGoogleCalendarUrl', () =>
  calendarExportSrc.includes('export function buildGoogleCalendarUrl') ? true : 'Falta buildGoogleCalendarUrl'
);
test('9.1c', 'calendar-export.js genera VCALENDAR RFC 5545 valido', () => {
  const hasBegin = calendarExportSrc.includes('BEGIN:VCALENDAR');
  const hasEnd = calendarExportSrc.includes('END:VCALENDAR');
  return (hasBegin && hasEnd) ? true : 'Formato iCalendar incompleto';
});
```

- [ ] **Step 3: Run QA test suite**

Run: `node "C:\Users\gerit\.gemini\antigravity\brain\3604f2a2-81a1-4697-aafb-d1a49e42ec5e\scratch\qa_test.js"`
Expected: PASS all tests.

- [ ] **Step 4: Commit**

```bash
git add js/calendar-export.js scratch/qa_test.js
git commit -m "feat: add calendar export module with ICS and Google Calendar generators"
```

---

### Task 2: Add Calendar Dropdown UI to `js/ui.js`

**Files:**
- Modify: `js/ui.js`

- [ ] **Step 1: Update `renderRaceCard` in `js/ui.js`**

Add the "Añadir a mi calendario" dropdown trigger and hidden dropdown menu to each race card in `renderRaceCard`.

In `renderRaceCard(race, options)`:
```html
<div class="relative inline-block w-full">
  <button 
    type="button" 
    data-calendar-trigger="${race.id}" 
    class="w-full bg-surface-container hover:bg-surface-container-high text-primary font-display font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-outline-variant/50"
    aria-expanded="false"
  >
    <span class="material-symbols-outlined text-sm">calendar_add_on</span>
    Añadir a mi calendario
    <span class="material-symbols-outlined text-xs">expand_more</span>
  </button>

  <div 
    id="calendar-dropdown-${race.id}" 
    class="calendar-dropdown-menu hidden absolute left-0 right-0 bottom-full mb-2 bg-white rounded-2xl shadow-xl border border-outline-variant/40 p-1.5 z-50 animate-fadeIn"
  >
    <button type="button" data-calendar-action="google" data-race-id="${race.id}" class="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-primary hover:bg-surface-container flex items-center gap-2 transition-colors">
      <span class="text-base">📅</span> Google Calendar
    </button>
    <button type="button" data-calendar-action="apple" data-race-id="${race.id}" class="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-primary hover:bg-surface-container flex items-center gap-2 transition-colors">
      <span class="text-base">🍎</span> Apple Calendar (.ics)
    </button>
    <button type="button" data-calendar-action="outlook" data-race-id="${race.id}" class="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-primary hover:bg-surface-container flex items-center gap-2 transition-colors">
      <span class="text-base">📆</span> Outlook (.ics)
    </button>
    <button type="button" data-calendar-action="copy" data-race-id="${race.id}" class="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-primary hover:bg-surface-container flex items-center gap-2 transition-colors border-t border-outline-variant/30 mt-1 pt-2">
      <span class="material-symbols-outlined text-sm text-outline">content_copy</span> Copiar Fecha
    </button>
  </div>
</div>
```

- [ ] **Step 2: Update `renderDetailView` in `js/ui.js`**

Add the same calendar dropdown trigger and menu to the sidebar or action buttons in `renderDetailView`.

- [ ] **Step 3: Update `scratch/qa_test.js` to assert calendar dropdown in `ui.js`**

Add assertions:
```javascript
test('9.2a', 'ui.js incluye data-calendar-trigger en tarjetas', () =>
  uiSrc.includes('data-calendar-trigger') ? true : 'Falta data-calendar-trigger en ui.js'
);
test('9.2b', 'ui.js incluye opciones de calendario (google, apple, outlook, copy)', () => {
  const hasG = uiSrc.includes('data-calendar-action="google"');
  const hasA = uiSrc.includes('data-calendar-action="apple"');
  const hasC = uiSrc.includes('data-calendar-action="copy"');
  return (hasG && hasA && hasC) ? true : 'Faltan data-calendar-action en ui.js';
});
```

- [ ] **Step 4: Run QA tests**

Run: `node "C:\Users\gerit\.gemini\antigravity\brain\3604f2a2-81a1-4697-aafb-d1a49e42ec5e\scratch\qa_test.js"`
Expected: PASS all tests.

- [ ] **Step 5: Commit**

```bash
git add js/ui.js scratch/qa_test.js
git commit -m "feat: add calendar export dropdown markup to race cards and detail view"
```

---

### Task 3: Handle Dropdown Interactions in `js/app.js` and Bundle

**Files:**
- Modify: `js/app.js`
- Modify: `js/bundle.js`

- [ ] **Step 1: Bind calendar dropdown events in `js/app.js`**

Import `buildGoogleCalendarUrl`, `downloadICSFile` from `./calendar-export.js`.
Add delegated event listeners in `setupEventHandlers()` to handle:
1. `[data-calendar-trigger]`: Toggle target dropdown visibility, hide all other open dropdowns.
2. Clicking outside (`document.addEventListener('click')`): Close any open `.calendar-dropdown-menu`.
3. `[data-calendar-action="google"]`: `window.open(buildGoogleCalendarUrl(race), '_blank')`.
4. `[data-calendar-action="apple"]` / `[data-calendar-action="outlook"]`: `downloadICSFile(race)`.
5. `[data-calendar-action="copy"]`: `navigator.clipboard.writeText(...)` + `showNotificationToast('📋 Fecha copiada al portapapeles')`.

- [ ] **Step 2: Re-bundle JS with esbuild**

Run: `npx esbuild js/app.js --bundle --outfile=js/bundle.js --format=esm --platform=browser --external:@supabase/supabase-js`

- [ ] **Step 3: Run QA tests**

Run: `node "C:\Users\gerit\.gemini\antigravity\brain\3604f2a2-81a1-4697-aafb-d1a49e42ec5e\scratch\qa_test.js"`
Expected: PASS all tests.

- [ ] **Step 4: Commit, Push and Deploy**

```bash
git commit -am "feat: bind calendar export events and bundle JS"
git push origin main
npx vercel --prod --yes
npx vercel alias set https://<deploy-url> calendariociclista.vercel.app
```
