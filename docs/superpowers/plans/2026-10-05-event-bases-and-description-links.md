# Event Bases and Description Links Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a dedicated "Bases de la Competencia" field and button, and resolve link overflow in the event description with safe autolinking.

**Architecture:** Extend Zod schema and Supabase mappings to handle `rulesUrl` (stored in DB column `link_bases`), render a secondary CTA button in the detail sidebar when present, and introduce `formatDescriptionWithLinks` in `js/ui.js` that sanitizes HTML and turns URLs into breakable, clickable `<a>` links.

**Tech Stack:** Vanilla JavaScript (ES Modules), Zod, Supabase (PostgreSQL & Storage), Tailwind CSS, esbuild, Vitest, Playwright.

---

### Task 1: Database Migration File and Zod Schema Validation for `rulesUrl`

**Files:**
- Create: `supabase/migrations/20261005_add_link_bases_column.sql`
- Modify: `shared/schema.js:80-100`
- Test: `tests/unit/validation-schema.test.js`

- [ ] **Step 1: Write the failing tests for `rulesUrl` validation**

Add test cases in `tests/unit/validation-schema.test.js`:
```javascript
  it('permite una URL válida en rulesUrl', () => {
    const validData = { ...validRaceData, rulesUrl: 'https://drive.google.com/file/d/123/view' };
    const res = raceSchema.safeParse(validData);
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.rulesUrl).toBe('https://drive.google.com/file/d/123/view');
    }
  });

  it('permite una cadena vacía o nula en rulesUrl (campo opcional)', () => {
    const emptyRulesData = { ...validRaceData, rulesUrl: '' };
    const res = raceSchema.safeParse(emptyRulesData);
    expect(res.success).toBe(true);
  });

  it('rechaza un formato de URL inválido en rulesUrl', () => {
    const invalidUrlData = { ...validRaceData, rulesUrl: 'no-es-una-url' };
    const res = raceSchema.safeParse(invalidUrlData);
    expect(res.success).toBe(false);
    if (!res.success) {
      const issue = res.error.issues.find(i => i.path.includes('rulesUrl'));
      expect(issue).toBeDefined();
    }
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/unit/validation-schema.test.js`
Expected: FAIL (because `rulesUrl` is not yet part of `raceSchema`).

- [ ] **Step 3: Create migration SQL and update Zod schema**

Create `supabase/migrations/20261005_add_link_bases_column.sql`:
```sql
-- Migración: Agregar columna link_bases para almacenar el enlace a las bases/reglamento
-- Fecha: 2026-10-05

ALTER TABLE public.carreras ADD COLUMN IF NOT EXISTS link_bases TEXT;
```

