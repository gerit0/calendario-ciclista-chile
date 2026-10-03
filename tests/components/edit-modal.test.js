import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';

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
});
