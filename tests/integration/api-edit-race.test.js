import { describe, it, expect, beforeEach } from 'vitest';
import { setCustomClientFactory, mapFrontendToDb, mapDbToFrontend } from '../../api/lib/supabase-server.js';
import raceIdHandler from '../../api/races/[id].js';

const targetRaceId = 'fe28c1f8-56dc-485b-a406-46d7132e89b7';
const adminUserId = '07aa93e6-8770-405e-9e6b-43bfa964ff2a';

function createMockHttp({ method = 'PATCH', query = { id: targetRaceId }, headers = {}, body = null } = {}) {
  const req = {
    method,
    query,
    headers: { ...headers },
    body
  };

  const res = {
    statusCode: 200,
    headers: {},
    ended: false,
    body: null,
    setHeader(key, val) {
      this.headers[key] = val;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      this.ended = true;
      return this;
    },
    end() {
      this.ended = true;
      return this;
    }
  };

  return { req, res };
}

describe('Fase 3: Pruebas de Integración y Anti-Silencio para Edición de Carreras (PATCH /api/races/:id)', () => {
  let dbRow;
  let updateBehavior; // 'normal' | 'zero_rows' | 'error' | 'constraint_base64'

  beforeEach(() => {
    updateBehavior = 'normal';
    dbRow = {
      id: targetRaceId,
      nombre: 'Curico Tour 2026',
      fecha: '2026-11-13',
      fecha_inicio: '2026-11-13',
      fecha_fin: '2026-11-15',
      disciplina: 'Ruta',
      region: 'Región del Maule',
      ubicacion: 'Curicó',
      distancia: '364 km',
      desnivel: '3000 m',
      organizador: 'Club Peteroa',
      link_inscripcion: 'https://curicotour.cl',
      categoria: 'Todo Competidor',
      precio: 55000,
      hero_image: 'https://storage.supabase.co/race-images/curico.webp',
      descripcion: 'Gran vuelta de 3 etapas.',
      creado_por: null,
      link_bases: null,
      estado: 'aprobada',
      status: 'Inscripciones Abiertas'
    };

    setCustomClientFactory((token) => ({
      auth: {
        getUser: async () => {
          if (!token || token === 'invalid') return { data: { user: null }, error: new Error('Invalid token') };
          if (token === 'admin-jwt') return { data: { user: { id: adminUserId } }, error: null };
          if (token === 'organizer-jwt') return { data: { user: { id: 'some-organizer-id' } }, error: null };
          return { data: { user: null }, error: new Error('Unknown token') };
        }
      },
      from: (table) => ({
        select: (_cols) => ({
          eq: (field, val) => ({
            maybeSingle: async () => {
              if (table === 'usuarios_admin') {
                if (val === adminUserId) return { data: { user_id: adminUserId }, error: null };
                return { data: null, error: null };
              }
              if (table === 'carreras') {
                if (val === targetRaceId) return { data: { ...dbRow }, error: null };
                return { data: null, error: null };
              }
              return { data: null, error: null };
            }
          })
        }),
        update: (payload) => ({
          eq: (_field, _val) => ({
            select: () => ({
              maybeSingle: async () => {
                if (updateBehavior === 'zero_rows') {
                  // Simula RLS que no coincide con ninguna fila (0 filas afectadas)
                  return { data: null, error: null };
                }
                if (updateBehavior === 'error') {
                  return { data: null, error: { message: 'DB connection failure' } };
                }
                if (updateBehavior === 'column_error_link_bases') {
                  if ('link_bases' in payload) {
                    return {
                      data: null,
                      error: { code: 'PGRST204', message: "Could not find the 'link_bases' column of 'carreras' in the schema cache" }
                    };
                  }
                  dbRow = { ...dbRow, ...payload };
                  return { data: { ...dbRow }, error: null };
                }
                if (updateBehavior === 'constraint_base64' || (payload.hero_image && payload.hero_image.startsWith('data:'))) {
                  return {
                    data: null,
                    error: { message: 'new row for relation "carreras" violates check constraint "check_no_base64_hero_image"' }
                  };
                }
                // Actualización exitosa
                dbRow = { ...dbRow, ...payload };
                return { data: { ...dbRow }, error: null };
              }
            })
          })
        })
      })
    }));
  });

  const baseValidPayload = {
    name: 'Curico Tour 2026',
    discipline: 'Ruta',
    date: '2026-11-13',
    startDate: '2026-11-13',
    endDate: '2026-11-15',
    region: 'Región del Maule',
    city: 'Curicó',
    organizer: 'Club Peteroa',
    description: 'Gran vuelta de 3 etapas con recorrido detallado.',
    price: 55000,
    categories: ['Todo Competidor']
  };

  it('1. Anti-Silencio: Si Supabase afecta 0 filas (data: null por RLS), la API responde 403 y NUNCA 200 con éxito', async () => {
    updateBehavior = 'zero_rows';

    const { req, res } = createMockHttp({
      method: 'PATCH',
      headers: { authorization: 'Bearer admin-jwt' },
      body: { ...baseValidPayload, name: 'Nombre Modificado' }
    });

    await raceIdHandler(req, res);

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBeUndefined();
    expect(res.body.error).toMatch(/no tienes permisos o la carrera no existe/i);
    // Verificar que la base de datos no cambió
    expect(dbRow.nombre).toBe('Curico Tour 2026');
  });

  it('2. Actualización exitosa: Admin actualiza campos individuales y la respuesta contiene la fila actualizada', async () => {
    const fieldsToTest = [
      { field: 'name', value: 'Vuelta Maule 2026', expectedDb: 'nombre' },
      { field: 'discipline', value: 'MTB', expectedDb: 'disciplina' },
      { field: 'region', value: 'Región de Valparaíso', expectedDb: 'region' },
      { field: 'city', value: 'Viña del Mar', expectedDb: 'ubicacion' },
      { field: 'distance', value: '120 km', expectedDb: 'distancia' },
      { field: 'elevation', value: '2500 m', expectedDb: 'desnivel' },
      { field: 'price', value: 30000, expectedDb: 'precio' },
      { field: 'status', value: 'Próximamente', expectedDb: 'status' },
      { field: 'organizer', value: 'Nuevo Organizador', expectedDb: 'organizador' },
      { field: 'registrationUrl', value: 'https://nueva-inscripcion.cl', expectedDb: 'link_inscripcion' },
      { field: 'heroImage', value: 'https://images.unsplash.com/foto.jpg', expectedDb: 'hero_image' },
      { field: 'description', value: 'Descripción actualizada con más de diez caracteres.', expectedDb: 'descripcion' }
    ];

    for (const item of fieldsToTest) {
      const payload = { ...baseValidPayload, [item.field]: item.value };
      const { req, res } = createMockHttp({
        method: 'PATCH',
        headers: { authorization: 'Bearer admin-jwt' },
        body: payload
      });

      await raceIdHandler(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(dbRow[item.expectedDb]).toBe(item.value);
    }
  });

  it('3. Error de base de datos retorna 500 y no falsea éxito', async () => {
    updateBehavior = 'error';

    const { req, res } = createMockHttp({
      method: 'PATCH',
      headers: { authorization: 'Bearer admin-jwt' },
      body: baseValidPayload
    });

    await raceIdHandler(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toMatch(/Error al guardar los cambios/i);
  });

  it('4. Validación Zod (Fail-Fast): Fechas incongruentes retornan 422 sin tocar Supabase', async () => {
    const { req, res } = createMockHttp({
      method: 'PATCH',
      headers: { authorization: 'Bearer admin-jwt' },
      body: {
        ...baseValidPayload,
        startDate: '2026-12-01',
        endDate: '2026-11-01' // Termina antes de empezar
      }
    });

    await raceIdHandler(req, res);

    expect(res.statusCode).toBe(422);
    expect(res.body.error).toMatch(/no son válidos/i);
    expect(res.body.issues.some(i => i.field === 'endDate')).toBe(true);
  });

  it('5. Validación Zod: Intento de inyectar base64 en heroImage es rechazado en 422 antes de la BD', async () => {
    const { req, res } = createMockHttp({
      method: 'PATCH',
      headers: { authorization: 'Bearer admin-jwt' },
      body: {
        ...baseValidPayload,
        heroImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
      }
    });

    await raceIdHandler(req, res);

    expect(res.statusCode).toBe(422);
    expect(res.body.error).toMatch(/no son válidos/i);
    expect(res.body.issues.some(i => i.field === 'heroImage')).toBe(true);
  });

  it('6. Mapeo bidireccional exacto (camelCase <-> snake_case)', () => {
    const frontendData = {
      name: 'Ruta del Maule',
      discipline: 'Ruta',
      date: '2026-11-20',
      startDate: '2026-11-20',
      endDate: '2026-11-22',
      region: 'Región del Maule',
      city: 'Curicó',
      distance: '100 km',
      elevation: '1200 m',
      organizer: 'Club Maule',
      registrationUrl: 'https://maule.cl',
      categories: ['Elite', 'Master A'],
      price: 25000,
      heroImage: 'https://images.unsplash.com/test.jpg',
      description: 'Gran desafío del Maule.',
      status: 'Inscripciones Abiertas',
      rulesUrl: 'https://drive.google.com/file/d/bases-curico/view'
    };

    const dbPayload = mapFrontendToDb(frontendData, 'user-uuid-1');

    expect(dbPayload.nombre).toBe('Ruta del Maule');
    expect(dbPayload.disciplina).toBe('Ruta');
    expect(dbPayload.fecha_inicio).toBe('2026-11-20');
    expect(dbPayload.fecha_fin).toBe('2026-11-22');
    expect(dbPayload.region).toBe('Región del Maule');
    expect(dbPayload.ubicacion).toBe('Curicó');
    expect(dbPayload.distancia).toBe('100 km');
    expect(dbPayload.desnivel).toBe('1200 m');
    expect(dbPayload.organizador).toBe('Club Maule');
    expect(dbPayload.link_inscripcion).toBe('https://maule.cl');
    expect(dbPayload.link_bases).toBe('https://drive.google.com/file/d/bases-curico/view');
    expect(dbPayload.categoria).toBe('Elite, Master A');
    expect(dbPayload.precio).toBe(25000);
    expect(dbPayload.hero_image).toBe('https://images.unsplash.com/test.jpg');
    expect(dbPayload.descripcion).toBe('Gran desafío del Maule.');
    expect(dbPayload.creado_por).toBe('user-uuid-1');

    const mappedBack = mapDbToFrontend(dbPayload);

    expect(mappedBack.name).toBe(frontendData.name);
    expect(mappedBack.discipline).toBe(frontendData.discipline);
    expect(mappedBack.startDate).toBe(frontendData.startDate);
    expect(mappedBack.endDate).toBe(frontendData.endDate);
    expect(mappedBack.region).toBe(frontendData.region);
    expect(mappedBack.city).toBe(frontendData.city);
    expect(mappedBack.distance).toBe(frontendData.distance);
    expect(mappedBack.elevation).toBe(frontendData.elevation);
    expect(mappedBack.organizer).toBe(frontendData.organizer);
    expect(mappedBack.registrationUrl).toBe(frontendData.registrationUrl);
    expect(mappedBack.rulesUrl).toBe(frontendData.rulesUrl);
    expect(mappedBack.categories).toEqual(frontendData.categories);
    expect(mappedBack.price).toBe(frontendData.price);
    expect(mappedBack.isFree).toBe(false);
    expect(mappedBack.heroImage).toBe(frontendData.heroImage);
    expect(mappedBack.description).toBe(frontendData.description);
  });

  it('7. Persiste y retorna rulesUrl mapeado a link_bases en PATCH /api/races/:id', async () => {
    const payload = {
      ...baseValidPayload,
      rulesUrl: 'https://drive.google.com/file/d/bases-curico/view'
    };

    const { req, res } = createMockHttp({
      method: 'PATCH',
      headers: { authorization: 'Bearer admin-jwt' },
      body: payload
    });

    await raceIdHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(dbRow.link_bases).toBe('https://drive.google.com/file/d/bases-curico/view');
    expect(res.body.data.rulesUrl).toBe('https://drive.google.com/file/d/bases-curico/view');
  });

  it('8. Limpieza de rulesUrl: enviar string vacío actualiza link_bases a null en la BD', async () => {
    dbRow.link_bases = 'https://drive.google.com/file/d/bases-viejas/view';

    const payload = {
      ...baseValidPayload,
      rulesUrl: ''
    };

    const { req, res } = createMockHttp({
      method: 'PATCH',
      headers: { authorization: 'Bearer admin-jwt' },
      body: payload
    });

    await raceIdHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(dbRow.link_bases).toBeNull();
    expect(res.body.data.rulesUrl).toBe('');
  });

  it('9. Fallback defensivo PGRST204: Si link_bases no existe en el esquema, el reintento se ejecuta y tiene éxito', async () => {
    updateBehavior = 'column_error_link_bases';

    const payload = {
      ...baseValidPayload,
      rulesUrl: 'https://drive.google.com/file/d/bases-curico/view'
    };

    const { req, res } = createMockHttp({
      method: 'PATCH',
      headers: { authorization: 'Bearer admin-jwt' },
      body: payload
    });

    await raceIdHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    // En el reintento sin link_bases, dbRow permanece null (no se guardó link_bases)
    expect(dbRow.link_bases).toBeNull();
  });
});
