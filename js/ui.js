/**
 * Módulo de Renderizado e Interfaz de Usuario (js/ui.js)
 * Maneja la construcción dinámica del DOM y las vistas SPA.
 */

import { isBookmarked } from './storage.js';
import { renderCalendarButtonHTML } from './calendar-export.js';

/**
 * Parsea una cadena de fecha YYYY-MM-DD a objeto Date a las 00:00:00 hora local
 * @param {string} dateStr 
 * @returns {Date|null}
 */
export function parseLocalDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const parts = dateStr.trim().split('T')[0].split('-');
  if (parts.length !== 3) return null;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
  return new Date(year, month, day);
}

/**
 * Utilitario para detectar la duración y el carácter multi-día de una carrera
 * @param {Object} race 
 * @returns {{ esMultiDia: boolean, duracionDias: number, startDateStr: string, endDateStr: string, startDateObj: Date|null, endDateObj: Date|null }}
 */
export function detectRaceDuration(race) {
  if (!race) {
    return { esMultiDia: false, duracionDias: 1, startDateStr: '', endDateStr: '', startDateObj: null, endDateObj: null };
  }

  const startStr = (race.startDate || race.fecha_inicio || race.date || '').split('T')[0].trim();
  const endStr = (race.endDate || race.fecha_fin || startStr).split('T')[0].trim();

  const startObj = parseLocalDate(startStr);
  const endObj = parseLocalDate(endStr || startStr);

  if (!startObj || !endObj || isNaN(startObj.getTime()) || isNaN(endObj.getTime())) {
    return {
      esMultiDia: false,
      duracionDias: 1,
      startDateStr: startStr,
      endDateStr: endStr || startStr,
      startDateObj: startObj,
      endDateObj: endObj
    };
  }

  // Comparación en milisegundos de las fechas a las 00:00:00 local
  const diffTime = endObj.getTime() - startObj.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  const duracionDias = Math.max(1, diffDays + 1);
  const esMultiDia = duracionDias > 1;

  return {
    esMultiDia,
    duracionDias,
    startDateStr: startStr,
    endDateStr: endStr,
    startDateObj: startObj,
    endDateObj: endObj
  };
}

/**
 * Calcula el día actual de la carrera respecto a una fecha seleccionada (ej: "Día 2 de 5")
 * @param {Object} race 
 * @param {Date|string} currentDate 
 * @returns {string|null}
 */
export function getRaceDayProgress(race, currentDate) {
  const durationInfo = detectRaceDuration(race);
  if (!durationInfo.esMultiDia) return null;

  const currentObj = typeof currentDate === 'string' ? parseLocalDate(currentDate) : currentDate;
  if (!currentObj || !durationInfo.startDateObj || !durationInfo.endDateObj) return null;

  if (currentObj < durationInfo.startDateObj || currentObj > durationInfo.endDateObj) {
    return null; // Fuera del rango de la carrera
  }

  const diffTime = currentObj.getTime() - durationInfo.startDateObj.getTime();
  const currentDay = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;

  return `Día ${currentDay} de ${durationInfo.duracionDias}`;
}

/**
 * Lista de disciplinas disponibles para filtrado
 */
export const DISCIPLINES = ['Todas', 'Ruta', 'MTB', 'Gravel', 'Pista', 'BMX', 'Virtual'];

/**
 * Formatea un precio numérico a CLP o retorna "Gratis"
 * @param {number} price 
 * @param {boolean} isFree 
 * @returns {string}
 */
export function formatPrice(price, isFree) {
  if (isFree || !price || price === 0) {
    return 'Gratis';
  }
  return '$' + Number(price).toLocaleString('es-CL');
}

/**
 * Retorna las clases de color de badge según la disciplina
 * @param {string} discipline 
 * @returns {string} Tailwind CSS classes
 */
export function getDisciplineBadgeClass(discipline) {
  switch (discipline) {
    case 'Ruta':
      // Asphalt
      return 'bg-[#181919] text-white';
    case 'MTB':
      // Terracotta
      return 'bg-[#a73918] text-white';
    case 'Gravel':
      // Verde Oscuro
      return 'bg-[#1b4332] text-white';
    case 'Pista':
      return 'bg-[#334155] text-white';
    case 'BMX':
      return 'bg-[#d97706] text-white';
    case 'Virtual':
      return 'bg-[#2563eb] text-white';
    default:
      return 'bg-gray-800 text-white';
  }
}

/**
 * Retorna el ícono de Material Symbols correspondiente a la disciplina
 * @param {string} discipline 
 * @returns {string} Icon name
 */
export function getDisciplineIcon(discipline) {
  switch (discipline) {
    case 'Ruta': return 'directions_bike';
    case 'MTB': return 'terrain';
    case 'Gravel': return 'explore';
    case 'Pista': return 'sports_score';
    case 'BMX': return 'two_wheeler';
    case 'Virtual': return 'devices';
    default: return 'directions_bike';
  }
}

/**
 * Renderiza los chips de selección de disciplina
 * @param {HTMLElement} container 
 * @param {string} activeDiscipline 
 */