Modify `shared/schema.js` to add `rulesUrl`:
```javascript
  rulesUrl: z
    .string()
    .trim()
    .url({ message: 'El enlace a las bases debe ser una URL válida (http/https).' })
    .or(z.literal(''))
    .optional(),
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/unit/validation-schema.test.js`
Expected: PASS (all tests pass).

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/20261005_add_link_bases_column.sql shared/schema.js tests/unit/validation-schema.test.js
git commit -m "feat(schema): agregar campo opcional rulesUrl y migracion para link_bases"
```

---

### Task 2: Backend Mapping & Serverless API Support for `rulesUrl` / `link_bases`

**Files:**
- Modify: `api/lib/supabase-server.js:50-110`
- Modify: `api/races/[id].js:115-135`
- Modify: `js/supabase.js:100-260`
- Modify: `js/storage.js:280-350`
- Test: `tests/integration/api-edit-race.test.js`

- [ ] **Step 1: Write integration tests for `rulesUrl` in edit API**

In `tests/integration/api-edit-race.test.js`, add test asserting `rulesUrl` is mapped to `link_bases`:
```javascript
  it('persiste y retorna rulesUrl mapeado desde link_bases', async () => {
    const payload = {
      name: 'Curico Tour 2026',
      discipline: 'Ruta',
      date: '2026-11-13',
      region: 'Región del Maule',
      city: 'Curicó',
      organizer: 'Club Peteroa',
      price: 35000,
      description: 'Carrera clásica por los valles de Curicó.',
      rulesUrl: 'https://drive.google.com/file/d/bases-curico/view'
    };

    const { req, res } = createMockHttp({
      method: 'PATCH',
      headers: { authorization: 'Bearer test-token' },
      body: payload
    });

    await raceIdHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.rulesUrl).toBe('https://drive.google.com/file/d/bases-curico/view');
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/integration/api-edit-race.test.js`
Expected: FAIL (because `mapFrontendToDb` and mock row do not yet map `rulesUrl`).

- [ ] **Step 3: Update `supabase-server.js`, `api/races/[id].js`, `js/supabase.js`, and `js/storage.js`**

1. In `api/lib/supabase-server.js`:
In `mapFrontendToDb`:
```javascript
    link_bases: data.rulesUrl && data.rulesUrl.trim() ? data.rulesUrl.trim() : null,
```
In `mapDbToFrontend`:
```javascript
    rulesUrl: row.link_bases || '',
```

2. In `api/races/[id].js`:
In defensive column retry block:
```javascript
    delete dbPayload.link_bases;
```

3. In `js/supabase.js`:
In `mapSupabaseToFrontend`:
```javascript
    rulesUrl: row.link_bases || '',
```
In `createRaceSupabase`:
```javascript
    link_bases: raceData.rulesUrl && raceData.rulesUrl.trim() ? raceData.rulesUrl.trim() : null,
```
and delete `fallbackPayload.link_bases;` on column retry.

4. In `js/storage.js`:
Ensure `updateRace` passes `rulesUrl` in `updatedRace`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/integration/api-edit-race.test.js`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add api/lib/supabase-server.js api/races/[id].js js/supabase.js js/storage.js tests/integration/api-edit-race.test.js
git commit -m "feat(api): soporte y mapeo de rulesUrl a link_bases con fallback defensivo"
```

---

### Task 3: Description Overflow Fix & Safe Autolinking

**Files:**
- Create: `tests/components/description-links.test.js`
- Modify: `js/ui.js:605-625`

- [ ] **Step 1: Write failing tests for description formatting and autolinking**

Create `tests/components/description-links.test.js`:
```javascript
import { describe, it, expect } from 'vitest';
import { formatDescriptionWithLinks } from '../../js/ui.js';

describe('formatDescriptionWithLinks', () => {
  it('escapa etiquetas HTML potencialmente peligrosas (anti-XSS)', () => {
    const malicious = '<script>alert("hack")</script> <b>negrita</b>';
    const result = formatDescriptionWithLinks(malicious);
    expect(result).not.toContain('<script>');
    expect(result).toContain('&lt;script&gt;');
    expect(result).toContain('&lt;b&gt;');
  });

  it('convierte URLs completas en hipervínculos clickeables con target blank y break-all', () => {
    const text = 'Bases: https://drive.google.com/file/d/123/view?fbclid=abc en el sitio.';
    const result = formatDescriptionWithLinks(text);
    expect(result).toContain('<a href="https://drive.google.com/file/d/123/view?fbclid=abc" target="_blank" rel="noopener noreferrer" class="text-secondary font-semibold underline hover:opacity-80 break-all">https://drive.google.com/file/d/123/view?fbclid=abc</a>');
    expect(result).toContain('Bases: ');
  });

  it('maneja textos vacíos o nulos sin lanzar errores', () => {
    expect(formatDescriptionWithLinks('')).toBe('');
    expect(formatDescriptionWithLinks(null)).toBe('');
    expect(formatDescriptionWithLinks(undefined)).toBe('');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/components/description-links.test.js`
Expected: FAIL (because `formatDescriptionWithLinks` is not exported from `js/ui.js`).

- [ ] **Step 3: Implement `formatDescriptionWithLinks` and update description card styling in `js/ui.js`**

In `js/ui.js`:
```javascript
/**
 * Sanitiza texto y convierte URLs encontradas en hipervínculos clickeables con ajuste de línea
 * @param {string} text
 * @returns {string}
 */
export function formatDescriptionWithLinks(text) {
  if (!text) return '';
  const escaped = escapeHTML(String(text));
  const urlRegex = /(https?:\/\/[^\s<]+)/g;
  return escaped.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-secondary font-semibold underline hover:opacity-80 break-all">${url}</a>`;
  });
}
```

Update description card in `renderDetailView` (`js/ui.js` lines ~608-618):
```html
          <!-- Descripción del Evento -->
          <div class="bg-white p-6 sm:p-8 rounded-3xl border border-outline-variant/40 shadow-sm space-y-4 break-words [overflow-wrap:anywhere] overflow-hidden">
            <h3 class="font-display font-bold text-xl text-primary flex items-center gap-2">
              <span class="material-symbols-outlined text-secondary">description</span>
              Descripción del Evento
            </h3>
            <p class="text-gray-700 text-base leading-relaxed whitespace-pre-line break-words [overflow-wrap:anywhere]">
              ${formatDescriptionWithLinks(race.description || '')}
            </p>
          </div>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/components/description-links.test.js`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add js/ui.js tests/components/description-links.test.js
git commit -m "feat(ui): autolinking seguro y correccion de desbordamiento en descripcion"
```

---

### Task 4: Bases Button in Race Detail View & Form Fields in Creation/Edit Modals

**Files:**
- Modify: `js/ui.js:665-680`
- Modify: `index.html:580-600, 950-965`
- Modify: `js/admin.js:255-265, 370-385`
- Modify: `js/app.js:975-990, 1220-1240`
- Test: `tests/components/edit-modal.test.js`

- [ ] **Step 1: Write failing test in `tests/components/edit-modal.test.js`**

Add assertion in `tests/components/edit-modal.test.js` verifying that `openEditModal` populates `rulesUrl` and that the form collects it:
```javascript
  it('precarga y recopila el campo rulesUrl en el modal de edición', () => {
    openEditModal({
      ...mockRace,
      rulesUrl: 'https://drive.google.com/file/d/bases-test/view'
    });
    const rulesInput = document.getElementById('edit-form-rules-url');
    expect(rulesInput).not.toBeNull();
    expect(rulesInput.value).toBe('https://drive.google.com/file/d/bases-test/view');
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/components/edit-modal.test.js`
Expected: FAIL (because `#edit-form-rules-url` does not exist in DOM).

- [ ] **Step 3: Implement inputs in `index.html`, `js/admin.js`, button in `js/ui.js`, and handlers in `js/app.js`**

1. In `js/ui.js` (`renderDetailView` right sidebar under registration button):
```html
            ${race.rulesUrl ? `
              <a 
                href="${escapeHTML(race.rulesUrl)}" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="w-full bg-surface-container hover:bg-surface-container-high text-primary font-display font-bold text-sm py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all border border-outline-variant/50 shadow-sm"
              >
                <span class="material-symbols-outlined text-lg text-secondary">description</span>
                Ver Bases de la Competencia
                <span class="material-symbols-outlined text-sm text-outline">open_in_new</span>
              </a>
            ` : ''}
```

2. In `index.html`:
In `#race-form`:
```html
          <div>
            <label for="form-rules-url" class="block font-display font-bold text-sm text-primary mb-2">
              Bases de la Competencia <span class="text-xs text-outline/80 font-normal">(Opcional)</span>
            </label>
            <input type="url" id="form-rules-url" name="rulesUrl" placeholder="https://drive.google.com/... o enlace a PDF"
              class="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all">
          </div>
```
In `#edit-race-form`:
```html
          <div>
            <label for="edit-form-rules-url" class="block font-display font-bold text-sm text-primary mb-2">
              Bases de la Competencia <span class="text-xs text-outline/80 font-normal">(Opcional)</span>
            </label>
            <input type="url" id="edit-form-rules-url" name="rulesUrl" placeholder="https://drive.google.com/... o enlace a PDF"
              class="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all">
          </div>
```

3. In `js/admin.js`:
Add `#edit-form-rules-url` in template and set `document.getElementById('edit-form-rules-url').value = race.rulesUrl || '';` in `openEditModal`.

4. In `js/app.js`:
In public submission: read `rulesUrl: formData.get('rulesUrl') || '',`
In edit submission: read `rulesUrl: formData.get('rulesUrl') || document.getElementById('edit-form-rules-url')?.value || '',`

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tests/components/edit-modal.test.js`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add index.html js/ui.js js/admin.js js/app.js tests/components/edit-modal.test.js
git commit -m "feat(ui): boton de bases en detalle y campos de entrada en formularios"
```

---

### Task 5: Database Migration Execution, Build & Full Verification

**Files:**
- Create: `scripts/apply-link-bases-migration.mjs`
- Modify: `scripts/build.mjs` (if needed)

- [ ] **Step 1: Execute database column migration in Supabase**

Create temporary execution script `scripts/apply-link-bases-migration.mjs`:
```javascript
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const env = fs.readFileSync('.env.local', 'utf8');
const url = env.match(/SUPABASE_URL=(.*)/)?.[1]?.trim().replace(/['"]/g, '');
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)?.[1]?.trim().replace(/['"]/g, '');

const supabase = createClient(url, key);
// Verify or test update/select with column link_bases
const { data, error } = await supabase.from('carreras').select('id, link_bases').limit(1);
console.log('Result:', data, error);
```
Run: `node scripts/apply-link-bases-migration.mjs`
If column does not exist, run SQL migration via Supabase SQL or API.

- [ ] **Step 2: Run build script**

Run: `npm run build`
Expected: esbuild compiles `bundle.js`, updates hash in `index.html`, and syncs `public/`.

- [ ] **Step 3: Run full automated test suite**

Run: `npm test`
Expected: All tests pass (0 failures).

- [ ] **Step 4: Commit and Push**

```bash
git add .
git commit -m "feat: integracion completa de bases de competencia y formato de descripcion"
git push origin main
```

- [ ] **Step 5: Verify production deployment**

Verify `https://calendario-ciclista-chile.vercel.app` serves latest build and test the flow end-to-end.
