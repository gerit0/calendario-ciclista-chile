// js/data.js
var REGIONS_CHILE = [
  "Todas las regiones",
  "Regi\xF3n de Arica y Parinacota",
  "Regi\xF3n de Tarapac\xE1",
  "Regi\xF3n de Antofagasta",
  "Regi\xF3n de Atacama",
  "Regi\xF3n de Coquimbo",
  "Regi\xF3n de Valpara\xEDso",
  "Regi\xF3n Metropolitana de Santiago",
  "Regi\xF3n del Libertador General Bernardo O'Higgins",
  "Regi\xF3n del Maule",
  "Regi\xF3n de \xD1uble",
  "Regi\xF3n del Biob\xEDo",
  "Regi\xF3n de La Araucan\xEDa",
  "Regi\xF3n de Los R\xEDos",
  "Regi\xF3n de Los Lagos",
  "Regi\xF3n de Ays\xE9n del General Carlos Ib\xE1\xF1ez del Campo",
  "Regi\xF3n de Magallanes y de la Ant\xE1rtica Chilena"
];
var INITIAL_RACES = [
  {
    id: "race-001",
    name: "Gran Fondo Valle del Elqui",
    discipline: "Ruta",
    date: "2026-10-15",
    month: "Octubre",
    displayDate: "15 de Octubre, 2026",
    region: "Regi\xF3n de Coquimbo",
    city: "Vicu\xF1a",
    distance: "120 km",
    elevation: "1850 m",
    price: 35e3,
    isFree: false,
    status: "Inscripciones Abiertas",
    organizer: "Club Ciclismo Coquimbo",
    registrationUrl: "https://ejemplo.cl/registro/gf-elqui",
    heroImage: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=1200&q=80",
    description: "Una imperdible competencia de gran fondo recorriendo los imponentes paisajes astron\xF3micos y vi\xF1edos del Valle del Elqui con llegada en altitud.",
    categories: ["Elite", "Master A", "Master B", "Master C", "Amateur", "Damas Elite", "Damas Master"],
    participants: 340
  },
  {
    id: "race-002",
    name: "Desaf\xEDo Transandes MTB Chilo\xE9",
    discipline: "MTB",
    date: "2026-11-20",
    month: "Noviembre",
    displayDate: "20 - 22 de Noviembre, 2026",
    region: "Regi\xF3n de Los Lagos",
    city: "Castro",
    distance: "85 km",
    elevation: "2400 m",
    price: 45e3,
    isFree: false,
    status: "Inscripciones Abiertas",
    organizer: "Austral Bike Chile",
    registrationUrl: "https://ejemplo.cl/registro/transandes-chiloe",
    heroImage: "https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=1200&q=80",
    description: "Tres d\xEDas de puro XCM cruzando los bosques nativos, palafitos y senderos ancestrales de la m\xEDtica Isla Grande de Chilo\xE9.",
    categories: ["Pro Elite", "Varones A", "Varones B", "Damas Pro", "Duplas Mixtas"],
    participants: 210
  },
  {
    id: "race-003",
    name: "Gravel Pac\xEDfico Central",
    discipline: "Gravel",
    date: "2026-09-05",
    month: "Septiembre",
    displayDate: "5 de Septiembre, 2026",
    region: "Regi\xF3n de Valpara\xEDso",
    city: "Zapallar",
    distance: "105 km",
    elevation: "1400 m",
    price: 28e3,
    isFree: false,
    status: "Pr\xF3ximamente",
    organizer: "Gravel Chile Club",
    registrationUrl: "https://ejemplo.cl/registro/gravel-pacifico",
    heroImage: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80",
    description: "Aventura costera por caminos rurales de tierra, huertos de paltos y acantilados sobre el Oc\xE9ano Pac\xEDfico.",
    categories: ["Gravel Open", "Gravel Master", "Gravel Damas", "E-Bike Gravel"],
    participants: 180
  },
  {
    id: "race-004",
    name: "Copa Pista Vel\xF3dromo Pe\xF1alol\xE9n",
    discipline: "Pista",
    date: "2026-08-12",
    month: "Agosto",
    displayDate: "12 de Agosto, 2026",
    region: "Regi\xF3n Metropolitana de Santiago",
    city: "Pe\xF1alol\xE9n",
    distance: "20 km",
    elevation: "0 m",
    price: 0,
    isFree: true,
    status: "Inscripciones Abiertas",
    organizer: "Federaci\xF3n Nacional de Ciclismo",
    registrationUrl: "https://ejemplo.cl/registro/copa-pista-penalolen",
    heroImage: "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=1200&q=80",
    description: "Competencia de velocidad, persecuci\xF3n y prueba de eliminaci\xF3n en la madera bajo techo del Vel\xF3dromo de Pe\xF1alol\xE9n.",
    categories: ["Junior", "Sub-23", "Elite Varones", "Elite Damas"],
    participants: 95
  },
  {
    id: "race-005",
    name: "Nacional BMX Racing \xD1u\xF1oa",
    discipline: "BMX",
    date: "2026-10-28",
    month: "Octubre",
    displayDate: "28 de Octubre, 2026",
    region: "Regi\xF3n Metropolitana de Santiago",
    city: "\xD1u\xF1oa",
    distance: "400 m",
    elevation: "5 m",
    price: 15e3,
    isFree: false,
    status: "Inscripciones Abiertas",
    organizer: "BMX Chile Federation",
    registrationUrl: "https://ejemplo.cl/registro/nacional-bmx",
    heroImage: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80",
    description: "Fecha clasificatoria nacional de BMX Racing con arranques explosivos en el partido t\xE9cnico del Estadio Nacional.",
    categories: ["Challenger 7-8", "Challenger 13-14", "Junior", "Elite Pro"],
    participants: 150
  },
  {
    id: "race-006",
    name: "Chile Zwift Virtual League - Fecha 4",
    discipline: "Virtual",
    date: "2026-08-30",
    month: "Agosto",
    displayDate: "30 de Agosto, 2026",
    region: "Todas las regiones",
    city: "Online (Zwift)",
    distance: "45 km",
    elevation: "650 m",
    price: 0,
    isFree: true,
    status: "Inscripciones Abiertas",
    organizer: "E-Sports Cycling Chile",
    registrationUrl: "https://ejemplo.cl/registro/zwift-chile-f4",
    heroImage: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=80",
    description: "Competencia virtual oficial sincr\xF3nica por potencia e-cycling con transmisi\xF3n en vivo y r\xE1nkings acumulativos.",
    categories: ["Cat A (+4.0 W/kg)", "Cat B (3.2-3.9 W/kg)", "Cat C (2.5-3.1 W/kg)", "Damas Open"],
    participants: 420
  },
  {
    id: "race-007",
    name: "Ascenso Farellones Challenge",
    discipline: "Ruta",
    date: "2026-11-08",
    month: "Noviembre",
    displayDate: "8 de Noviembre, 2026",
    region: "Regi\xF3n Metropolitana de Santiago",
    city: "Lo Barnechea",
    distance: "32 km",
    elevation: "1980 m",
    price: 32e3,
    isFree: false,
    status: "Cupos Agotados",
    organizer: "Andes Cycling Promotions",
    registrationUrl: "https://ejemplo.cl/registro/ascenso-farellones",
    heroImage: "https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=1200&q=80",
    description: "El m\xEDtico desaf\xEDo de 40 curvas desde la curva 0 hasta Farellones. La escalada en ruta m\xE1s emblem\xE1tica de la capital.",
    categories: ["Elite", "Master A", "Master B", "Master C", "Damas", "Cicloturismo"],
    participants: 600
  },
  {
    id: "race-008",
    name: "Epic Araucan\xEDa MTB Marathon",
    discipline: "MTB",
    date: "2026-12-05",
    month: "Diciembre",
    displayDate: "5 de Diciembre, 2026",
    region: "Regi\xF3n de La Araucan\xEDa",
    city: "Puc\xF3n",
    distance: "70 km",
    elevation: "2100 m",
    price: 38e3,
    isFree: false,
    status: "Pr\xF3ximamente",
    organizer: "Volcano Bike Race",
    registrationUrl: "https://ejemplo.cl/registro/epic-araucania",
    heroImage: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80",
    description: "Ruta volc\xE1nica a los pies del Volc\xE1n Villarrica, sorteando arena volc\xE1nica, senderos de araucarias y lechos de r\xEDos.",
    categories: ["XCM Elite", "XCM Master", "XCM Damas", "XCO Promocional"],
    participants: 280
  }
];