export function renderDisciplineChips(container, activeDiscipline = 'Todas') {
  if (!container) return;

  container.innerHTML = DISCIPLINES.map(discipline => {
    const isActive = discipline === activeDiscipline;
    const activeClasses = 'bg-primary text-tertiary-fixed font-bold shadow-sm ring-2 ring-primary';
    const inactiveClasses = 'bg-white text-primary hover:bg-surface-container border border-outline-variant/40 font-medium';

    return `
      <button 
        type="button" 
        data-discipline="${discipline}" 
        class="chip-discipline px-4 py-2 rounded-xl text-xs sm:text-sm transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${isActive ? activeClasses : inactiveClasses}"
      >
        <span class="material-symbols-outlined text-base">${discipline === 'Todas' ? 'apps' : getDisciplineIcon(discipline)}</span>
        ${discipline}
      </button>
    `;
  }).join('');
}

/**
 * Renderiza las opciones del selector de regiones
 * @param {HTMLElement} container 
 * @param {string[]} regions 
 * @param {string} activeRegion 
 */
export function renderRegionSelect(container, regions = [], activeRegion = 'Todas las regiones') {
  if (!container) return;

  // Si el contenedor es el <select> directamente o un wrapper
  const selectElem = container.tagName === 'SELECT' ? container : container.querySelector('select');
  if (!selectElem) return;

  selectElem.innerHTML = regions.map(region => `
    <option value="${region}" ${region === activeRegion ? 'selected' : ''}>
      ${region}
    </option>
  `).join('');
}

/**
 * Renderiza el grid de tarjetas de carreras
 * @param {HTMLElement} container 
 * @param {Array} races 
 */
export function renderRaceCards(container, races = [], isAdmin = false) {
  if (!container) return;

  if (races.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center bg-white rounded-3xl border border-dashed border-outline-variant/60 p-8 space-y-4">
        <div class="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mx-auto text-outline">
          <span class="material-symbols-outlined text-4xl">search_off</span>
        </div>
        <h3 class="font-display font-bold text-xl text-primary">No se encontraron carreras</h3>
        <p class="text-outline text-sm max-w-md mx-auto">
          Intenta cambiar los filtros de disciplina, región, mes o término de búsqueda.
        </p>
      </div>
    `;
    return;
  }

  container.innerHTML = races.map(race => {
    const bookmarked = isBookmarked(race.id);
    const disciplineBadgeClass = getDisciplineBadgeClass(race.discipline);
    const formattedPrice = formatPrice(race.price, race.isFree);
    const durationInfo = detectRaceDuration(race);

    const multiDayBadgeHTML = durationInfo.esMultiDia 
      ? `<span class="px-2.5 py-1 rounded-full text-xs font-black bg-purple-100 text-purple-900 border border-purple-300 flex items-center gap-1 shadow-sm"><span class="material-symbols-outlined text-xs">date_range</span> ${durationInfo.duracionDias} días</span>`
      : '';

    // Badges de Estado
    let statusBadgeHTML = '';
    if (race.status === 'Últimos Cupos') {
      statusBadgeHTML = `<span class="px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">Últimos Cupos</span>`;
    } else if (race.status === 'Inscripciones Abiertas') {
      statusBadgeHTML = `<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">Inscripciones Abiertas</span>`;
    } else if (race.status === 'Cupos Agotados') {
      statusBadgeHTML = `<span class="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">Cupos Agotados</span>`;
    } else {
      statusBadgeHTML = `<span class="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">${race.status || 'Próximamente'}</span>`;
    }

    const freeBadgeHTML = (race.isFree || race.price === 0) 
      ? `<span class="px-2.5 py-1 rounded-full text-xs font-black bg-tertiary-fixed text-primary border border-lime-400">Gratuita</span>`
      : '';

    return `
      <article class="race-card bg-white rounded-3xl border border-outline-variant/40 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
        
        <!-- Hero Image Header -->
        <div class="relative h-48 w-full overflow-hidden bg-surface-container">
          <img 
            src="${race.heroImage || 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=800&q=80'}" 
            alt="${race.name}" 
            loading="lazy"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          >
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          
          <!-- Badges superiores (Disciplina, Multi-Día y Gratuita) -->
          <div class="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            <span class="px-3 py-1 rounded-lg text-xs font-bold shadow-md flex items-center gap-1 ${disciplineBadgeClass}">
              <span class="material-symbols-outlined text-sm">${getDisciplineIcon(race.discipline)}</span>
              ${race.discipline}
            </span>
            ${multiDayBadgeHTML}
            ${freeBadgeHTML}
          </div>

          <!-- Botón Bookmark / Favorito -->
          <button 
            type="button" 
            data-bookmark-id="${race.id}" 
            aria-label="Guardar en favoritos" 
            class="btn-bookmark absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-primary hover:bg-white flex items-center justify-center shadow-md transition-all active:scale-90 z-10"
          >
            <span class="material-symbols-outlined ${bookmarked ? 'filled text-secondary' : 'text-outline'}">
              ${bookmarked ? 'bookmark' : 'bookmark_border'}
            </span>
          </button>

          <!-- Fecha y Ubicación sobre la imagen -->
          <div class="absolute bottom-3 left-3 right-3 text-white z-10 flex items-center justify-between text-xs">
            <span class="font-bold flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-md">
              <span class="material-symbols-outlined text-sm text-tertiary-fixed">calendar_today</span>
              ${race.displayDate || race.date}
            </span>
            <span class="font-medium bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-md truncate max-w-[50%]">
              ${race.city}
            </span>
          </div>

        </div>

        <!-- Card Body -->
        <div class="p-6 flex-grow flex flex-col justify-between space-y-4">
          
          <div class="space-y-2">
            <!-- Estado & Precio -->
            <div class="flex items-center justify-between gap-2">
              <div>${statusBadgeHTML}</div>
              <span class="font-display font-black text-lg text-primary">
                ${formattedPrice}
              </span>
            </div>

            <!-- Título de la Carrera -->
            <h3 class="font-display font-bold text-xl text-primary group-hover:text-secondary transition-colors line-clamp-2 leading-snug">
              ${race.name}
            </h3>

            <!-- Especificaciones técnicas (Distancia & Desnivel) -->
            <div class="flex items-center gap-4 text-xs font-semibold text-outline pt-1">
              <span class="flex items-center gap-1">
                <span class="material-symbols-outlined text-base">straighten</span>
                ${race.distance}
              </span>
              <span class="flex items-center gap-1">
                <span class="material-symbols-outlined text-base">landscape</span>
                ${race.elevation}
              </span>
              <span class="flex items-center gap-1 truncate">
                <span class="material-symbols-outlined text-base">map</span>
                ${race.region.replace('Región de ', '').replace("Región del Libertador General ", "").replace("Región del ", "")}
              </span>
            </div>

            <!-- Descripción corta -->
            <p class="text-xs text-gray-600 line-clamp-2 leading-relaxed pt-1">
              ${race.description}
            </p>
          </div>

          <!-- Card Footer & CTA -->
          <div class="pt-4 border-t border-outline-variant/30 flex flex-col gap-2">
            <button 
              type="button" 
              data-race-id="${race.id}" 
              class="btn-view-detail w-full bg-[#d8ef00] text-[#181919] font-display font-bold text-sm hover:brightness-105 shadow-sm rounded-xl py-3 px-4 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              Ver Detalle
              <span class="material-symbols-outlined text-base">arrow_forward</span>
            </button>
            ${renderCalendarButtonHTML(race.id, 'card')}
            ${isAdmin ? `
            <div class="flex gap-2 w-full pt-1">
              <button type="button" data-edit-id="${race.id}" class="flex-grow py-2.5 rounded-xl bg-surface-container border border-outline-variant/60 text-primary font-bold text-xs hover:bg-surface-container-high transition-colors flex items-center justify-center gap-1">
                <span class="material-symbols-outlined text-sm">edit</span> Editar
              </button>
              <button type="button" data-delete-id="${race.id}" class="py-2.5 px-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 font-bold text-xs hover:bg-red-500/20 transition-colors flex items-center justify-center gap-1" title="Eliminar Carrera">
                <span class="material-symbols-outlined text-sm">delete</span>
              </button>
            </div>
            ` : ''}
          </div>

        </div>

      </article>
    `;
  }).join('');
}

