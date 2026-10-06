# Indicador de Carrera Finalizada Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a derived time-status calculator (`America/Santiago` timezone) that renders "Finalizada" and "En Curso" badges, applies visual desaturation to finished race cards, adds a "Mostrar carreras pasadas" toggle in the filter bar, and updates detail views and SSR.

**Architecture:** Extend `js/ui.js` with `getTodayChileDateStr()` and `getRaceTimeStatus(race)`. Update `renderRaceCard`, `renderDetailView`, and grid renders in `js/ui.js` and `api/seo.js` to handle derived badges and opacity. Add toggle `#toggle-past-races` to `index.html` and handle past race filtering in `js/app.js`.

**Tech Stack:** Vanilla JavaScript ES Modules, Tailwind CSS, Vercel Serverless SSR.

---

### File Structure

- `js/ui.js`: [MODIFY] Add `getTodayChileDateStr()` and `getRaceTimeStatus(race)`. Update `renderRaceCard`, `renderDetailView`, `renderMonthGrid`, `renderWeekGrid`, `renderDayGrid` with "Finalizada" and "En Curso" badges and card desaturation styles.
- `index.html`: [MODIFY] Add `#toggle-past-races` checkbox and label in the filter controls bar.
- `js/app.js`: [MODIFY] Add `showPastRaces` state, bind `#toggle-past-races` change event, and update `getFilteredRaces()` to filter out past races by default.
- `api/seo.js`: [MODIFY] Update `renderDetailHtmlSSR` to derive status and show "Finalizada" badge for SSR.
- `js/bundle.js`: [MODIFY] Re-bundle with `esbuild`.
- `scratch/qa_test.js`: [MODIFY] Add test assertions for `getTodayChileDateStr`, `getRaceTimeStatus`, badges, and past races toggle.

---

### Task 1: Add time status calculation and badge rendering in `js/ui.js`

**Files:**
- Modify: `js/ui.js`
- Modify: `scratch/qa_test.js`

- [ ] **Step 1: Add `getTodayChileDateStr` and `getRaceTimeStatus` to `js/ui.js`**

```javascript
/**
 * Retorna la fecha actual en la zona horaria America/Santiago en formato YYYY-MM-DD
 * @returns {string} Ej: "2026-07-22"
 */
export function getTodayChileDateStr() {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Santiago',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  return formatter.format(now);
}

/**
 * Calcula el estado derivado de tiempo de una carrera respecto a hoy en America/Santiago
 * @param {Object} race 
 * @param {string} [todayOverride] Fecha YYYY-MM-DD opcional para pruebas
 * @returns {{ esFinalizada: boolean, esEnCurso: boolean, esFutura: boolean, todayStr: string, startDateStr: string, endDateStr: string }}
 */
export function getRaceTimeStatus(race, todayOverride) {
  const durationInfo = detectRaceDuration(race);
  const todayStr = todayOverride || getTodayChileDateStr();

  const startStr = durationInfo.startDateStr || '';
  const endStr = durationInfo.endDateStr || startStr;

  let esFinalizada = false;
  let esEnCurso = false;
  let esFutura = false;

  if (endStr && endStr < todayStr) {
    esFinalizada = true;
  } else if (startStr && startStr <= todayStr && todayStr <= endStr) {
    esEnCurso = true;
  } else {
    esFutura = true;
  }

  return {
    esFinalizada,
    esEnCurso,
    esFutura,
    todayStr,
    startDateStr: startStr,
    endDateStr: endStr
  };
}
```

- [ ] **Step 2: Update `renderRaceCard` and `renderDetailView` in `js/ui.js`**

In `renderRaceCard`:
Evaluate `timeStatus = getRaceTimeStatus(race)`.
If `timeStatus.esFinalizada`:
- Set `statusBadgeHTML = '<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-700 border border-slate-300">Finalizada</span>'`
- Add `opacity-65 grayscale-[30%] bg-slate-50/80 hover:opacity-100 hover:grayscale-0 transition-all` to `<article class="race-card ...">`.