// js/supabase.js
import { createClient } from "@supabase/supabase-js";
var DEFAULT_URL = "";
var DEFAULT_ANON_KEY = "";
var supabaseInstance = null;
function getCredentials() {
  const url = typeof window !== "undefined" && window.SUPABASE_URL ? String(window.SUPABASE_URL).trim() : DEFAULT_URL;
  const key = typeof window !== "undefined" && window.SUPABASE_ANON_KEY ? String(window.SUPABASE_ANON_KEY).trim() : DEFAULT_ANON_KEY;
  return { url, key };
}
function isSupabaseConfigured() {
  const { url, key } = getCredentials();
  if (!url || !key) return false;
  if (url.includes("YOUR_SUPABASE_URL") || key.includes("YOUR_SUPABASE_ANON_KEY")) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch (e) {
    return false;
  }
}
function getSupabase() {
  if (supabaseInstance) return supabaseInstance;
  if (!isSupabaseConfigured()) return null;
  const { url, key } = getCredentials();
  try {
    supabaseInstance = createClient(url, key);
    return supabaseInstance;
  } catch (error) {
    console.error("Error al inicializar el cliente de Supabase:", error);
    return null;
  }
}
function mapSupabaseToFrontend(row) {
  const priceNum = row.precio != null ? Number(row.precio) : 0;
  let displayDate = row.fecha || "";
  let month = "";
  if (row.fecha) {
    try {
      const d = /* @__PURE__ */ new Date(row.fecha + "T00:00:00");
      if (!isNaN(d.getTime())) {
        const monthName = d.toLocaleDateString("es-CL", { month: "long" });
        month = monthName.charAt(0).toUpperCase() + monthName.slice(1);
        displayDate = d.toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" });
      }
    } catch (e) {
      displayDate = row.fecha;
    }
  }
  let categories = [];
  if (Array.isArray(row.categoria)) {
    categories = row.categoria;
  } else if (typeof row.categoria === "string" && row.categoria.trim() !== "") {
    categories = row.categoria.split(",").map((c) => c.trim());
  } else {
    categories = ["General"];
  }
  return {
    id: row.id,
    name: row.nombre || "",
    discipline: row.disciplina || "",
    date: row.fecha || "",
    month,
    displayDate,
    region: row.region || "",
    city: row.ubicacion || "",
    distance: row.distancia || "N/A",
    elevation: row.desnivel || "N/A",
    price: priceNum,
    isFree: priceNum === 0,
    status: row.status || (row.estado === "aprobada" ? "Inscripciones Abiertas" : row.estado),
    organizer: row.organizador || "",
    registrationUrl: row.link_inscripcion || "",
    heroImage: row.hero_image || "",
    description: row.descripcion || "",
    categories,
    participants: row.participantes != null ? row.participantes : 0
  };
}
async function fetchApprovedRacesSupabase() {
  const client = getSupabase();
  if (!client) {
    console.warn("Supabase no est\xE1 configurado. Retornando array vac\xEDo.");
    return [];
  }
  try {
    const hoy = /* @__PURE__ */ new Date();
    const fechaDesde = `${hoy.getFullYear()}-01-01`;
    const fechaHasta = `${hoy.getFullYear() + 1}-12-31`;
    const { data, error } = await client.from("carreras").select("*").eq("estado", "aprobada").gte("fecha", fechaDesde).lte("fecha", fechaHasta).order("fecha", { ascending: true }).limit(500);
    if (error) {
      console.error("Error al consultar carreras aprobadas en Supabase:", error);
      return [];
    }
    if (!Array.isArray(data)) return [];
    return data.map(mapSupabaseToFrontend);
  } catch (err) {
    console.error("Excepci\xF3n al consultar carreras en Supabase:", err);
    return [];
  }
}
async function createPendingRaceSupabase(raceData) {
  const client = getSupabase();
  if (!client) {
    return {
      success: false,
      error: new Error("Supabase no est\xE1 configurado.")
    };
  }
  try {
    const payload = {
      nombre: raceData.nombre || raceData.name,
      fecha: raceData.fecha || raceData.date,
      disciplina: raceData.disciplina || raceData.discipline,
      region: raceData.region || null,
      ubicacion: raceData.ubicacion || raceData.city || null,
      organizador: raceData.organizador || raceData.organizer || null,
      link_inscripcion: raceData.link_inscripcion || raceData.registrationUrl || null,
      categoria: Array.isArray(raceData.categories) ? raceData.categories.join(", ") : raceData.categoria || raceData.categories || null,
      precio: raceData.precio != null ? raceData.precio : raceData.price != null ? raceData.price : 0,
      hero_image: raceData.hero_image || raceData.heroImage || null,
      descripcion: raceData.descripcion || raceData.description || null,
      estado: "pendiente"
    };
    const { data, error } = await client.from("carreras").insert([payload]).select();
    if (error) {
      console.error("Error al insertar carrera pendiente en Supabase:", error);
      return { success: false, error: error.message || error };
    }
    return {
      success: true,
      data: data && data.length > 0 ? data[0] : null
    };
  } catch (err) {
    console.error("Excepci\xF3n al crear carrera pendiente en Supabase:", err);
    return { success: false, error: err.message || err };
  }
}

