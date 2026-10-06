import { describe, it, expect } from 'vitest';
import { validateRaceForm } from '../../js/validation.js';

describe('1. Pruebas Unitarias: Esquema de Validación Zod (raceSchema y validateRaceForm)', () => {
  const validBasePayload = {
    name: 'Curico Tour 2026',
    discipline: 'Ruta',
    date: '2026-11-13',
    startDate: '2026-11-13',
    endDate: '2026-11-15',
    isMultiDay: true,
    region: 'Región del Maule',
    city: 'Curicó',
    organizer: 'Club Deportivo Peteroa',
    registrationUrl: 'https://curicotour.cl',
    distance: '364 km',
    elevation: '3000 m',
    price: 55000,
    status: 'Inscripciones Abiertas',
    heroImage: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182',
    categories: ['Todo Competidor', 'Master A'],
    description: '3 etapas, 364 kilómetros y más de 3.000 metros de desnivel acumulado.'
  };

  it('valida correctamente una carrera con todos los campos válidos', () => {
    const result = validateRaceForm(validBasePayload);
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
    expect(result.sanitizedData.name).toBe('Curico Tour 2026');
    expect(result.sanitizedData.startDate).toBe('2026-11-13');
    expect(result.sanitizedData.endDate).toBe('2026-11-15');
    expect(result.sanitizedData.price).toBe(55000);
    expect(result.sanitizedData.categories).toEqual(['Todo Competidor', 'Master A']);
  });

  it('acepta valores "N/A" para distancia y desnivel', () => {
    const payload = { ...validBasePayload, distance: 'N/A', elevation: 'N/A' };
    const result = validateRaceForm(payload);
    expect(result.isValid).toBe(true);
    expect(result.sanitizedData.distance).toBe('N/A');
    expect(result.sanitizedData.elevation).toBe('N/A');
  });

  it('rechaza nombres menores a 3 o mayores a 120 caracteres', () => {
    const shortRes = validateRaceForm({ ...validBasePayload, name: 'AB' });
    expect(shortRes.isValid).toBe(false);
    expect(shortRes.errors.name).toMatch(/al menos 3/i);

    const longRes = validateRaceForm({ ...validBasePayload, name: 'A'.repeat(125) });
    expect(longRes.isValid).toBe(false);
    expect(longRes.errors.name).toMatch(/120 caracteres/i);
  });

  it('rechaza fechas incoherentes (endDate anterior a startDate)', () => {
    const payload = {
      ...validBasePayload,
      startDate: '2026-11-15',
      endDate: '2026-11-10'
    };
    const result = validateRaceForm(payload);
    expect(result.isValid).toBe(false);
    expect(result.errors.endDate).toMatch(/no puede ser anterior a la fecha de inicio/i);
  });

  it('si no se especifica endDate, hereda el startDate automáticamente', () => {
    const payload = {
      ...validBasePayload,
      startDate: '2026-11-13',
      endDate: ''
    };
    const result = validateRaceForm(payload);
    expect(result.isValid).toBe(true);
    expect(result.sanitizedData.endDate).toBe('2026-11-13');
  });

  it('acepta descripciones extensas de hasta 20.000 caracteres en el servidor', () => {
    const longDesc = 'Detalle de la carrera: ' + 'Km 1 al 100 con subida pronunciada. '.repeat(550);
    expect(longDesc.length).toBeGreaterThan(15000);
    expect(longDesc.length).toBeLessThan(20000);

    const payload = { ...validBasePayload, description: longDesc };
    const result = validateRaceForm(payload);
    expect(result.isValid).toBe(true);
    expect(result.sanitizedData.description.length).toBe(longDesc.trim().length);
  });

  it('rechaza descripciones que superen los 20.000 caracteres', () => {
    const tooLongDesc = 'A'.repeat(20050);
    const payload = { ...validBasePayload, description: tooLongDesc };
    const result = validateRaceForm(payload);
    expect(result.isValid).toBe(false);
    expect(result.errors.description).toMatch(/20\.000 caracteres/i);
  });

  it('RECHAZA ESTRICTAMENTE imágenes en formato data URI Base64', () => {
    const base64Img = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const payload = { ...validBasePayload, heroImage: base64Img };
    const result = validateRaceForm(payload);
    expect(result.isValid).toBe(false);
    expect(result.errors.heroImage).toMatch(/no se permiten imágenes en base64/i);
  });

  it('normaliza categorías no canónicas a la lista cerrada permitida', () => {
    const payload = {
      ...validBasePayload,
      categories: 'tc, elite, intemedia, master a, desconocida_xyz'
    };
    const result = validateRaceForm(payload);
    expect(result.isValid).toBe(true);
    expect(result.sanitizedData.categories).toContain('Todo Competidor');
    expect(result.sanitizedData.categories).toContain('Elite');
    expect(result.sanitizedData.categories).toContain('Intermedia');
    expect(result.sanitizedData.categories).toContain('Master A');
    expect(result.sanitizedData.categories).not.toContain('desconocida_xyz');
  });

  it('normaliza precios con formato monetario (ej: "$35.000" a 35000)', () => {
    const payload = { ...validBasePayload, price: '$35.000' };
    const result = validateRaceForm(payload);
    expect(result.isValid).toBe(true);
    expect(result.sanitizedData.price).toBe(35000);
  });

  it('establece precio en 0 si isFree está activo', () => {
    const payload = { ...validBasePayload, isFree: true, price: 50000 };
    const result = validateRaceForm(payload);
    expect(result.isValid).toBe(true);
    expect(result.sanitizedData.price).toBe(0);
  });

  describe('validación de rulesUrl (bases de la carrera)', () => {
    it('acepta una URL válida en rulesUrl', () => {
      const payload = {
        ...validBasePayload,
        rulesUrl: 'https://drive.google.com/file/d/123/view'
      };
      const result = validateRaceForm(payload);
      expect(result.isValid).toBe(true);
      expect(result.sanitizedData.rulesUrl).toBe('https://drive.google.com/file/d/123/view');
    });

    it('acepta rulesUrl como cadena vacía, espacios en blanco, null o undefined y lo normaliza a cadena vacía', () => {
      const cases = ['', '   ', null, undefined];
      for (const val of cases) {
        const payload = { ...validBasePayload, rulesUrl: val };
        const result = validateRaceForm(payload);
        expect(result.isValid).toBe(true);
        expect(result.sanitizedData.rulesUrl).toBe('');
      }

      const omittedPayload = { ...validBasePayload };
      delete omittedPayload.rulesUrl;
      const omittedResult = validateRaceForm(omittedPayload);
      expect(omittedResult.isValid).toBe(true);
      expect(omittedResult.sanitizedData.rulesUrl).toBe('');
    });

    it('rechaza rulesUrl si no es una URL válida o usa esquemas no permitidos (ej. javascript:)', () => {
      const invalidUrls = ['no-es-una-url', 'javascript:alert(1)', 'ftp://example.com/bases.pdf'];
      for (const badUrl of invalidUrls) {
        const payload = { ...validBasePayload, rulesUrl: badUrl };
        const result = validateRaceForm(payload);
        expect(result.isValid).toBe(false);
        expect(result.errors.rulesUrl).toBeDefined();
        expect(result.errors.rulesUrl).toMatch(/debe ser una URL válida/i);
      }
    });

    it('rechaza rulesUrl si supera los 500 caracteres', () => {
      const longUrl = 'https://example.com/' + 'a'.repeat(500);
      const payload = { ...validBasePayload, rulesUrl: longUrl };
      const result = validateRaceForm(payload);
      expect(result.isValid).toBe(false);
      expect(result.errors.rulesUrl).toBeDefined();
      expect(result.errors.rulesUrl).toMatch(/500 caracteres/i);
    });
  });
});

