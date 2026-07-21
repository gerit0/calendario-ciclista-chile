# Plan de Implementación: Seguridad y Backend Supabase — CalendarioCiclista

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar las 5 Reglas de Seguridad y la integración con el backend de Supabase (SQL, RLS, Validación/Sanitización XSS, Moderación de propuestas y Fallback resiliente).

**Architecture:** Módulo de validación cliente/servidor (`js/validation.js`), conector Supabase JS SDK (`js/supabase.js`), capa de persistencia resiliente (`js/storage.js`) y script SQL de migración con RLS activado (`supabase/migrations/20260720_carreras_rls.sql`).

**Tech Stack:** HTML5, ES6 JavaScript, `@supabase/supabase-js`, PostgreSQL, RLS, Tailwind CSS.

---

### Task 1: Script de Migración SQL y RLS de Supabase (`supabase/migrations/20260720_carreras_rls.sql`)

**Files:**
- Create: `supabase/migrations/20260720_carreras_rls.sql`

- [ ] **Step 1: Crear script SQL de migración autónomo**

```sql
-- Migración SQL para CalendarioCiclista (PostgreSQL / Supabase)
-- 1. Crear tabla public.carreras
create table if not exists public.carreras (
  id uuid primary key default gen_random_uuid(),
  nombre text not null check (char_length(nombre) between 3 and 100),
  fecha date not null,
  disciplina text not null check (disciplina in ('Ruta', 'MTB', 'Gravel', 'Pista', 'BMX', 'Virtual')),
  region text not null,
  ubicacion text check (char_length(ubicacion) <= 150),
  organizador text not null check (char_length(organizador) between 2 and 100),
  link_inscripcion text check (link_inscripcion ~* '^https?://'),
  categoria text,
  precio text,
  hero_image text,
  descripcion text,
  creado_por uuid references auth.users(id),
  estado text not null default 'pendiente' check (estado in ('pendiente', 'aprobada', 'rechazada')),
  created_at timestamptz not null default now()
);

-- 2. Crear tabla public.usuarios_admin para moderadores
create table if not exists public.usuarios_admin (
  user_id uuid primary key references auth.users(id),
  created_at timestamptz not null default now()
);

-- 3. Crear índices optimizados para filtrado por fecha, disciplina y región
create index if not exists idx_carreras_fecha on public.carreras (fecha);
create index if not exists idx_carreras_disciplina_region on public.carreras (disciplina, region);

-- 4. Activar Row Level Security (RLS)
alter table public.carreras enable row level security;
alter table public.usuarios_admin enable row level security;

-- 5. Definir Políticas RLS
-- Lectura pública de carreras aprobadas
drop policy if exists "Lectura pública de carreras aprobadas" on public.carreras;
create policy "Lectura pública de carreras aprobadas"
on public.carreras for select
using (estado = 'aprobada');

-- Inserción de propuestas por usuarios autenticados o anónimos seguros en estado pendiente
drop policy if exists "Proponer carreras pendientes" on public.carreras;
create policy "Proponer carreras pendientes"
on public.carreras for insert
with check (estado = 'pendiente');

-- Creadores leen y editan sus propias propuestas mientras no estén aprobadas
drop policy if exists "Creador edita sus propias carreras pendientes" on public.carreras;
create policy "Creador edita sus propias carreras pendientes"
on public.carreras for update
to authenticated
using (creado_por = auth.uid() and estado <> 'aprobada')
with check (creado_por = auth.uid());

-- Administradores leen y moderan todas las carreras
drop policy if exists "Admin moderacion de carreras" on public.carreras;
create policy "Admin moderacion de carreras"
on public.carreras for all
to authenticated
using (exists (select 1 from public.usuarios_admin where user_id = auth.uid()));
```

---

### Task 2: Módulo de Sanitización y Validación (`js/validation.js`)

**Files:**
- Create: `js/validation.js`

- [ ] **Step 1: Crear funciones de sanitización XSS y validación de campos**

