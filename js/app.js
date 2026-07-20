/**
 * Controlador Principal de la Aplicación (js/app.js)
 * Gestiona el estado global, filtrado de carreras, manejo de eventos DOM e inicialización SPA.
 */

import { REGIONS_CHILE } from './data.js';
import { getAllRaces, getBookmarkedIds, toggleBookmark, isBookmarked, saveCustomRace, saveRace } from './storage.js';
import { renderDisciplineChips, renderRegionSelect, renderRaceCards, renderDetailView, switchView, renderPendingRaces } from './ui.js';
import { validateRaceForm } from './validation.js';
import { 
  loginAdmin, 
  logoutAdmin, 
  getCurrentUser, 
  checkIsAdmin, 
  fetchPendingRacesSupabase, 
  updateRaceStatusSupabase, 
  deleteRaceSupabase, 
  updateRaceSupabase 
} from './supabase.js';

// 2. Estado de la Aplicación
let currentDiscipline = "Todas";
let currentRegion = "Todas las regiones";
let currentMonth = "Todos";
let searchQuery = "";
let activeTab = "all"; // "all" o "my-calendar"
let currentRaceId = null;
let isAdmin = false;

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
    renderRaceCards(racesContainer, filteredRaces, isAdmin);
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

      // Editar Carrera (Admin)
      const editBtn = e.target.closest('[data-edit-id]');
      if (editBtn) {
        e.stopPropagation();
        const raceId = editBtn.getAttribute('data-edit-id');
        openEditModal(raceId);
        return;
      }

      // Eliminar Carrera (Admin)
      const deleteBtn = e.target.closest('[data-delete-id]');
      if (deleteBtn) {
        e.stopPropagation();
        const raceId = deleteBtn.getAttribute('data-delete-id');
        handleDeleteRace(raceId);
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
          renderDetailView(detailContainer, race, isAdmin);
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

      // Editar desde Detalle
      const editBtn = e.target.closest('[data-edit-id]');
      if (editBtn) {
        const raceId = editBtn.getAttribute('data-edit-id');
        openEditModal(raceId);
        return;
      }

      // Eliminar desde Detalle
      const deleteBtn = e.target.closest('[data-delete-id]');
      if (deleteBtn) {
        const raceId = deleteBtn.getAttribute('data-delete-id');
        handleDeleteRace(raceId);
        return;
      }

      const bookmarkBtn = e.target.closest('[data-bookmark-id]');
      if (bookmarkBtn) {
        const raceId = bookmarkBtn.getAttribute('data-bookmark-id');
        toggleBookmark(raceId);
        const races = await getAllRaces();
        const race = races.find(r => r.id === raceId);
        if (race) {
          renderDetailView(detailContainer, race, isAdmin);
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

  // --- Admin Auth Modals and Event Listeners ---
  const loginModal = document.getElementById('login-modal');
  const editModal = document.getElementById('edit-modal');

  // Open login modal
  const openLoginBtns = ['nav-admin-login', 'mobile-nav-admin-login'];
  openLoginBtns.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const errorContainer = document.getElementById('login-error-container');
        if (errorContainer) errorContainer.classList.add('hidden');
        document.getElementById('login-form')?.reset();
        if (loginModal) loginModal.classList.remove('hidden');
      });
    }
  });

  // Close login modal
  const closeLoginBtn = document.getElementById('btn-close-login');
  if (closeLoginBtn) {
    closeLoginBtn.addEventListener('click', () => {
      if (loginModal) loginModal.classList.add('hidden');
    });
  }

  // Handle Login Form Submit
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email')?.value || '';
      const password = document.getElementById('login-password')?.value || '';
      const submitBtn = document.getElementById('btn-submit-login');
      const errorContainer = document.getElementById('login-error-container');
      const errorMsgEl = document.getElementById('login-error-msg');

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-50');
      }

      const res = await loginAdmin(email, password);
      if (res.success && res.user) {
        const checkAdmin = await checkIsAdmin(res.user.id);
        if (checkAdmin) {
          isAdmin = true;
          updateAuthUI();
          if (loginModal) loginModal.classList.add('hidden');
          showNotificationToast("🔓 ¡Sesión iniciada con éxito! Has ingresado como Administrador del sistema.");
          await updateCalendar();
        } else {
          await logoutAdmin();
          isAdmin = false;
          updateAuthUI();
          if (errorContainer && errorMsgEl) {
            errorMsgEl.textContent = "Acceso denegado: El usuario no es administrador.";
            errorContainer.classList.remove('hidden');
          }
        }
      } else {
        if (errorContainer && errorMsgEl) {
          errorMsgEl.textContent = res.error || "Credenciales incorrectas o problema de conexión.";
          errorContainer.classList.remove('hidden');
        }
      }

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.remove('opacity-50');
      }
    });
  }

  // Handle Admin Logout
  const logoutBtns = ['nav-admin-logout', 'mobile-nav-admin-logout'];
  logoutBtns.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', async (e) => {
        e.preventDefault();
        const res = await logoutAdmin();
        if (res.success) {
          isAdmin = false;
          updateAuthUI();
          switchView('calendar');
          showNotificationToast("🔒 Sesión de administrador cerrada.");
          await updateCalendar();
        }
      });
    }
  });

  // Navigation: Moderation Panel
  const adminPanelBtns = ['nav-admin-panel', 'mobile-nav-admin-panel'];
  adminPanelBtns.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', async (e) => {
        e.preventDefault();
        switchView('admin-panel');
        await loadPendingRacesList();
      });
    }
  });

  // Close Edit Modal
  const closeEditBtn = document.getElementById('btn-close-edit');
  if (closeEditBtn) {
    closeEditBtn.addEventListener('click', () => {
      if (editModal) editModal.classList.add('hidden');
    });
  }

  const cancelEditBtn = document.getElementById('btn-cancel-edit');
  if (cancelEditBtn) {
    cancelEditBtn.addEventListener('click', () => {
      if (editModal) editModal.classList.add('hidden');
    });
  }

  // Handle Moderation Approvals/Rejections (click delegates inside pending list)
  const pendingRacesList = document.getElementById('pending-races-list');
  if (pendingRacesList) {
    pendingRacesList.addEventListener('click', async (e) => {
      const approveBtn = e.target.closest('[data-approve-id]');
      if (approveBtn) {
        const id = approveBtn.getAttribute('data-approve-id');
        approveBtn.disabled = true;
        const res = await updateRaceStatusSupabase(id, 'aprobada');
        if (res.success) {
          showNotificationToast("✅ Carrera aprobada con éxito. Ya es visible en el calendario.");
          await loadPendingRacesList();
          await updateCalendar();
        } else {
          showNotificationToast("⚠️ No se pudo aprobar la carrera: " + res.error);
          approveBtn.disabled = false;
        }
        return;
      }

      const rejectBtn = e.target.closest('[data-reject-id]');
      if (rejectBtn) {
        const id = rejectBtn.getAttribute('data-reject-id');
        rejectBtn.disabled = true;
        const res = await updateRaceStatusSupabase(id, 'rechazada');
        if (res.success) {
          showNotificationToast("❌ Propuesta rechazada.");
          await loadPendingRacesList();
          await updateCalendar();
        } else {
          showNotificationToast("⚠️ No se pudo rechazar la carrera: " + res.error);
          rejectBtn.disabled = false;
        }
      }
    });
  }

  // Handle Edit Form Submit
  const editForm = document.getElementById('edit-form');
  if (editForm) {
    editForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const raceId = document.getElementById('edit-race-id')?.value;
      if (!raceId) return;

      const submitBtn = document.getElementById('btn-save-edit');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-50');
      }

      const isFree = document.getElementById('edit-form-is-free')?.checked || false;
      const formData = new FormData(editForm);

      const rawFormData = {
        name: formData.get('name') || '',
        discipline: formData.get('discipline') || '',
        date: formData.get('date') || '',
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

      const validationResult = validateRaceForm(rawFormData);
      if (!validationResult.isValid) {
        renderFormErrors(editForm, validationResult.errors);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('opacity-50');
        }
        return;
      }

      clearFormErrors(editForm);
      const res = await updateRaceSupabase(raceId, validationResult.sanitizedData);
      if (res.success) {
        showNotificationToast("💾 Cambios guardados con éxito.");
        if (editModal) editModal.classList.add('hidden');
        await updateCalendar();
        
        // Si estábamos viendo el detalle, actualizar la vista
        if (document.getElementById('view-detail')?.classList.contains('hidden') === false && currentRaceId === raceId) {
          const races = await getAllRaces();
          const updatedRace = races.find(r => r.id === raceId);
          if (updatedRace) {
            renderDetailView(document.getElementById('detail-content'), updatedRace, isAdmin);
          }
        }
      } else {
        showNotificationToast("⚠️ Error al guardar los cambios: " + res.error);
      }

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.remove('opacity-50');
      }
    });
  }
}

