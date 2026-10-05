# Especificación de Diseño: Enlace a Bases de Competencia y Prevención de Desbordamiento de Enlaces

**Fecha**: 2026-10-05  
**Estado**: Aprobado por el usuario  
**Autor**: Antigravity Assistant & Usuario  

---

## 1. Contexto y Problema

En la vista de detalle de carreras y en los formularios de publicación y edición se identificaron dos requerimientos:
1. **Desbordamiento de URLs en la descripción del evento**: En la tarjeta de "Descripción del Evento" ([`js/ui.js`](file:///c:/Users/gerit/OneDrive/Escritorio/Calendario%20ciclista/js/ui.js)), el contenedor no tiene reglas de salto para palabras o cadenas continuas sin espacios (`break-all` / `overflow-wrap: anywhere`). Cuando un usuario incluye una URL extensa (como enlaces de Google Drive con parámetros de seguimiento), el texto se desborda horizontalmente fuera del cuadro blanco de la tarjeta y no es interactivo (no se puede pulsar como enlace).
2. **Falta de enlace y botón formal para las Bases de la Competencia**: Actualmente no existe un campo estructurado ni un botón en la ficha del evento para enlazar el reglamento o bases de la carrera, obligando a los organizadores a pegar enlaces dentro del texto libre de la descripción.

---

## 2. Objetivos

1. **Prevención de desbordamiento y enlaces clickeables en la descripción**:
   - Ajustar el ancho del texto mediante CSS para que ninguna cadena continua se salga del contenedor.
   - Detectar de forma automática y segura cualquier URL `http://` o `https://` dentro del texto de la descripción y convertirla en un hipervínculo `<a>` clickeable con apertura en una nueva pestaña (`target="_blank" rel="noopener noreferrer"`).
   - Sanitizar todo el contenido HTML previo a la conversión para asegurar protección total contra XSS.

2. **Campo estructurado y botón para Bases de la Competencia**:
   - Agregar el campo opcional `rulesUrl` en los formularios de creación y edición de carreras ([`index.html`](file:///c:/Users/gerit/OneDrive/Escritorio/Calendario%20ciclista/index.html) y [`js/admin.js`](file:///c:/Users/gerit/OneDrive/Escritorio/Calendario%20ciclista/js/admin.js)).
   - Validar el formato de la URL en el esquema Zod ([`shared/schema.js`](file:///c:/Users/gerit/OneDrive/Escritorio/Calendario%20ciclista/shared/schema.js)).
   - Persistir el valor en Supabase en la columna `link_bases TEXT` de la tabla `carreras`, con manejo retrocompatible en caso de que la columna aún no exista en el esquema activo.
   - Renderizar un botón dedicado *"Ver Bases de la Competencia"* en la tarjeta lateral derecha de la vista de detalle, situado justo debajo del botón *"Ir a Formulario de Inscripción"*.

---

## 3. Arquitectura y Cambios Técnicos

### 3.1. Base de Datos (Supabase)
- **Migración SQL**: Archivo `supabase/migrations/20261005_add_link_bases_column.sql`:
  ```sql
  ALTER TABLE public.carreras ADD COLUMN IF NOT EXISTS link_bases TEXT;
  ```
- **Manejo defensivo en backend**:
  - En [`api/races/[id].js`](file:///c:/Users/gerit/OneDrive/Escritorio/Calendario%20ciclista/api/races/[id].js) y [`api/races/index.js`](file:///c:/Users/gerit/OneDrive/Escritorio/Calendario%20ciclista/api/races/index.js), si la base de datos devuelve error por columna inexistente (`PGRST204` o mensaje indicando falta de columna `link_bases`), el payload se reintenta eliminando `link_bases`, evitando interrupciones en la experiencia de guardado o publicación.

### 3.2. Validación de Datos (Zod)
- En [`shared/schema.js`](file:///c:/Users/gerit/OneDrive/Escritorio/Calendario%20ciclista/shared/schema.js):
  ```js
  rulesUrl: z
    .string()
    .trim()
    .url({ message: 'El enlace a las bases debe ser una URL válida (http/https).' })
    .or(z.literal(''))
    .optional()
  ```

### 3.3. Mapeo Frontend ↔ Base de Datos
- En [`api/lib/supabase-server.js`](file:///c:/Users/gerit/OneDrive/Escritorio/Calendario%20ciclista/api/lib/supabase-server.js):
  - `mapFrontendToDb`: incluye `link_bases: data.rulesUrl ? data.rulesUrl.trim() : null`.
  - `mapDbToFrontend`: incluye `rulesUrl: row.link_bases || ''`.
- En [`js/supabase.js`](file:///c:/Users/gerit/OneDrive/Escritorio/Calendario%20ciclista/js/supabase.js):
  - `mapSupabaseToFrontend`: mapea `row.link_bases` a `rulesUrl: row.link_bases || ''`.
  - `createRaceSupabase`: incluye `link_bases` en el payload de inserción con el fallback defensivo existente.
  - `updateRaceSupabase`: incluye `link_bases` en la actualización.

### 3.4. Formateo Seguro de Descripción y Anti-Desbordamiento
- En [`js/ui.js`](file:///c:/Users/gerit/OneDrive/Escritorio/Calendario%20ciclista/js/ui.js):
  - Crear la función utilitaria `formatDescriptionWithLinks(text)`:
    1. Escapar caracteres HTML peligrosos (`&`, `<`, `>`, `"`, `'`).
    2. Reemplazar expresiones regulares de URL (`https?://[^\s<]+`) con:
       ```html
       <a href="${url}" target="_blank" rel="noopener noreferrer" class="text-secondary font-semibold underline hover:opacity-80 break-all">${url}</a>
       ```
    3. Retornar el string resultante para renderizar dentro del elemento de descripción.
  - En el contenedor de la tarjeta de descripción:
    - Aplicar las clases CSS: `break-words [overflow-wrap:anywhere] overflow-hidden` en el elemento contenedor y párrafo.

### 3.5. Componente Visual de Bases en Vista Detalle
- En [`js/ui.js`](file:///c:/Users/gerit/OneDrive/Escritorio/Calendario%20ciclista/js/ui.js) (`renderDetailView`):
  - En la columna lateral derecha, inmediatamente después del bloque del botón de inscripción (o evento finalizado), evaluar si `race.rulesUrl` contiene una URL válida:
    ```html
    ${race.rulesUrl ? `
      <a 
        href="${race.rulesUrl}" 
        target="_blank" 
        rel="noopener noreferrer" 
        class="w-full bg-surface-container hover:bg-surface-container-high text-primary font-display font-bold text-sm py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all border border-outline-variant/50 shadow-sm mt-3"
      >
        <span class="material-symbols-outlined text-lg text-secondary">description</span>
        Ver Bases de la Competencia
        <span class="material-symbols-outlined text-sm text-outline">open_in_new</span>
      </a>
    ` : ''}
    ```

### 3.6. Formularios de Registro y Edición
- En [`index.html`](file:///c:/Users/gerit/OneDrive/Escritorio/Calendario%20ciclista/index.html):
  - Formulario de publicación (`#race-form`): agregar input `name="rulesUrl"`.
  - Modal de edición (`#edit-race-form`): agregar input `id="edit-form-rules-url"` y `name="rulesUrl"`.
- En [`js/admin.js`](file:///c:/Users/gerit/OneDrive/Escritorio/Calendario%20ciclista/js/admin.js):
  - Incluir el campo en la plantilla dinámica del modal de edición si aplica.
  - En `openEditModal(race)`: asignar `document.getElementById('edit-form-rules-url').value = race.rulesUrl || ''`.
- En [`js/app.js`](file:///c:/Users/gerit/OneDrive/Escritorio/Calendario%20ciclista/js/app.js):
  - Extraer `rulesUrl` tanto en el envío del formulario público como en el submit del modal de edición.

---

## 4. Pruebas y Criterios de Aceptación

1. **Pruebas Unitarias**:
   - `shared/schema.test.js`: Validar que `rulesUrl` acepte URLs válidas (http/https), cadenas vacías y rechace valores inválidos no-URL.
   - `ui.test.js`: Validar que `formatDescriptionWithLinks` escape HTML, cree hipervínculos con atributos seguros y maneje textos vacíos o sin links sin corromper el contenido.
2. **Pruebas de Integración**:
   - `api-edit-race.test.js`: Probar que la API acepte y persista `rulesUrl` tanto en creación como en actualización.
3. **Prueba Visual / E2E**:
   - Comprobar que en una descripción con enlace largo de Google Drive no ocurra desbordamiento visual fuera de la tarjeta.
   - Comprobar que el botón *"Ver Bases de la Competencia"* aparezca únicamente cuando la carrera disponga de dicho enlace y que abra la URL en una nueva pestaña.
