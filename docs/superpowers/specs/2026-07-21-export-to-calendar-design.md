# Exportar a Calendario (ICS / Google Calendar / Apple Calendar) — Spec de Diseño

## Resumen Ejecutivo
Agregar un módulo y componente de UI en el frontend ("Añadir a mi calendario") que permita a los corredores y usuarios exportar cualquier carrera a su plataforma de calendario preferida (Google Calendar, Apple Calendar, Outlook o copiar la fecha al portapapeles).

---

## 1. Alcance y Arquitectura

### 1.1 Enfoque Client-Side Puro
- Sin endpoints backend adicionales.
- Se procesan los objetos `race` ya existentes en la aplicación.

### 1.2 Módulo `js/calendar-export.js`
Nuevas funciones utilitarias puras:
1. `generateICSContent(race)`: Retorna un `string` formateado en estándar RFC 5545 (iCalendar `.ics`).
   - `SUMMARY`: Título de la carrera (ej. "Gran Fondo Curacaví 2026").
   - `DESCRIPTION`: Descripción, tipo de disciplina, desnivel/distancia y enlace a la carrera/inscripción.
   - `LOCATION`: Ciudad y Región (ej. "Curacaví, Región Metropolitana").
   - `DTSTART` / `DTEND`: Formato UTC YYYYMMDDTHHMMSSZ (o fecha de todo el día YYYYMMDD).
   - `URL`: Link directo al detalle de la carrera en `calendariociclista.vercel.app`.
   - `UID`: `carrera-${race.id}@calendariociclista.vercel.app`.

2. `buildGoogleCalendarUrl(race)`: Genera una URL de redirección a Google Calendar web:
   - `https://calendar.google.com/calendar/render?action=TEMPLATE&text=...&details=...&location=...&dates=...`

3. `downloadICSFile(race)`: Dispara la descarga del archivo `.ics` (Blob + `URL.createObjectURL`).

4. `copyRaceDateToClipboard(race)`: Copia el texto legible de la fecha y muestra un toast de notificación.

---

## 2. Interacción y UI (Dropdown)

### 2.1 En las Tarjetas del Listado (`renderRaceCard`)
- Debajo del botón "Ver Detalle", o integrado a su lado, se agrega un botón secundario:
  ```html
  <button type="button" data-calendar-dropdown-trigger="${race.id}" class="...">
    <span class="material-symbols-outlined">calendar_add_on</span>
    Añadir a Calendario
  </button>
  ```
- Al hacer clic, se muestra un menú flotante (`position: absolute`, `z-index: 50`) con las 4 opciones:
  - 📅 Google Calendar
  - 🍎 Apple Calendar (.ics)
  - 📆 Outlook (.ics)
  - 📋 Copiar Fecha

### 2.2 En la Vista de Detalle (`renderDetailView`)
- En el encabezado / sección de información principal de la vista de detalle, se incluye también el botón con el mismo menú desplegable.

---

## 3. Pruebas y Verificación

1. **Pruebas unitarias/estáticas en QA test suite**:
   - Verificar la estructura del string `.ics` generado (campos obligatorios `BEGIN:VCALENDAR`, `SUMMARY`, `DTSTART`, `END:VCALENDAR`).
   - Verificar que `buildGoogleCalendarUrl` encodea correctamente parámetros especiales y espacios.
2. **Build bundle**: `esbuild js/app.js --bundle ...`
3. **Verificación manual / E2E**.