/**
 * Renderiza la vista detallada de una carrera en el contenedor especificado
 * @param {HTMLElement} container 
 * @param {Object} race 
 */
export function renderDetailView(container, race, isAdmin = false) {
  if (!container || !race) return;

  const bookmarked = isBookmarked(race.id);
  const disciplineBadgeClass = getDisciplineBadgeClass(race.discipline);
  const formattedPrice = formatPrice(race.price, race.isFree);

  const categoriesHTML = Array.isArray(race.categories) && race.categories.length > 0
    ? race.categories.map(cat => `
        <span class="px-3 py-1 rounded-lg bg-surface-container text-primary font-semibold text-xs border border-outline-variant/40">
          ${cat}
        </span>
      `).join('')
    : '<span class="text-xs text-outline italic">Categorías por confirmar</span>';

  container.innerHTML = `
    <div class="space-y-8 animate-fadeIn">
      
      <!-- Back Button & Actions Bar -->
      <div class="flex items-center justify-between flex-wrap gap-4">
        <button 
          type="button" 
          id="btn-back-to-calendar" 
          class="px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-display font-bold text-sm flex items-center gap-2 transition-colors"
        >
          <span class="material-symbols-outlined text-lg">arrow_back</span>
          Volver a Carreras
        </button>

        <div class="flex items-center gap-2">
          ${isAdmin ? `
            <button type="button" data-edit-id="${race.id}" class="px-4 py-2.5 rounded-xl bg-surface-container border border-outline-variant/55 text-primary font-display font-bold text-sm flex items-center gap-2 hover:bg-surface-container-high transition-all shadow-sm">
              <span class="material-symbols-outlined text-base">edit</span> Editar
            </button>
            <button type="button" data-delete-id="${race.id}" class="px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 font-display font-bold text-sm flex items-center gap-2 hover:bg-red-500/20 transition-all shadow-sm">
              <span class="material-symbols-outlined text-base">delete</span> Eliminar
            </button>
          ` : ''}
          <button 
            type="button" 
            data-bookmark-id="${race.id}" 
            class="btn-bookmark px-4 py-2.5 rounded-xl bg-white border border-outline-variant/50 text-primary font-display font-bold text-sm flex items-center gap-2 hover:bg-surface-container transition-all shadow-sm"
          >
            <span class="material-symbols-outlined ${bookmarked ? 'filled text-secondary' : 'text-outline'}">
              ${bookmarked ? 'bookmark' : 'bookmark_border'}
            </span>
            ${bookmarked ? 'Guardada en Agenda' : 'Guardar en Agenda'}
          </button>
          ${renderCalendarButtonHTML(race.id, 'detail')}
        </div>
      </div>

      <!-- Hero Banner Details -->
      <div class="relative rounded-3xl bg-primary text-white overflow-hidden shadow-2xl">
        <div class="relative h-72 sm:h-96 w-full">
          <img 
            src="${race.heroImage || 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=1600&q=80'}" 
            alt="${race.name}" 
            class="w-full h-full object-cover"
          >
          <div class="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent"></div>
          
          <!-- Badges superiores -->
          <div class="absolute top-6 left-6 flex flex-wrap gap-2 z-10">
            <span class="px-3.5 py-1.5 rounded-xl text-xs font-extrabold shadow-lg flex items-center gap-1.5 ${disciplineBadgeClass}">
              <span class="material-symbols-outlined text-base">${getDisciplineIcon(race.discipline)}</span>
              ${race.discipline}
            </span>
            ${race.isFree ? `<span class="px-3.5 py-1.5 rounded-xl text-xs font-black bg-tertiary-fixed text-primary shadow-lg">Evento Gratuito</span>` : ''}
          </div>

          <!-- Información Overlay sobre banner -->
          <div class="absolute bottom-6 left-6 right-6 z-10 space-y-3">
            <div class="flex items-center gap-2 text-tertiary-fixed font-display font-bold text-xs uppercase tracking-widest">
              <span class="material-symbols-outlined text-sm">location_on</span>
              ${race.city}, ${race.region}
            </div>
            <h1 class="text-2xl sm:text-4xl md:text-5xl font-display font-black tracking-tight text-white leading-tight">
              ${race.name}
            </h1>
          </div>

        </div>
      </div>

      <!-- Grid Principal: Detalles y Sidebar CTA -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Columna Izquierda: Información Completa -->
        <div class="lg:col-span-8 space-y-8">
          
          <!-- Stats Rápidos -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-white rounded-3xl border border-outline-variant/40 shadow-sm text-center">
            <div class="space-y-1">
              <span class="material-symbols-outlined text-secondary text-2xl">calendar_month</span>
              <p class="text-xs font-bold text-outline uppercase">Fecha</p>
              <p class="font-display font-bold text-sm text-primary">${race.displayDate || race.date}</p>
            </div>
            <div class="space-y-1">
              <span class="material-symbols-outlined text-secondary text-2xl">straighten</span>
              <p class="text-xs font-bold text-outline uppercase">Distancia</p>
              <p class="font-display font-bold text-sm text-primary">${race.distance}</p>
            </div>
            <div class="space-y-1">
              <span class="material-symbols-outlined text-secondary text-2xl">landscape</span>
              <p class="text-xs font-bold text-outline uppercase">Desnivel</p>
              <p class="font-display font-bold text-sm text-primary">${race.elevation}</p>
            </div>
            <div class="space-y-1">
              <span class="material-symbols-outlined text-secondary text-2xl">group</span>
              <p class="text-xs font-bold text-outline uppercase">Inscriptos</p>
              <p class="font-display font-bold text-sm text-primary">${race.participants || 0}+ ciclistas</p>
            </div>
          </div>

          <!-- Descripción del Evento -->
          <div class="bg-white p-6 sm:p-8 rounded-3xl border border-outline-variant/40 shadow-sm space-y-4">
            <h3 class="font-display font-bold text-xl text-primary flex items-center gap-2">
              <span class="material-symbols-outlined text-secondary">description</span>
              Sobre la Competencia
            </h3>
            <p class="text-gray-700 text-base leading-relaxed whitespace-pre-line">
              ${race.description}
            </p>
          </div>

          <!-- Categorías Disponibles -->
          <div class="bg-white p-6 sm:p-8 rounded-3xl border border-outline-variant/40 shadow-sm space-y-4">
            <h3 class="font-display font-bold text-xl text-primary flex items-center gap-2">
              <span class="material-symbols-outlined text-secondary">military_tech</span>
              Categorías Habilitadas
            </h3>
            <div class="flex flex-wrap gap-2">
              ${categoriesHTML}
            </div>
          </div>

        </div>

        <!-- Columna Derecha: Sidebar Inscripción & Organizador -->
        <div class="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
          
          <div class="bg-white p-6 sm:p-8 rounded-3xl border border-outline-variant/40 shadow-lg space-y-6">
            
            <div class="space-y-1">
              <span class="text-xs font-bold text-outline uppercase tracking-wider">Precio de Inscripción</span>
              <div class="font-display font-black text-3xl text-primary">
                ${formattedPrice}
              </div>
            </div>

            <div class="space-y-3 pt-2">
              <div class="flex justify-between items-center text-sm py-2 border-b border-outline-variant/30">
                <span class="text-outline font-medium">Estado:</span>
                <span class="font-bold text-primary">${race.status}</span>
              </div>
              <div class="flex justify-between items-center text-sm py-2 border-b border-outline-variant/30">
                <span class="text-outline font-medium">Organiza:</span>
                <span class="font-bold text-primary truncate max-w-[60%]">${race.organizer}</span>
              </div>
              <div class="flex justify-between items-center text-sm py-2">
                <span class="text-outline font-medium">Ubicación:</span>
                <span class="font-bold text-primary">${race.city}</span>
              </div>
            </div>

            <!-- CTA Button -->
            <a 
              href="${race.registrationUrl || '#'}" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="w-full bg-[#d8ef00] text-[#181919] font-display font-bold text-base hover:brightness-105 shadow-md rounded-2xl py-4 px-6 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              Ir a Formulario de Inscripción
              <span class="material-symbols-outlined text-xl">open_in_new</span>
            </a>

            <p class="text-[11px] text-center text-outline leading-tight">
              Serás redirigido al sitio web oficial del organizador para completar tu registro.
            </p>

          </div>

        </div>

      </div>

    </div>
  `;
}