/**
 * Sincroniza la visualización de los controles de administración en el DOM
 */
export function updateAuthUI() {
  const adminPanelBtns = [document.getElementById('nav-admin-panel'), document.getElementById('mobile-nav-admin-panel')];
  const adminLogoutBtns = [document.getElementById('nav-admin-logout'), document.getElementById('mobile-nav-admin-logout')];
  const adminLoginBtns = [document.getElementById('nav-admin-login'), document.getElementById('mobile-nav-admin-login')];

  adminPanelBtns.forEach(btn => {
    if (btn) {
      if (isAdmin) btn.classList.remove('hidden');
      else btn.classList.add('hidden');
    }
  });

  adminLogoutBtns.forEach(btn => {
    if (btn) {
      if (isAdmin) btn.classList.remove('hidden');
      else btn.classList.add('hidden');
    }
  });

  adminLoginBtns.forEach(btn => {
    if (btn) {
      if (isAdmin) btn.classList.add('hidden');
      else btn.classList.remove('hidden');
    }
  });
}

/**
 * Carga y renderiza la lista de carreras pendientes en el panel de moderación
 */
export async function loadPendingRacesList() {
  const container = document.getElementById('pending-races-list');
  const countEl = document.getElementById('pending-count');
  if (!container) return;

  const pending = await fetchPendingRacesSupabase();
  if (countEl) countEl.textContent = pending.length;
  renderPendingRaces(container, pending);
}

