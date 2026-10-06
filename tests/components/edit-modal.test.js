import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { openEditModal } from '../../js/admin.js';
import { renderDetailView } from '../../js/ui.js';

describe('3. Pruebas de Componentes DOM: Formulario y Modal de Edición', () => {
  beforeEach(() => {
    // Cargar markup real de index.html
    const html = fs.readFileSync(path.resolve('index.html'), 'utf8');
    document.body.innerHTML = html;
  });

  it('el formulario #edit-form tiene method="POST", action="javascript:void(0);" y onsubmit con preventDefault', () => {
    const editForm = document.getElementById('edit-form');
    expect(editForm).not.toBeNull();
    expect(editForm.getAttribute('method')).toBe('POST');
    expect(editForm.getAttribute('action')).toBe('javascript:void(0);');
    expect(editForm.getAttribute('onsubmit')).toContain('preventDefault');
  });

  it('el formulario #race-form tiene method="POST", action="javascript:void(0);" y onsubmit con preventDefault', () => {
    const raceForm = document.getElementById('race-form');
    expect(raceForm).not.toBeNull();
    expect(raceForm.getAttribute('method')).toBe('POST');
    expect(raceForm.getAttribute('action')).toBe('javascript:void(0);');
    expect(raceForm.getAttribute('onsubmit')).toContain('preventDefault');
  });

  it('un evento submit nativo sin JS es interceptado por preventDefault y no navega con GET', () => {
    const editForm = document.getElementById('edit-form');

    // Simular envío nativo
    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
    
    // Evaluar el onsubmit inline
    const onsubmitHandler = editForm.getAttribute('onsubmit');
    const fn = new Function('event', onsubmitHandler);
    fn(submitEvent);

    expect(submitEvent.defaultPrevented).toBe(true);
  });

  it('el campo heroImage del formulario de edición tiene tipo text/url y no admite archivos base64 directo', () => {
    const editImgInput = document.getElementById('edit-form-image');
    expect(editImgInput).not.toBeNull();
    expect(editImgInput.getAttribute('type')).toBe('text');
  });

  it('el formulario #race-form incluye el campo #form-rules-url con name="rulesUrl"', () => {
    const raceForm = document.getElementById('race-form');
    const rulesInput = raceForm.querySelector('#form-rules-url');
    expect(rulesInput).not.toBeNull();
    expect(rulesInput.getAttribute('name')).toBe('rulesUrl');
    expect(rulesInput.getAttribute('type')).toBe('url');
  });

  it('el formulario #edit-form incluye el campo #edit-form-rules-url con name="rulesUrl"', () => {
    const editForm = document.getElementById('edit-form');
    const rulesInput = editForm.querySelector('#edit-form-rules-url');
    expect(rulesInput).not.toBeNull();
    expect(rulesInput.getAttribute('name')).toBe('rulesUrl');
    expect(rulesInput.getAttribute('type')).toBe('url');
  });

  it('openEditModal populates edit-form-rules-url when rulesUrl is present in race object', () => {
    const mockRace = {
      id: 'race-1',
      name: 'Vuelta Ciclista',
      rulesUrl: 'https://ejemplo.cl/bases.pdf'
    };
    openEditModal(mockRace);
    const rulesInput = document.getElementById('edit-form-rules-url');
    expect(rulesInput).not.toBeNull();
    expect(rulesInput.value).toBe('https://ejemplo.cl/bases.pdf');
  });

  it('openEditModal sets edit-form-rules-url to empty string when rulesUrl is absent', () => {
    const mockRace = {
      id: 'race-2',
      name: 'Vuelta Ciclista Sin Bases'
    };
    openEditModal(mockRace);
    const rulesInput = document.getElementById('edit-form-rules-url');
    expect(rulesInput).not.toBeNull();
    expect(rulesInput.value).toBe('');
  });

  it('renderDetailView renderiza el botón "Ver Bases de la Competencia" cuando rulesUrl está presente', () => {
    const container = document.createElement('div');
    const mockRace = {
      id: 'race-3',
      name: 'Clásica Ciclista',
      discipline: 'Ruta',
      date: '2026-11-20',
      rulesUrl: 'https://drive.google.com/file/d/xyz/view'
    };
    renderDetailView(container, mockRace);
    const rulesLink = container.querySelector('a[href="https://drive.google.com/file/d/xyz/view"]');
    expect(rulesLink).not.toBeNull();
    expect(rulesLink.getAttribute('target')).toBe('_blank');
    expect(rulesLink.getAttribute('rel')).toBe('noopener noreferrer');
    expect(rulesLink.textContent).toContain('Ver Bases de la Competencia');
  });

  it('renderDetailView no renderiza el botón de bases si rulesUrl no existe o está vacío', () => {
    const container = document.createElement('div');
    const mockRace = {
      id: 'race-4',
      name: 'Clásica Ciclista Sin Bases',
      discipline: 'Ruta',
      date: '2026-11-20',
      rulesUrl: ''
    };
    renderDetailView(container, mockRace);
    expect(container.innerHTML).not.toContain('Ver Bases de la Competencia');
  });
});


