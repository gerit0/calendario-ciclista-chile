/**
 * Controlador Principal de la Aplicación (js/app.js)
 * Gestiona el estado global, filtrado de carreras, manejo de eventos DOM e inicialización SPA.
 */

import { REGIONS_CHILE } from './data.js';
import { getAllRaces, getBookmarkedIds, toggleBookmark, isBookmarked, saveCustomRace, saveRace } from './storage.js';
import { renderDisciplineChips, renderRegionSelect, renderRaceCards, renderDetailView, switchView } from './ui.js';
import { validateRaceForm } from './validation.js';

// 2. Estado de la Aplicación
let currentDiscipline = "Todas";
let currentRegion = "Todas las regiones";
let currentMonth = "Todos";
let searchQuery = "";
let activeTab = "all"; // "all" o "my-calendar"
let currentRaceId = null;

/**
 * Limpia todos los mensajes de error del formulario
 * @param {HTMLFormElement} form 
 */
export function clearFormErrors(form) {
  if (!form) return;
  form.querySelectorAll('.field-error-msg').forEach(el => el.remove());
  form.querySelectorAll('input, select, textarea').forEach(input => {
    input.classList.remove('border-secondary', 'ring-1', 'ring-secondary');
  });
}

/**
 * Renderiza los errores de validación debajo de cada campo correspondiente
 * @param {HTMLFormElement} form 
 * @param {Object} errors 
 */
export function renderFormErrors(form, errors) {
  clearFormErrors(form);
  if (!form || !errors) return;

  const fieldMap = {
    name: 'name',
    discipline: 'discipline',
    date: 'date',
    region: 'region',
    organizador: 'organizer',
    organizer: 'organizer',
    registrationUrl: 'registrationUrl',
    city: 'city',
    distance: 'distance',
    description: 'description'
  };

  for (const [key, errorMsg] of Object.entries(errors)) {
    const fieldName = fieldMap[key] || key;
    const inputElem = form.querySelector(`[name="${fieldName}"]`) || form.querySelector(`#form-${fieldName}`);
    
    if (inputElem) {
      inputElem.classList.add('border-secondary', 'ring-1', 'ring-secondary');
      const errEl = document.createElement('p');
      errEl.className = 'field-error-msg text-secondary text-xs font-semibold mt-1 flex items-center gap-1';
      errEl.innerHTML = `<span class="material-symbols-outlined text-sm">error</span> ${errorMsg}`;
      
      if (inputElem.parentNode) {
        inputElem.parentNode.appendChild(errEl);
      }
    }
  }
}

/**
 * Muestra una notificación flotante tipo banner toast en pantalla
 * @param {string} message 
 */
export function showNotificationToast(message) {
  const existing = document.getElementById('toast-notification');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'toast-notification';
  toast.className = 'fixed bottom-6 right-6 z-50 max-w-lg bg-primary text-white p-5 rounded-2xl shadow-2xl border border-tertiary-fixed/50 flex items-start gap-4 transition-all duration-300 transform translate-y-0';
  toast.innerHTML = `
    <div class="w-10 h-10 rounded-xl bg-tertiary-fixed text-primary flex items-center justify-center flex-shrink-0 font-bold shadow-md">
      <span class="material-symbols-outlined text-2xl">published_with_changes</span>
    </div>
    <div class="flex-grow text-sm space-y-1">
      <h4 class="font-display font-bold text-tertiary-fixed text-base">Notificación del Sistema</h4>
      <p class="text-gray-200 leading-relaxed font-medium">${message}</p>
    </div>
    <button type="button" id="close-toast-btn" aria-label="Cerrar notificación" class="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
      <span class="material-symbols-outlined text-xl">close</span>
    </button>
  `;

  document.body.appendChild(toast);

  const closeBtn = toast.querySelector('#close-toast-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      toast.remove();
    });
  }

  setTimeout(() => {
    if (document.body.contains(toast)) {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => {
        if (document.body.contains(toast)) toast.remove();
      }, 300);
    }
  }, 9000);
}

