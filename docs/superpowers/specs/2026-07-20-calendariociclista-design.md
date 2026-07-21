# Especificación de Diseño: CalendarioCiclista Centralizado

**Fecha:** 2026-07-20  
**Proyecto:** CalendarioCiclista (CicloCalendario Centralizado)  
**Estado:** Aprobado por el usuario  

---

## 1. Resumen del Proyecto

**CalendarioCiclista** es una aplicación web de alto rendimiento orientada a ciclistas, organizadores y fanáticos en Chile. Consolida las tres pantallas de diseño en una experiencia **Single Page Application (SPA)** interactiva, moderna y ultrarrápida:

1. **Calendario Principal**: Feed cronológico de carreras filtrable por región, disciplina, mes y distancia (inspirado en la funcionalidad de Corre.cl).
2. **Detalle de Carrera**: Ficha técnica completa de eventos con perfil altimétrico, categorías, lista de participantes y cuenta regresiva.
3. **Registrar Carrera**: Formulario dinámico para que los organizadores publiquen nuevas carreras que se integran al instante en el calendario.

---

## 2. Arquitectura de la Aplicación (SPA)

### Estrategia Técnica
- **Formato**: SPA interactiva pura en `index.html` impulsada por JavaScript ES6 modular (`js/app.js`, `js/data.js`, `js/storage.js`, `js/ui.js`) y Tailwind CSS.
- **Sin proceso de build complejo**: Ejecución directa en navegador local y lista para despliegue web estático (GitHub Pages, Vercel, Netlify).

### Módulos Principales:
1. `js/data.js`: Base de datos inicial de carreras de ciclismo en Chile (Ruta, MTB, Gravel, Pista, BMX, Virtual) con detalles completos.
2. `js/storage.js`: Gestión de `localStorage` para eventos favoritos ("Mi Agenda") y eventos creados por usuarios.
3. `js/ui.js`: Renderizado de vistas, filtros en tiempo real, modales y navegación entre las pantallas:
   - `view-calendar`: Pantalla principal del calendario y filtros.
   - `view-detail`: Pantalla del detalle de la carrera seleccionada.
   - `view-register`: Pantalla del formulario de publicación de carrera.
4. `js/app.js`: Inicialización y router de eventos de usuario.

---

## 3. Vistas y Funcionalidad

### 3.1 Vista: Calendario Principal (`#calendar-view`)
- **Cabecera**: Marca oficial **CalendarioCiclista**, menú de navegación ("Explorar Carreras", "Mi Agenda", "+ Publicar Carrera").
- **Barra de Búsqueda y Filtros**:
  - **Filtro por Región**: Selector con todas las regiones de Chile (Arica a Magallanes).
  - **Chips por Disciplina**: *Todas*, *Ruta* (Estilo Asphalt), *MTB* (Estilo Terracotta), *Gravel*, *Pista*.
  - **Campo de Búsqueda por Texto**: Filtrado dinámico por nombre de evento o comuna.
  - **Filtro por Mes/Año**: Navegación rápida por períodos.
  - **Conmutador de Vista**: Alternar entre "Todas las Carreras" y "Mi Agenda" (Carreras guardadas por el usuario).
- **Tarjetas de Eventos**: Presentación de fecha en bloque destacado, título de carrera, ubicación, disciplina, distancia y botón para guardar en la agenda.

### 3.2 Vista: Detalle de Carrera (`#detail-view`)
- **Banner Hero**: Fotografía de alta calidad del evento con gradiente sutil.
- **Ficha Técnica**: Fecha, comuna/región, distancia (km), desnivel acumulado (+m), tipo de superficie y organizador.
- **Contador Regresivo**: Tiempo restante para el inicio de la carrera.
- **Categorías y Lista de Inscritos**: Visualización de categorías (Elite, Master, Amateur) y avatares de participantes registrados.
- **Acciones**: Botón principal "Ir a Inscripción Oficial" (Safety Yellow CTA) y "Guardar en Mi Agenda".

### 3.3 Vista: Registrar Carrera (`#register-view`)
- **Formulario Completo para Organizadores**:
  - Nombre del Evento, Disciplina, Fecha de Inicio, Región/Comuna.
  - Distancias (ej. 50 km, 100 km), Desnivel positivo, Enlace de inscripción oficial.
  - Imagen promocional / Logo y descripción detallada.
- **Procesamiento e Inserción Inmediata**: Al enviar el formulario, el evento se guarda en `localStorage` y la app redirige automáticamente al Calendario Principal mostrando la nueva carrera.

---

## 4. Sistema de Diseño (Athletic Performance System)

Basado estrictamente en la especificación de `athletic_performance_system/DESIGN.md`:

### Paleta de Colores
- **Asphalt (`#181919`)**: Color primario para texto, navegación y distintivo de la disciplina **Ruta**.
- **Terracotta (`#a73918`)**: Color secundario para eventos **MTB** y superficies de tierra.
- **Safety Yellow (`#d8ef00`)**: Color de alta visibilidad para botones CTA de acción primaria y estados interactivos.
- **Surface & Neutros (`#f8f9f9`, `#edeeee`, `#ffffff`)**: Fondos limpios tipo laboratorio.

### Tipografía
- **Títulos y Cabeceras**: **Montserrat** (Extra Bold 800 y Bold 700) para transmitir la potencia del ciclismo de competición.
- **Cuerpo y Datos**: **Inter** (Regular 400 y SemiBold 600) para máxima legibilidad de especificaciones y fechas.

### Estructura y Componentes
- **Bordes**: Esquinas de `0.25rem` (`rounded`) de estilo técnico e industrial.
- **Elevación**: Bordes de `1px` (`#e1e3e3`) con sombras afiladas en hover.

---

## 5. Plan de Verificación y Pruebas
1. **Verificación de Navegación SPA**: Transición fluida entre Calendario, Detalle de Carrera y Formulario de Registro sin recarga de página.
2. **Prueba de Filtros y Búsqueda**: Filtrar eventos por región, disciplina (Ruta/MTB/Gravel) y texto libre en tiempo real.
3. **Prueba de Persistencia ("Mi Agenda")**: Marcar y desmarcar carreras como guardadas y verificar que persistan al recargar la página.
4. **Prueba de Registro de Evento**: Crear un nuevo evento mediante el formulario y comprobar su aparición inmediata en el Calendario.
