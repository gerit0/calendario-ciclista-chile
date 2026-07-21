# Plan de Implementación de CalendarioCiclista

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir la aplicación web SPA de CalendarioCiclista integrando el Calendario Principal, Detalle de Carrera y Registro de Carrera con diseño athletic-performance y filtros tipo Corre.cl.

**Architecture:** Single Page Application (SPA) con HTML5, Tailwind CSS y JavaScript modular (`js/data.js`, `js/storage.js`, `js/ui.js`, `js/app.js`) utilizando `localStorage` para la persistencia de datos.

**Tech Stack:** HTML5, Vanilla JavaScript (ES6+ Modules), Tailwind CSS, Montserrat & Inter Fonts, Material Symbols Icons.

---

### Task 1: Módulo de Datos Iniciales (`js/data.js`)

**Files:**
- Create: `js/data.js`

- [ ] **Step 1: Crear dataset de carreras de ciclismo de Chile**

Escribir el código en `js/data.js` con las carreras iniciales y sus propiedades completas (id, nombre, disciplina, fecha, mes, region, comuna, distancia, desnivel, organizador, descripcion, inscritos, etc.).

```javascript
export const INITIAL_RACES = [
  {
    id: "gran-fondo-elqui-2026",
    name: "Gran Fondo Valle del Elqui 2026",
    discipline: "Ruta",
    date: "2026-08-15",
    month: "Agosto 2026",
    displayDate: "15/08 • Sábado",
    region: "IV - Coquimbo",
    city: "Vicuña",
    distance: "120 km",
    elevation: "+1.850 m",
    price: "$35.000",
    isFree: false,
    status: "Inscripciones Abiertas",
    organizer: "Club Ciclismo Coquimbo",
    registrationUrl: "https://ejemplo.cl/inscripcion/elqui",
    heroImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBkJW_8-Lm-qEfuudvNHCxudXJWqfiRFqA8ST2LxugYPir0KIuopTdjWAM4QLO1dAYVpuoL5crVGIXzDPW_q046gN5h-b561v2vOZBocyVjX6N-Qin8X3dieEXcvKiz9KZnLUuVdPcbQC-8Vz7V4FeEgnDX_M507Vzb3qaGqAF-aepq5vruZIXVMvujq5zAQglklMwH9ej_FraxiN1TLmG6c3DH3FgjGhtetRVBb392T1M9jKM50RY1jw",
    description: "Desafío de gran fondo por las místicas curvas y ascensos del Valle del Elqui. Pavimento en excelente estado con metas volantes y cronometradas.",
    categories: ["Pro Elite", "Master A/B/C", "Amateur Open"],
    participants: [
      { name: "Sebastián Mora", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAhH8mGeNUSMwSDC7IcXbswb1fzvsJgTKaF5cz7UpCAEupZxRKczWS8G8SseKvvNxkvV80lVarsfVejNmoy3Bxf5wc9sYiR55KNuFDP8dKASnKAgKoW_S1c6059npBnCeibS5QMylpdRWBHiMuDiQfaWwtu209Y5iaRZDekog0VtLMwugZGN7apjfiAtvNKXp3LuCPkIy_d62aoGkklK1kgpJ4yiL4WLxsXofcWUJhHAV4EQ6NK7yB-qw" },
      { name: "Camila Silva", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDUsHIpj76BdwGY63ebE-RMLW8qfxM9QPOWrbPaaT8VsQCVrbn_QymHDSDDHbygZMOEXRXiZGaGkYqvZNO-Zs_ThNHokWAI91nafOKla_G2EDOjdy9ox2kYGqYZgWXPBb5AVSMVVZJjzU2nVa72oNPDuPHPOq1jjaIJFVTAn6vYc5y7Sltufn5eWAUS2PC-k4jFfGDwodN-klyj2FSxxq7lSnGuxkxd_B16s6C4QvQc7FFyk4BHyQqcSg" }
    ]
  },
  {
    id: "desafio-tierra-del-fuego-mtb",
    name: "Desafío Tierra del Fuego MTB",
    discipline: "MTB",
    date: "2026-08-22",
    month: "Agosto 2026",
    displayDate: "22/08 • Sábado",
    region: "XII - Magallanes",
    city: "Porvenir",
    distance: "85 km",
    elevation: "+1.200 m",
    price: "$25.000",
    isFree: false,
    status: "Últimos Cupos",
    organizer: "Patagonia Bike Club",
    registrationUrl: "https://ejemplo.cl/inscripcion/fuegomtb",
    heroImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuC4TufUP6EOHFGVB5fIteNdd5_IttCaKGA1a7Of9lgpPEpndQ-5nyQ3i-eJWLAwDzjBzDLeO_cHCuzydgVCDBVcrr4mFU-AhlKRsaXOn4VIaYvn9XSkEpOyI2ROCtgP0lN4TwkYv7r_sd8PLlVPtG2e_jrThPECzL719DNULMEpSUoE5oTrvGiA2fmt0ZFfEu6780gH7NrKKyVtG2KAMNRL0G4gHQgFS33NmiCuWrCr_S9bO_4s9jI9gA",
    description: "Una carrera extrema de MTB atravesando los bosques prístinos y senderos técnicos de la Isla Grande de Tierra del Fuego.",
    categories: ["Varones Elite", "Damas Open", "Duplas Mixtas"],
    participants: []
  },
  {
    id: "gravel-volcan-osorno",
    name: "Gravel Classic Volcán Osorno",
    discipline: "Gravel",
    date: "2026-09-05",
    month: "Septiembre 2026",
    displayDate: "05/09 • Sábado",
    region: "X - Los Lagos",
    city: "Puerto Varas",
    distance: "105 km",
    elevation: "+2.100 m",
    price: "Gratuita",
    isFree: true,
    status: "Gratuita",
    organizer: "Sur Gravel Chile",
    registrationUrl: "https://ejemplo.cl/inscripcion/gravelosorno",
    heroImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCCETsJ8Tj9zWkcYviTvZeo3RHL4ZfWThEAvMkdeJFSRspwp1hlu90H3BC0vzRb30OSWUYs_TfXsNfOIa4i5nyJq-iHd8id_yTuDS4paYlkOBWij4DdUF5EpvNIQCiVQIJPKqsULZnkoNVG8DXBkC60Jp7j6iO3RmQLvVP52svMIO3CPFZzic7C8JyJeKzT-NkZZoEnJWsO9CgqgAxxsSo_VaHIBnX3XSnSQ6n5-XfURx2pISrW4ftUmw",
    description: "Circuito de gravel circundando la falda del majestuoso Volcán Osorno con vistas panorámicas al Lago Llanquihue.",
    categories: ["Gravel Pro", "Gravel Master", "Bicicletas Rígidas"],
    participants: []
  },
  {
    id: "clasica-santiago-valparaiso",
    name: "Clásica Santiago - Valparaíso 2026",
    discipline: "Ruta",
    date: "2026-09-18",
    month: "Septiembre 2026",
    displayDate: "18/09 • Viernes",
    region: "RM - Metropolitana",
    city: "Santiago / Curacaví",
    distance: "140 km",
    elevation: "+1.650 m",
    price: "$40.000",
    isFree: false,
    status: "Inscripciones Abiertas",
    organizer: "Federación Nacional de Ciclismo",
    registrationUrl: "https://ejemplo.cl/inscripcion/stgovalpo",
    heroImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCOL4QVJe2kQ_-8IDBQHKkwB2xBcm2nGxbeZLlFzA8yauMvCzY29W5hOgYGmbfr4CUbitir4M_Zss5iyTcguq2ZNg9rV4vZjbMWBoRrHbqFzaR9wAMXySb09WI7fqsB4E0XYbaROknEX7rryeVDki6W-9Bda1NfcEhwrp-pDSj0TLlyyznjZuFbTy0q4FhHMKBLn5OUwdOf6FocC0TYsmA7LYXFeg07SnIC_aiWeoOWoQhVuu9DosvO-A",
    description: "La icónica prueba de ruta por la Ruta 68 cruzando la Cuesta Zapata y la Cuesta Lo Prado finalizando en la costa.",
    categories: ["Pro Elite", "Junior", "Master A", "Master B"],
    participants: []
  }
];

export const REGIONS_CHILE = [
  "Todas las regiones",
  "XV - Arica y Parinacota",
  "I - Tarapacá",
  "II - Antofagasta",
  "III - Atacama",
  "IV - Coquimbo",
  "V - Valparaíso",
  "RM - Metropolitana",
  "VI - O'Higgins",
  "VII - Maule",
  "XVI - Ñuble",
  "VIII - Biobío",
  "IX - La Araucanía",
  "XIV - Los Ríos",
  "X - Los Lagos",
  "XI - Aysén",
  "XII - Magallanes"
];
```

