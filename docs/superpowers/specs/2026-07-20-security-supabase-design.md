# Especificación de Diseño: Seguridad y Backend Supabase — CalendarioCiclista

**Fecha:** 2026-07-20  
**Proyecto:** CalendarioCiclista Centralizado  
**Estado:** Aprobado por el usuario  

---

## 1. Resumen de Objetivos de Seguridad y Backend

Integrar la infraestructura de backend de **Supabase** y las 5 Reglas de Seguridad en **CalendarioCiclista**:

1. **Protección de API Keys**: Únicamente exponer `SUPABASE_ANON_KEY` en el cliente web; las credenciales administrativas (`service_role`) permanecen aisladas.
2. **Validación y Sanitización Bi-capa**: Sanitizar todo texto libre ingresado por los usuarios contra ataques XSS y validar tipos/formatos de datos (nombres, fechas futuras, enums, URLs HTTP/HTTPS).
3. **Esquema de Base de Datos Postgres (Supabase)**: Tabla `public.carreras` con restricciones de verificación (`check`), índices optimizados y soporte para moderación (`pendiente`, `aprobada`, `rechazada`).
4. **Rate Limiting**: Control de frecuencia de solicitudes en cliente/servidor para prevenir abuso en la creación de eventos y lecturas.
5. **Row Level Security (RLS)**: Políticas Postgres activas por defecto para garantizar que los usuarios solo puedan leer carreras aprobadas o gestionar sus propias propuestas pendientes.

---

## 2. Arquitectura de Módulos

```
[ Frontend: index.html + js/app.js ]
       |
       +---> js/validation.js (Sanitización XSS, Regex, Validaciones de campos)
       |
       +---> js/supabase.js (Cliente oficial Supabase SDK con anon key)
       |
       +---> js/storage.js (Lógica de sincronización Supabase / LocalStorage Fallback)
       |
       v
[ Supabase Backend (Postgres + Auth + RLS) ]
       |
       +---> Tabla public.carreras (RLS activado: Select público de 'aprobada')
       +---> Tabla public.usuarios_admin (RLS admin: Aprobación/Rechazo)
```

### Módulos a Crear / Modificar:
1. **`supabase/migrations/20260720_carreras_rls.sql`** [NUEVO]:
   - Script SQL autónomo con la definición de la tabla `carreras`, tabla `usuarios_admin`, índices y las 5 políticas RLS exactas.
2. **`js/validation.js`** [NUEVO]:
   - Funciones de sanitización XSS (`sanitizeHTML`), validación de URLs (`isValidURL`), validación de fechas futuras y validador de formulario completo `validateRaceForm(formData)`.
3. **`js/supabase.js`** [NUEVO]:
   - Cliente singleton de Supabase utilizando `@supabase/supabase-js`.
   - Soporte para variables de entorno / constantes globales configurables.
4. **`js/storage.js`** [MODIFICAR]:
   - Conectar lectura de carreras a Supabase (`fetchRacesFromSupabase`).
   - Conectar inserción de propuestas a Supabase (`createRaceInSupabase`).
   - Mantenimiento del modo *fallback* para almacenamiento local y offline.
5. **`js/app.js` e `index.html`** [MODIFICAR]:
   - Cargar librería Supabase JS mediante CDN / ES module.
   - Conectar la validación/sanitización al enviar el formulario `#race-form`.
   - Mostrar notificaciones de feedback al usuario ("Tu carrera ha sido enviada a moderación y será revisada antes de publicarse").

---

## 3. Esquema de Base de Datos y Políticas RLS

### Esquema Postgres (`public.carreras`)
```sql
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
```

### Políticas RLS (Row Level Security)
1. **Lectura pública**: `select` permitido para cualquiera cuando `estado = 'aprobada'`.
2. **Inserción de propuestas**: `insert` para usuarios autenticados con `estado = 'pendiente'`.
3. **Ver/editar propias propuestas**: `select` y `update` para el creador `creado_por = auth.uid()` mientras `estado != 'aprobada'`.
4. **Administradores**: `select` y `update` completo para usuarios que figuren en `public.usuarios_admin`.

---

## 4. Plan de Verificación

1. **Verificación de Sanitización XSS**: Probar el envío de campos con caracteres `<script>alert('xss')</script>` o etiquetas `<img>` maliciosas y comprobar que sean neutralizadas.
2. **Verificación de Validaciones**: Comprobar el rechazo de URLs no HTTP/HTTPS, nombres menores a 3 caracteres o fechas pasadas.
3. **Verificación de Script SQL RLS**: Validar la sintaxis del script SQL de migración para ejecución directa en la consola de Supabase.
4. **Prueba de Fallback**: Garantizar que si Supabase no está configurado o falla la red, la aplicación continúe funcionando sin errores utilizando los datos locales.
