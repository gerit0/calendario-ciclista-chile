import { test, expect } from '@playwright/test';

const SAMPLE_RACE_ID = 'fe28c1f8-56dc-485b-a406-46d7132e89b7';

const mockRace = {
  id: SAMPLE_RACE_ID,
  nombre: 'Curico Tour 2026',
  disciplina: 'Ruta',
  fecha: '2026-11-13',
  fecha_inicio: '2026-11-13',
  fecha_fin: '2026-11-15',
  region: 'Región del Maule',
  ubicacion: 'Curicó',
  distancia: '364 km',
  desnivel: '3000 m',
  precio: 55000,
  status: 'Inscripciones Abiertas',
  organizador: 'Club Deportivo Peteroa',
  link_inscripcion: 'https://curicotour.cl',
  hero_image: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182',
  categoria: ['Todo Competidor', 'Master A'],
  descripcion: '3 etapas, 364 kilómetros en el corazón del Maule.',
  estado: 'aprobada',
  creado_por: 'test-admin-uuid'
};

test.describe('Flujo E2E: Edición de Carrera y Prevención de Bug 414 URI_TOO_LONG', () => {

  test.beforeEach(async ({ page }) => {
    page.on('console', msg => {
      if (msg.type() === 'error' || msg.text().includes('Supabase') || msg.text().includes('Admin')) {
        console.log(`[Browser ${msg.type()}]:`, msg.text());
      }
    });

    // Inyectar sesión de administrador en localStorage para autenticar inmediatamente
    await page.addInitScript(() => {
      const now = Math.floor(Date.now() / 1000);
      const session = {
        access_token: 'fake-jwt-token-for-e2e',
        token_type: 'bearer',
        expires_in: 86400,
        expires_at: now + 86400,
        refresh_token: 'fake-refresh-token',
        user: {
          id: 'test-admin-uuid',
          aud: 'authenticated',
          role: 'authenticated',
          email: 'admin@boceto.cl'
        }
      };
      localStorage.setItem('sb-mhzktzvxdmhanqkhhaqm-auth-token', JSON.stringify(session));
    });

    // Interceptar todas las llamadas a Supabase para no tocar la base de datos real
    await page.route('**/rest/v1/**', async (route) => {
      const url = route.request().url();
      const acceptHeader = route.request().headers()['accept'] || '';
      const isSingle = acceptHeader.includes('application/vnd.pgrst.object+json');

      if (url.includes('usuarios_admin')) {
        return route.fulfill({
          status: 200,
          contentType: isSingle ? 'application/vnd.pgrst.object+json' : 'application/json',
          body: JSON.stringify(isSingle ? { user_id: 'test-admin-uuid' } : [{ user_id: 'test-admin-uuid' }])
        });
      }
      if (url.includes('carreras')) {
        return route.fulfill({
          status: 200,
          contentType: isSingle ? 'application/vnd.pgrst.object+json' : 'application/json',
          body: JSON.stringify(isSingle ? mockRace : [mockRace])
        });
      }
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    });

    await page.route('**/auth/v1/**', async (route) => {
      const url = route.request().url();
      const user = {
        id: 'test-admin-uuid',
        aud: 'authenticated',
        role: 'authenticated',
        email: 'admin@boceto.cl'
      };
      if (url.includes('/token')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            access_token: 'fake-jwt-token-for-e2e',
            token_type: 'bearer',
            expires_in: 86400,
            expires_at: Math.floor(Date.now() / 1000) + 86400,
            refresh_token: 'fake-refresh-token',
            user: user
          })
        });
      }
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(user)
      });
    });
  });

  test('1. Al pulsar "Editar", la URL contiene únicamente el ID y jamás supera 2.000 caracteres', async ({ page }) => {
    // Escuchar todas las peticiones de red
    const requests = [];
    page.on('request', req => requests.push(req));

    await page.goto('/');

    // Esperar a que la carrera se renderice en pantalla
    await expect(page.locator('text=Curico Tour 2026').first()).toBeVisible({ timeout: 10000 });

    // Encontrar el botón de editar en la tarjeta
    const editBtn = page.locator(`[data-edit-id="${SAMPLE_RACE_ID}"]`).first();
    await expect(editBtn).toBeVisible({ timeout: 5000 });
    await editBtn.click();

    // Verificar que la URL actual en el navegador es corta y limpia (/editar/<id>)
    await page.waitForURL(`**/editar/${SAMPLE_RACE_ID}`);
    const currentUrl = page.url();
    expect(currentUrl.length).toBeLessThan(120);
    expect(currentUrl).toContain(`/editar/${SAMPLE_RACE_ID}`);
    expect(currentUrl).not.toContain('heroImage');
    expect(currentUrl).not.toContain('description');

    // Verificar que el modal de edición se abrió y precargó los datos
    const editModal = page.locator('#edit-modal');
    await expect(editModal).toBeVisible();

    const nameInput = page.locator('#edit-form-name');
    await expect(nameInput).toHaveValue('Curico Tour 2026');

    // Comprobar que NINGUNA petición realizada superó los 2.000 caracteres
    for (const req of requests) {
      expect(req.url().length).toBeLessThan(2000);
    }
  });

  test('2. Edición con descripción extensa (4.000+ chars) guarda vía PATCH/JSON sin GET ni URL inflada', async ({ page }) => {
    let patchReceived = null;

    // Interceptar la llamada a la API de guardado
    await page.route(`**/api/races/${SAMPLE_RACE_ID}`, async (route) => {
      if (route.request().method() === 'PATCH') {
        patchReceived = {
          url: route.request().url(),
          method: route.request().method(),
          postData: route.request().postDataJSON()
        };
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, data: { id: SAMPLE_RACE_ID } })
        });
      }
      return route.continue();
    });

    const recordedRequests = [];
    page.on('request', req => recordedRequests.push({ url: req.url(), method: req.method() }));

    // Cargar directamente la ruta de edición
    await page.goto(`/editar/${SAMPLE_RACE_ID}`);

    const editModal = page.locator('#edit-modal');
    await expect(editModal).toBeVisible({ timeout: 10000 });

    // Escribir una descripción extensa
    const longDescription = 'Etapa 1: Contrarreloj 30km. '.repeat(150);
    expect(longDescription.length).toBeGreaterThan(4000);

    await page.fill('#edit-form-description', longDescription);
    await page.fill('#edit-form-name', 'Curico Tour 2026 - Edición Élite');

    // Guardar los cambios
    const saveButton = page.locator('#btn-save-edit');
    await saveButton.click();

    // Esperar a que el toast de éxito aparezca
    await expect(page.locator('#toast-notification')).toContainText('Cambios guardados con éxito', { timeout: 10000 });

    // Verificar que se envió un PATCH con el JSON en el body
    expect(patchReceived).not.toBeNull();
    expect(patchReceived.method).toBe('PATCH');
    expect(patchReceived.url).not.toContain('?');
    expect(patchReceived.postData.name).toBe('Curico Tour 2026 - Edición Élite');
    expect(patchReceived.postData.description.length).toBeGreaterThan(4000);

    // Regla de Oro: Ninguna petición fue un GET con datos de carrera
    const invalidGetRequests = recordedRequests.filter(
      r => r.method === 'GET' && (r.url.includes('name=') || r.url.includes('description='))
    );
    expect(invalidGetRequests.length).toBe(0);

    // Ninguna petición superó 2.000 caracteres
    for (const r of recordedRequests) {
      expect(r.url.length).toBeLessThan(2000);
    }
  });

  test('3. Enlace heredado con query string enorme (/?name=...&heroImage=...) se desinfecta y no rompe', async ({ page }) => {
    const hugeLegacyQuery = '?name=Curico+Tour+2026&discipline=Ruta&heroImage=data:image/png;base64,' + 'A'.repeat(5000);

    await page.goto('/' + hugeLegacyQuery);

    // Esperar a que la app cargue
    await page.waitForLoadState('domcontentloaded');

    // La URL debe haberse limpiado sin los query params gigantes
    await page.waitForFunction(() => !window.location.search.includes('heroImage'));
    expect(page.url()).not.toContain('heroImage');

    // Debe mostrar la notificación de enlace antiguo
    const toast = page.locator('#toast-notification');
    await expect(toast).toBeVisible();
    await expect(toast).toContainText('Enlace antiguo normalizado');
  });

  test('4. Flujo de moderación: Aprobar carrera pendiente con base64 procesa vía API, muestra toast y jamás dispara alert()', async ({ page }) => {
    let alertCalled = false;
    page.on('dialog', async dialog => {
      alertCalled = true;
      await dialog.dismiss();
    });

    const pendingRaceId = 'ffb56586-e413-41ed-a097-5e075bfd5d7e';
    const pendingRace = {
      ...mockRace,
      id: pendingRaceId,
      nombre: 'Vuelta Union Ciclista Curico',
      estado: 'pendiente',
      hero_image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
    };

    // Mock API de aprobación
    let approveApiCalled = false;
    await page.route(`**/api/races/${pendingRaceId}/approve`, async (route) => {
      approveApiCalled = true;
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Carrera aprobada con éxito.',
          data: {
            ...pendingRace,
            estado: 'aprobada',
            hero_image: 'https://storage.supabase.co/race-images/races/migrated.png'
          }
        })
      });
    });

    // Interceptar llamadas de carreras para que retorne la pendiente cuando se pida estado=pendiente
    await page.route('**/rest/v1/carreras*', async (route) => {
      const url = route.request().url();
      if (url.includes('estado=eq.pendiente')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([pendingRace])
        });
      }
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([mockRace])
      });
    });

    // Cargar panel de administración
    await page.goto('/admin');

    // Esperar a que aparezca la propuesta pendiente
    const approveBtn = page.locator(`[data-approve-id="${pendingRaceId}"]`).first();
    await expect(approveBtn).toBeVisible({ timeout: 10000 });

    // Pulsar Aprobar
    await approveBtn.click();

    // Verificar notificación amigable en UI
    const toast = page.locator('#toast-notification');
    await expect(toast).toBeVisible({ timeout: 10000 });
    await expect(toast).toContainText('Carrera aprobada');

    // Verificar que se llamó a la API serverless
    expect(approveApiCalled).toBe(true);

    // Regla de Oro: NUNCA se disparó alert() crudo
    expect(alertCalled).toBe(false);
  });

  test('5. Admin edita carrera publicada, guarda y al recargar (/evento/:id) los cambios persisten y se visualizan actualizados', async ({ page }) => {
    let currentServerRace = { ...mockRace };

    // Interceptar llamadas a Supabase carreras para reflejar el estado mutado
    await page.route('**/rest/v1/carreras*', async (route) => {
      const acceptHeader = route.request().headers()['accept'] || '';
      const isSingle = acceptHeader.includes('application/vnd.pgrst.object+json');
      return route.fulfill({
        status: 200,
        contentType: isSingle ? 'application/vnd.pgrst.object+json' : 'application/json',
        body: JSON.stringify(isSingle ? currentServerRace : [currentServerRace])
      });
    });

    // Interceptar la API de guardado PATCH
    await page.route(`**/api/races/${SAMPLE_RACE_ID}`, async (route) => {
      if (route.request().method() === 'PATCH') {
        const payload = route.request().postDataJSON();
        currentServerRace = {
          ...currentServerRace,
          nombre: payload.name,
          precio: payload.price,
          ubicacion: payload.city
        };
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              ...currentServerRace,
              id: SAMPLE_RACE_ID,
              name: currentServerRace.nombre,
              price: currentServerRace.precio,
              city: currentServerRace.ubicacion
            }
          })
        });
      }
      return route.continue();
    });

    // 1. Navegar al modal de edición
    await page.goto(`/editar/${SAMPLE_RACE_ID}`);
    const editModal = page.locator('#edit-modal');
    await expect(editModal).toBeVisible({ timeout: 10000 });

    // 2. Modificar nombre y ciudad
    await page.fill('#edit-form-name', 'Curico Tour 2026 - Edición Bicentenario');
    await page.fill('#edit-form-city', 'Molina');

    // 3. Guardar cambios
    const saveButton = page.locator('#btn-save-edit');
    await saveButton.click();

    // 4. Verificar toast de éxito
    const toast = page.locator('#toast-notification');
    await expect(toast).toContainText('Cambios guardados con éxito', { timeout: 10000 });

    // 5. Recargar la página en la vista de detalle del evento para verificar persistencia real
    await page.goto(`/evento/${SAMPLE_RACE_ID}`);
    await page.waitForLoadState('domcontentloaded');

    // 6. Verificar que la vista detalle muestra los nuevos datos actualizados
    await expect(page.locator('text=Curico Tour 2026 - Edición Bicentenario').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Molina').first()).toBeVisible();
  });

  test('6. Simulación de fallo silencioso (0 filas afectadas / 403): La UI muestra toast de error y jamás dice "guardado con éxito", preservando los inputs', async ({ page }) => {
    // Interceptar PATCH simulando rechazo por 0 filas / RLS (HTTP 403)
    await page.route(`**/api/races/${SAMPLE_RACE_ID}`, async (route) => {
      if (route.request().method() === 'PATCH') {
        return route.fulfill({
          status: 403,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'No se pudo actualizar la carrera: no tienes permisos o la carrera no existe.'
          })
        });
      }
      return route.continue();
    });

    // 1. Abrir modal de edición
    await page.goto(`/editar/${SAMPLE_RACE_ID}`);
    const editModal = page.locator('#edit-modal');
    await expect(editModal).toBeVisible({ timeout: 10000 });

    // 2. Modificar un campo
    await page.fill('#edit-form-name', 'Intento No Autorizado de Modificación');

    // 3. Guardar cambios
    const saveButton = page.locator('#btn-save-edit');
    await saveButton.click();

    // 4. Verificar que se muestra toast de advertencia/error
    const toast = page.locator('#toast-notification');
    await expect(toast).toBeVisible({ timeout: 10000 });
    await expect(toast).toContainText('No tienes permiso para editar esta carrera');
    await expect(toast).not.toContainText('Cambios guardados con éxito');

    // 5. El modal debe seguir visible (no se cierra perdiendo el trabajo)
    await expect(editModal).toBeVisible();

    // 6. El formulario mantiene lo que el usuario escribió (no se resetea)
    const nameInput = page.locator('#edit-form-name');
    await expect(nameInput).toHaveValue('Intento No Autorizado de Modificación');

    // 7. El botón vuelve a estar habilitado
    await expect(saveButton).toBeEnabled();
  });

});