---

### Task 2: Módulo de Almacenamiento y Estado (`js/storage.js`)

**Files:**
- Create: `js/storage.js`

- [ ] **Step 1: Crear wrapper de LocalStorage para "Mi Agenda" y Carreras Personalizadas**

```javascript
import { INITIAL_RACES } from './data.js';

const STORAGE_KEYS = {
  BOOKMARKS: 'calendariociclista_bookmarks',
  CUSTOM_RACES: 'calendariociclista_custom_races'
};

export function getBookmarkedIds() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error reading bookmarks:', e);
    return [];
  }
}

export function toggleBookmark(raceId) {
  const bookmarks = getBookmarkedIds();
  const index = bookmarks.indexOf(raceId);
  if (index >= 0) {
    bookmarks.splice(index, 1);
  } else {
    bookmarks.push(raceId);
  }
  localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
  return bookmarks;
}

export function isBookmarked(raceId) {
  const bookmarks = getBookmarkedIds();
  return bookmarks.includes(raceId);
}

export function getCustomRaces() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_RACES);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error reading custom races:', e);
    return [];
  }
}

export function saveCustomRace(newRace) {
  const races = getCustomRaces();
  races.unshift(newRace);
  localStorage.setItem(STORAGE_KEYS.CUSTOM_RACES, JSON.stringify(races));
}

export function getAllRaces() {
  const custom = getCustomRaces();
  return [...custom, ...INITIAL_RACES];
}
```

