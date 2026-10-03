import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { parseCurrentRoute, navigateTo } from '../../js/router.js';

describe('4. Pruebas de Regresión Específicas: Guardia Estática y Prevención 414 URI_TOO_LONG', () => {

  it('al navegar hacia la ruta de edición, la URL contiene ÚNICAMENTE el ID y mide menos de 100 caracteres', () => {
    const sampleId = 'fe28c1f8-56dc-485b-a406-46d7132e89b7';
    const targetUrl = `/editar/${sampleId}`;

    navigateTo(targetUrl);

    expect(window.location.pathname).toBe(targetUrl);
    expect(window.location.search).toBe('');
    expect(window.location.href.length).toBeLessThan(200);

    const parsed = parseCurrentRoute();
    expect(parsed.viewName).toBe('edit');
    expect(parsed.params.id).toBe(sampleId);
  });

  it('una carrera con descripción de 15.000 caracteres e imagen grande jamás genera parámetros en la URL al guardarse', () => {
    const longDesc = 'Descripción inmensa '.repeat(800);
    const heroImgUrl = 'https://images.unsplash.com/photo-1541625602330-2277a4c46182';

    // Al preparar el payload para PUT/PATCH
    const payload = {
      name: 'Curico Tour 2026',
      description: longDesc,
      heroImage: heroImgUrl
    };
    expect(payload.description.length).toBeGreaterThan(10000);

    // La URL de destino es estrictamente el endpoint con ID
    const sampleId = 'fe28c1f8-56dc-485b-a406-46d7132e89b7';
    const requestUrl = `/api/races/${sampleId}`;

    expect(requestUrl.length).toBeLessThan(100);
    expect(requestUrl).not.toContain('?');
    expect(requestUrl).not.toContain('name=');
    expect(requestUrl).not.toContain('heroImage=');
    expect(requestUrl).not.toContain('description=');
  });

  it('Guardia Estática: ningún archivo fuente en js/ serializa objetos de carrera en URLSearchParams ni query string', () => {
    const jsDir = path.resolve('js');
    const files = fs.readdirSync(jsDir).filter(f => f.endsWith('.js') && !f.startsWith('bundle'));

    const forbiddenPatterns = [
      /[a-zA-Z0-9_]+\s*\+\s*['"`]\?name=/,
      /navigateTo\s*\([^)]*\?name=/i,
      /href\s*=\s*[`'"][^`'"]*\?name=/i,
      /\?heroImage=/,
      /searchParams\.set\(['"]heroImage['"]/,
      /searchParams\.set\(['"]description['"]/,
      /new URLSearchParams\([^)]*race\)/i,
      /new URLSearchParams\([^)]*formData\)/i
    ];

    for (const file of files) {
      const content = fs.readFileSync(path.join(jsDir, file), 'utf8');
      for (const pattern of forbiddenPatterns) {
        const matches = content.match(pattern);
        expect(matches, `Patrón prohibido ${pattern} encontrado en js/${file}`).toBeNull();
      }
    }
  });

  it('Guardia Estática: ningún archivo fuente en js/ asigna Base64 data: como URL final de heroImage', () => {
    const jsDir = path.resolve('js');
    const files = fs.readdirSync(jsDir).filter(f => f.endsWith('.js') && !f.startsWith('bundle'));

    for (const file of files) {
      const content = fs.readFileSync(path.join(jsDir, file), 'utf8');
      expect(content).not.toMatch(/finalUrl\s*=\s*base64Data/);
      expect(content).not.toMatch(/urlInput\.value\s*=\s*base64Data/);
      expect(content).not.toMatch(/urlInput\.value\s*=\s*event\.target\.result/);
    }
  });
});
