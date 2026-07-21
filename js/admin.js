/**
 * Módulo de Administración y Moderación Dinámico (js/admin.js)
 * Carga de forma perezosa (lazy load) la superficie administrativa para proteger el DOM público.
 */

import { loginAdmin, logoutAdmin, checkIsAdmin, fetchPendingRacesSupabase, updateRaceStatusSupabase, uploadRaceImageSupabase } from './supabase.js';
import { REGIONS_CHILE } from './data.js';
import { updateRace } from './storage.js';
import { renderPendingRaces, switchView } from './ui.js';
import { showNotificationToast } from './app.js';
import { validateRaceForm } from './validation.js';

let isMounted = false;
let isAdminState = false;
let onAuthChangeCallback = null;

export function setAuthChangeCallback(cb) {
  onAuthChangeCallback = cb;
}

/**
 * Monta e inyecta dinámicamente los componentes administrativos en el DOM.
 */
export function ensureAdminElementsMounted() {
  if (isMounted) return;

  // 1. Inyectar vista del panel de administración
  if (!document.getElementById('view-admin-panel')) {
    const main = document.querySelector('main');
    if (main) {
      const adminSection = document.createElement('section');
      adminSection.id = 'view-admin-panel';
      adminSection.className = 'hidden space-y-8';
      adminSection.innerHTML = `
        <div class="flex items-center justify-between border-b border-outline-variant/30 pb-4">
          <div>
            <h1 class="text-2xl sm:text-3xl font-display font-black text-primary flex items-center gap-2">
              <span class="material-symbols-outlined text-3xl text-secondary">admin_panel_settings</span>
              Panel de Moderación
            </h1>
            <p class="text-outline text-sm">Gestiona y aprueba las propuestas de carreras recibidas.</p>
          </div>
          <div id="admin-session-badge" class="px-4 py-2 rounded-xl bg-surface-container border border-outline-variant/40 flex items-center gap-2 text-xs font-bold">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Sesión Activa
          </div>
        </div>

        <div class="space-y-4">
          <h3 class="font-display font-bold text-lg text-primary">Propuestas Pendientes (<span id="pending-count">0</span>)</h3>
          
          <div id="pending-races-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Pending race items populated dynamically -->
          </div>
        </div>
      `;
      main.appendChild(adminSection);
    }
  }

  // 2. Inyectar Modal de Login
  if (!document.getElementById('login-modal')) {
    const loginDiv = document.createElement('div');
    loginDiv.id = 'login-modal';
    loginDiv.className = 'hidden fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn';
    loginDiv.innerHTML = `
      <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-outline-variant/40 shadow-2xl relative space-y-6">
        <button id="btn-close-login" class="absolute top-4 right-4 text-outline hover:text-primary transition-colors p-1 rounded-lg hover:bg-surface-container">
          <span class="material-symbols-outlined text-2xl">close</span>
        </button>
        <div class="text-center space-y-2">
          <div class="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mx-auto shadow-sm">
            <span class="material-symbols-outlined text-3xl">lock_open</span>
          </div>
          <h3 class="font-display font-black text-2xl text-primary">Ingreso Admin</h3>
          <p class="text-xs text-outline leading-tight">Inicia sesión con tus credenciales de Supabase para habilitar la edición de carreras.</p>
        </div>
        <form id="login-form" class="space-y-4">
          <div id="login-error-container" class="hidden p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 text-xs font-semibold flex items-center gap-1.5">
            <span class="material-symbols-outlined text-base">error</span>
            <span id="login-error-msg">Credenciales incorrectas</span>
          </div>
          <div class="space-y-1">
            <label for="login-email" class="block font-display font-bold text-xs text-primary">Correo Electrónico</label>
            <input type="email" id="login-email" required placeholder="admin@calendariociclista.cl"
              class="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all">
          </div>
          <div class="space-y-1">
            <label for="login-password" class="block font-display font-bold text-xs text-primary">Contraseña</label>
            <input type="password" id="login-password" required placeholder="••••••••"
              class="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all">
          </div>
          <button type="submit" id="btn-submit-login" class="w-full py-3.5 rounded-xl bg-primary text-white font-display font-bold text-sm hover:bg-black transition-all active:scale-[0.98] shadow-md flex items-center justify-center gap-2">
            <span class="material-symbols-outlined text-base">login</span>
            Iniciar Sesión
          </button>
        </form>
      </div>
    `;
    document.body.appendChild(loginDiv);
  }

  // 3. Inyectar Modal de Edición de Carrera
  if (!document.getElementById('edit-modal')) {
    const editDiv = document.createElement('div');
    editDiv.id = 'edit-modal';
    editDiv.className = 'hidden fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto';
    editDiv.innerHTML = `
      <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full border border-outline-variant/40 shadow-2xl my-8 relative space-y-6 max-h-[90vh] overflow-y-auto">
        <button id="btn-close-edit" class="absolute top-4 right-4 text-outline hover:text-primary transition-colors p-1 rounded-lg hover:bg-surface-container">
          <span class="material-symbols-outlined text-2xl">close</span>
        </button>
        <div class="flex items-center gap-3 border-b border-outline-variant/30 pb-4">
          <div class="w-10 h-10 rounded-xl bg-[#d8ef00] text-primary flex items-center justify-center font-bold">
            <span class="material-symbols-outlined text-xl">edit</span>
          </div>
          <div>
            <h3 class="font-display font-black text-2xl text-primary">Editar Carrera</h3>
            <p class="text-xs text-outline">Modifica los detalles del evento seleccionado.</p>
          </div>
        </div>
        <form id="edit-form" class="space-y-6">
          <input type="hidden" id="edit-race-id">
          <div>
            <label for="edit-form-name" class="block font-display font-bold text-sm text-primary mb-2">
              Nombre de la Carrera <span class="text-secondary">*</span>
            </label>
            <input type="text" id="edit-form-name" name="name" required placeholder="Ej: Gran Fondo Andes Challenge 2026"
              class="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all">
          </div>
          <div class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label for="edit-form-discipline" class="block font-display font-bold text-sm text-primary mb-2">
                  Disciplina <span class="text-secondary">*</span>
                </label>
                <select id="edit-form-discipline" name="discipline" required
                  class="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all cursor-pointer">
                  <option value="Ruta">Ruta</option>
                  <option value="MTB">MTB</option>
                  <option value="Gravel">Gravel</option>
                  <option value="Pista">Pista</option>
                  <option value="BMX">BMX</option>
                  <option value="Virtual">Virtual</option>
                </select>
              </div>

              <div>
                <div class="flex items-center justify-between mb-2">
                  <label for="edit-form-date" class="block font-display font-bold text-sm text-primary">
                    Fecha de Inicio <span class="text-secondary">*</span>
                  </label>
                  <label class="inline-flex items-center gap-1.5 cursor-pointer text-xs font-bold text-primary select-none">
                    <input type="checkbox" id="edit-form-is-multiday" name="isMultiDay" class="w-4 h-4 text-primary rounded border-outline-variant focus:ring-primary">
                    <span>¿Más de 1 día?</span>
                  </label>
                </div>

                <div id="edit-form-single-date-container">
                  <input type="date" id="edit-form-date" name="date"
                    class="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all cursor-pointer">
                </div>

                <div id="edit-form-start-date-container" class="hidden">
                  <input type="date" id="edit-form-start-date" name="startDate"
                    class="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all cursor-pointer">
                </div>
              </div>
            </div>

            <div id="edit-form-end-date-container" class="hidden bg-purple-50/70 p-4 rounded-2xl border border-purple-200 space-y-2">
              <div class="flex items-center justify-between">
                <label for="edit-form-end-date" class="block font-display font-bold text-xs text-purple-950 uppercase tracking-wider">
                  Fecha de Término de la Vuelta / Etapas <span class="text-secondary">*</span>
                </label>
                <span id="edit-form-duration-badge" class="text-xs font-black text-purple-900 bg-purple-200/80 px-2.5 py-0.5 rounded-full">
                  Multi-Día
                </span>
              </div>
              <input type="date" id="edit-form-end-date" name="endDate"
                class="w-full px-4 py-2.5 rounded-xl bg-white border border-purple-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all cursor-pointer">
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="edit-form-region" class="block font-display font-bold text-sm text-primary mb-2">
                Región <span class="text-secondary">*</span>
              </label>
              <select id="edit-form-region" name="region" required
                class="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all cursor-pointer">
              </select>
            </div>
            <div>
              <label for="edit-form-city" class="block font-display font-bold text-sm text-primary mb-2">
                Ciudad / Comuna <span class="text-secondary">*</span>
              </label>
              <input type="text" id="edit-form-city" name="city" required placeholder="Ej: Pucón"
                class="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all">
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="edit-form-distance" class="block font-display font-bold text-sm text-primary mb-2">
                Distancia (km) <span class="text-secondary">*</span>
              </label>
              <input type="text" id="edit-form-distance" name="distance" required placeholder="Ej: 120 km"
                class="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all">
            </div>
            <div>
              <label for="edit-form-elevation" class="block font-display font-bold text-sm text-primary mb-2">
                Desnivel Acumulado (m)
              </label>
              <input type="text" id="edit-form-elevation" name="elevation" placeholder="Ej: 1850 m"
                class="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all">
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div>
              <label for="edit-form-price" class="block font-display font-bold text-sm text-primary mb-2">
                Precio Inscripción ($ CLP)
              </label>
              <input type="number" id="edit-form-price" name="price" min="0" step="1000" placeholder="Ej: 35000"
                class="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all">
            </div>
            <div class="flex items-center h-12">
              <label class="inline-flex items-center gap-2 cursor-pointer">
                <input type="checkbox" id="edit-form-is-free" name="isFree"
                  class="w-5 h-5 rounded text-primary focus:ring-primary border-outline-variant">
                <span class="font-display font-bold text-sm text-primary">¿Evento Gratuito?</span>
              </label>
            </div>
            <div>
              <label for="edit-form-status" class="block font-display font-bold text-sm text-primary mb-2">
                Estado de Inscripción
              </label>
              <select id="edit-form-status" name="status"
                class="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all cursor-pointer">
                <option value="Inscripciones Abiertas">Inscripciones Abiertas</option>
                <option value="Últimos Cupos">Últimos Cupos</option>
                <option value="Próximamente">Próximamente</option>
                <option value="Cupos Agotados">Cupos Agotados</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="edit-form-organizer" class="block font-display font-bold text-sm text-primary mb-2">
                Organizador <span class="text-secondary">*</span>
              </label>
              <input type="text" id="edit-form-organizer" name="organizer" required placeholder="Ej: Club Ciclismo Chile"
                class="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all">
            </div>
            <div>
              <label for="edit-form-url" class="block font-display font-bold text-sm text-primary mb-2">
                Link de Inscripción / Sitio Web <span class="text-secondary">*</span>
              </label>
              <input type="text" id="edit-form-url" name="registrationUrl" required placeholder="https://ejemplo.cl/registro"
                class="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all">
            </div>
          </div>
          <div class="space-y-2">
            <label class="block font-display font-bold text-sm text-primary">
              Imagen de Portada <span class="text-xs text-outline/80 font-normal">(Opcional)</span>
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div id="edit-form-upload-zone" class="border-2 border-dashed border-outline-variant/60 hover:border-primary/50 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer bg-surface-container-low/20 min-h-[120px] select-none text-center">
                <span class="material-symbols-outlined text-outline text-3xl">add_a_photo</span>
                <span class="text-xs font-bold text-outline">Arrastra una imagen o haz clic aquí</span>
                <span class="text-[10px] text-outline/60">JPG, PNG (Max 5MB)</span>
                <input type="file" id="edit-form-image-file" accept="image/*" class="hidden">
              </div>

              <div class="flex flex-col justify-between gap-3">
                <div>
                  <span class="text-xs font-bold text-outline block mb-1">O ingresa un enlace web:</span>
                  <input type="text" id="edit-form-image" name="heroImage" placeholder="https://images.unsplash.com/..."
                    class="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all">
                </div>
                <div id="edit-form-image-preview-container" class="hidden h-[70px] rounded-xl overflow-hidden border border-outline-variant/40 relative bg-surface-container-low">
                  <img id="edit-form-image-preview" src="" class="w-full h-full object-cover">
                  <button type="button" id="btn-remove-edit-image" class="absolute top-1 right-1 w-6 h-6 rounded-full bg-primary/80 text-white flex items-center justify-center font-bold text-[10px] hover:bg-primary transition-all active:scale-90">✕</button>
                </div>
              </div>
            </div>
          </div>
          <div>
            <label for="edit-form-categories" class="block font-display font-bold text-sm text-primary mb-2">
              Categorías (separadas por comas)
            </label>
            <input type="text" id="edit-form-categories" name="categories" placeholder="Ej: Elite, Master A, Master B, Damas"
              class="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all">
          </div>
          <div>
            <label for="edit-form-description" class="block font-display font-bold text-sm text-primary mb-2">
              Descripción del Evento <span class="text-secondary">*</span>
            </label>
            <textarea id="edit-form-description" name="description" rows="4" required
              placeholder="Describe la ruta, puntos de hidratación, premios, etc..."
              class="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all"></textarea>
          </div>
          <div class="pt-4 flex justify-end gap-4 border-t border-outline-variant/30">
            <button type="button" id="btn-cancel-edit"
              class="px-6 py-3 rounded-xl bg-surface-container text-primary font-display font-bold text-sm hover:bg-surface-container-high transition-colors">
              Cancelar
            </button>
            <button type="submit" id="btn-save-edit"
              class="px-8 py-3 rounded-xl bg-secondary text-white font-display font-bold text-sm hover:brightness-105 active:scale-95 transition-all shadow-md flex items-center gap-2">
              <span class="material-symbols-outlined text-lg">save</span>
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(editDiv);

    // Poblar selector de regiones de edición
    const editRegionSelect = document.getElementById('edit-form-region');
    if (editRegionSelect && REGIONS_CHILE) {
      editRegionSelect.innerHTML = REGIONS_CHILE.filter(r => r !== 'Todas las regiones').map(r => `<option value="${r}">${r}</option>`).join('');
    }
  }

  isMounted = true;
  bindAdminEvents();
}

/**
 * Muestra el modal de inicio de sesión de administrador.
 */
export function openLoginModal() {
  ensureAdminElementsMounted();
  const loginModal = document.getElementById('login-modal');
  const errorContainer = document.getElementById('login-error-container');
  if (errorContainer) errorContainer.classList.add('hidden');
  document.getElementById('login-form')?.reset();
  if (loginModal) loginModal.classList.remove('hidden');
}

/**
 * Muestra el modal de edición para una carrera dada.
 * @param {Object} race 
 */
export function openEditModal(race) {
  if (!race) return;
  ensureAdminElementsMounted();
  const editModal = document.getElementById('edit-modal');
  
  document.getElementById('edit-race-id').value = race.id || '';
  document.getElementById('edit-form-name').value = race.name || '';
  document.getElementById('edit-form-discipline').value = race.discipline || 'Ruta';
  
  const isMultiDay = !!race.endDate && race.endDate !== race.date;
  const isMultiCheckbox = document.getElementById('edit-form-is-multiday');
  if (isMultiCheckbox) {
    isMultiCheckbox.checked = isMultiDay;
    toggleEditMultiDay(isMultiDay);
  }
  
  if (isMultiDay) {
    document.getElementById('edit-form-start-date').value = race.date || race.startDate || '';
    document.getElementById('edit-form-end-date').value = race.endDate || '';
  } else {
    document.getElementById('edit-form-date').value = race.date || '';
  }
  
  document.getElementById('edit-form-region').value = race.region || REGIONS_CHILE[0];
  document.getElementById('edit-form-city').value = race.city || '';
  document.getElementById('edit-form-distance').value = race.distance || '';
  document.getElementById('edit-form-elevation').value = race.elevation || '';
  document.getElementById('edit-form-price').value = race.price || 0;
  document.getElementById('edit-form-is-free').checked = !!race.isFree;
  document.getElementById('edit-form-status').value = race.status || 'Inscripciones Abiertas';
  document.getElementById('edit-form-organizer').value = race.organizer || race.organizador || '';
  document.getElementById('edit-form-url').value = race.registrationUrl || '';
  document.getElementById('edit-form-image').value = race.heroImage || '';
  document.getElementById('edit-form-categories').value = Array.isArray(race.categories) ? race.categories.join(', ') : (race.categories || '');
  document.getElementById('edit-form-description').value = race.description || '';

  if (editModal) editModal.classList.remove('hidden');
}

function toggleEditMultiDay(show) {
  const singleContainer = document.getElementById('edit-form-single-date-container');
  const startContainer = document.getElementById('edit-form-start-date-container');
  const endContainer = document.getElementById('edit-form-end-date-container');
  if (show) {
    if (singleContainer) singleContainer.classList.add('hidden');
    if (startContainer) startContainer.classList.remove('hidden');
    if (endContainer) endContainer.classList.remove('hidden');
  } else {
    if (singleContainer) singleContainer.classList.remove('hidden');
    if (startContainer) startContainer.classList.add('hidden');
    if (endContainer) endContainer.classList.add('hidden');
  }
}

/**
 * Carga y renderiza la lista de propuestas pendientes en la vista de administración.
 */
export async function loadPendingRacesList() {
  ensureAdminElementsMounted();
  const container = document.getElementById('pending-races-list');
  const countEl = document.getElementById('pending-count');
  if (!container) return;

  const res = await fetchPendingRacesSupabase();
  if (res && res.success) {
    const pendingList = Array.isArray(res.data) ? res.data : [];
    if (countEl) countEl.textContent = pendingList.length;
    renderPendingRaces(container, pendingList);
    bindPendingRaceActionEvents();
  } else {
    if (countEl) countEl.textContent = '0';
    const errorMsg = (res && res.error) ? (res.error.message || String(res.error)) : 'Error al conectar con la base de datos.';
    container.innerHTML = `<p class="col-span-full text-center text-red-500 font-bold">Error al cargar propuestas: ${errorMsg}</p>`;
  }
}

function bindPendingRaceActionEvents() {
  const container = document.getElementById('pending-races-list');
  if (!container) return;

  container.querySelectorAll('.btn-approve-race').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const raceId = e.currentTarget.dataset.id;
      if (!raceId) return;
      btn.disabled = true;
      btn.textContent = 'Aprobando...';
      const res = await updateRaceStatusSupabase(raceId, 'aprobada');
      if (res.success) {
        showNotificationToast('✅ Carrera aprobada con éxito. Ahora es visible en el calendario público.');
        await loadPendingRacesList();
      } else {
        alert('Error al aprobar la carrera: ' + res.error);
        btn.disabled = false;
        btn.textContent = 'Aprobar';
      }
    });
  });

  container.querySelectorAll('.btn-reject-race').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const raceId = e.currentTarget.dataset.id;
      if (!raceId) return;
      if (!confirm('¿Estás seguro de que deseas rechazar esta propuesta?')) return;
      btn.disabled = true;
      btn.textContent = 'Rechazando...';
      const res = await updateRaceStatusSupabase(raceId, 'rechazada');
      if (res.success) {
        showNotificationToast('🚫 Carrera rechazada.');
        await loadPendingRacesList();
      } else {
        alert('Error al rechazar la carrera: ' + res.error);
        btn.disabled = false;
        btn.textContent = 'Rechazar';
      }
    });
  });
}

function bindAdminEvents() {
  // Cierre de Login
  const closeLoginBtn = document.getElementById('btn-close-login');
  if (closeLoginBtn) {
    closeLoginBtn.addEventListener('click', () => {
      document.getElementById('login-modal')?.classList.add('hidden');
    });
  }

  // Form Submit Login
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
          isAdminState = true;
          if (typeof onAuthChangeCallback === 'function') onAuthChangeCallback(true);
          document.getElementById('login-modal')?.classList.add('hidden');
          showNotificationToast("🔓 ¡Sesión iniciada con éxito! Has ingresado como Administrador del sistema.");
        } else {
          await logoutAdmin();
          isAdminState = false;
          if (typeof onAuthChangeCallback === 'function') onAuthChangeCallback(false);
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

  // Cierre de Editar
  const closeEditBtn = document.getElementById('btn-close-edit');
  if (closeEditBtn) {
    closeEditBtn.addEventListener('click', () => {
      document.getElementById('edit-modal')?.classList.add('hidden');
    });
  }
}