/**
 * Cambia la vista principal SPA visible
 * @param {'calendar' | 'detail' | 'register' | 'admin-panel'} viewName 
 */
export function switchView(viewName) {
  const viewCalendar = document.getElementById('view-calendar');
  const viewDetail = document.getElementById('view-detail');
  const viewRegister = document.getElementById('view-register');
  const viewAdminPanel = document.getElementById('view-admin-panel');
 
  const navExplore = document.getElementById('nav-explore');
  const navAgenda = document.getElementById('nav-agenda');
  const navRegister = document.getElementById('nav-register');
  const navAdminPanel = document.getElementById('nav-admin-panel');
 
  // Reset visibilidad
  if (viewCalendar) viewCalendar.classList.add('hidden');
  if (viewDetail) viewDetail.classList.add('hidden');
  if (viewRegister) viewRegister.classList.add('hidden');
  if (viewAdminPanel) viewAdminPanel.classList.add('hidden');
 
  // Reset estilos nav desktop
  const inactiveNavClasses = 'text-outline hover:text-primary hover:bg-surface-container-low';
  const activeNavClasses = 'text-primary bg-surface-container-low font-bold';
 
  if (navExplore) navExplore.className = `nav-btn px-4 py-2 rounded-lg font-display font-bold text-sm transition-colors flex items-center gap-2 ${viewName === 'calendar' ? activeNavClasses : inactiveNavClasses}`;
  if (navAgenda) navAgenda.className = `nav-btn px-4 py-2 rounded-lg font-display font-bold text-sm transition-colors flex items-center gap-2 ${viewName === 'agenda' ? activeNavClasses : inactiveNavClasses}`;
  if (navAdminPanel) navAdminPanel.className = `nav-btn px-4 py-2 rounded-lg font-display font-bold text-sm transition-colors flex items-center gap-2 ${viewName === 'admin-panel' ? activeNavClasses : inactiveNavClasses}`;
 
  if (viewName === 'calendar' || viewName === 'agenda') {
    if (viewCalendar) viewCalendar.classList.remove('hidden');
  } else if (viewName === 'detail') {
    if (viewDetail) viewDetail.classList.remove('hidden');
  } else if (viewName === 'register') {
    if (viewRegister) viewRegister.classList.remove('hidden');
  } else if (viewName === 'admin-panel') {
    if (viewAdminPanel) viewAdminPanel.classList.remove('hidden');
  }
 
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Renderiza las propuestas de carreras pendientes en el panel de moderación.
 * @param {HTMLElement} container 
 * @param {Array} races 
 */
export function renderPendingRaces(container, races = []) {
  if (!container) return;

  if (races.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center bg-white rounded-3xl border border-dashed border-outline-variant/60 p-8 space-y-4">
        <div class="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mx-auto text-outline">
          <span class="material-symbols-outlined text-4xl">task_alt</span>
        </div>
        <h3 class="font-display font-bold text-xl text-primary">No hay propuestas pendientes</h3>
        <p class="text-outline text-sm max-w-md mx-auto">Buen trabajo, el calendario está al día y moderado.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = races.map(race => {
    const disciplineBadgeClass = getDisciplineBadgeClass(race.discipline);
    return `
      <article class="bg-white rounded-3xl border border-outline-variant/40 overflow-hidden shadow-sm flex flex-col group p-6 space-y-4">
        <div class="flex items-center justify-between">
          <span class="px-2.5 py-1 rounded-lg text-xs font-bold ${disciplineBadgeClass}">
            ${race.discipline}
          </span>
          <span class="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            Pendiente
          </span>
        </div>
        <div>
          <h3 class="font-display font-bold text-lg text-primary line-clamp-2">${race.name}</h3>
          <p class="text-xs text-outline font-semibold">${race.displayDate || race.date} — ${race.city}, ${race.region}</p>
        </div>
        <p class="text-xs text-gray-600 line-clamp-3">${race.description}</p>
        <div class="pt-4 border-t border-outline-variant/30 grid grid-cols-2 gap-2">
          <button type="button" data-id="${race.id}" data-approve-id="${race.id}" class="btn-approve-race py-2.5 rounded-xl bg-emerald-600 text-white font-display font-bold text-xs hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1 shadow-sm">
            <span class="material-symbols-outlined text-sm">check_circle</span> Aprobar
          </button>
          <button type="button" data-id="${race.id}" data-reject-id="${race.id}" class="btn-reject-race py-2.5 rounded-xl bg-red-600 text-white font-display font-bold text-xs hover:bg-red-700 transition-colors flex items-center justify-center gap-1 shadow-sm">
            <span class="material-symbols-outlined text-sm">cancel</span> Rechazar
          </button>
        </div>
      </article>
    `;
  }).join('');
}

/**
 * Renderiza la vista mensual en grid continuo de 7 columnas con barras para carreras de varios días
 * @param {HTMLElement} container 
 * @param {Array} races 
 * @param {string} activeMonthYear 
 */
export function renderMonthGrid(container, races = [], activeMonthYear = 'Todos') {
  if (!container) return;

  let year = 2026;
  let monthIndex = 9; // Octubre por defecto

  if (activeMonthYear && activeMonthYear !== 'Todos') {
    const parts = activeMonthYear.split(' ');
    const monthsNameMap = {
      'Enero': 0, 'Febrero': 1, 'Marzo': 2, 'Abril': 3, 'Mayo': 4, 'Junio': 5,
      'Julio': 6, 'Agosto': 7, 'Septiembre': 8, 'Octubre': 9, 'Noviembre': 10, 'Diciembre': 11
    };
    if (monthsNameMap[parts[0]] !== undefined) {
      monthIndex = monthsNameMap[parts[0]];
    }
    if (parts[1] && !isNaN(parseInt(parts[1], 10))) {
      year = parseInt(parts[1], 10);
    }
  } else if (races.length > 0) {
    const firstWithDate = races.find(r => r.startDate || r.date);
    if (firstWithDate) {
      const d = parseLocalDate(firstWithDate.startDate || firstWithDate.date);
      if (d) {
        year = d.getFullYear();
        monthIndex = d.getMonth();
      }
    }
  }

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const monthName = monthNames[monthIndex];

  // Primer y último día del mes
  const firstOfMonth = new Date(year, monthIndex, 1);
  const lastOfMonth = new Date(year, monthIndex + 1, 0);

  // Offset para Lunes como primer día de la semana (0=Lun ... 6=Dom)
  const firstDayDayOfWeek = firstOfMonth.getDay();
  const startOffset = (firstDayDayOfWeek === 0 ? 6 : firstDayDayOfWeek - 1);

  // Generar fecha de inicio del grid
  const startDateGrid = new Date(firstOfMonth);
  startDateGrid.setDate(startDateGrid.getDate() - startOffset);

  // Semanas totales necesarias (4, 5 o 6)
  const totalDaysNeeded = startOffset + lastOfMonth.getDate();
  const totalWeeks = Math.ceil(totalDaysNeeded / 7);

  let html = `
    <div class="space-y-4 animate-fadeIn">
      <!-- Header del Mes -->
      <div class="flex items-center justify-between pb-2 border-b border-outline-variant/30">
        <h3 class="font-display font-black text-xl text-primary flex items-center gap-2">
          <span class="material-symbols-outlined text-secondary text-2xl">calendar_month</span>
          ${monthName} ${year}
        </h3>
        <span class="text-xs font-bold px-3 py-1 rounded-full bg-surface-container text-outline uppercase tracking-wider">
          Vista Mensual
        </span>
      </div>

      <!-- Cabecera Días de la Semana -->
      <div class="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-bold text-outline py-2 border-b border-outline-variant/20">
        <div>Lun</div>
        <div>Mar</div>
        <div>Mié</div>
        <div>Jue</div>
        <div>Vie</div>
        <div>Sáb</div>
        <div>Dom</div>
      </div>

      <!-- Filas de Semanas -->
      <div class="space-y-3">
  `;

  let currentIterDate = new Date(startDateGrid);

  for (let w = 0; w < totalWeeks; w++) {
    const weekStartDate = new Date(currentIterDate);
    const weekEndDate = new Date(currentIterDate);
    weekEndDate.setDate(weekEndDate.getDate() + 6);

    const weekDays = [];
    for (let d = 0; d < 7; d++) {
      weekDays.push(new Date(currentIterDate));
      currentIterDate.setDate(currentIterDate.getDate() + 1);
    }

    // Filtrar carreras activas en esta semana
    const racesInWeek = [];
    races.forEach(race => {
      const dur = detectRaceDuration(race);
      if (!dur.startDateObj || !dur.endDateObj) return;

      if (dur.startDateObj <= weekEndDate && dur.endDateObj >= weekStartDate) {
        let colStart = 1;
        let colEnd = 7;

        if (dur.startDateObj > weekStartDate) {
          const diffMs = dur.startDateObj.getTime() - weekStartDate.getTime();
          colStart = Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1;
        }

        if (dur.endDateObj < weekEndDate) {
          const diffMs = dur.endDateObj.getTime() - weekStartDate.getTime();
          colEnd = Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1;
        }

        racesInWeek.push({
          race,
          dur,
          colStart: Math.max(1, Math.min(7, colStart)),
          colEnd: Math.max(1, Math.min(7, colEnd)),
          span: Math.max(1, colEnd - colStart + 1)
        });
      }
    });

    // Ordenar: multi-día con mayor extensión primero
    racesInWeek.sort((a, b) => {
      if (a.dur.esMultiDia !== b.dur.esMultiDia) {
        return a.dur.esMultiDia ? -1 : 1;
      }
      if (a.colStart !== b.colStart) {
        return a.colStart - b.colStart;
      }
      return b.span - a.span;
    });

    html += `
      <div class="relative bg-surface-container-low/50 rounded-2xl p-2.5 border border-outline-variant/30 min-h-[110px] sm:min-h-[130px] flex flex-col justify-between space-y-2">
        
        <!-- Números de los Días -->
        <div class="grid grid-cols-7 gap-1 sm:gap-2 text-right">
          ${weekDays.map(dayObj => {
            const isCurrentMonth = dayObj.getMonth() === monthIndex;
            const isToday = new Date().toDateString() === dayObj.toDateString();
            const dayNum = dayObj.getDate();

            return `
              <div class="pr-1 font-display font-bold text-xs ${isCurrentMonth ? 'text-primary' : 'text-outline-variant/50'}">
                <span class="${isToday ? 'bg-secondary text-white px-1.5 py-0.5 rounded-full' : ''}">
                  ${dayNum}
                </span>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Renderizado de Barras de Eventos -->
        <div class="grid grid-cols-7 gap-1 sm:gap-2 gap-y-1.5 z-10">
          ${racesInWeek.map(item => {
            const { race, dur, colStart, span } = item;
            const badgeClass = getDisciplineBadgeClass(race.discipline);

            if (dur.esMultiDia) {
              return `
                <div 
                  data-race-id="${race.id}"
                  style="grid-column: ${colStart} / span ${span};"
                  class="cursor-pointer group relative bg-gradient-to-r from-primary via-primary/95 to-primary/80 text-white rounded-xl px-2.5 py-1.5 text-xs font-bold shadow-sm hover:brightness-110 transition-all flex items-center justify-between overflow-hidden border-l-4 border-tertiary-fixed"
                  title="${race.name} (${dur.duracionDias} días)"
                >
                  <div class="flex items-center gap-1.5 truncate">
                    <span class="px-1.5 py-0.5 rounded text-[10px] font-black uppercase ${badgeClass}">${race.discipline}</span>
                    <span class="truncate font-display font-extrabold text-white">${race.name}</span>
                  </div>
                  <span class="shrink-0 text-[10px] font-bold bg-white/20 px-1.5 py-0.5 rounded-full text-tertiary-fixed ml-1">
                    ${dur.duracionDias}d
                  </span>
                </div>
              `;
            } else {
              return `
                <div 
                  data-race-id="${race.id}"
                  style="grid-column: ${colStart} / span 1;"
                  class="cursor-pointer group relative bg-white border border-outline-variant/60 hover:border-primary text-primary rounded-xl px-2 py-1 text-[11px] font-bold shadow-2xs hover:shadow-md transition-all flex items-center gap-1 truncate"
                  title="${race.name}"
                >
                  <span class="w-2 h-2 rounded-full ${badgeClass} shrink-0"></span>
                  <span class="truncate font-medium">${race.name}</span>
                </div>
              `;
            }
          }).join('')}
        </div>

      </div>
    `;
  }

  html += `
      </div>
    </div>
  `;

  container.innerHTML = html;
}

/**
 * Renderiza la vista semanal con indicadores de progreso "Día X de Y"
 * @param {HTMLElement} container 
 * @param {Array} races 
 * @param {Date|string} referenceDate 
 */
export function renderWeekGrid(container, races = [], referenceDate = new Date()) {
  if (!container) return;

  const refObj = typeof referenceDate === 'string' ? (parseLocalDate(referenceDate) || new Date()) : referenceDate;
  
  const dayOfWeek = refObj.getDay();
  const offsetToMonday = (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
  const mondayObj = new Date(refObj);
  mondayObj.setDate(mondayObj.getDate() - offsetToMonday);

  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(mondayObj);
    d.setDate(d.getDate() + i);
    weekDays.push(d);
  }

  const sundayObj = weekDays[6];
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  
  const headerText = `Semana del ${mondayObj.getDate()} de ${monthNames[mondayObj.getMonth()]} al ${sundayObj.getDate()} de ${monthNames[sundayObj.getMonth()]}, ${sundayObj.getFullYear()}`;

  let html = `
    <div class="space-y-6 animate-fadeIn">
      <div class="flex items-center justify-between pb-2 border-b border-outline-variant/30">
        <h3 class="font-display font-black text-xl text-primary flex items-center gap-2">
          <span class="material-symbols-outlined text-secondary text-2xl">view_week</span>
          ${headerText}
        </h3>
        <span class="text-xs font-bold px-3 py-1 rounded-full bg-surface-container text-outline uppercase tracking-wider">
          Vista Semanal
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-7 gap-4">
  `;

  const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  weekDays.forEach((dayObj, index) => {
    const isToday = new Date().toDateString() === dayObj.toDateString();

    const activeRaces = races.filter(race => {
      const dur = detectRaceDuration(race);
      return dur.startDateObj && dur.endDateObj && dayObj >= dur.startDateObj && dayObj <= dur.endDateObj;
    });

    html += `
      <div class="bg-surface-container-low/50 rounded-2xl p-3 border border-outline-variant/30 flex flex-col space-y-3 min-h-[160px]">
        <div class="flex items-center justify-between border-b border-outline-variant/20 pb-2">
          <span class="font-display font-bold text-xs text-primary">${dayNames[index]}</span>
          <span class="text-xs font-extrabold ${isToday ? 'bg-secondary text-white px-2 py-0.5 rounded-full' : 'text-outline'}">
            ${dayObj.getDate()}
          </span>
        </div>

        <div class="space-y-2 flex-grow">
          ${activeRaces.length === 0 ? `
            <p class="text-[11px] text-outline italic py-2 text-center">Sin eventos</p>
          ` : activeRaces.map(race => {
            const dur = detectRaceDuration(race);
            const badgeClass = getDisciplineBadgeClass(race.discipline);
            const dayProgress = getRaceDayProgress(race, dayObj);

            return `
              <div 
                data-race-id="${race.id}" 
                class="cursor-pointer bg-white border border-outline-variant/40 hover:border-primary p-2.5 rounded-xl shadow-2xs hover:shadow-md transition-all space-y-1.5"
              >
                <div class="flex items-center justify-between gap-1">
                  <span class="px-1.5 py-0.5 rounded text-[10px] font-black uppercase ${badgeClass}">${race.discipline}</span>
                  ${dur.esMultiDia && dayProgress ? `
                    <span class="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-purple-100 text-purple-900 border border-purple-300">
                      ${dayProgress}
                    </span>
                  ` : ''}
                </div>
                <h5 class="font-display font-bold text-xs text-primary line-clamp-2">${race.name}</h5>
                <p class="text-[10px] text-outline font-medium truncate">${race.city}</p>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  });

  html += `
      </div>
    </div>
  `;

  container.innerHTML = html;
}

/**
 * Renderiza la vista diaria con indicador detallado de avance "Día X de Y"
 * @param {HTMLElement} container 
 * @param {Array} races 
 * @param {Date|string} referenceDate 
 */
export function renderDayGrid(container, races = [], referenceDate = new Date()) {
  if (!container) return;

  const dayObj = typeof referenceDate === 'string' ? (parseLocalDate(referenceDate) || new Date()) : referenceDate;
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  const headerText = `${dayNames[dayObj.getDay()]} ${dayObj.getDate()} de ${monthNames[dayObj.getMonth()]}, ${dayObj.getFullYear()}`;

  const activeRaces = races.filter(race => {
    const dur = detectRaceDuration(race);
    return dur.startDateObj && dur.endDateObj && dayObj >= dur.startDateObj && dayObj <= dur.endDateObj;
  });

  let html = `
    <div class="space-y-6 animate-fadeIn">
      <div class="flex items-center justify-between pb-2 border-b border-outline-variant/30">
        <h3 class="font-display font-black text-xl text-primary flex items-center gap-2">
          <span class="material-symbols-outlined text-secondary text-2xl">today</span>
          ${headerText}
        </h3>
        <span class="text-xs font-bold px-3 py-1 rounded-full bg-surface-container text-outline uppercase tracking-wider">
          Vista Diaria (${activeRaces.length} evento${activeRaces.length === 1 ? '' : 's'})
        </span>
      </div>

      <div class="space-y-4">
        ${activeRaces.length === 0 ? `
          <div class="py-16 text-center bg-white rounded-3xl border border-dashed border-outline-variant/60 p-8 space-y-3">
            <span class="material-symbols-outlined text-4xl text-outline">event_busy</span>
            <h4 class="font-display font-bold text-lg text-primary">No hay eventos para este día</h4>
            <p class="text-xs text-outline">Prueba seleccionando otra fecha o cambiando las disciplinas.</p>
          </div>
        ` : activeRaces.map(race => {
          const dur = detectRaceDuration(race);
          const badgeClass = getDisciplineBadgeClass(race.discipline);
          const dayProgress = getRaceDayProgress(race, dayObj);

          return `
            <article 
              data-race-id="${race.id}" 
              class="cursor-pointer bg-white p-6 rounded-3xl border border-outline-variant/40 hover:border-primary shadow-sm hover:shadow-lg transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
            >
              <div class="space-y-2 max-w-xl">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="px-2.5 py-1 rounded-lg text-xs font-bold ${badgeClass}">${race.discipline}</span>
                  ${dur.esMultiDia && dayProgress ? `
                    <span class="px-3 py-1 rounded-full text-xs font-black bg-purple-100 text-purple-900 border border-purple-300 shadow-2xs flex items-center gap-1">
                      <span class="material-symbols-outlined text-xs">flag</span> ${dayProgress}
                    </span>
                  ` : `
                    <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-surface-container text-outline">Un solo día</span>
                  `}
                </div>
                <h4 class="font-display font-black text-xl text-primary group-hover:text-secondary transition-colors">${race.name}</h4>
                <p class="text-xs text-gray-600 line-clamp-2">${race.description}</p>
                <div class="flex items-center gap-4 text-xs text-outline font-semibold">
                  <span>📍 ${race.city}, ${race.region}</span>
                  <span>📏 ${race.distance}</span>
                </div>
              </div>

              <div class="sm:text-right shrink-0 space-y-2">
                <span class="font-display font-black text-xl text-primary block">${formatPrice(race.price, race.isFree)}</span>
                <button type="button" class="px-4 py-2 rounded-xl bg-tertiary-fixed text-primary font-bold text-xs hover:brightness-105 shadow-sm inline-flex items-center gap-1">
                  Ver Detalles <span class="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </article>
          `;
        }).join('')}
      </div>
    </div>
  `;

  container.innerHTML = html;
}