If `timeStatus.esEnCurso`:
- Set `statusBadgeHTML = '<span class="px-2.5 py-1 rounded-full text-xs font-black bg-blue-600 text-white border border-blue-500 shadow-sm animate-pulse flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-white animate-ping"></span> En Curso</span>'`

In `renderDetailView`:
If `timeStatus.esFinalizada`:
- Render "Finalizada" badge and update CTA button text/notice to indicate event has finished.

- [ ] **Step 3: Update `scratch/qa_test.js` assertions**

Add tests for `getTodayChileDateStr`, `getRaceTimeStatus`, and "Finalizada" badge logic.

- [ ] **Step 4: Run QA tests**

Run: `node "C:\Users\gerit\.gemini\antigravity\brain\3604f2a2-81a1-4697-aafb-d1a49e42ec5e\scratch\qa_test.js"`
Expected: PASS all tests.

- [ ] **Step 5: Commit**

```bash
git add js/ui.js scratch/qa_test.js
git commit -m "feat: add derived time status calculation and Finalizada/En Curso badges in ui.js"
```

---

### Task 2: Add past races toggle in `index.html` and filtering in `js/app.js`

**Files:**
- Modify: `index.html`
- Modify: `js/app.js`
- Modify: `scratch/qa_test.js`

- [ ] **Step 1: Add `#toggle-past-races` control to `index.html`**

In the filter bar controls row in `index.html`:
```html
<label class="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-outline hover:text-primary transition-colors">
  <input type="checkbox" id="toggle-past-races" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer">
  <span>Mostrar carreras pasadas</span>
</label>
```

- [ ] **Step 2: Update `js/app.js` filtering and event handlers**

1. Define `let showPastRaces = false;` in state.
2. In `getFilteredRaces()`:
   Filter out finished races if `showPastRaces` is false:
   ```javascript
   const timeStatus = getRaceTimeStatus(race);
   if (!showPastRaces && timeStatus.esFinalizada) {
     return false;
   }
   ```
3. Bind `#toggle-past-races` change listener in `setupEventHandlers()`:
   ```javascript
   const togglePastBtn = document.getElementById('toggle-past-races');
   if (togglePastBtn) {
     togglePastBtn.addEventListener('change', (e) => {
       showPastRaces = e.target.checked;
       updateCalendar();
     });
   }
   ```

- [ ] **Step 3: Update `scratch/qa_test.js` assertions**

Add tests for `#toggle-past-races` and `showPastRaces` logic.

- [ ] **Step 4: Run QA tests**

Run: `node "C:\Users\gerit\.gemini\antigravity\brain\3604f2a2-81a1-4697-aafb-d1a49e42ec5e\scratch\qa_test.js"`
Expected: PASS all tests.

- [ ] **Step 5: Commit**

```bash
git add index.html js/app.js scratch/qa_test.js
git commit -m "feat: add past races filter toggle to index.html and app.js filtering"
```

---

### Task 3: Update SSR in `api/seo.js`, Bundle JS, Test & Deploy

**Files:**
- Modify: `api/seo.js`
- Modify: `js/bundle.js`

- [ ] **Step 1: Update `renderDetailHtmlSSR` in `api/seo.js`**

Derive `esFinalizada` in SSR to display the "Finalizada" badge in direct URL access.

- [ ] **Step 2: Re-bundle JS with `esbuild`**

Run: `npx esbuild js/app.js --bundle --outfile=js/bundle.js --format=esm --platform=browser --external:@supabase/supabase-js`

- [ ] **Step 3: Run full QA test suite**

Run: `node "C:\Users\gerit\.gemini\antigravity\brain\3604f2a2-81a1-4697-aafb-d1a49e42ec5e\scratch\qa_test.js"`
Expected: PASS all tests.

- [ ] **Step 4: Commit, Push and Deploy to Vercel**

```bash
git commit -am "feat: update SSR for finished races, bundle JS, and deploy"
git push origin main
npx vercel --prod --yes
npx vercel alias set https://<deploy-url> calendariociclista.vercel.app
```