```javascript
/**
 * Módulo de Sanitización y Validación de Formularios (js/validation.js)
 */

/**
 * Sanitiza una cadena de texto eliminando etiquetas HTML y scripts para prevenir XSS.
 * @param {string} str 
 * @returns {string}
 */
export function sanitizeHTML(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .trim();
}

/**
 * Valida si una cadena es una URL HTTP o HTTPS válida.
 * @param {string} urlStr 
 * @returns {boolean}
 */
export function isValidURL(urlStr) {
  if (!urlStr) return true; // Campo opcional
  try {
    const parsed = new URL(urlStr);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (e) {
    return false;
  }
}

/**
 * Valida todos los datos del formulario de registro de carreras.
 * @param {Object} data 
 * @returns {{ isValid: boolean, errors: Object, sanitizedData: Object }}
 */
export function validateRaceForm(data) {
  const errors = {};
  const sanitized = {};

  // 1. Nombre (Obligatorio, 3 - 100 caracteres)
  const name = sanitizeHTML(data.name || '');
  if (!name || name.length < 3 || name.length > 100) {
    errors.name = 'El nombre de la carrera debe tener entre 3 y 100 caracteres.';
  } else {
    sanitized.name = name;
  }

  // 2. Disciplina (Enum válido)
  const validDisciplines = ['Ruta', 'MTB', 'Gravel', 'Pista', 'BMX', 'Virtual'];
  if (!validDisciplines.includes(data.discipline)) {
    errors.discipline = 'Selecciona una disciplina válida.';
  } else {
    sanitized.discipline = data.discipline;
  }

  // 3. Fecha (Formato YYYY-MM-DD y fecha no vacía)
  if (!data.date || !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
    errors.date = 'Selecciona una fecha válida en formato AAAA-MM-DD.';
  } else {
    sanitized.date = data.date;
  }

  // 4. Región (Obligatorio)
  const region = sanitizeHTML(data.region || '');
  if (!region || region === 'Todas las regiones') {
    errors.region = 'Selecciona una región de Chile válida.';
  } else {
    sanitized.region = region;
  }

  // 5. Organizador (Obligatorio, 2 - 100 caracteres)
  const organizer = sanitizeHTML(data.organizer || '');
  if (!organizer || organizer.length < 2 || organizer.length > 100) {
    errors.organizer = 'El nombre del organizador debe tener entre 2 y 100 caracteres.';
  } else {
    sanitized.organizer = organizer;
  }

  // 6. Link de Inscripción (Opcional, formato URL HTTP/HTTPS)
  if (data.registrationUrl && !isValidURL(data.registrationUrl)) {
    errors.registrationUrl = 'Ingresa un enlace de inscripción válido (debe comenzar con http:// o https://).';
  } else {
    sanitized.registrationUrl = sanitizeHTML(data.registrationUrl || '');
  }

  // 7. Campos opcionales sanitizados
  sanitized.city = sanitizeHTML(data.city || '');
  sanitized.distance = sanitizeHTML(data.distance || '');
  sanitized.elevation = sanitizeHTML(data.elevation || '');
  sanitized.price = sanitizeHTML(data.price || '');
  sanitized.heroImage = isValidURL(data.heroImage) ? data.heroImage : '';
  sanitized.description = sanitizeHTML(data.description || '');

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData: sanitized
  };
}
```

---

### Task 3: Cliente de Conexión Supabase (`js/supabase.js`)

**Files:**
- Create: `js/supabase.js`

- [ ] **Step 1: Crear conector seguro Supabase JS Client**

```javascript
/**
 * Módulo de Conexión Supabase (js/supabase.js)
 * Expone el cliente inicializado únicamente con la anonKey pública.
 */

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Configuración pública de Supabase
const SUPABASE_URL = window.SUPABASE_URL || 'https://tu-proyecto.supabase.co';
const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key';

let supabaseClient = null;

export function getSupabase() {
  if (!supabaseClient) {
    try {
      supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } catch (e) {
      console.warn('Supabase Client no pudo inicializarse. Usando almacenamiento local.', e);
    }
  }
  return supabaseClient;
}

export function isSupabaseConfigured() {
  return SUPABASE_URL.includes('.supabase.co') && !SUPABASE_ANON_KEY.includes('dummy_anon_key');
}
```

---

### Task 4: Sincronización en `js/storage.js` y Notificaciones en `js/app.js`

**Files:**
- Modify: `js/storage.js`
- Modify: `js/app.js`

- [ ] **Step 1: Actualizar `js/storage.js` con soporte para Supabase y Fallback resiliente**
- [ ] **Step 2: Conectar validación en `js/app.js` e informar estado de moderación "pendiente"**

---

### Task 5: Verificación y Walkthrough

- [ ] **Step 1: Ejecutar pruebas de validación y sanitización XSS**
- [ ] **Step 2: Generar walkthrough documentando la seguridad aplicada**