// js/storage.js
var BOOKMARKS_KEY = "calendariociclista_bookmarks";
var CUSTOM_RACES_KEY = "calendariociclista_custom_races";
function getBookmarkedIds() {
  try {
    const data = localStorage.getItem(BOOKMARKS_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Error leyendo bookmarks de localStorage:", error);
    return [];
  }
}
function toggleBookmark(raceId) {
  if (!raceId) return getBookmarkedIds();
  const bookmarks = getBookmarkedIds();
  const index = bookmarks.indexOf(raceId);
  if (index >= 0) {
    bookmarks.splice(index, 1);
  } else {
    bookmarks.push(raceId);
  }
  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  } catch (error) {
    console.error("Error guardando bookmarks en localStorage:", error);
  }
  return bookmarks;
}
function isBookmarked(raceId) {
  if (!raceId) return false;
  const bookmarks = getBookmarkedIds();
  return bookmarks.includes(raceId);
}
function getCustomRaces() {
  try {
    const data = localStorage.getItem(CUSTOM_RACES_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Error leyendo custom races de localStorage:", error);
    return [];
  }
}
function saveCustomRace(newRace) {
  if (!newRace) return getCustomRaces();
  const customRaces = getCustomRaces();
  customRaces.unshift(newRace);
  try {
    localStorage.setItem(CUSTOM_RACES_KEY, JSON.stringify(customRaces));
  } catch (error) {
    console.error("Error guardando custom race en localStorage:", error);
  }
  return customRaces;
}
async function getAllRaces() {
  let supabaseRaces = [];
  if (isSupabaseConfigured()) {
    try {
      supabaseRaces = await fetchApprovedRacesSupabase();
    } catch (error) {
      console.error("Error al obtener carreras desde Supabase:", error);
    }
  }
  const customRaces = getCustomRaces();
  const combined = [...supabaseRaces, ...customRaces, ...INITIAL_RACES];
  const seenIds = /* @__PURE__ */ new Set();
  const uniqueRaces = [];
  for (const race of combined) {
    if (race && race.id && !seenIds.has(race.id)) {
      seenIds.add(race.id);
      uniqueRaces.push(race);
    }
  }
  return uniqueRaces;
}
async function saveRace(newRace) {
  if (!newRace) return { success: false, source: "none" };
  if (isSupabaseConfigured()) {
    try {
      const res = await createPendingRaceSupabase(newRace);
      if (res && res.success) {
        return { success: true, source: "supabase", data: res.data };
      }
    } catch (error) {
      console.error("Error al enviar carrera a Supabase. Realizando fallback a localStorage:", error);
    }
  }
  const savedLocal = saveCustomRace(newRace);
  return { success: true, source: "localStorage", data: savedLocal };
}

// js/ui.js
var DISCIPLINES = ["Todas", "Ruta", "MTB", "Gravel", "Pista", "BMX", "Virtual"];
function formatPrice(price, isFree) {
  if (isFree || !price || price === 0) {
    return "Gratis";
  }
  return "$" + Number(price).toLocaleString("es-CL");
}
function getDisciplineBadgeClass(discipline) {
  switch (discipline) {
    case "Ruta":
      return "bg-[#181919] text-white";
    case "MTB":
      return "bg-[#a73918] text-white";
    case "Gravel":
      return "bg-[#1b4332] text-white";
    case "Pista":
      return "bg-[#334155] text-white";
    case "BMX":
      return "bg-[#d97706] text-white";
    case "Virtual":
      return "bg-[#2563eb] text-white";
    default:
      return "bg-gray-800 text-white";
  }
}
function getDisciplineIcon(discipline) {
  switch (discipline) {
    case "Ruta":
      return "directions_bike";
    case "MTB":
      return "terrain";
    case "Gravel":
      return "explore";
    case "Pista":
      return "sports_score";
    case "BMX":
      return "two_wheeler";
    case "Virtual":
      return "devices";
    default:
      return "directions_bike";
  }
}
function renderDisciplineChips(container, activeDiscipline = "Todas") {
  if (!container) return;
  container.innerHTML = DISCIPLINES.map((discipline) => {
    const isActive = discipline === activeDiscipline;
    const activeClasses = "bg-primary text-tertiary-fixed font-bold shadow-sm ring-2 ring-primary";
    const inactiveClasses = "bg-white text-primary hover:bg-surface-container border border-outline-variant/40 font-medium";
    return `
      <button 
        type="button" 
        data-discipline="${discipline}" 
        class="chip-discipline px-4 py-2 rounded-xl text-xs sm:text-sm transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${isActive ? activeClasses : inactiveClasses}"
      >
        <span class="material-symbols-outlined text-base">${discipline === "Todas" ? "apps" : getDisciplineIcon(discipline)}</span>
        ${discipline}
      </button>
    `;
  }).join("");
}
function renderRegionSelect(container, regions = [], activeRegion = "Todas las regiones") {
  if (!container) return;
  const selectElem = container.tagName === "SELECT" ? container : container.querySelector("select");
  if (!selectElem) return;
  selectElem.innerHTML = regions.map((region) => `
    <option value="${region}" ${region === activeRegion ? "selected" : ""}>
      ${region}
    </option>
  `).join("");
}
function renderRaceCards(container, races = []) {
  if (!container) return;
  if (races.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center bg-white rounded-3xl border border-dashed border-outline-variant/60 p-8 space-y-4">
        <div class="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mx-auto text-outline">
          <span class="material-symbols-outlined text-4xl">search_off</span>
        </div>
        <h3 class="font-display font-bold text-xl text-primary">No se encontraron carreras</h3>
        <p class="text-outline text-sm max-w-md mx-auto">
          Intenta cambiar los filtros de disciplina, regi\xF3n, mes o t\xE9rmino de b\xFAsqueda.
        </p>
      </div>
    `;
    return;
  }
  container.innerHTML = races.map((race) => {
    const bookmarked = isBookmarked(race.id);
    const disciplineBadgeClass = getDisciplineBadgeClass(race.discipline);
    const formattedPrice = formatPrice(race.price, race.isFree);
    let statusBadgeHTML = "";
    if (race.status === "\xDAltimos Cupos") {
      statusBadgeHTML = `<span class="px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">\xDAltimos Cupos</span>`;
    } else if (race.status === "Inscripciones Abiertas") {
      statusBadgeHTML = `<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">Inscripciones Abiertas</span>`;
    } else if (race.status === "Cupos Agotados") {
      statusBadgeHTML = `<span class="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">Cupos Agotados</span>`;
    } else {
      statusBadgeHTML = `<span class="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">${race.status || "Pr\xF3ximamente"}</span>`;
    }
    const freeBadgeHTML = race.isFree || race.price === 0 ? `<span class="px-2.5 py-1 rounded-full text-xs font-black bg-tertiary-fixed text-primary border border-lime-400">Gratuita</span>` : "";
    return `
      <article class="race-card bg-white rounded-3xl border border-outline-variant/40 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
        
        <!-- Hero Image Header -->
        <div class="relative h-48 w-full overflow-hidden bg-surface-container">
          <img 
            src="${race.heroImage || "https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=800&q=80"}" 
            alt="${race.name}" 
            loading="lazy"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          >
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          
          <!-- Badges superiores (Disciplina y Gratuita) -->
          <div class="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            <span class="px-3 py-1 rounded-lg text-xs font-bold shadow-md flex items-center gap-1 ${disciplineBadgeClass}">
              <span class="material-symbols-outlined text-sm">${getDisciplineIcon(race.discipline)}</span>
              ${race.discipline}
            </span>
            ${freeBadgeHTML}
          </div>

          <!-- Bot\xF3n Bookmark / Favorito -->
          <button 
            type="button" 
            data-bookmark-id="${race.id}" 
            aria-label="Guardar en favoritos" 
            class="btn-bookmark absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-primary hover:bg-white flex items-center justify-center shadow-md transition-all active:scale-90 z-10"
          >
            <span class="material-symbols-outlined ${bookmarked ? "filled text-secondary" : "text-outline"}">
              ${bookmarked ? "bookmark" : "bookmark_border"}
            </span>
          </button>

          <!-- Fecha y Ubicaci\xF3n sobre la imagen -->
          <div class="absolute bottom-3 left-3 right-3 text-white z-10 flex items-center justify-between text-xs">
            <span class="font-bold flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-md">
              <span class="material-symbols-outlined text-sm text-tertiary-fixed">calendar_today</span>
              ${race.displayDate || race.date}
            </span>
            <span class="font-medium bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-md truncate max-w-[50%]">
              ${race.city}
            </span>
          </div>

        </div>

        <!-- Card Body -->
        <div class="p-6 flex-grow flex flex-col justify-between space-y-4">
          
          <div class="space-y-2">
            <!-- Estado & Precio -->
            <div class="flex items-center justify-between gap-2">
              <div>${statusBadgeHTML}</div>
              <span class="font-display font-black text-lg text-primary">
                ${formattedPrice}
              </span>
            </div>

            <!-- T\xEDtulo de la Carrera -->
            <h3 class="font-display font-bold text-xl text-primary group-hover:text-secondary transition-colors line-clamp-2 leading-snug">
              ${race.name}
            </h3>

            <!-- Especificaciones t\xE9cnicas (Distancia & Desnivel) -->
            <div class="flex items-center gap-4 text-xs font-semibold text-outline pt-1">
              <span class="flex items-center gap-1">
                <span class="material-symbols-outlined text-base">straighten</span>
                ${race.distance}
              </span>
              <span class="flex items-center gap-1">
                <span class="material-symbols-outlined text-base">landscape</span>
                ${race.elevation}
              </span>
              <span class="flex items-center gap-1 truncate">
                <span class="material-symbols-outlined text-base">map</span>
                ${race.region.replace("Regi\xF3n de ", "").replace("Regi\xF3n del Libertador General ", "").replace("Regi\xF3n del ", "")}
              </span>
            </div>

            <!-- Descripci\xF3n corta -->
            <p class="text-xs text-gray-600 line-clamp-2 leading-relaxed pt-1">
              ${race.description}
            </p>
          </div>

          <!-- Card Footer & CTA -->
          <div class="pt-4 border-t border-outline-variant/30 flex items-center gap-2">
            <button 
              type="button" 
              data-race-id="${race.id}" 
              class="btn-view-detail w-full bg-[#d8ef00] text-[#181919] font-display font-bold text-sm hover:brightness-105 shadow-sm rounded-xl py-3 px-4 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              Ver Detalle
              <span class="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>

        </div>

      </article>
    `;
  }).join("");
}
function renderDetailView(container, race) {
  if (!container || !race) return;
  const bookmarked = isBookmarked(race.id);
  const disciplineBadgeClass = getDisciplineBadgeClass(race.discipline);
  const formattedPrice = formatPrice(race.price, race.isFree);
  const categoriesHTML = Array.isArray(race.categories) && race.categories.length > 0 ? race.categories.map((cat) => `
        <span class="px-3 py-1 rounded-lg bg-surface-container text-primary font-semibold text-xs border border-outline-variant/40">
          ${cat}
        </span>
      `).join("") : '<span class="text-xs text-outline italic">Categor\xEDas por confirmar</span>';
  container.innerHTML = `
    <div class="space-y-8 animate-fadeIn">
      
      <!-- Back Button & Actions Bar -->
      <div class="flex items-center justify-between">
        <button 
          type="button" 
          id="btn-back-to-calendar" 
          class="px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-display font-bold text-sm flex items-center gap-2 transition-colors"
        >
          <span class="material-symbols-outlined text-lg">arrow_back</span>
          Volver a Carreras
        </button>

        <button 
          type="button" 
          data-bookmark-id="${race.id}" 
          class="btn-bookmark px-4 py-2.5 rounded-xl bg-white border border-outline-variant/50 text-primary font-display font-bold text-sm flex items-center gap-2 hover:bg-surface-container transition-all shadow-sm"
        >
          <span class="material-symbols-outlined ${bookmarked ? "filled text-secondary" : "text-outline"}">
            ${bookmarked ? "bookmark" : "bookmark_border"}
          </span>
          ${bookmarked ? "Guardada en Agenda" : "Guardar en Agenda"}
        </button>
      </div>

      <!-- Hero Banner Details -->
      <div class="relative rounded-3xl bg-primary text-white overflow-hidden shadow-2xl">
        <div class="relative h-72 sm:h-96 w-full">
          <img 
            src="${race.heroImage || "https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=1600&q=80"}" 
            alt="${race.name}" 
            class="w-full h-full object-cover"
          >
          <div class="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent"></div>
          
          <!-- Badges superiores -->
          <div class="absolute top-6 left-6 flex flex-wrap gap-2 z-10">
            <span class="px-3.5 py-1.5 rounded-xl text-xs font-extrabold shadow-lg flex items-center gap-1.5 ${disciplineBadgeClass}">
              <span class="material-symbols-outlined text-base">${getDisciplineIcon(race.discipline)}</span>
              ${race.discipline}
            </span>
            ${race.isFree ? `<span class="px-3.5 py-1.5 rounded-xl text-xs font-black bg-tertiary-fixed text-primary shadow-lg">Evento Gratuito</span>` : ""}
          </div>

          <!-- Informaci\xF3n Overlay sobre banner -->
          <div class="absolute bottom-6 left-6 right-6 z-10 space-y-3">
            <div class="flex items-center gap-2 text-tertiary-fixed font-display font-bold text-xs uppercase tracking-widest">
              <span class="material-symbols-outlined text-sm">location_on</span>
              ${race.city}, ${race.region}
            </div>
            <h1 class="text-2xl sm:text-4xl md:text-5xl font-display font-black tracking-tight text-white leading-tight">
              ${race.name}
            </h1>
          </div>

        </div>
      </div>

      <!-- Grid Principal: Detalles y Sidebar CTA -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Columna Izquierda: Informaci\xF3n Completa -->
        <div class="lg:col-span-8 space-y-8">
          
          <!-- Stats R\xE1pidos -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-white rounded-3xl border border-outline-variant/40 shadow-sm text-center">
            <div class="space-y-1">
              <span class="material-symbols-outlined text-secondary text-2xl">calendar_month</span>
              <p class="text-xs font-bold text-outline uppercase">Fecha</p>
              <p class="font-display font-bold text-sm text-primary">${race.displayDate || race.date}</p>
            </div>
            <div class="space-y-1">
              <span class="material-symbols-outlined text-secondary text-2xl">straighten</span>
              <p class="text-xs font-bold text-outline uppercase">Distancia</p>
              <p class="font-display font-bold text-sm text-primary">${race.distance}</p>
            </div>
            <div class="space-y-1">
              <span class="material-symbols-outlined text-secondary text-2xl">landscape</span>
              <p class="text-xs font-bold text-outline uppercase">Desnivel</p>
              <p class="font-display font-bold text-sm text-primary">${race.elevation}</p>
            </div>
            <div class="space-y-1">
              <span class="material-symbols-outlined text-secondary text-2xl">group</span>
              <p class="text-xs font-bold text-outline uppercase">Inscriptos</p>
              <p class="font-display font-bold text-sm text-primary">${race.participants || 0}+ ciclistas</p>
            </div>
          </div>

          <!-- Descripci\xF3n del Evento -->
          <div class="bg-white p-6 sm:p-8 rounded-3xl border border-outline-variant/40 shadow-sm space-y-4">
            <h3 class="font-display font-bold text-xl text-primary flex items-center gap-2">
              <span class="material-symbols-outlined text-secondary">description</span>
              Sobre la Competencia
            </h3>
            <p class="text-gray-700 text-base leading-relaxed whitespace-pre-line">
              ${race.description}
            </p>
          </div>

          <!-- Categor\xEDas Disponibles -->
          <div class="bg-white p-6 sm:p-8 rounded-3xl border border-outline-variant/40 shadow-sm space-y-4">
            <h3 class="font-display font-bold text-xl text-primary flex items-center gap-2">
              <span class="material-symbols-outlined text-secondary">military_tech</span>
              Categor\xEDas Habilitadas
            </h3>
            <div class="flex flex-wrap gap-2">
              ${categoriesHTML}
            </div>
          </div>

        </div>

        <!-- Columna Derecha: Sidebar Inscripci\xF3n & Organizador -->
        <div class="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
          
          <div class="bg-white p-6 sm:p-8 rounded-3xl border border-outline-variant/40 shadow-lg space-y-6">
            
            <div class="space-y-1">
              <span class="text-xs font-bold text-outline uppercase tracking-wider">Precio de Inscripci\xF3n</span>
              <div class="font-display font-black text-3xl text-primary">
                ${formattedPrice}
              </div>
            </div>

            <div class="space-y-3 pt-2">
              <div class="flex justify-between items-center text-sm py-2 border-b border-outline-variant/30">
                <span class="text-outline font-medium">Estado:</span>
                <span class="font-bold text-primary">${race.status}</span>
              </div>
              <div class="flex justify-between items-center text-sm py-2 border-b border-outline-variant/30">
                <span class="text-outline font-medium">Organiza:</span>
                <span class="font-bold text-primary truncate max-w-[60%]">${race.organizer}</span>
              </div>
              <div class="flex justify-between items-center text-sm py-2">
                <span class="text-outline font-medium">Ubicaci\xF3n:</span>
                <span class="font-bold text-primary">${race.city}</span>
              </div>
            </div>

            <!-- CTA Button -->
            <a 
              href="${race.registrationUrl || "#"}" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="w-full bg-[#d8ef00] text-[#181919] font-display font-bold text-base hover:brightness-105 shadow-md rounded-2xl py-4 px-6 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              Ir a Formulario de Inscripci\xF3n
              <span class="material-symbols-outlined text-xl">open_in_new</span>
            </a>

            <p class="text-[11px] text-center text-outline leading-tight">
              Ser\xE1s redirigido al sitio web oficial del organizador para completar tu registro.
            </p>

          </div>

        </div>

      </div>

    </div>
  `;
}
function switchView(viewName) {
  const viewCalendar = document.getElementById("view-calendar");
  const viewDetail = document.getElementById("view-detail");
  const viewRegister = document.getElementById("view-register");
  const navExplore = document.getElementById("nav-explore");
  const navAgenda = document.getElementById("nav-agenda");
  const navRegister = document.getElementById("nav-register");
  if (viewCalendar) viewCalendar.classList.add("hidden");
  if (viewDetail) viewDetail.classList.add("hidden");
  if (viewRegister) viewRegister.classList.add("hidden");
  const inactiveNavClasses = "text-outline hover:text-primary hover:bg-surface-container-low";
  const activeNavClasses = "text-primary bg-surface-container-low font-bold";
  if (navExplore) navExplore.className = `nav-btn px-4 py-2 rounded-lg font-display font-bold text-sm transition-colors flex items-center gap-2 ${viewName === "calendar" ? activeNavClasses : inactiveNavClasses}`;
  if (navAgenda) navAgenda.className = `nav-btn px-4 py-2 rounded-lg font-display font-bold text-sm transition-colors flex items-center gap-2 ${viewName === "agenda" ? activeNavClasses : inactiveNavClasses}`;
  if (viewName === "calendar" || viewName === "agenda") {
    if (viewCalendar) viewCalendar.classList.remove("hidden");
  } else if (viewName === "detail") {
    if (viewDetail) viewDetail.classList.remove("hidden");
  } else if (viewName === "register") {
    if (viewRegister) viewRegister.classList.remove("hidden");
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// js/validation.js
var VALID_DISCIPLINES = ["Ruta", "MTB", "Gravel", "Pista", "BMX", "Virtual"];
function sanitizeHTML(str) {
  if (typeof str !== "string") return "";
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  return str.trim().replace(/[&<>"']/g, (match) => map[match]);
}
function isValidURL(urlStr) {
  if (!urlStr || typeof urlStr !== "string") return true;
  const trimmed = urlStr.trim();
  if (trimmed === "") return true;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}
function validateRaceForm(data) {
  const raw = data || {};
  const errors = {};
  const sanitizedData = {};
  const name = sanitizeHTML(raw.name);
  sanitizedData.name = name;
  if (!name || name.length < 3 || name.length > 100) {
    errors.name = "El nombre de la carrera debe tener entre 3 y 100 caracteres.";
  }
  const discipline = typeof raw.discipline === "string" ? raw.discipline.trim() : "";
  sanitizedData.discipline = discipline;
  if (!VALID_DISCIPLINES.includes(discipline)) {
    errors.discipline = "Debe seleccionar una disciplina v\xE1lida (Ruta, MTB, Gravel, Pista, BMX, Virtual).";
  }
  const dateStr = typeof raw.date === "string" ? raw.date.trim() : "";
  sanitizedData.date = dateStr;
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateStr || !dateRegex.test(dateStr) || isNaN(Date.parse(dateStr))) {
    errors.date = "La fecha debe tener un formato v\xE1lido (AAAA-MM-DD).";
  }
  const region = sanitizeHTML(raw.region);
  sanitizedData.region = region;
  if (!region) {
    errors.region = "La regi\xF3n es obligatoria.";
  }
  const organizador = sanitizeHTML(raw.organizador);
  sanitizedData.organizador = organizador;
  if (!organizador || organizador.length < 2 || organizador.length > 100) {
    errors.organizador = "El organizador debe tener entre 2 y 100 caracteres.";
  }
  const registrationUrl = typeof raw.registrationUrl === "string" ? raw.registrationUrl.trim() : "";
  sanitizedData.registrationUrl = registrationUrl;
  if (!isValidURL(registrationUrl)) {
    errors.registrationUrl = "La URL de inscripci\xF3n debe ser una URL v\xE1lida con protocolo http: o https:.";
  }
  const city = sanitizeHTML(raw.city);
  sanitizedData.city = city;
  if (!city || city.length < 1 || city.length > 100) {
    errors.city = "La ciudad / comuna es obligatoria (m\xE1ximo 100 caracteres).";
  }
  const distance = sanitizeHTML(raw.distance);
  sanitizedData.distance = distance;
  if (!distance || distance.length < 1 || distance.length > 30) {
    errors.distance = "La distancia es obligatoria (ej: 120 km) y no puede superar 30 caracteres.";
  }
  const description = sanitizeHTML(raw.description);
  sanitizedData.description = description;
  if (!description || description.length < 10 || description.length > 2e3) {
    errors.description = "La descripci\xF3n es obligatoria (entre 10 y 2000 caracteres).";
  }
  sanitizedData.elevation = sanitizeHTML(raw.elevation);
  sanitizedData.price = sanitizeHTML(raw.price);
  sanitizedData.heroImage = sanitizeHTML(raw.heroImage);
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData
  };
}

// js/app.js
var currentDiscipline = "Todas";
var currentRegion = "Todas las regiones";
var currentMonth = "Todos";
var searchQuery = "";
var activeTab = "all";
var currentRaceId = null;
function clearFormErrors(form) {
  if (!form) return;
  form.querySelectorAll(".field-error-msg").forEach((el) => el.remove());
  form.querySelectorAll("input, select, textarea").forEach((input) => {
    input.classList.remove("border-secondary", "ring-1", "ring-secondary");
  });
}
function renderFormErrors(form, errors) {
  clearFormErrors(form);
  if (!form || !errors) return;
  const fieldMap = {
    name: "name",
    discipline: "discipline",
    date: "date",
    region: "region",
    organizador: "organizer",
    organizer: "organizer",
    registrationUrl: "registrationUrl",
    city: "city",
    distance: "distance",
    description: "description"
  };
  for (const [key, errorMsg] of Object.entries(errors)) {
    const fieldName = fieldMap[key] || key;
    const inputElem = form.querySelector(`[name="${fieldName}"]`) || form.querySelector(`#form-${fieldName}`);
    if (inputElem) {
      inputElem.classList.add("border-secondary", "ring-1", "ring-secondary");
      const errEl = document.createElement("p");
      errEl.className = "field-error-msg text-secondary text-xs font-semibold mt-1 flex items-center gap-1";
      errEl.innerHTML = `<span class="material-symbols-outlined text-sm">error</span> ${errorMsg}`;
      if (inputElem.parentNode) {
        inputElem.parentNode.appendChild(errEl);
      }
    }
  }
}
function showNotificationToast(message) {
  const existing = document.getElementById("toast-notification");
  if (existing) existing.remove();
  const toast = document.createElement("div");
  toast.id = "toast-notification";
  toast.className = "fixed bottom-6 right-6 z-50 max-w-lg bg-primary text-white p-5 rounded-2xl shadow-2xl border border-tertiary-fixed/50 flex items-start gap-4 transition-all duration-300 transform translate-y-0";
  toast.innerHTML = `
    <div class="w-10 h-10 rounded-xl bg-tertiary-fixed text-primary flex items-center justify-center flex-shrink-0 font-bold shadow-md">
      <span class="material-symbols-outlined text-2xl">published_with_changes</span>
    </div>
    <div class="flex-grow text-sm space-y-1">
      <h4 class="font-display font-bold text-tertiary-fixed text-base">Notificaci\xF3n del Sistema</h4>
      <p class="text-gray-200 leading-relaxed font-medium">${message}</p>
    </div>
    <button type="button" id="close-toast-btn" aria-label="Cerrar notificaci\xF3n" class="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
      <span class="material-symbols-outlined text-xl">close</span>
    </button>
  `;
  document.body.appendChild(toast);
  const closeBtn = toast.querySelector("#close-toast-btn");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      toast.remove();
    });
  }
  setTimeout(() => {
    if (document.body.contains(toast)) {
      toast.classList.add("opacity-0", "translate-y-2");
      setTimeout(() => {
        if (document.body.contains(toast)) toast.remove();
      }, 300);
    }
  }, 9e3);
}
async function getFilteredRaces() {
  const races = await getAllRaces();
  const bookmarkedIds = getBookmarkedIds();
  return races.filter((race) => {
    if (activeTab === "my-calendar" || activeTab === "agenda") {
      if (!bookmarkedIds.includes(race.id)) {
        return false;
      }
    }
    if (currentDiscipline && currentDiscipline !== "Todas") {
      if (race.discipline !== currentDiscipline) {
        return false;
      }
    }
    if (currentRegion && currentRegion !== "Todas las regiones") {
      if (race.region !== currentRegion) {
        return false;
      }
    }
    if (currentMonth && currentMonth !== "Todos") {
      let raceMonthYear = race.monthYear || "";
      if (!raceMonthYear && race.date) {
        const dateObj = /* @__PURE__ */ new Date(race.date + "T00:00:00");
        const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        raceMonthYear = `${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
      }
      const matchMonthYear = raceMonthYear === currentMonth;
      const matchMonthOnly = currentMonth.split(" ").length === 1 && raceMonthYear.startsWith(currentMonth);
      if (!matchMonthYear && !matchMonthOnly) {
        return false;
      }
    }
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      const matchName = race.name ? race.name.toLowerCase().includes(q) : false;
      const matchCity = race.city ? race.city.toLowerCase().includes(q) : false;
      const matchOrganizer = race.organizer || race.organizador ? (race.organizer || race.organizador).toLowerCase().includes(q) : false;
      const matchDescription = race.description ? race.description.toLowerCase().includes(q) : false;
      if (!matchName && !matchCity && !matchOrganizer && !matchDescription) {
        return false;
      }
    }
    return true;
  });
}
async function updateCalendar() {
  const filteredRaces = await getFilteredRaces();
  const racesContainer = document.getElementById("races-container");
  if (racesContainer) {
    renderRaceCards(racesContainer, filteredRaces);
  }
  const countElem = document.getElementById("races-count");
  if (countElem) {
    countElem.textContent = `${filteredRaces.length} carrera${filteredRaces.length === 1 ? "" : "s"}`;
  }
  const agendaBadge = document.getElementById("agenda-badge");
  const bookmarkedCount = getBookmarkedIds().length;
  if (agendaBadge) {
    agendaBadge.textContent = bookmarkedCount;
    if (bookmarkedCount > 0) {
      agendaBadge.classList.remove("hidden");
    } else {
      agendaBadge.classList.add("hidden");
    }
  }
  const calendarTitle = document.getElementById("calendar-title");
  if (calendarTitle) {
    if (activeTab === "my-calendar" || activeTab === "agenda") {
      calendarTitle.textContent = "Mi Agenda de Carreras Guardadas";
    } else {
      calendarTitle.textContent = "Pr\xF3ximas Carreras";
    }
  }
}
function setupEventHandlers() {
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      updateCalendar();
    });
  }
  const regionSelect = document.getElementById("region-select");
  if (regionSelect) {
    regionSelect.addEventListener("change", (e) => {
      currentRegion = e.target.value;
      updateCalendar();
    });
  }
  const monthSelect = document.getElementById("month-select");
  if (monthSelect) {
    monthSelect.addEventListener("change", (e) => {
      currentMonth = e.target.value;
      updateCalendar();
    });
  }
  const disciplineChipsContainer = document.getElementById("discipline-chips");
  if (disciplineChipsContainer) {
    disciplineChipsContainer.addEventListener("click", (e) => {
      const chipBtn = e.target.closest("[data-discipline]");
      if (chipBtn) {
        currentDiscipline = chipBtn.getAttribute("data-discipline");
        renderDisciplineChips(disciplineChipsContainer, currentDiscipline);
        updateCalendar();
      }
    });
  }
  const navExploreIds = ["nav-explore", "mobile-nav-explore"];
  const navAgendaIds = ["nav-agenda", "nav-my-calendar", "mobile-nav-agenda"];
  const navPublishIds = ["nav-register", "nav-publish-btn", "hero-publish-btn", "mobile-nav-register"];
  const navLogoIds = ["brand-logo", "nav-logo"];
  navExploreIds.forEach((id) => {
    const elem = document.getElementById(id);
    if (elem) {
      elem.addEventListener("click", (e) => {
        e.preventDefault();
        activeTab = "all";
        switchView("calendar");
        updateCalendar();
      });
    }
  });
  navAgendaIds.forEach((id) => {
    const elem = document.getElementById(id);
    if (elem) {
      elem.addEventListener("click", (e) => {
        e.preventDefault();
        activeTab = "my-calendar";
        switchView("agenda");
        updateCalendar();
      });
    }
  });
  navPublishIds.forEach((id) => {
    const elem = document.getElementById(id);
    if (elem) {
      elem.addEventListener("click", (e) => {
        e.preventDefault();
        switchView("register");
      });
    }
  });
  navLogoIds.forEach((id) => {
    const elem = document.getElementById(id);
    if (elem) {
      elem.addEventListener("click", (e) => {
        e.preventDefault();
        activeTab = "all";
        switchView("calendar");
        updateCalendar();
      });
    }
  });
  const backFromRegisterBtn = document.getElementById("btn-back-from-register");
  if (backFromRegisterBtn) {
    backFromRegisterBtn.addEventListener("click", () => {
      const raceForm2 = document.getElementById("race-form");
      if (raceForm2) clearFormErrors(raceForm2);
      switchView("calendar");
    });
  }
  const cancelRegisterBtn = document.getElementById("btn-cancel-register");
  if (cancelRegisterBtn) {
    cancelRegisterBtn.addEventListener("click", () => {
      const raceForm2 = document.getElementById("race-form");
      if (raceForm2) clearFormErrors(raceForm2);
      switchView("calendar");
    });
  }
  const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }
  const racesContainer = document.getElementById("races-container");
  if (racesContainer) {
    racesContainer.addEventListener("click", async (e) => {
      const bookmarkBtn = e.target.closest("[data-bookmark-id]");
      if (bookmarkBtn) {
        e.stopPropagation();
        const raceId = bookmarkBtn.getAttribute("data-bookmark-id");
        toggleBookmark(raceId);
        await updateCalendar();
        return;
      }
      const detailBtn = e.target.closest("[data-race-id]");
      if (detailBtn) {
        const raceId = detailBtn.getAttribute("data-race-id");
        const races = await getAllRaces();
        const race = races.find((r) => r.id === raceId);
        if (race) {
          currentRaceId = raceId;
          const detailContainer2 = document.getElementById("detail-content");
          renderDetailView(detailContainer2, race);
          switchView("detail");
        }
      }
    });
  }
  const detailContainer = document.getElementById("detail-content");
  if (detailContainer) {
    detailContainer.addEventListener("click", async (e) => {
      const backBtn = e.target.closest("#btn-back-to-calendar");
      if (backBtn) {
        switchView("calendar");
        await updateCalendar();
        return;
      }
      const bookmarkBtn = e.target.closest("[data-bookmark-id]");
      if (bookmarkBtn) {
        const raceId = bookmarkBtn.getAttribute("data-bookmark-id");
        toggleBookmark(raceId);
        const races = await getAllRaces();
        const race = races.find((r) => r.id === raceId);
        if (race) {
          renderDetailView(detailContainer, race);
        }
        await updateCalendar();
      }
    });
  }
  const raceForm = document.getElementById("race-form");
  if (raceForm) {
    raceForm.noValidate = true;
    raceForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = raceForm.querySelector('[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add("opacity-50", "cursor-not-allowed");
      }
      const formData = new FormData(raceForm);
      const isFree = document.getElementById("form-is-free")?.checked || false;
      const dateStr = formData.get("date") || "";
      const rawFormData = {
        name: formData.get("name") || "",
        discipline: formData.get("discipline") || "",
        date: dateStr,
        region: formData.get("region") || "",
        organizador: formData.get("organizer") || "",
        organizer: formData.get("organizer") || "",
        registrationUrl: formData.get("registrationUrl") || "",
        city: formData.get("city") || "",
        distance: formData.get("distance") || "",
        elevation: formData.get("elevation") || "",
        price: isFree ? 0 : formData.get("price") || 0,
        heroImage: formData.get("heroImage") || "",
        description: formData.get("description") || "",
        categories: formData.get("categories") || ""
      };
      const validationResult = validateRaceForm(rawFormData);
      if (!validationResult.isValid) {
        renderFormErrors(raceForm, validationResult.errors);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove("opacity-50", "cursor-not-allowed");
        }
        const firstError = raceForm.querySelector(".field-error-msg");
        if (firstError) firstError.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      clearFormErrors(raceForm);
      const sanitizedData = validationResult.sanitizedData;
      let monthName = "Todos";
      let monthYear = "";
      let displayDateStr = sanitizedData.date || "";
      if (sanitizedData.date) {
        try {
          const dateObj = /* @__PURE__ */ new Date(sanitizedData.date + "T00:00:00");
          if (!isNaN(dateObj.getTime())) {
            const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
            monthName = months[dateObj.getMonth()];
            const day = dateObj.getDate();
            const year = dateObj.getFullYear();
            monthYear = `${monthName} ${year}`;
            displayDateStr = `${day} de ${monthName}, ${year}`;
          }
        } catch (err) {
        }
      }
      const existingRaces = await getAllRaces();
      const conflicts = existingRaces.filter((r) => {
        if (!r.date || !sanitizedData.date) return false;
        const sameDate = r.date === sanitizedData.date;
        const sameRegion = r.region === sanitizedData.region;
        const sameDiscipline = r.discipline === sanitizedData.discipline;
        return sameDate && sameRegion && sameDiscipline;
      });
      if (conflicts.length > 0) {
        const conflictNames = conflicts.map((r) => `"${r.name}"`).join(", ");
        const conflictWarning2 = document.getElementById("form-conflict-warning");
        if (conflictWarning2) {
          conflictWarning2.innerHTML = `
            <span class="material-symbols-outlined text-lg align-middle">warning</span>
            <strong>Advertencia de Conflicto:</strong> Ya existe(n) ${conflicts.length} carrera(s) en esta misma fecha, regi\xF3n y disciplina: ${conflictNames}.
            Verifica antes de publicar o cambia la fecha/disciplina/regi\xF3n.
          `;
          conflictWarning2.classList.remove("hidden");
          conflictWarning2.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          const warnEl = document.createElement("div");
          warnEl.id = "form-conflict-warning";
          warnEl.className = "w-full p-4 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-700 dark:text-amber-300 text-sm font-semibold flex flex-col gap-2 mb-2";
          warnEl.innerHTML = `
            <span class="material-symbols-outlined text-lg align-middle">warning</span>
            <strong>Advertencia de Conflicto:</strong> Ya existe(n) ${conflicts.length} carrera(s) en esta misma fecha, regi\xF3n y disciplina: ${conflictNames}.
            Verifica antes de publicar o cambia la fecha/disciplina/regi\xF3n.
          `;
          raceForm.insertBefore(warnEl, raceForm.firstChild);
          warnEl.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove("opacity-50", "cursor-not-allowed");
        }
        return;
      }
      const conflictWarning = document.getElementById("form-conflict-warning");
      if (conflictWarning) conflictWarning.remove();
      const categoriesStr = formData.get("categories") || "";
      const categoriesArray = typeof categoriesStr === "string" ? categoriesStr.split(",").map((c) => c.trim()).filter(Boolean) : [];
      const newRace = {
        id: "race-" + Date.now(),
        name: sanitizedData.name || "Nueva Carrera",
        discipline: sanitizedData.discipline || "Ruta",
        date: sanitizedData.date || "",
        month: monthName,
        monthYear,
        displayDate: displayDateStr,
        region: sanitizedData.region || "Regi\xF3n Metropolitana de Santiago",
        city: sanitizedData.city || "",
        distance: sanitizedData.distance || "0 km",
        elevation: sanitizedData.elevation || "0 m",
        price: isFree ? 0 : Number(sanitizedData.price) || 0,
        isFree,
        status: "Pendiente",
        organizer: sanitizedData.organizador || sanitizedData.organizer || "",
        organizador: sanitizedData.organizador || sanitizedData.organizer || "",
        registrationUrl: sanitizedData.registrationUrl || "#",
        heroImage: sanitizedData.heroImage || "https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=1200&q=80",
        description: sanitizedData.description || "",
        categories: categoriesArray,
        participants: 1
      };
      try {
        await saveRace(newRace);
      } catch (saveErr) {
        console.error("Error al guardar la carrera:", saveErr);
        showNotificationToast("\u26A0\uFE0F Ocurri\xF3 un error al guardar la carrera. Int\xE9ntalo de nuevo.");
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove("opacity-50", "cursor-not-allowed");
        }
        return;
      }
      showNotificationToast("\xA1Propuesta de carrera enviada a moderaci\xF3n! Tu evento ha sido registrado en estado 'pendiente' y se mostrar\xE1 en el calendario p\xFAblico una vez sea revisado y aprobado por el administrador.");
      raceForm.reset();
      activeTab = "all";
      switchView("calendar");
      await updateCalendar();
    });
  }
}
async function initApp() {
  const regionSelectContainer = document.getElementById("region-select");
  if (regionSelectContainer) {
    renderRegionSelect(regionSelectContainer, REGIONS_CHILE, currentRegion);
  }
  const formRegionSelect = document.getElementById("form-region");
  if (formRegionSelect) {
    const filterRegions = REGIONS_CHILE.filter((r) => r !== "Todas las regiones");
    renderRegionSelect(formRegionSelect, filterRegions, filterRegions[0]);
  }
  const disciplineChipsContainer = document.getElementById("discipline-chips");
  if (disciplineChipsContainer) {
    renderDisciplineChips(disciplineChipsContainer, currentDiscipline);
  }
  setupEventHandlers();
  await updateCalendar();
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
export {
  clearFormErrors,
  getFilteredRaces,
  renderFormErrors,
  showNotificationToast,
  updateCalendar
};
