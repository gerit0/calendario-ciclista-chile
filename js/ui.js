/**
 * Módulo de Renderizado e Interfaz de Usuario (js/ui.js)
 * Maneja la construcción dinámica del DOM y las vistas SPA.
 */

import { isBookmarked } from './storage.js';

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
export function renderRaceCards(container, races = []) {
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
          
          <!-- Badges superiores (Disciplina y Gratuita) -->
          <div class="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            <span class="px-3 py-1 rounded-lg text-xs font-bold shadow-md flex items-center gap-1 ${disciplineBadgeClass}">
              <span class="material-symbols-outlined text-sm">${getDisciplineIcon(race.discipline)}</span>
              ${race.discipline}
            </span>
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
          <div class="pt-4 border-t border-outline-variant/30 flex items-center gap-2">
            <button 
              type="button" 
              data-race-id="${race.id}" 
              class="btn-view-detail w-full bg-[#d8ef00] text-[#181919] font-display font-bold text-sm hover:brightness-105 shadow-sm rounded-xl py-3 px-4 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              Ver Detalle
              <span class="material-symbols-outlined text-base">arrow_forward</span>
            </button>
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
export function renderDetailView(container, race) {
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
      <div class="flex items-center justify-between">
        <button 
          type="button" 
          id="btn-back-to-calendar" 
          class="px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-display font-bold text-sm flex items-center gap-2 transition-colors"
        >
          <span class="material-symbols-outlined text-lg">arrow_back</span>
          Volver a Carreras
        </button>

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
 * @param {'calendar' | 'detail' | 'register'} viewName 
 */
export function switchView(viewName) {
  const viewCalendar = document.getElementById('view-calendar');
  const viewDetail = document.getElementById('view-detail');
  const viewRegister = document.getElementById('view-register');

  const navExplore = document.getElementById('nav-explore');
  const navAgenda = document.getElementById('nav-agenda');
  const navRegister = document.getElementById('nav-register');

  // Reset visibilidad
  if (viewCalendar) viewCalendar.classList.add('hidden');
  if (viewDetail) viewDetail.classList.add('hidden');
  if (viewRegister) viewRegister.classList.add('hidden');

  // Reset estilos nav desktop
  const inactiveNavClasses = 'text-outline hover:text-primary hover:bg-surface-container-low';
  const activeNavClasses = 'text-primary bg-surface-container-low font-bold';

  if (navExplore) navExplore.className = `nav-btn px-4 py-2 rounded-lg font-display font-bold text-sm transition-colors flex items-center gap-2 ${viewName === 'calendar' ? activeNavClasses : inactiveNavClasses}`;
  if (navAgenda) navAgenda.className = `nav-btn px-4 py-2 rounded-lg font-display font-bold text-sm transition-colors flex items-center gap-2 ${viewName === 'agenda' ? activeNavClasses : inactiveNavClasses}`;

  if (viewName === 'calendar' || viewName === 'agenda') {
    if (viewCalendar) viewCalendar.classList.remove('hidden');
  } else if (viewName === 'detail') {
    if (viewDetail) viewDetail.classList.remove('hidden');
  } else if (viewName === 'register') {
    if (viewRegister) viewRegister.classList.remove('hidden');
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
