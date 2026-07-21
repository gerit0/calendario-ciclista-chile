/**
 * Enrutador Frontend Basado en History API (js/router.js)
 * Sincroniza la navegación de la SPA con la barra de direcciones del navegador.
 */

let routeChangeCallback = null;

/**
 * Parsea la ruta actual del navegador y retorna el nombre de la vista y sus parámetros.
 * @returns {{ viewName: string, params: Object, path: string }}
 */
export function parseCurrentRoute() {
  const path = window.location.pathname || '/';
  
  if (path === '/' || path === '' || path === '/index.html') {
    return { viewName: 'calendar', params: {}, path: '/' };
  }
  
  if (path === '/agenda' || path === '/agenda/') {
    return { viewName: 'agenda', params: {}, path: '/agenda' };
  }
  
  if (path === '/publicar' || path === '/publicar/') {
    return { viewName: 'register', params: {}, path: '/publicar' };
  }
  
  if (path === '/admin' || path === '/admin/') {
    return { viewName: 'admin-panel', params: {}, path: '/admin' };
  }
  
  const eventMatch = path.match(/^\/evento\/([^/]+)/);
  if (eventMatch) {
    return { viewName: 'detail', params: { id: eventMatch[1] }, path };
  }
  
  return { viewName: 'calendar', params: {}, path: '/' };
}

/**
 * Navega a una nueva ruta actualizando el historial del navegador.
 * @param {string} path 
 * @param {Object} [state={}] 
 */
export function navigateTo(path, state = {}) {
  if (window.location.pathname !== path) {
    window.history.pushState(state, '', path);
  }
  if (typeof routeChangeCallback === 'function') {
    routeChangeCallback(parseCurrentRoute());
  }
}

/**
 * Inicializa los escuchadores de navegación (popstate e intersección de enlaces)
 * @param {Function} onRouteChanged 
 */
export function initRouter(onRouteChanged) {
  routeChangeCallback = onRouteChanged;

  // Escuchar navegación del historial (Botones Atrás / Adelante del navegador)
  window.addEventListener('popstate', () => {
    if (typeof routeChangeCallback === 'function') {
      routeChangeCallback(parseCurrentRoute());
    }
  });

  // Interceptación de clics delegados en enlaces locales <a href="/...">
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (!href) return;

    // Solo interceptar URLs relativas o locales que inicien con '/' (evitando esquemas http, mailto, etc.)
    if (href.startsWith('/') && !href.startsWith('//') && !anchor.hasAttribute('target') && !anchor.hasAttribute('download')) {
      e.preventDefault();
      navigateTo(href);
    }
  });

  // Notificar estado inicial
  if (typeof routeChangeCallback === 'function') {
    routeChangeCallback(parseCurrentRoute());
  }
}
