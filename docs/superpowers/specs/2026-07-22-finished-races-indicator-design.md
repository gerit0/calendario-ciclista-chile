# Indicador Visual de "Carrera Finalizada" — Spec de Diseño

## Resumen Ejecutivo
Implementar un cálculo derivado de estado temporal ("En Curso", "Finalizada") basado en la fecha oficial del evento en la zona horaria `America/Santiago`. Las carreras pasadas mostrarán un badge desaturado "Finalizada", atenuación visual en sus tarjetas (`opacity-65 grayscale-[30%]`), y estarán ocultas por defecto en el explorador principal a menos que el usuario active el nuevo filtro "Mostrar carreras pasadas".

---

## 1. Reglas de Cálculo Derivado de Fecha (`America/Santiago`)

### 1.1 Obtención de Fecha Actual en Chile
```javascript
export function getTodayChileDateStr() {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Santiago',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  return formatter.format(now); // Retorna "YYYY-MM-DD"
}
```

### 1.2 Determinación de Estado Temporal
Utilizando `detectRaceDuration(race)`:
- `startDateStr` = YYYY-MM-DD de inicio.
- `endDateStr` = YYYY-MM-DD de término (o `startDateStr` si no es multi-día).
- `todayStr` = Fecha actual YYYY-MM-DD en Chile.

Estados derivados:
1. **`esFinalizada`**: `endDateStr < todayStr`
2. **`esEnCurso`**: `startDateStr <= todayStr && todayStr <= endDateStr`
3. **`esFutura`**: `todayStr < startDateStr`

---

## 2. Componente de UI y Tratamiento Visual

### 2.1 Prioridad de Badges
- **Si `esFinalizada` === true**:
  - Badge prioritario: `<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-700 border border-slate-300">Finalizada</span>`
  - Se oculta el badge de `estado_inscripcion` ("Inscripciones Abiertas", "Últimos Cupos", etc.).
- **Si `esEnCurso` === true**:
  - Badge prioritario: `<span class="px-2.5 py-1 rounded-full text-xs font-black bg-blue-600 text-white shadow-sm animate-pulse flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-white animate-ping"></span> En Curso</span>`
- **Si es futura / normal**:
  - Se renderiza el `estado_inscripcion` habitual.

### 2.2 Estilo de Tarjeta en Grilla (`renderRaceCard`)
- Si `esFinalizada === true`:
  - Clases agregadas a `<article>`: `opacity-65 grayscale-[30%] bg-slate-50/80 hover:opacity-100 hover:grayscale-0 transition-all`

### 2.3 Vista de Detalle (`/evento/:id` y SSR `api/seo.js`)
- En el encabezado, renderiza el badge "Finalizada" o "En Curso".
- Si finalizó, muestra aviso desaturado en el CTA: "Evento Finalizado".

### 2.4 Vistas de Mes / Semana / Día (`renderMonthGrid`, `renderWeekGrid`, `renderDayGrid`)
- Renderiza el badge o estilo atenuado para eventos pasados.

---

## 3. Filtrado y Control de UX

### 3.1 Toggle "Mostrar carreras pasadas"
En `index.html`, en la barra de filtros:
- Checkbox/Toggle id `#toggle-past-races`
- Texto: `"Mostrar carreras pasadas"`

### 3.2 Lógica en `js/app.js` (`getFilteredRaces`)
- Variable de estado `showPastRaces` (default `false`).
- Si `showPastRaces === false`: Excluye eventos donde `esFinalizada === true`.
- Si `showPastRaces === true`: Incluye eventos pasados.

---

## 4. Plan de Pruebas

1. Pruebas QA automatizadas en `scratch/qa_test.js`:
   - Validar cálculo de `getTodayChileDateStr()` y estados de fecha.
   - Validar badges y filtro `#toggle-past-races`.
2. Verificación manual y despliegue en Vercel.
