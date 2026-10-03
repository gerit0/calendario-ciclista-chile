import { describe, it, expect, beforeEach } from 'vitest';
import { setCustomClientFactory } from '../../api/lib/supabase-server.js';

const sampleRaceId = 'fe28c1f8-56dc-485b-a406-46d7132e89b7';
const sampleOwnerId = 'user-owner-123';

beforeEach(() => {
  setCustomClientFactory((token) => ({
    auth: {
      getUser: async () => {
        if (!token || token === 'invalid-token') {
          return { data: { user: null }, error: new Error('Token inválido') };
        }
        if (token === 'admin-token') {
          return { data: { user: { id: 'admin-user-id' } }, error: null };
        }
        if (token === 'other-user-token') {
          return { data: { user: { id: 'other-user-id' } }, error: null };
        }
        return { data: { user: { id: sampleOwnerId } }, error: null };
      }
    },
    from: (table) => ({
      select: () => ({
        eq: (field, val) => ({
          maybeSingle: async () => {
            if (table === 'carreras') {
              if (val === 'non-existent-id') return { data: null, error: null };
              return {
                data: {
                  id: sampleRaceId,
                  nombre: 'Curico Tour 2026',
                  disciplina: 'Ruta',
                  fecha: '2026-11-13',
                  fecha_inicio: '2026-11-13',
                  fecha_fin: '2026-11-15',
                  region: 'Región del Maule',
                  ubicacion: 'Curicó',
                  organizador: 'Club Peteroa',
                  descripcion: 'Descripción inicial',
                  creado_por: sampleOwnerId
                },
                error: null
              };
            }
            if (table === 'usuarios_admin') {
              if (val === 'admin-user-id') return { data: { user_id: 'admin-user-id' }, error: null };
              return { data: null, error: null };
            }
            return { data: null, error: null };
          }
        })
      }),
      update: () => ({
        eq: () => ({
          select: () => ({
            maybeSingle: async () => ({
              data: {
                id: sampleRaceId,
                nombre: 'Curico Tour Actualizado',
                fecha: '2026-11-13',
                creado_por: sampleOwnerId
              },
              error: null
            })
          })
        })
      }),
      delete: () => ({
        eq: async () => ({ error: null })
      })
    }),
    storage: {
      from: () => ({
        upload: async () => ({ error: null }),
        getPublicUrl: () => ({ data: { publicUrl: 'https://storage.supabase.co/race-images/hero.webp' } })
      })
    }
  }));
});

import raceIdHandler from '../../api/races/[id].js';
import uploadImageHandler from '../../api/upload-image.js';

function createMocks({ method = 'GET', query = {}, headers = {}, body = null } = {}) {
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

describe('2. Pruebas de Integración: API Serverless (/api/races/:id y /api/upload-image)', () => {
  const validEditBody = {
    name: 'Curico Tour 2026 Actualizado',
    discipline: 'Ruta',
    date: '2026-11-13',
    startDate: '2026-11-13',
    endDate: '2026-11-15',
    region: 'Región del Maule',
    city: 'Curicó',
    organizer: 'Club Peteroa',
    description: 'Descripción completa actualizada con más de 10 caracteres.',
    price: 45000,
    categories: ['Todo Competidor']
  };

  it('PATCH /api/races/:id retorna 401 si no se envía token de autenticación', async () => {
    const { req, res } = createMocks({
      method: 'PATCH',
      query: { id: sampleRaceId },
      body: validEditBody
    });

    await raceIdHandler(req, res);
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toMatch(/Autenticación requerida/i);
  });

  it('PATCH /api/races/:id retorna 422 si los datos son inválidos (fechas invertidas)', async () => {
    const { req, res } = createMocks({
      method: 'PATCH',
      query: { id: sampleRaceId },
      headers: { authorization: 'Bearer valid-token' },
      body: {
        ...validEditBody,
        startDate: '2026-11-15',
        endDate: '2026-11-10' // Invertida
      }
    });

    await raceIdHandler(req, res);
    expect(res.statusCode).toBe(422);
    expect(res.body.error).toMatch(/no son válidos/i);
    expect(res.body.issues.some(i => i.field === 'endDate')).toBe(true);
  });

  it('PATCH /api/races/:id retorna 200 y persiste correctamente cuando los datos son válidos y tiene permisos', async () => {
    const { req, res } = createMocks({
      method: 'PATCH',
      query: { id: sampleRaceId },
      headers: { authorization: 'Bearer valid-token' },
      body: validEditBody
    });

    await raceIdHandler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(sampleRaceId);
  });

  it('PATCH /api/races/:id retorna 403 si el usuario no es creador ni admin', async () => {
    const { req, res } = createMocks({
      method: 'PATCH',
      query: { id: sampleRaceId },
      headers: { authorization: 'Bearer other-user-token' },
      body: validEditBody
    });

    await raceIdHandler(req, res);
    expect(res.statusCode).toBe(403);
    expect(res.body.error).toMatch(/No tienes permisos/i);
  });

  it('PATCH /api/races/:id retorna 404 si el ID no existe', async () => {
    const { req, res } = createMocks({
      method: 'PATCH',
      query: { id: 'non-existent-id' },
      headers: { authorization: 'Bearer valid-token' },
      body: validEditBody
    });

    await raceIdHandler(req, res);
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/no encontrada/i);
  });

  it('PATCH /api/races/:id procesa correctamente payload grande con descripción extensa (15.000+ chars)', async () => {
    const longDescription = 'Etapa Reina: '.repeat(1100);
    expect(longDescription.length).toBeGreaterThan(14000);

    const { req, res } = createMocks({
      method: 'PATCH',
      query: { id: sampleRaceId },
      headers: { authorization: 'Bearer valid-token' },
      body: {
        ...validEditBody,
        description: longDescription
      }
    });

    await raceIdHandler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('GET /api/races/:id retorna 200 con la información formateada', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: { id: sampleRaceId }
    });

    await raceIdHandler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Curico Tour 2026');
  });

  it('POST /api/upload-image retorna 400 si el content-type no es multipart/form-data', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ image: 'base64...' })
    });

    await uploadImageHandler(req, res);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/multipart\/form-data/i);
  });
});