---

### Task 3: Renderizado e Interfaz de Usuario (`js/ui.js` e `index.html`)

**Files:**
- Create: `index.html`
- Create: `js/ui.js`

- [ ] **Step 1: Crear `index.html` con las 3 vistas y tokens del sistema de diseño**

Implementar `index.html` con importación de tipografías Google Fonts (Montserrat & Inter), iconos Material Symbols, fuentes de Tailwind CSS, estructurando la cabecera, contenedor de vista SPA y pie de página.

- [ ] **Step 2: Crear `js/ui.js` con las funciones de renderizado y filtros**

Desarrollar en `js/ui.js`:
- Renderizado de filtros por disciplina, región, mes y texto.
- Renderizado del listado de carreras en `#calendar-view` agrupadas por mes.
- Renderizado del detalle completo de la carrera seleccionada en `#detail-view`.
- Renderizado y lógica de captura del formulario en `#register-view`.
- Transición entre vistas mediante clases `hidden`.

---

### Task 4: Controlador Principal (`js/app.js`)

**Files:**
- Create: `js/app.js`

- [ ] **Step 1: Vincular eventos de usuario y navegación SPA**

Inicializar el controlador en `js/app.js`:
- Escuchar cambios en la barra de búsqueda, selectores de región, mes y chips de disciplina.
- Escuchar clic en tarjetas de carrera para abrir `#detail-view`.
- Escuchar clic en botones de guardar en agenda (Bookmarking).
- Escuchar envío del formulario `#register-view` enviando la nueva carrera a `storage.js` y cambiando a la vista de calendario.
- Escuchar navegación de cabecera (Calendario, Mi Agenda, Publicar).

---

### Task 5: Verificación y Walkthrough

- [ ] **Step 1: Probar en navegador Edge/Chrome local**
- [ ] **Step 2: Generar walkthrough documentando el resultado final**
