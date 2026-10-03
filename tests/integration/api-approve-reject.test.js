import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setCustomClientFactory } from '../../api/lib/supabase-server.js';
import approveHandler from '../../api/races/[id]/approve.js';
import rejectHandler from '../../api/races/[id]/reject.js';

const sampleRaceId = 'ffb56586-e413-41ed-a097-5e075bfd5d7e';
const sampleBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

let currentRaceState = null;
let uploadShouldFail = false;

beforeEach(() => {
  uploadShouldFail = false;
  currentRaceState = {
    id: sampleRaceId,
    nombre: 'Vuelta Union Ciclista Curico',
    disciplina: 'Ruta',
    fecha: '2026-12-05',
    fecha_inicio: '2026-12-05',
    fecha_fin: '2026-12-06',
    region: 'Región del Maule',
    ubicacion: 'Curicó',
    organizador: 'Club Curicó',
    descripcion: 'Vuelta anual de ciclismo',
    estado: 'pendiente',
    status: 'Pendiente',
    hero_image: sampleBase64
  };

  // Mock globalThis.fetch para la verificación de salud de la imagen
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: true,
    status: 200
  });

  setCustomClientFactory((token) => ({
    auth: {
      getUser: async () => {
        if (!token || token === 'invalid-token') {
          return { data: { user: null }, error: new Error('Token inválido') };
        }
        if (token === 'admin-token') {
          return { data: { user: { id: 'admin-user-id' } }, error: null };
        }
        if (token === 'non-admin-token') {
          return { data: { user: { id: 'normal-user-id' } }, error: null };
        }
        return { data: { user: null }, error: new Error('Token desconocido') };
      }
    },
    from: (table) => ({
      select: () => ({
        eq: (_field, val) => ({
          maybeSingle: async () => {
            if (table === 'carreras') {
              if (val === 'non-existent-id') return { data: null, error: null };
              return { data: currentRaceState, error: null };
            }
            if (table === 'usuarios_admin') {
              if (val === 'admin-user-id') return { data: { user_id: 'admin-user-id' }, error: null };
              return { data: null, error: null };
            }
            return { data: null, error: null };
          }
        })
      }),
      update: (payload) => ({
        eq: (_field, _val) => {
          if (table === 'carreras') {
            currentRaceState = { ...currentRaceState, ...payload };
          }
          return {
            select: () => ({
              maybeSingle: async () => ({
                data: currentRaceState,
                error: null
              })
            })
          };
        }
      })
    }),
    storage: {
      from: () => ({
        upload: async () => {
          if (uploadShouldFail) {
            return { error: new Error('Fallo simulado en storage') };
          }
          return { error: null };
        },
        getPublicUrl: (filename) => ({
          data: { publicUrl: `https://storage.supabase.co/race-images/${filename}` }
        })
      })
    }
  }));
});

function createMocks({ method = 'POST', query = {}, headers = {}, body = null } = {}) {
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

describe('Pruebas de Aprobación de Carreras (POST /api/races/:id/approve)', () => {
  it('Retorna 401 si no se envía token de autenticación', async () => {
    const { req, res } = createMocks({
      query: { id: sampleRaceId }
    });

    await approveHandler(req, res);
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toMatch(/No autorizado/i);
  });

  it('Retorna 403 si el usuario autenticado no es administrador', async () => {
    const { req, res } = createMocks({
      query: { id: sampleRaceId },
      headers: { authorization: 'Bearer non-admin-token' }
    });

    await approveHandler(req, res);
    expect(res.statusCode).toBe(403);
    expect(res.body.error).toMatch(/permisos de administrador/i);
  });

  it('Retorna 404 si la carrera no existe', async () => {
    const { req, res } = createMocks({
      query: { id: 'non-existent-id' },
      headers: { authorization: 'Bearer admin-token' }
    });

    await approveHandler(req, res);
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/Carrera no encontrada/i);
  });

  it('Convierte hero_image en base64 a URL de Storage y aprueba exitosamente', async () => {
    const { req, res } = createMocks({
      query: { id: sampleRaceId },
      headers: { authorization: 'Bearer admin-token' }
    });

    await approveHandler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.heroImage).toMatch(/^https:\/\/storage\.supabase\.co\/race-images\/races\/.+\.png$/);
    expect(res.body.data.heroImage).not.toContain('data:');
    expect(currentRaceState.estado).toBe('aprobada');
  });

  it('Es idempotente: aprobar dos veces no duplica ni rompe', async () => {
    const mock1 = createMocks({
      query: { id: sampleRaceId },
      headers: { authorization: 'Bearer admin-token' }
    });
    await approveHandler(mock1.req, mock1.res);
    expect(mock1.res.statusCode).toBe(200);

    const mock2 = createMocks({
      query: { id: sampleRaceId },
      headers: { authorization: 'Bearer admin-token' }
    });
    await approveHandler(mock2.req, mock2.res);
    expect(mock2.res.statusCode).toBe(200);
    expect(mock2.res.body.success).toBe(true);
    expect(mock2.res.body.data.heroImage).not.toContain('data:');
  });

  it('Si la imagen base64 está corrupta, aprueba la carrera sin imagen y devuelve warning amigable', async () => {
    currentRaceState.hero_image = 'data:image/png;base64,TOTALMENTE_INVALIDO_NOT_BASE64_###';

    const { req, res } = createMocks({
      query: { id: sampleRaceId },
      headers: { authorization: 'Bearer admin-token' }
    });

    await approveHandler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.warning).toMatch(/corrupta|decodificar/i);
    expect(currentRaceState.hero_image).toBeNull();
    expect(currentRaceState.estado).toBe('aprobada');
  });

  it('Si Storage falla al subir, aprueba la carrera sin imagen sin romper la base de datos', async () => {
    uploadShouldFail = true;

    const { req, res } = createMocks({
      query: { id: sampleRaceId },
      headers: { authorization: 'Bearer admin-token' }
    });

    await approveHandler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.warning).toMatch(/almacenamiento/i);
    expect(currentRaceState.hero_image).toBeNull();
    expect(currentRaceState.estado).toBe('aprobada');
  });
});

describe('Pruebas de Rechazo de Carreras (POST /api/races/:id/reject)', () => {
  it('Retorna 401 si no se envía token de autenticación', async () => {
    const { req, res } = createMocks({
      query: { id: sampleRaceId }
    });

    await rejectHandler(req, res);
    expect(res.statusCode).toBe(401);
  });

  it('Retorna 403 si el usuario autenticado no es administrador', async () => {
    const { req, res } = createMocks({
      query: { id: sampleRaceId },
      headers: { authorization: 'Bearer non-admin-token' }
    });

    await rejectHandler(req, res);
    expect(res.statusCode).toBe(403);
  });

  it('Rechaza exitosamente y limpia base64 para no violar la restricción de base de datos', async () => {
    const { req, res } = createMocks({
      query: { id: sampleRaceId },
      headers: { authorization: 'Bearer admin-token' }
    });

    await rejectHandler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(currentRaceState.estado).toBe('rechazada');
    expect(currentRaceState.hero_image).toBeNull();
  });
});