/**
 * 3. Lógica de Filtrado:
 * Filtra las carreras obtenidas de getAllRaces() según currentDiscipline, currentRegion,
 * currentMonth, searchQuery y activeTab.
 * @returns {Promise<Array>} Array de carreras filtradas.
 */
export async function getFilteredRaces() {
  const races = await getAllRaces();
  const bookmarkedIds = getBookmarkedIds();

  return races.filter(race => {
    // Filtrado por pestaña activa (Mi Agenda / Mis Carreras)
    if (activeTab === 'my-calendar' || activeTab === 'agenda') {
      if (!bookmarkedIds.includes(race.id)) {
        return false;
      }
    }

    // Filtrado por disciplina
    if (currentDiscipline && currentDiscipline !== 'Todas') {
      if (race.discipline !== currentDiscipline) {
        return false;
      }
    }

    // Filtrado por región
    if (currentRegion && currentRegion !== 'Todas las regiones') {
      if (race.region !== currentRegion) {
        return false;
      }
    }

    // Filtrado por mes — incluye año para evitar mezclar eventos de distintos años
    if (currentMonth && currentMonth !== 'Todos') {
      let raceMonthYear = race.monthYear || '';
      if (!raceMonthYear && race.date) {
        const dateObj = new Date(race.date + 'T00:00:00');
        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        raceMonthYear = `${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
      }
      // currentMonth puede ser 'Enero 2026' (con año) o solo 'Enero' (retrocompatibilidad)
      const matchMonthYear = raceMonthYear === currentMonth;
      const matchMonthOnly = currentMonth.split(' ').length === 1 && raceMonthYear.startsWith(currentMonth);
      if (!matchMonthYear && !matchMonthOnly) {
        return false;
      }
    }

    // Filtrado por búsqueda de texto
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      const matchName = race.name ? race.name.toLowerCase().includes(q) : false;
      const matchCity = race.city ? race.city.toLowerCase().includes(q) : false;
      const matchOrganizer = (race.organizer || race.organizador) ? (race.organizer || race.organizador).toLowerCase().includes(q) : false;
      const matchDescription = race.description ? race.description.toLowerCase().includes(q) : false;
      if (!matchName && !matchCity && !matchOrganizer && !matchDescription) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Actualiza el renderizado del calendario y sus contadores/badges
 */
export async function updateCalendar() {
  const filteredRaces = await getFilteredRaces();
  const racesContainer = document.getElementById('races-container');
  
  if (racesContainer) {
    renderRaceCards(racesContainer, filteredRaces);
  }

  // Contador de carreras filtradas
  const countElem = document.getElementById('races-count');
  if (countElem) {
    countElem.textContent = `${filteredRaces.length} carrera${filteredRaces.length === 1 ? '' : 's'}`;
  }

  // Badge de agenda
  const agendaBadge = document.getElementById('agenda-badge');
  const bookmarkedCount = getBookmarkedIds().length;
  if (agendaBadge) {
    agendaBadge.textContent = bookmarkedCount;
    if (bookmarkedCount > 0) {
      agendaBadge.classList.remove('hidden');
    } else {
      agendaBadge.classList.add('hidden');
    }
  }

  // Título de sección del calendario
  const calendarTitle = document.getElementById('calendar-title');
  if (calendarTitle) {
    if (activeTab === 'my-calendar' || activeTab === 'agenda') {
      calendarTitle.textContent = 'Mi Agenda de Carreras Guardadas';
    } else {
      calendarTitle.textContent = 'Próximas Carreras';
    }
  }
}

/**
 * 4. Configuración de Event Handlers e Interactividad
 */
function setupEventHandlers() {
  // Búsqueda por texto (#search-input)
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      updateCalendar();
    });
  }

  // Selector de región (#region-select)
  const regionSelect = document.getElementById('region-select');
  if (regionSelect) {
    regionSelect.addEventListener('change', (e) => {
      currentRegion = e.target.value;
      updateCalendar();
    });
  }

  // Selector de mes (#month-select)
  const monthSelect = document.getElementById('month-select');
  if (monthSelect) {
    monthSelect.addEventListener('change', (e) => {
      currentMonth = e.target.value;
      updateCalendar();
    });
  }

  // Chips de disciplina (#discipline-chips)
  const disciplineChipsContainer = document.getElementById('discipline-chips');
  if (disciplineChipsContainer) {
    disciplineChipsContainer.addEventListener('click', (e) => {
      const chipBtn = e.target.closest('[data-discipline]');
      if (chipBtn) {
        currentDiscipline = chipBtn.getAttribute('data-discipline');
        renderDisciplineChips(disciplineChipsContainer, currentDiscipline);
        updateCalendar();
      }
    });
  }

  // Navegación de pestañas de cabecera
  const navExploreIds = ['nav-explore', 'mobile-nav-explore'];
  const navAgendaIds = ['nav-agenda', 'nav-my-calendar', 'mobile-nav-agenda'];
  const navPublishIds = ['nav-register', 'nav-publish-btn', 'hero-publish-btn', 'mobile-nav-register'];
  const navLogoIds = ['brand-logo', 'nav-logo'];

  navExploreIds.forEach(id => {
    const elem = document.getElementById(id);
    if (elem) {
      elem.addEventListener('click', (e) => {
        e.preventDefault();
        activeTab = 'all';
        switchView('calendar');
        updateCalendar();
      });
    }
  });

  navAgendaIds.forEach(id => {
    const elem = document.getElementById(id);
    if (elem) {
      elem.addEventListener('click', (e) => {
        e.preventDefault();
        activeTab = 'my-calendar';
        switchView('agenda');
        updateCalendar();
      });
    }
  });

  navPublishIds.forEach(id => {
    const elem = document.getElementById(id);
    if (elem) {
      elem.addEventListener('click', (e) => {
        e.preventDefault();
        switchView('register');
      });
    }
  });

  navLogoIds.forEach(id => {
    const elem = document.getElementById(id);
    if (elem) {
      elem.addEventListener('click', (e) => {
        e.preventDefault();
        activeTab = 'all';
        switchView('calendar');
        updateCalendar();
      });
    }
  });

  // Botones de cancelar/volver del formulario de registro
  const backFromRegisterBtn = document.getElementById('btn-back-from-register');
  if (backFromRegisterBtn) {
    backFromRegisterBtn.addEventListener('click', () => {
      const raceForm = document.getElementById('race-form');
      if (raceForm) clearFormErrors(raceForm);
      switchView('calendar');
    });
  }

  const cancelRegisterBtn = document.getElementById('btn-cancel-register');
  if (cancelRegisterBtn) {
    cancelRegisterBtn.addEventListener('click', () => {
      const raceForm = document.getElementById('race-form');
      if (raceForm) clearFormErrors(raceForm);
      switchView('calendar');
    });
  }

  // Menú móvil toggle
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Clics delegados en #races-container (favoritos y ver detalle)
  const racesContainer = document.getElementById('races-container');
  if (racesContainer) {
    racesContainer.addEventListener('click', async (e) => {
      // Favoritos (.btn-bookmark o data-bookmark-id)
      const bookmarkBtn = e.target.closest('[data-bookmark-id]');
      if (bookmarkBtn) {
        e.stopPropagation();
        const raceId = bookmarkBtn.getAttribute('data-bookmark-id');
        toggleBookmark(raceId);
        await updateCalendar();
        return;
      }

      // Ver detalle ([data-race-id] o .btn-view-detail)
      const detailBtn = e.target.closest('[data-race-id]');
      if (detailBtn) {
        const raceId = detailBtn.getAttribute('data-race-id');
        const races = await getAllRaces();
        const race = races.find(r => r.id === raceId);
        if (race) {
          currentRaceId = raceId;
          const detailContainer = document.getElementById('detail-content');
          renderDetailView(detailContainer, race);
          switchView('detail');
        }
      }
    });
  }

  // Clics delegados en #detail-content (volver o bookmark dentro de la vista detalle)
  const detailContainer = document.getElementById('detail-content');
  if (detailContainer) {
    detailContainer.addEventListener('click', async (e) => {
      const backBtn = e.target.closest('#btn-back-to-calendar');
      if (backBtn) {
        switchView('calendar');
        await updateCalendar();
        return;
      }

      const bookmarkBtn = e.target.closest('[data-bookmark-id]');
      if (bookmarkBtn) {
        const raceId = bookmarkBtn.getAttribute('data-bookmark-id');
        toggleBookmark(raceId);
        const races = await getAllRaces();
        const race = races.find(r => r.id === raceId);
        if (race) {
          renderDetailView(detailContainer, race);
        }
        await updateCalendar();
      }
    });
  }

  // Envío del formulario #race-form
  const raceForm = document.getElementById('race-form');
  if (raceForm) {
    raceForm.noValidate = true;

    raceForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Anti doble-envío: deshabilitar el botón de publicar inmediatamente
      const submitBtn = raceForm.querySelector('[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
      }

      const formData = new FormData(raceForm);
      const isFree = document.getElementById('form-is-free')?.checked || false;
      const dateStr = formData.get('date') || '';

      const rawFormData = {
        name: formData.get('name') || '',
        discipline: formData.get('discipline') || '',
        date: dateStr,
        region: formData.get('region') || '',
        organizador: formData.get('organizer') || '',
        organizer: formData.get('organizer') || '',
        registrationUrl: formData.get('registrationUrl') || '',
        city: formData.get('city') || '',
        distance: formData.get('distance') || '',
        elevation: formData.get('elevation') || '',
        price: isFree ? 0 : formData.get('price') || 0,
        heroImage: formData.get('heroImage') || '',
        description: formData.get('description') || '',
        categories: formData.get('categories') || ''
      };

      // 1. Ejecutar validateRaceForm(rawFormData)
      const validationResult = validateRaceForm(rawFormData);

      // 2. Si isValid === false, renderizar errores, rehabilitar botón y no enviar
      if (!validationResult.isValid) {
        renderFormErrors(raceForm, validationResult.errors);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
        // Scroll al primer error
        const firstError = raceForm.querySelector('.field-error-msg');
        if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      // 3. Si isValid === true, limpiar mensajes de error
      clearFormErrors(raceForm);

      const sanitizedData = validationResult.sanitizedData;

      let monthName = 'Todos';
      let monthYear = '';
      let displayDateStr = sanitizedData.date || '';

      if (sanitizedData.date) {
        try {
          const dateObj = new Date(sanitizedData.date + 'T00:00:00');
          if (!isNaN(dateObj.getTime())) {
            const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
            monthName = months[dateObj.getMonth()];
            const day = dateObj.getDate();
            const year = dateObj.getFullYear();
            monthYear = `${monthName} ${year}`;
            displayDateStr = `${day} de ${monthName}, ${year}`;
          }
        } catch (err) {}
      }

      // 4. Detección de cruce de fechas por región y disciplina
      const existingRaces = await getAllRaces();
      const conflicts = existingRaces.filter(r => {
        if (!r.date || !sanitizedData.date) return false;
        const sameDate = r.date === sanitizedData.date;
        const sameRegion = r.region === sanitizedData.region;
        const sameDiscipline = r.discipline === sanitizedData.discipline;
        return sameDate && sameRegion && sameDiscipline;
      });

      if (conflicts.length > 0) {
        const conflictNames = conflicts.map(r => `"${r.name}"`).join(', ');
        const conflictWarning = document.getElementById('form-conflict-warning');
        if (conflictWarning) {
          conflictWarning.innerHTML = `
            <span class="material-symbols-outlined text-lg align-middle">warning</span>
            <strong>Advertencia de Conflicto:</strong> Ya existe(n) ${conflicts.length} carrera(s) en esta misma fecha, región y disciplina: ${conflictNames}.
            Verifica antes de publicar o cambia la fecha/disciplina/región.
          `;
          conflictWarning.classList.remove('hidden');
          conflictWarning.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          const warnEl = document.createElement('div');
          warnEl.id = 'form-conflict-warning';
          warnEl.className = 'w-full p-4 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-700 dark:text-amber-300 text-sm font-semibold flex flex-col gap-2 mb-2';
          warnEl.innerHTML = `
            <span class="material-symbols-outlined text-lg align-middle">warning</span>
            <strong>Advertencia de Conflicto:</strong> Ya existe(n) ${conflicts.length} carrera(s) en esta misma fecha, región y disciplina: ${conflictNames}.
            Verifica antes de publicar o cambia la fecha/disciplina/región.
          `;
          raceForm.insertBefore(warnEl, raceForm.firstChild);
          warnEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        // Rehabilitar el botón para que el usuario pueda corregir
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
        return;
      }

      // Limpiar advertencia de conflicto si existía
      const conflictWarning = document.getElementById('form-conflict-warning');
      if (conflictWarning) conflictWarning.remove();

      const categoriesStr = formData.get('categories') || '';
      const categoriesArray = typeof categoriesStr === 'string'
        ? categoriesStr.split(',').map(c => c.trim()).filter(Boolean)
        : [];

      const newRace = {
        id: 'race-' + Date.now(),
        name: sanitizedData.name || 'Nueva Carrera',
        discipline: sanitizedData.discipline || 'Ruta',
        date: sanitizedData.date || '',
        month: monthName,
        monthYear: monthYear,
        displayDate: displayDateStr,
        region: sanitizedData.region || 'Región Metropolitana de Santiago',
        city: sanitizedData.city || '',
        distance: sanitizedData.distance || '0 km',
        elevation: sanitizedData.elevation || '0 m',
        price: isFree ? 0 : Number(sanitizedData.price) || 0,
        isFree: isFree,
        status: 'Pendiente',
        organizer: sanitizedData.organizador || sanitizedData.organizer || '',
        organizador: sanitizedData.organizador || sanitizedData.organizer || '',
        registrationUrl: sanitizedData.registrationUrl || '#',
        heroImage: sanitizedData.heroImage || 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=1200&q=80',
        description: sanitizedData.description || '',
        categories: categoriesArray,
        participants: 1
      };

      try {
        await saveRace(newRace);
      } catch (saveErr) {
        console.error('Error al guardar la carrera:', saveErr);
        showNotificationToast('⚠️ Ocurrió un error al guardar la carrera. Inténtalo de nuevo.');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
        return;
      }

      // 5. Mostrar banner flotante de notificación modal/toast en pantalla
      showNotificationToast("¡Propuesta de carrera enviada a moderación! Tu evento ha sido registrado en estado 'pendiente' y se mostrará en el calendario público una vez sea revisado y aprobado por el administrador.");

      // 6. Limpiar el formulario y navegar a la vista de calendario
      raceForm.reset();
      activeTab = 'all';
      switchView('calendar');
      await updateCalendar();
    });
  }
}

// 5. Inicialización segura (soporta scripts diferidos o al final del body)
async function initApp() {
  const regionSelectContainer = document.getElementById('region-select');
  if (regionSelectContainer) {
    renderRegionSelect(regionSelectContainer, REGIONS_CHILE, currentRegion);
  }

  const formRegionSelect = document.getElementById('form-region');
  if (formRegionSelect) {
    const filterRegions = REGIONS_CHILE.filter(r => r !== 'Todas las regiones');
    renderRegionSelect(formRegionSelect, filterRegions, filterRegions[0]);
  }

  const disciplineChipsContainer = document.getElementById('discipline-chips');
  if (disciplineChipsContainer) {
    renderDisciplineChips(disciplineChipsContainer, currentDiscipline);
  }

  setupEventHandlers();
  await updateCalendar();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