/**
 * Abre el modal de edición de carrera pre-rellenando los datos correspondientes.
 * @param {string} raceId 
 */
export async function openEditModal(raceId) {
  const editModal = document.getElementById('edit-modal');
  if (!editModal) return;

  const races = await getAllRaces();
  const race = races.find(r => r.id === raceId);
  if (!race) return;

  // Pre-rellenar id
  document.getElementById('edit-race-id').value = raceId;
  
  // Pre-rellenar textos
  document.getElementById('edit-form-name').value = race.name || '';
  document.getElementById('edit-form-discipline').value = race.discipline || 'Ruta';
  document.getElementById('edit-form-date').value = race.date || '';
  document.getElementById('edit-form-city').value = race.city || '';
  document.getElementById('edit-form-distance').value = race.distance || '';
  document.getElementById('edit-form-elevation').value = race.elevation || '';
  document.getElementById('edit-form-price').value = race.price || 0;
  document.getElementById('edit-form-is-free').checked = !!race.isFree || race.price === 0;
  document.getElementById('edit-form-status').value = race.status || 'Inscripciones Abiertas';
  document.getElementById('edit-form-organizer').value = race.organizer || race.organizador || '';
  document.getElementById('edit-form-url').value = race.registrationUrl || '';
  document.getElementById('edit-form-image').value = race.heroImage || '';
  document.getElementById('edit-form-categories').value = Array.isArray(race.categories) ? race.categories.join(', ') : '';
  document.getElementById('edit-form-description').value = race.description || '';

  // Poblar regiones
  const editRegionSelect = document.getElementById('edit-form-region');
  if (editRegionSelect) {
    const filterRegions = REGIONS_CHILE.filter(r => r !== 'Todas las regiones');
    renderRegionSelect(editRegionSelect, filterRegions, race.region || filterRegions[0]);
  }

  // Limpiar errores previos
  const editForm = document.getElementById('edit-form');
  if (editForm) clearFormErrors(editForm);

  // Mostrar modal
  editModal.classList.remove('hidden');
}

/**
 * Gestiona la eliminación de una carrera pidiendo confirmación al usuario.
 * @param {string} raceId 
 */
export async function handleDeleteRace(raceId) {
  const confirmed = confirm("⚠️ ¿Estás seguro de que deseas eliminar esta carrera de forma permanente? Esta acción no se puede deshacer.");
  if (!confirmed) return;

  const res = await deleteRaceSupabase(raceId);
  if (res.success) {
    showNotificationToast("🗑️ Carrera eliminada con éxito.");
    switchView('calendar');
    await updateCalendar();
  } else {
    showNotificationToast("⚠️ No se pudo eliminar la carrera: " + res.error);
  }
}

// 5. Inicialización segura (soporta scripts diferidos o al final del body)
async function initApp() {
  const regionSelectContainer = document.getElementById('region-select');
  if (regionSelectContainer) {
    renderRegionSelect(regionSelectContainer, REGIONS_CHILE, currentRegion);
  }

  const formRegionSelect = document.getElementById('edit-form-region') || document.getElementById('form-region');
  if (formRegionSelect) {
    const filterRegions = REGIONS_CHILE.filter(r => r !== 'Todas las regiones');
    renderRegionSelect(formRegionSelect, filterRegions, filterRegions[0]);
  }

  const disciplineChipsContainer = document.getElementById('discipline-chips');
  if (disciplineChipsContainer) {
    renderDisciplineChips(disciplineChipsContainer, currentDiscipline);
  }

  setupEventHandlers();

  // Auth Check Inicial
  const user = await getCurrentUser();
  if (user) {
    isAdmin = await checkIsAdmin(user.id);
  } else {
    isAdmin = false;
  }
  updateAuthUI();

  await updateCalendar();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

