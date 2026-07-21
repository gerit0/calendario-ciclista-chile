var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// js/router.js
function parseCurrentRoute() {
  const path = window.location.pathname || "/";
  if (path === "/" || path === "" || path === "/index.html") {
    return { viewName: "calendar", params: {}, path: "/" };
  }
  if (path === "/agenda" || path === "/agenda/") {
    return { viewName: "agenda", params: {}, path: "/agenda" };
  }
  if (path === "/publicar" || path === "/publicar/") {
    return { viewName: "register", params: {}, path: "/publicar" };
  }
  if (path === "/admin" || path === "/admin/") {
    return { viewName: "admin-panel", params: {}, path: "/admin" };
  }
  const eventMatch = path.match(/^\/evento\/([^/]+)/);
  if (eventMatch) {
    return { viewName: "detail", params: { id: eventMatch[1] }, path };
  }
  return { viewName: "calendar", params: {}, path: "/" };
}
function navigateTo(path, state = {}) {
  if (window.location.pathname !== path) {
    window.history.pushState(state, "", path);
  }
  if (typeof routeChangeCallback === "function") {
    routeChangeCallback(parseCurrentRoute());
  }
}
function initRouter(onRouteChanged) {
  routeChangeCallback = onRouteChanged;
  window.addEventListener("popstate", () => {
    if (typeof routeChangeCallback === "function") {
      routeChangeCallback(parseCurrentRoute());
    }
  });
  document.addEventListener("click", (e) => {
    const anchor = e.target.closest("a");
    if (!anchor) return;
    const href = anchor.getAttribute("href");
    if (!href) return;
    if (href.startsWith("/") && !href.startsWith("//") && !anchor.hasAttribute("target") && !anchor.hasAttribute("download")) {
      e.preventDefault();
      navigateTo(href);
    }
  });
  if (typeof routeChangeCallback === "function") {
    routeChangeCallback(parseCurrentRoute());
  }
}
var routeChangeCallback;
var init_router = __esm({
  "js/router.js"() {
    routeChangeCallback = null;
  }
});

// js/data.js
var REGIONS_CHILE, INITIAL_RACES;
var init_data = __esm({
  "js/data.js"() {
    REGIONS_CHILE = [
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
    INITIAL_RACES = [
      {
        id: "race-001",
        name: "Gran Fondo Valle del Elqui",
        discipline: "Ruta",
        date: "2026-10-15",
        startDate: "2026-10-15",
        endDate: "2026-10-15",
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
        startDate: "2026-11-20",
        endDate: "2026-11-22",
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
        startDate: "2026-09-05",
        endDate: "2026-09-05",
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
        startDate: "2026-08-12",
        endDate: "2026-08-12",
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
        startDate: "2026-10-28",
        endDate: "2026-10-28",
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
        startDate: "2026-08-30",
        endDate: "2026-08-30",
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
  }
});

// js/supabase.js
import { createClient } from "@supabase/supabase-js";
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
  const startDate = row.fecha_inicio || row.fecha || "";
  const endDate = row.fecha_fin || row.fecha_inicio || row.fecha || "";
  return {
    id: row.id,
    name: row.nombre || "",
    discipline: row.disciplina || "",
    date: startDate || row.fecha || "",
    startDate,
    endDate,
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
    const insertPromise = client.from("carreras").insert([payload]);
    const timeoutPromise = new Promise(
      (_, reject) => setTimeout(() => reject(new Error("TIMEOUT_EXCEEDED")), 6e3)
    );
    const { data, error } = await Promise.race([insertPromise, timeoutPromise]);
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
    throw err;
  }
}
async function loginAdmin(email, password) {
  const client = getSupabase();
  if (!client) return { success: false, error: "Supabase no est\xE1 configurado." };
  try {
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return { success: true, session: data.session, user: data.user };
  } catch (err) {
    console.error("Error al iniciar sesi\xF3n de admin:", err);
    return { success: false, error: err.message || err };
  }
}
async function logoutAdmin() {
  const client = getSupabase();
  if (!client) return { success: false, error: "Supabase no est\xE1 configurado." };
  try {
    const { error } = await client.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error("Error al cerrar sesi\xF3n:", err);
    return { success: false, error: err.message || err };
  }
}
async function getCurrentUser() {
  const client = getSupabase();
  if (!client) return null;
  try {
    const { data: { user } } = await client.auth.getUser();
    return user;
  } catch {
    return null;
  }
}
async function checkIsAdmin(userId) {
  const client = getSupabase();
  if (!client || !userId) return false;
  try {
    const { data, error } = await client.from("usuarios_admin").select("user_id").eq("user_id", userId).maybeSingle();
    if (error) throw error;
    return !!data;
  } catch (err) {
    console.error("Error al verificar rol de admin:", err);
    return false;
  }
}
async function fetchPendingRacesSupabase() {
  const client = getSupabase();
  if (!client) return [];
  try {
    const { data, error } = await client.from("carreras").select("*").eq("estado", "pendiente").order("fecha", { ascending: true });
    if (error) throw error;
    if (!Array.isArray(data)) return [];
    return data.map(mapSupabaseToFrontend);
  } catch (err) {
    console.error("Error al consultar carreras pendientes:", err);
    return [];
  }
}
async function updateRaceStatusSupabase(raceId, status) {
  const client = getSupabase();
  if (!client) return { success: false, error: "Supabase no est\xE1 configurado." };
  try {
    const { error } = await client.from("carreras").update({ estado: status }).eq("id", raceId);
    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error("Error al actualizar estado de carrera:", err);
    return { success: false, error: err.message || err };
  }
}
async function uploadRaceImageSupabase(file) {
  const client = getSupabase();
  if (!client) return { success: false, error: "Supabase no est\xE1 configurado." };
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `hero-images/${fileName}`;
    const { data, error } = await client.storage.from("race-images").upload(filePath, file, {
      cacheControl: "3600",
      upsert: false
    });
    if (error) throw error;
    const { data: publicUrlData } = client.storage.from("race-images").getPublicUrl(filePath);
    return {
      success: true,
      url: publicUrlData.publicUrl
    };
  } catch (err) {
    console.error("Error en uploadRaceImageSupabase:", err);
    return { success: false, error: err.message || err };
  }
}
var DEFAULT_URL, DEFAULT_ANON_KEY, supabaseInstance;
var init_supabase = __esm({
  "js/supabase.js"() {
    DEFAULT_URL = "";
    DEFAULT_ANON_KEY = "";
    supabaseInstance = null;
  }
});

// js/storage.js
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
  const DELETED_INITIAL_KEY = "calendariociclista_deleted_initial_races";
  let deletedInitialIds = [];
  try {
    const deletedStr = localStorage.getItem(DELETED_INITIAL_KEY);
    if (deletedStr) deletedInitialIds = JSON.parse(deletedStr);
  } catch (err) {
    console.error("Error leyendo deleted_initial_races:", err);
  }
  const filteredInitial = INITIAL_RACES.filter((r) => !deletedInitialIds.includes(r.id));
  const combined = [...supabaseRaces, ...customRaces, ...filteredInitial];
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
async function deleteRace(raceId) {
  if (!raceId) return { success: false, error: "ID de carrera inv\xE1lido" };
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const isUUID = uuidRegex.test(raceId);
  if (isUUID && isSupabaseConfigured()) {
    try {
      const res = await deleteRaceSupabase(raceId);
      if (res.success) return { success: true, source: "supabase" };
      return { success: false, error: res.error };
    } catch (err) {
      return { success: false, error: err.message || err };
    }
  }
  const customRaces = getCustomRaces();
  const updatedCustom = customRaces.filter((r) => r.id !== raceId);
  if (customRaces.length !== updatedCustom.length) {
    try {
      localStorage.setItem(CUSTOM_RACES_KEY, JSON.stringify(updatedCustom));
      return { success: true, source: "localStorage" };
    } catch (err) {
      return { success: false, error: "Error al actualizar localStorage: " + err.message };
    }
  }
  const DELETED_INITIAL_KEY = "calendariociclista_deleted_initial_races";
  try {
    const deletedStr = localStorage.getItem(DELETED_INITIAL_KEY);
    const deletedIds = deletedStr ? JSON.parse(deletedStr) : [];
    if (!deletedIds.includes(raceId)) {
      deletedIds.push(raceId);
      localStorage.setItem(DELETED_INITIAL_KEY, JSON.stringify(deletedIds));
    }
    return { success: true, source: "localStorage_initial" };
  } catch (err) {
    return { success: false, error: "Error al eliminar carrera inicial localmente: " + err.message };
  }
}
async function updateRace(raceId, raceData) {
  if (!raceId) return { success: false, error: "ID de carrera inv\xE1lido" };
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const isUUID = uuidRegex.test(raceId);
  if (isUUID && isSupabaseConfigured()) {
    try {
      const res = await updateRaceSupabase(raceId, raceData);
      if (res.success) return { success: true, source: "supabase" };
      return { success: false, error: res.error };
    } catch (err) {
      return { success: false, error: err.message || err };
    }
  }
  const customRaces = getCustomRaces();
  const existingIndex = customRaces.findIndex((r) => r.id === raceId);
  let updatedRace = { ...raceData, id: raceId };
  if (raceData.categories && typeof raceData.categories === "string") {
    updatedRace.categories = raceData.categories.split(",").map((c) => c.trim()).filter(Boolean);
  }
  if (existingIndex >= 0) {
    customRaces[existingIndex] = { ...customRaces[existingIndex], ...updatedRace };
  } else {
    const original = INITIAL_RACES.find((r) => r.id === raceId) || {};
    customRaces.unshift({ ...original, ...updatedRace });
  }
  try {
    localStorage.setItem(CUSTOM_RACES_KEY, JSON.stringify(customRaces));
    return { success: true, source: "localStorage" };
  } catch (err) {
    return { success: false, error: "Error al actualizar localStorage: " + err.message };
  }
}
var BOOKMARKS_KEY, CUSTOM_RACES_KEY;
var init_storage = __esm({
  "js/storage.js"() {
    init_data();
    init_supabase();
    BOOKMARKS_KEY = "calendariociclista_bookmarks";
    CUSTOM_RACES_KEY = "calendariociclista_custom_races";
  }
});

// js/ui.js
function parseLocalDate(dateStr) {
  if (!dateStr || typeof dateStr !== "string") return null;
  const parts = dateStr.trim().split("T")[0].split("-");
  if (parts.length !== 3) return null;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
  return new Date(year, month, day);
}
function detectRaceDuration(race) {
  if (!race) {
    return { esMultiDia: false, duracionDias: 1, startDateStr: "", endDateStr: "", startDateObj: null, endDateObj: null };
  }
  const startStr = (race.startDate || race.fecha_inicio || race.date || "").split("T")[0].trim();
  const endStr = (race.endDate || race.fecha_fin || startStr).split("T")[0].trim();
  const startObj = parseLocalDate(startStr);
  const endObj = parseLocalDate(endStr || startStr);
  if (!startObj || !endObj || isNaN(startObj.getTime()) || isNaN(endObj.getTime())) {
    return {
      esMultiDia: false,
      duracionDias: 1,
      startDateStr: startStr,
      endDateStr: endStr || startStr,
      startDateObj: startObj,
      endDateObj: endObj
    };
  }
  const diffTime = endObj.getTime() - startObj.getTime();
  const diffDays = Math.round(diffTime / (1e3 * 60 * 60 * 24));
  const duracionDias = Math.max(1, diffDays + 1);
  const esMultiDia = duracionDias > 1;
  return {
    esMultiDia,
    duracionDias,
    startDateStr: startStr,
    endDateStr: endStr,
    startDateObj: startObj,
    endDateObj: endObj
  };
}
function getRaceDayProgress(race, currentDate) {
  const durationInfo = detectRaceDuration(race);
  if (!durationInfo.esMultiDia) return null;
  const currentObj = typeof currentDate === "string" ? parseLocalDate(currentDate) : currentDate;
  if (!currentObj || !durationInfo.startDateObj || !durationInfo.endDateObj) return null;
  if (currentObj < durationInfo.startDateObj || currentObj > durationInfo.endDateObj) {
    return null;
  }
  const diffTime = currentObj.getTime() - durationInfo.startDateObj.getTime();
  const currentDay = Math.round(diffTime / (1e3 * 60 * 60 * 24)) + 1;
  return `D\xEDa ${currentDay} de ${durationInfo.duracionDias}`;
}
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
function renderRaceCards(container, races = [], isAdmin2 = false) {
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
    const durationInfo = detectRaceDuration(race);
    const multiDayBadgeHTML = durationInfo.esMultiDia ? `<span class="px-2.5 py-1 rounded-full text-xs font-black bg-purple-100 text-purple-900 border border-purple-300 flex items-center gap-1 shadow-sm"><span class="material-symbols-outlined text-xs">date_range</span> ${durationInfo.duracionDias} d\xEDas</span>` : "";
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
          
          <!-- Badges superiores (Disciplina, Multi-D\xEDa y Gratuita) -->
          <div class="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            <span class="px-3 py-1 rounded-lg text-xs font-bold shadow-md flex items-center gap-1 ${disciplineBadgeClass}">
              <span class="material-symbols-outlined text-sm">${getDisciplineIcon(race.discipline)}</span>
              ${race.discipline}
            </span>
            ${multiDayBadgeHTML}
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
          <div class="pt-4 border-t border-outline-variant/30 flex flex-col gap-2">
            <button 
              type="button" 
              data-race-id="${race.id}" 
              class="btn-view-detail w-full bg-[#d8ef00] text-[#181919] font-display font-bold text-sm hover:brightness-105 shadow-sm rounded-xl py-3 px-4 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              Ver Detalle
              <span class="material-symbols-outlined text-base">arrow_forward</span>
            </button>
            ${isAdmin2 ? `
            <div class="flex gap-2 w-full pt-1">
              <button type="button" data-edit-id="${race.id}" class="flex-grow py-2.5 rounded-xl bg-surface-container border border-outline-variant/60 text-primary font-bold text-xs hover:bg-surface-container-high transition-colors flex items-center justify-center gap-1">
                <span class="material-symbols-outlined text-sm">edit</span> Editar
              </button>
              <button type="button" data-delete-id="${race.id}" class="py-2.5 px-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 font-bold text-xs hover:bg-red-500/20 transition-colors flex items-center justify-center gap-1" title="Eliminar Carrera">
                <span class="material-symbols-outlined text-sm">delete</span>
              </button>
            </div>
            ` : ""}
          </div>

        </div>

      </article>
    `;
  }).join("");
}
function renderDetailView(container, race, isAdmin2 = false) {
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
      <div class="flex items-center justify-between flex-wrap gap-4">
        <button 
          type="button" 
          id="btn-back-to-calendar" 
          class="px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-display font-bold text-sm flex items-center gap-2 transition-colors"
        >
          <span class="material-symbols-outlined text-lg">arrow_back</span>
          Volver a Carreras
        </button>

        <div class="flex items-center gap-2">
          ${isAdmin2 ? `
            <button type="button" data-edit-id="${race.id}" class="px-4 py-2.5 rounded-xl bg-surface-container border border-outline-variant/55 text-primary font-display font-bold text-sm flex items-center gap-2 hover:bg-surface-container-high transition-all shadow-sm">
              <span class="material-symbols-outlined text-base">edit</span> Editar
            </button>
            <button type="button" data-delete-id="${race.id}" class="px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 font-display font-bold text-sm flex items-center gap-2 hover:bg-red-500/20 transition-all shadow-sm">
              <span class="material-symbols-outlined text-base">delete</span> Eliminar
            </button>
          ` : ""}
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
  const viewAdminPanel = document.getElementById("view-admin-panel");
  const navExplore = document.getElementById("nav-explore");
  const navAgenda = document.getElementById("nav-agenda");
  const navRegister = document.getElementById("nav-register");
  const navAdminPanel = document.getElementById("nav-admin-panel");
  if (viewCalendar) viewCalendar.classList.add("hidden");
  if (viewDetail) viewDetail.classList.add("hidden");
  if (viewRegister) viewRegister.classList.add("hidden");
  if (viewAdminPanel) viewAdminPanel.classList.add("hidden");
  const inactiveNavClasses = "text-outline hover:text-primary hover:bg-surface-container-low";
  const activeNavClasses = "text-primary bg-surface-container-low font-bold";
  if (navExplore) navExplore.className = `nav-btn px-4 py-2 rounded-lg font-display font-bold text-sm transition-colors flex items-center gap-2 ${viewName === "calendar" ? activeNavClasses : inactiveNavClasses}`;
  if (navAgenda) navAgenda.className = `nav-btn px-4 py-2 rounded-lg font-display font-bold text-sm transition-colors flex items-center gap-2 ${viewName === "agenda" ? activeNavClasses : inactiveNavClasses}`;
  if (navAdminPanel) navAdminPanel.className = `nav-btn px-4 py-2 rounded-lg font-display font-bold text-sm transition-colors flex items-center gap-2 ${viewName === "admin-panel" ? activeNavClasses : inactiveNavClasses}`;
  if (viewName === "calendar" || viewName === "agenda") {
    if (viewCalendar) viewCalendar.classList.remove("hidden");
  } else if (viewName === "detail") {
    if (viewDetail) viewDetail.classList.remove("hidden");
  } else if (viewName === "register") {
    if (viewRegister) viewRegister.classList.remove("hidden");
  } else if (viewName === "admin-panel") {
    if (viewAdminPanel) viewAdminPanel.classList.remove("hidden");
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function renderPendingRaces(container, races = []) {
  if (!container) return;
  if (races.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center bg-white rounded-3xl border border-dashed border-outline-variant/60 p-8 space-y-4">
        <div class="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mx-auto text-outline">
          <span class="material-symbols-outlined text-4xl">task_alt</span>
        </div>
        <h3 class="font-display font-bold text-xl text-primary">No hay propuestas pendientes</h3>
        <p class="text-outline text-sm max-w-md mx-auto">Buen trabajo, el calendario est\xE1 al d\xEDa y moderado.</p>
      </div>
    `;
    return;
  }
  container.innerHTML = races.map((race) => {
    const disciplineBadgeClass = getDisciplineBadgeClass(race.discipline);
    return `
      <article class="bg-white rounded-3xl border border-outline-variant/40 overflow-hidden shadow-sm flex flex-col group p-6 space-y-4">
        <div class="flex items-center justify-between">
          <span class="px-2.5 py-1 rounded-lg text-xs font-bold ${disciplineBadgeClass}">
            ${race.discipline}
          </span>
          <span class="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            Pendiente
          </span>
        </div>
        <div>
          <h3 class="font-display font-bold text-lg text-primary line-clamp-2">${race.name}</h3>
          <p class="text-xs text-outline font-semibold">${race.displayDate || race.date} \u2014 ${race.city}, ${race.region}</p>
        </div>
        <p class="text-xs text-gray-600 line-clamp-3">${race.description}</p>
        <div class="pt-4 border-t border-outline-variant/30 grid grid-cols-2 gap-2">
          <button type="button" data-approve-id="${race.id}" class="py-2.5 rounded-xl bg-emerald-600 text-white font-display font-bold text-xs hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1 shadow-sm">
            <span class="material-symbols-outlined text-sm">check_circle</span> Aprobar
          </button>
          <button type="button" data-reject-id="${race.id}" class="py-2.5 rounded-xl bg-red-600 text-white font-display font-bold text-xs hover:bg-red-700 transition-colors flex items-center justify-center gap-1 shadow-sm">
            <span class="material-symbols-outlined text-sm">cancel</span> Rechazar
          </button>
        </div>
      </article>
    `;
  }).join("");
}
function renderMonthGrid(container, races = [], activeMonthYear = "Todos") {
  if (!container) return;
  let year = 2026;
  let monthIndex = 9;
  if (activeMonthYear && activeMonthYear !== "Todos") {
    const parts = activeMonthYear.split(" ");
    const monthsNameMap = {
      "Enero": 0,
      "Febrero": 1,
      "Marzo": 2,
      "Abril": 3,
      "Mayo": 4,
      "Junio": 5,
      "Julio": 6,
      "Agosto": 7,
      "Septiembre": 8,
      "Octubre": 9,
      "Noviembre": 10,
      "Diciembre": 11
    };
    if (monthsNameMap[parts[0]] !== void 0) {
      monthIndex = monthsNameMap[parts[0]];
    }
    if (parts[1] && !isNaN(parseInt(parts[1], 10))) {
      year = parseInt(parts[1], 10);
    }
  } else if (races.length > 0) {
    const firstWithDate = races.find((r) => r.startDate || r.date);
    if (firstWithDate) {
      const d = parseLocalDate(firstWithDate.startDate || firstWithDate.date);
      if (d) {
        year = d.getFullYear();
        monthIndex = d.getMonth();
      }
    }
  }
  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const monthName = monthNames[monthIndex];
  const firstOfMonth = new Date(year, monthIndex, 1);
  const lastOfMonth = new Date(year, monthIndex + 1, 0);
  const firstDayDayOfWeek = firstOfMonth.getDay();
  const startOffset = firstDayDayOfWeek === 0 ? 6 : firstDayDayOfWeek - 1;
  const startDateGrid = new Date(firstOfMonth);
  startDateGrid.setDate(startDateGrid.getDate() - startOffset);
  const totalDaysNeeded = startOffset + lastOfMonth.getDate();
  const totalWeeks = Math.ceil(totalDaysNeeded / 7);
  let html = `
    <div class="space-y-4 animate-fadeIn">
      <!-- Header del Mes -->
      <div class="flex items-center justify-between pb-2 border-b border-outline-variant/30">
        <h3 class="font-display font-black text-xl text-primary flex items-center gap-2">
          <span class="material-symbols-outlined text-secondary text-2xl">calendar_month</span>
          ${monthName} ${year}
        </h3>
        <span class="text-xs font-bold px-3 py-1 rounded-full bg-surface-container text-outline uppercase tracking-wider">
          Vista Mensual
        </span>
      </div>

      <!-- Cabecera D\xEDas de la Semana -->
      <div class="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-bold text-outline py-2 border-b border-outline-variant/20">
        <div>Lun</div>
        <div>Mar</div>
        <div>Mi\xE9</div>
        <div>Jue</div>
        <div>Vie</div>
        <div>S\xE1b</div>
        <div>Dom</div>
      </div>

      <!-- Filas de Semanas -->
      <div class="space-y-3">
  `;
  let currentIterDate = new Date(startDateGrid);
  for (let w = 0; w < totalWeeks; w++) {
    const weekStartDate = new Date(currentIterDate);
    const weekEndDate = new Date(currentIterDate);
    weekEndDate.setDate(weekEndDate.getDate() + 6);
    const weekDays = [];
    for (let d = 0; d < 7; d++) {
      weekDays.push(new Date(currentIterDate));
      currentIterDate.setDate(currentIterDate.getDate() + 1);
    }
    const racesInWeek = [];
    races.forEach((race) => {
      const dur = detectRaceDuration(race);
      if (!dur.startDateObj || !dur.endDateObj) return;
      if (dur.startDateObj <= weekEndDate && dur.endDateObj >= weekStartDate) {
        let colStart = 1;
        let colEnd = 7;
        if (dur.startDateObj > weekStartDate) {
          const diffMs = dur.startDateObj.getTime() - weekStartDate.getTime();
          colStart = Math.round(diffMs / (1e3 * 60 * 60 * 24)) + 1;
        }
        if (dur.endDateObj < weekEndDate) {
          const diffMs = dur.endDateObj.getTime() - weekStartDate.getTime();
          colEnd = Math.round(diffMs / (1e3 * 60 * 60 * 24)) + 1;
        }
        racesInWeek.push({
          race,
          dur,
          colStart: Math.max(1, Math.min(7, colStart)),
          colEnd: Math.max(1, Math.min(7, colEnd)),
          span: Math.max(1, colEnd - colStart + 1)
        });
      }
    });
    racesInWeek.sort((a, b) => {
      if (a.dur.esMultiDia !== b.dur.esMultiDia) {
        return a.dur.esMultiDia ? -1 : 1;
      }
      if (a.colStart !== b.colStart) {
        return a.colStart - b.colStart;
      }
      return b.span - a.span;
    });
    html += `
      <div class="relative bg-surface-container-low/50 rounded-2xl p-2.5 border border-outline-variant/30 min-h-[110px] sm:min-h-[130px] flex flex-col justify-between space-y-2">
        
        <!-- N\xFAmeros de los D\xEDas -->
        <div class="grid grid-cols-7 gap-1 sm:gap-2 text-right">
          ${weekDays.map((dayObj) => {
      const isCurrentMonth = dayObj.getMonth() === monthIndex;
      const isToday = (/* @__PURE__ */ new Date()).toDateString() === dayObj.toDateString();
      const dayNum = dayObj.getDate();
      return `
              <div class="pr-1 font-display font-bold text-xs ${isCurrentMonth ? "text-primary" : "text-outline-variant/50"}">
                <span class="${isToday ? "bg-secondary text-white px-1.5 py-0.5 rounded-full" : ""}">
                  ${dayNum}
                </span>
              </div>
            `;
    }).join("")}
        </div>

        <!-- Renderizado de Barras de Eventos -->
        <div class="grid grid-cols-7 gap-1 sm:gap-2 gap-y-1.5 z-10">
          ${racesInWeek.map((item) => {
      const { race, dur, colStart, span } = item;
      const badgeClass = getDisciplineBadgeClass(race.discipline);
      if (dur.esMultiDia) {
        return `
                <div 
                  data-race-id="${race.id}"
                  style="grid-column: ${colStart} / span ${span};"
                  class="cursor-pointer group relative bg-gradient-to-r from-primary via-primary/95 to-primary/80 text-white rounded-xl px-2.5 py-1.5 text-xs font-bold shadow-sm hover:brightness-110 transition-all flex items-center justify-between overflow-hidden border-l-4 border-tertiary-fixed"
                  title="${race.name} (${dur.duracionDias} d\xEDas)"
                >
                  <div class="flex items-center gap-1.5 truncate">
                    <span class="px-1.5 py-0.5 rounded text-[10px] font-black uppercase ${badgeClass}">${race.discipline}</span>
                    <span class="truncate font-display font-extrabold text-white">${race.name}</span>
                  </div>
                  <span class="shrink-0 text-[10px] font-bold bg-white/20 px-1.5 py-0.5 rounded-full text-tertiary-fixed ml-1">
                    ${dur.duracionDias}d
                  </span>
                </div>
              `;
      } else {
        return `
                <div 
                  data-race-id="${race.id}"
                  style="grid-column: ${colStart} / span 1;"
                  class="cursor-pointer group relative bg-white border border-outline-variant/60 hover:border-primary text-primary rounded-xl px-2 py-1 text-[11px] font-bold shadow-2xs hover:shadow-md transition-all flex items-center gap-1 truncate"
                  title="${race.name}"
                >
                  <span class="w-2 h-2 rounded-full ${badgeClass} shrink-0"></span>
                  <span class="truncate font-medium">${race.name}</span>
                </div>
              `;
      }
    }).join("")}
        </div>

      </div>
    `;
  }
  html += `
      </div>
    </div>
  `;
  container.innerHTML = html;
}
function renderWeekGrid(container, races = [], referenceDate = /* @__PURE__ */ new Date()) {
  if (!container) return;
  const refObj = typeof referenceDate === "string" ? parseLocalDate(referenceDate) || /* @__PURE__ */ new Date() : referenceDate;
  const dayOfWeek = refObj.getDay();
  const offsetToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const mondayObj = new Date(refObj);
  mondayObj.setDate(mondayObj.getDate() - offsetToMonday);
  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(mondayObj);
    d.setDate(d.getDate() + i);
    weekDays.push(d);
  }
  const sundayObj = weekDays[6];
  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const headerText = `Semana del ${mondayObj.getDate()} de ${monthNames[mondayObj.getMonth()]} al ${sundayObj.getDate()} de ${monthNames[sundayObj.getMonth()]}, ${sundayObj.getFullYear()}`;
  let html = `
    <div class="space-y-6 animate-fadeIn">
      <div class="flex items-center justify-between pb-2 border-b border-outline-variant/30">
        <h3 class="font-display font-black text-xl text-primary flex items-center gap-2">
          <span class="material-symbols-outlined text-secondary text-2xl">view_week</span>
          ${headerText}
        </h3>
        <span class="text-xs font-bold px-3 py-1 rounded-full bg-surface-container text-outline uppercase tracking-wider">
          Vista Semanal
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-7 gap-4">
  `;
  const dayNames = ["Lunes", "Martes", "Mi\xE9rcoles", "Jueves", "Viernes", "S\xE1bado", "Domingo"];
  weekDays.forEach((dayObj, index) => {
    const isToday = (/* @__PURE__ */ new Date()).toDateString() === dayObj.toDateString();
    const activeRaces = races.filter((race) => {
      const dur = detectRaceDuration(race);
      return dur.startDateObj && dur.endDateObj && dayObj >= dur.startDateObj && dayObj <= dur.endDateObj;
    });
    html += `
      <div class="bg-surface-container-low/50 rounded-2xl p-3 border border-outline-variant/30 flex flex-col space-y-3 min-h-[160px]">
        <div class="flex items-center justify-between border-b border-outline-variant/20 pb-2">
          <span class="font-display font-bold text-xs text-primary">${dayNames[index]}</span>
          <span class="text-xs font-extrabold ${isToday ? "bg-secondary text-white px-2 py-0.5 rounded-full" : "text-outline"}">
            ${dayObj.getDate()}
          </span>
        </div>

        <div class="space-y-2 flex-grow">
          ${activeRaces.length === 0 ? `
            <p class="text-[11px] text-outline italic py-2 text-center">Sin eventos</p>
          ` : activeRaces.map((race) => {
      const dur = detectRaceDuration(race);
      const badgeClass = getDisciplineBadgeClass(race.discipline);
      const dayProgress = getRaceDayProgress(race, dayObj);
      return `
              <div 
                data-race-id="${race.id}" 
                class="cursor-pointer bg-white border border-outline-variant/40 hover:border-primary p-2.5 rounded-xl shadow-2xs hover:shadow-md transition-all space-y-1.5"
              >
                <div class="flex items-center justify-between gap-1">
                  <span class="px-1.5 py-0.5 rounded text-[10px] font-black uppercase ${badgeClass}">${race.discipline}</span>
                  ${dur.esMultiDia && dayProgress ? `
                    <span class="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-purple-100 text-purple-900 border border-purple-300">
                      ${dayProgress}
                    </span>
                  ` : ""}
                </div>
                <h5 class="font-display font-bold text-xs text-primary line-clamp-2">${race.name}</h5>
                <p class="text-[10px] text-outline font-medium truncate">${race.city}</p>
              </div>
            `;
    }).join("")}
        </div>
      </div>
    `;
  });
  html += `
      </div>
    </div>
  `;
  container.innerHTML = html;
}
function renderDayGrid(container, races = [], referenceDate = /* @__PURE__ */ new Date()) {
  if (!container) return;
  const dayObj = typeof referenceDate === "string" ? parseLocalDate(referenceDate) || /* @__PURE__ */ new Date() : referenceDate;
  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const dayNames = ["Domingo", "Lunes", "Martes", "Mi\xE9rcoles", "Jueves", "Viernes", "S\xE1bado"];
  const headerText = `${dayNames[dayObj.getDay()]} ${dayObj.getDate()} de ${monthNames[dayObj.getMonth()]}, ${dayObj.getFullYear()}`;
  const activeRaces = races.filter((race) => {
    const dur = detectRaceDuration(race);
    return dur.startDateObj && dur.endDateObj && dayObj >= dur.startDateObj && dayObj <= dur.endDateObj;
  });
  let html = `
    <div class="space-y-6 animate-fadeIn">
      <div class="flex items-center justify-between pb-2 border-b border-outline-variant/30">
        <h3 class="font-display font-black text-xl text-primary flex items-center gap-2">
          <span class="material-symbols-outlined text-secondary text-2xl">today</span>
          ${headerText}
        </h3>
        <span class="text-xs font-bold px-3 py-1 rounded-full bg-surface-container text-outline uppercase tracking-wider">
          Vista Diaria (${activeRaces.length} evento${activeRaces.length === 1 ? "" : "s"})
        </span>
      </div>

      <div class="space-y-4">
        ${activeRaces.length === 0 ? `
          <div class="py-16 text-center bg-white rounded-3xl border border-dashed border-outline-variant/60 p-8 space-y-3">
            <span class="material-symbols-outlined text-4xl text-outline">event_busy</span>
            <h4 class="font-display font-bold text-lg text-primary">No hay eventos para este d\xEDa</h4>
            <p class="text-xs text-outline">Prueba seleccionando otra fecha o cambiando las disciplinas.</p>
          </div>
        ` : activeRaces.map((race) => {
    const dur = detectRaceDuration(race);
    const badgeClass = getDisciplineBadgeClass(race.discipline);
    const dayProgress = getRaceDayProgress(race, dayObj);
    return `
            <article 
              data-race-id="${race.id}" 
              class="cursor-pointer bg-white p-6 rounded-3xl border border-outline-variant/40 hover:border-primary shadow-sm hover:shadow-lg transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
            >
              <div class="space-y-2 max-w-xl">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="px-2.5 py-1 rounded-lg text-xs font-bold ${badgeClass}">${race.discipline}</span>
                  ${dur.esMultiDia && dayProgress ? `
                    <span class="px-3 py-1 rounded-full text-xs font-black bg-purple-100 text-purple-900 border border-purple-300 shadow-2xs flex items-center gap-1">
                      <span class="material-symbols-outlined text-xs">flag</span> ${dayProgress}
                    </span>
                  ` : `
                    <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-surface-container text-outline">Un solo d\xEDa</span>
                  `}
                </div>
                <h4 class="font-display font-black text-xl text-primary group-hover:text-secondary transition-colors">${race.name}</h4>
                <p class="text-xs text-gray-600 line-clamp-2">${race.description}</p>
                <div class="flex items-center gap-4 text-xs text-outline font-semibold">
                  <span>\u{1F4CD} ${race.city}, ${race.region}</span>
                  <span>\u{1F4CF} ${race.distance}</span>
                </div>
              </div>

              <div class="sm:text-right shrink-0 space-y-2">
                <span class="font-display font-black text-xl text-primary block">${formatPrice(race.price, race.isFree)}</span>
                <button type="button" class="px-4 py-2 rounded-xl bg-tertiary-fixed text-primary font-bold text-xs hover:brightness-105 shadow-sm inline-flex items-center gap-1">
                  Ver Detalles <span class="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </article>
          `;
  }).join("")}
      </div>
    </div>
  `;
  container.innerHTML = html;
}
var DISCIPLINES;
var init_ui = __esm({
  "js/ui.js"() {
    init_storage();
    DISCIPLINES = ["Todas", "Ruta", "MTB", "Gravel", "Pista", "BMX", "Virtual"];
  }
});

// js/validation.js
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
  let trimmed = urlStr.trim();
  if (trimmed === "") return true;
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = "https://" + trimmed;
  }
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
  const isMultiDay = raw.isMultiDay === true || raw.isMultiDay === "on" || raw.isMultiDay === "true";
  const dateStr = typeof raw.date === "string" ? raw.date.trim() : "";
  const startDateStr = isMultiDay && typeof raw.startDate === "string" && raw.startDate.trim() !== "" ? raw.startDate.trim() : dateStr;
  const endDateStr = isMultiDay && typeof raw.endDate === "string" && raw.endDate.trim() !== "" ? raw.endDate.trim() : startDateStr;
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  sanitizedData.date = startDateStr || dateStr;
  sanitizedData.startDate = startDateStr || dateStr;
  sanitizedData.endDate = endDateStr || startDateStr || dateStr;
  if (!sanitizedData.startDate || !dateRegex.test(sanitizedData.startDate) || isNaN(Date.parse(sanitizedData.startDate))) {
    errors.date = "La fecha de inicio debe tener un formato v\xE1lido (AAAA-MM-DD).";
  } else if (isMultiDay && (!sanitizedData.endDate || !dateRegex.test(sanitizedData.endDate) || isNaN(Date.parse(sanitizedData.endDate)))) {
    errors.endDate = "La fecha de t\xE9rmino debe tener un formato v\xE1lido (AAAA-MM-DD).";
  } else if (isMultiDay && sanitizedData.endDate < sanitizedData.startDate) {
    errors.endDate = "La fecha de t\xE9rmino no puede ser anterior a la fecha de inicio.";
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
  let registrationUrl = typeof raw.registrationUrl === "string" ? raw.registrationUrl.trim() : "";
  if (registrationUrl && !/^https?:\/\//i.test(registrationUrl)) {
    registrationUrl = "https://" + registrationUrl;
  }
  sanitizedData.registrationUrl = registrationUrl;
  if (!isValidURL(registrationUrl)) {
    errors.registrationUrl = "La URL de inscripci\xF3n debe ser una URL v\xE1lida (ej: https://ejemplo.cl).";
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
var VALID_DISCIPLINES;
var init_validation = __esm({
  "js/validation.js"() {
    VALID_DISCIPLINES = ["Ruta", "MTB", "Gravel", "Pista", "BMX", "Virtual"];
  }
});

// js/admin.js
var admin_exports = {};
__export(admin_exports, {
  ensureAdminElementsMounted: () => ensureAdminElementsMounted,
  loadPendingRacesList: () => loadPendingRacesList,
  openEditModal: () => openEditModal,
  openLoginModal: () => openLoginModal,
  setAuthChangeCallback: () => setAuthChangeCallback
});
function setAuthChangeCallback(cb) {
  onAuthChangeCallback = cb;
}
function ensureAdminElementsMounted() {
  if (isMounted) return;
  if (!document.getElementById("view-admin-panel")) {
    const main = document.querySelector("main");
    if (main) {
      const adminSection = document.createElement("section");
      adminSection.id = "view-admin-panel";
      adminSection.className = "hidden space-y-8";
      adminSection.innerHTML = `
        <div class="flex items-center justify-between border-b border-outline-variant/30 pb-4">
          <div>
            <h1 class="text-2xl sm:text-3xl font-display font-black text-primary flex items-center gap-2">
              <span class="material-symbols-outlined text-3xl text-secondary">admin_panel_settings</span>
              Panel de Moderaci\xF3n
            </h1>
            <p class="text-outline text-sm">Gestiona y aprueba las propuestas de carreras recibidas.</p>
          </div>
          <div id="admin-session-badge" class="px-4 py-2 rounded-xl bg-surface-container border border-outline-variant/40 flex items-center gap-2 text-xs font-bold">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Sesi\xF3n Activa
          </div>
        </div>

        <div class="space-y-4">
          <h3 class="font-display font-bold text-lg text-primary">Propuestas Pendientes (<span id="pending-count">0</span>)</h3>
          
          <div id="pending-races-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Pending race items populated dynamically -->
          </div>
        </div>
      `;
      main.appendChild(adminSection);
    }
  }
  if (!document.getElementById("login-modal")) {
    const loginDiv = document.createElement("div");
    loginDiv.id = "login-modal";
    loginDiv.className = "hidden fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn";
    loginDiv.innerHTML = `
      <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-outline-variant/40 shadow-2xl relative space-y-6">
        <button id="btn-close-login" class="absolute top-4 right-4 text-outline hover:text-primary transition-colors p-1 rounded-lg hover:bg-surface-container">
          <span class="material-symbols-outlined text-2xl">close</span>
        </button>
        <div class="text-center space-y-2">
          <div class="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mx-auto shadow-sm">
            <span class="material-symbols-outlined text-3xl">lock_open</span>
          </div>
          <h3 class="font-display font-black text-2xl text-primary">Ingreso Admin</h3>
          <p class="text-xs text-outline leading-tight">Inicia sesi\xF3n con tus credenciales de Supabase para habilitar la edici\xF3n de carreras.</p>
        </div>
        <form id="login-form" class="space-y-4">
          <div id="login-error-container" class="hidden p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 text-xs font-semibold flex items-center gap-1.5">
            <span class="material-symbols-outlined text-base">error</span>
            <span id="login-error-msg">Credenciales incorrectas</span>
          </div>
          <div class="space-y-1">
            <label for="login-email" class="block font-display font-bold text-xs text-primary">Correo Electr\xF3nico</label>
            <input type="email" id="login-email" required placeholder="admin@calendariociclista.cl"
              class="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all">
          </div>
          <div class="space-y-1">
            <label for="login-password" class="block font-display font-bold text-xs text-primary">Contrase\xF1a</label>
            <input type="password" id="login-password" required placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
              class="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all">
          </div>
          <button type="submit" id="btn-submit-login" class="w-full py-3.5 rounded-xl bg-primary text-white font-display font-bold text-sm hover:bg-black transition-all active:scale-[0.98] shadow-md flex items-center justify-center gap-2">
            <span class="material-symbols-outlined text-base">login</span>
            Iniciar Sesi\xF3n
          </button>
        </form>
      </div>
    `;
    document.body.appendChild(loginDiv);
  }
  if (!document.getElementById("edit-modal")) {
    const editDiv = document.createElement("div");
    editDiv.id = "edit-modal";
    editDiv.className = "hidden fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto";
    editDiv.innerHTML = `
      <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full border border-outline-variant/40 shadow-2xl my-8 relative space-y-6 max-h-[90vh] overflow-y-auto">
        <button id="btn-close-edit" class="absolute top-4 right-4 text-outline hover:text-primary transition-colors p-1 rounded-lg hover:bg-surface-container">
          <span class="material-symbols-outlined text-2xl">close</span>
        </button>
        <div class="flex items-center gap-3 border-b border-outline-variant/30 pb-4">
          <div class="w-10 h-10 rounded-xl bg-[#d8ef00] text-primary flex items-center justify-center font-bold">
            <span class="material-symbols-outlined text-xl">edit</span>
          </div>
          <div>
            <h3 class="font-display font-black text-2xl text-primary">Editar Carrera</h3>
            <p class="text-xs text-outline">Modifica los detalles del evento seleccionado.</p>
          </div>
        </div>
        <form id="edit-form" class="space-y-6">
          <input type="hidden" id="edit-race-id">
          <div>
            <label for="edit-form-name" class="block font-display font-bold text-sm text-primary mb-2">
              Nombre de la Carrera <span class="text-secondary">*</span>
            </label>
            <input type="text" id="edit-form-name" name="name" required placeholder="Ej: Gran Fondo Andes Challenge 2026"
              class="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all">
          </div>
          <div class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label for="edit-form-discipline" class="block font-display font-bold text-sm text-primary mb-2">
                  Disciplina <span class="text-secondary">*</span>
                </label>
                <select id="edit-form-discipline" name="discipline" required
                  class="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all cursor-pointer">
                  <option value="Ruta">Ruta</option>
                  <option value="MTB">MTB</option>
                  <option value="Gravel">Gravel</option>
                  <option value="Pista">Pista</option>
                  <option value="BMX">BMX</option>
                  <option value="Virtual">Virtual</option>
                </select>
              </div>

              <div>
                <div class="flex items-center justify-between mb-2">
                  <label for="edit-form-date" class="block font-display font-bold text-sm text-primary">
                    Fecha de Inicio <span class="text-secondary">*</span>
                  </label>
                  <label class="inline-flex items-center gap-1.5 cursor-pointer text-xs font-bold text-primary select-none">
                    <input type="checkbox" id="edit-form-is-multiday" name="isMultiDay" class="w-4 h-4 text-primary rounded border-outline-variant focus:ring-primary">
                    <span>\xBFM\xE1s de 1 d\xEDa?</span>
                  </label>
                </div>

                <div id="edit-form-single-date-container">
                  <input type="date" id="edit-form-date" name="date"
                    class="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all cursor-pointer">
                </div>

                <div id="edit-form-start-date-container" class="hidden">
                  <input type="date" id="edit-form-start-date" name="startDate"
                    class="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all cursor-pointer">
                </div>
              </div>
            </div>

            <div id="edit-form-end-date-container" class="hidden bg-purple-50/70 p-4 rounded-2xl border border-purple-200 space-y-2">
              <div class="flex items-center justify-between">
                <label for="edit-form-end-date" class="block font-display font-bold text-xs text-purple-950 uppercase tracking-wider">
                  Fecha de T\xE9rmino de la Vuelta / Etapas <span class="text-secondary">*</span>
                </label>
                <span id="edit-form-duration-badge" class="text-xs font-black text-purple-900 bg-purple-200/80 px-2.5 py-0.5 rounded-full">
                  Multi-D\xEDa
                </span>
              </div>
              <input type="date" id="edit-form-end-date" name="endDate"
                class="w-full px-4 py-2.5 rounded-xl bg-white border border-purple-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all cursor-pointer">
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="edit-form-region" class="block font-display font-bold text-sm text-primary mb-2">
                Regi\xF3n <span class="text-secondary">*</span>
              </label>
              <select id="edit-form-region" name="region" required
                class="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all cursor-pointer">
              </select>
            </div>
            <div>
              <label for="edit-form-city" class="block font-display font-bold text-sm text-primary mb-2">
                Ciudad / Comuna <span class="text-secondary">*</span>
              </label>
              <input type="text" id="edit-form-city" name="city" required placeholder="Ej: Puc\xF3n"
                class="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all">
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="edit-form-distance" class="block font-display font-bold text-sm text-primary mb-2">
                Distancia (km) <span class="text-secondary">*</span>
              </label>
              <input type="text" id="edit-form-distance" name="distance" required placeholder="Ej: 120 km"
                class="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all">
            </div>
            <div>
              <label for="edit-form-elevation" class="block font-display font-bold text-sm text-primary mb-2">
                Desnivel Acumulado (m)
              </label>
              <input type="text" id="edit-form-elevation" name="elevation" placeholder="Ej: 1850 m"
                class="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all">
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div>
              <label for="edit-form-price" class="block font-display font-bold text-sm text-primary mb-2">
                Precio Inscripci\xF3n ($ CLP)
              </label>
              <input type="number" id="edit-form-price" name="price" min="0" step="1000" placeholder="Ej: 35000"
                class="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all">
            </div>
            <div class="flex items-center h-12">
              <label class="inline-flex items-center gap-2 cursor-pointer">
                <input type="checkbox" id="edit-form-is-free" name="isFree"
                  class="w-5 h-5 rounded text-primary focus:ring-primary border-outline-variant">
                <span class="font-display font-bold text-sm text-primary">\xBFEvento Gratuito?</span>
              </label>
            </div>
            <div>
              <label for="edit-form-status" class="block font-display font-bold text-sm text-primary mb-2">
                Estado de Inscripci\xF3n
              </label>
              <select id="edit-form-status" name="status"
                class="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all cursor-pointer">
                <option value="Inscripciones Abiertas">Inscripciones Abiertas</option>
                <option value="\xDAltimos Cupos">\xDAltimos Cupos</option>
                <option value="Pr\xF3ximamente">Pr\xF3ximamente</option>
                <option value="Cupos Agotados">Cupos Agotados</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="edit-form-organizer" class="block font-display font-bold text-sm text-primary mb-2">
                Organizador <span class="text-secondary">*</span>
              </label>
              <input type="text" id="edit-form-organizer" name="organizer" required placeholder="Ej: Club Ciclismo Chile"
                class="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all">
            </div>
            <div>
              <label for="edit-form-url" class="block font-display font-bold text-sm text-primary mb-2">
                Link de Inscripci\xF3n / Sitio Web <span class="text-secondary">*</span>
              </label>
              <input type="text" id="edit-form-url" name="registrationUrl" required placeholder="https://ejemplo.cl/registro"
                class="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all">
            </div>
          </div>
          <div class="space-y-2">
            <label class="block font-display font-bold text-sm text-primary">
              Imagen de Portada <span class="text-xs text-outline/80 font-normal">(Opcional)</span>
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div id="edit-form-upload-zone" class="border-2 border-dashed border-outline-variant/60 hover:border-primary/50 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer bg-surface-container-low/20 min-h-[120px] select-none text-center">
                <span class="material-symbols-outlined text-outline text-3xl">add_a_photo</span>
                <span class="text-xs font-bold text-outline">Arrastra una imagen o haz clic aqu\xED</span>
                <span class="text-[10px] text-outline/60">JPG, PNG (Max 5MB)</span>
                <input type="file" id="edit-form-image-file" accept="image/*" class="hidden">
              </div>

              <div class="flex flex-col justify-between gap-3">
                <div>
                  <span class="text-xs font-bold text-outline block mb-1">O ingresa un enlace web:</span>
                  <input type="text" id="edit-form-image" name="heroImage" placeholder="https://images.unsplash.com/..."
                    class="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all">
                </div>
                <div id="edit-form-image-preview-container" class="hidden h-[70px] rounded-xl overflow-hidden border border-outline-variant/40 relative bg-surface-container-low">
                  <img id="edit-form-image-preview" src="" class="w-full h-full object-cover">
                  <button type="button" id="btn-remove-edit-image" class="absolute top-1 right-1 w-6 h-6 rounded-full bg-primary/80 text-white flex items-center justify-center font-bold text-[10px] hover:bg-primary transition-all active:scale-90">\u2715</button>
                </div>
              </div>
            </div>
          </div>
          <div>
            <label for="edit-form-categories" class="block font-display font-bold text-sm text-primary mb-2">
              Categor\xEDas (separadas por comas)
            </label>
            <input type="text" id="edit-form-categories" name="categories" placeholder="Ej: Elite, Master A, Master B, Damas"
              class="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all">
          </div>
          <div>
            <label for="edit-form-description" class="block font-display font-bold text-sm text-primary mb-2">
              Descripci\xF3n del Evento <span class="text-secondary">*</span>
            </label>
            <textarea id="edit-form-description" name="description" rows="4" required
              placeholder="Describe la ruta, puntos de hidrataci\xF3n, premios, etc..."
              class="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all"></textarea>
          </div>
          <div class="pt-4 flex justify-end gap-4 border-t border-outline-variant/30">
            <button type="button" id="btn-cancel-edit"
              class="px-6 py-3 rounded-xl bg-surface-container text-primary font-display font-bold text-sm hover:bg-surface-container-high transition-colors">
              Cancelar
            </button>
            <button type="submit" id="btn-save-edit"
              class="px-8 py-3 rounded-xl bg-secondary text-white font-display font-bold text-sm hover:brightness-105 active:scale-95 transition-all shadow-md flex items-center gap-2">
              <span class="material-symbols-outlined text-lg">save</span>
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(editDiv);
    const editRegionSelect = document.getElementById("edit-form-region");
    if (editRegionSelect && REGIONS_CHILE) {
      editRegionSelect.innerHTML = REGIONS_CHILE.filter((r) => r !== "Todas las regiones").map((r) => `<option value="${r}">${r}</option>`).join("");
    }
  }
  isMounted = true;
  bindAdminEvents();
}
function openLoginModal() {
  ensureAdminElementsMounted();
  const loginModal = document.getElementById("login-modal");
  const errorContainer = document.getElementById("login-error-container");
  if (errorContainer) errorContainer.classList.add("hidden");
  document.getElementById("login-form")?.reset();
  if (loginModal) loginModal.classList.remove("hidden");
}
function openEditModal(race) {
  if (!race) return;
  ensureAdminElementsMounted();
  const editModal = document.getElementById("edit-modal");
  document.getElementById("edit-race-id").value = race.id || "";
  document.getElementById("edit-form-name").value = race.name || "";
  document.getElementById("edit-form-discipline").value = race.discipline || "Ruta";
  const isMultiDay = !!race.endDate && race.endDate !== race.date;
  const isMultiCheckbox = document.getElementById("edit-form-is-multiday");
  if (isMultiCheckbox) {
    isMultiCheckbox.checked = isMultiDay;
    toggleEditMultiDay(isMultiDay);
  }
  if (isMultiDay) {
    document.getElementById("edit-form-start-date").value = race.date || race.startDate || "";
    document.getElementById("edit-form-end-date").value = race.endDate || "";
  } else {
    document.getElementById("edit-form-date").value = race.date || "";
  }
  document.getElementById("edit-form-region").value = race.region || REGIONS_CHILE[0];
  document.getElementById("edit-form-city").value = race.city || "";
  document.getElementById("edit-form-distance").value = race.distance || "";
  document.getElementById("edit-form-elevation").value = race.elevation || "";
  document.getElementById("edit-form-price").value = race.price || 0;
  document.getElementById("edit-form-is-free").checked = !!race.isFree;
  document.getElementById("edit-form-status").value = race.status || "Inscripciones Abiertas";
  document.getElementById("edit-form-organizer").value = race.organizer || race.organizador || "";
  document.getElementById("edit-form-url").value = race.registrationUrl || "";
  document.getElementById("edit-form-image").value = race.heroImage || "";
  document.getElementById("edit-form-categories").value = Array.isArray(race.categories) ? race.categories.join(", ") : race.categories || "";
  document.getElementById("edit-form-description").value = race.description || "";
  if (editModal) editModal.classList.remove("hidden");
}
function toggleEditMultiDay(show) {
  const singleContainer = document.getElementById("edit-form-single-date-container");
  const startContainer = document.getElementById("edit-form-start-date-container");
  const endContainer = document.getElementById("edit-form-end-date-container");
  if (show) {
    if (singleContainer) singleContainer.classList.add("hidden");
    if (startContainer) startContainer.classList.remove("hidden");
    if (endContainer) endContainer.classList.remove("hidden");
  } else {
    if (singleContainer) singleContainer.classList.remove("hidden");
    if (startContainer) startContainer.classList.add("hidden");
    if (endContainer) endContainer.classList.add("hidden");
  }
}
async function loadPendingRacesList() {
  ensureAdminElementsMounted();
  const container = document.getElementById("pending-races-list");
  const countEl = document.getElementById("pending-count");
  if (!container) return;
  const res = await fetchPendingRacesSupabase();
  if (res.success) {
    if (countEl) countEl.textContent = res.data.length;
    renderPendingRaces(container, res.data);
    bindPendingRaceActionEvents();
  } else {
    if (countEl) countEl.textContent = "0";
    container.innerHTML = `<p class="col-span-full text-center text-red-500 font-bold">Error al cargar propuestas: ${res.error}</p>`;
  }
}
function bindPendingRaceActionEvents() {
  const container = document.getElementById("pending-races-list");
  if (!container) return;
  container.querySelectorAll(".btn-approve-race").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const raceId = e.currentTarget.dataset.id;
      if (!raceId) return;
      btn.disabled = true;
      btn.textContent = "Aprobando...";
      const res = await updateRaceStatusSupabase(raceId, "aprobada");
      if (res.success) {
        showNotificationToast("\u2705 Carrera aprobada con \xE9xito. Ahora es visible en el calendario p\xFAblico.");
        await loadPendingRacesList();
      } else {
        alert("Error al aprobar la carrera: " + res.error);
        btn.disabled = false;
        btn.textContent = "Aprobar";
      }
    });
  });
  container.querySelectorAll(".btn-reject-race").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const raceId = e.currentTarget.dataset.id;
      if (!raceId) return;
      if (!confirm("\xBFEst\xE1s seguro de que deseas rechazar esta propuesta?")) return;
      btn.disabled = true;
      btn.textContent = "Rechazando...";
      const res = await updateRaceStatusSupabase(raceId, "rechazada");
      if (res.success) {
        showNotificationToast("\u{1F6AB} Carrera rechazada.");
        await loadPendingRacesList();
      } else {
        alert("Error al rechazar la carrera: " + res.error);
        btn.disabled = false;
        btn.textContent = "Rechazar";
      }
    });
  });
}
function bindAdminEvents() {
  const closeLoginBtn = document.getElementById("btn-close-login");
  if (closeLoginBtn) {
    closeLoginBtn.addEventListener("click", () => {
      document.getElementById("login-modal")?.classList.add("hidden");
    });
  }
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email")?.value || "";
      const password = document.getElementById("login-password")?.value || "";
      const submitBtn = document.getElementById("btn-submit-login");
      const errorContainer = document.getElementById("login-error-container");
      const errorMsgEl = document.getElementById("login-error-msg");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add("opacity-50");
      }
      const res = await loginAdmin(email, password);
      if (res.success && res.user) {
        const checkAdmin = await checkIsAdmin(res.user.id);
        if (checkAdmin) {
          isAdminState = true;
          if (typeof onAuthChangeCallback === "function") onAuthChangeCallback(true);
          document.getElementById("login-modal")?.classList.add("hidden");
          showNotificationToast("\u{1F513} \xA1Sesi\xF3n iniciada con \xE9xito! Has ingresado como Administrador del sistema.");
        } else {
          await logoutAdmin();
          isAdminState = false;
          if (typeof onAuthChangeCallback === "function") onAuthChangeCallback(false);
          if (errorContainer && errorMsgEl) {
            errorMsgEl.textContent = "Acceso denegado: El usuario no es administrador.";
            errorContainer.classList.remove("hidden");
          }
        }
      } else {
        if (errorContainer && errorMsgEl) {
          errorMsgEl.textContent = res.error || "Credenciales incorrectas o problema de conexi\xF3n.";
          errorContainer.classList.remove("hidden");
        }
      }
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.remove("opacity-50");
      }
    });
  }
  const closeEditBtn = document.getElementById("btn-close-edit");
  if (closeEditBtn) {
    closeEditBtn.addEventListener("click", () => {
      document.getElementById("edit-modal")?.classList.add("hidden");
    });
  }
}
var isMounted, isAdminState, onAuthChangeCallback;
var init_admin = __esm({
  "js/admin.js"() {
    init_supabase();
    init_data();
    init_storage();
    init_ui();
    init_app();
    init_validation();
    isMounted = false;
    isAdminState = false;
    onAuthChangeCallback = null;
  }
});

// js/app.js
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
  const isMultiDay = form.querySelector('[name="isMultiDay"]')?.checked || false;
  const fieldMap = {
    name: "name",
    discipline: "discipline",
    date: isMultiDay ? "startDate" : "date",
    startDate: "startDate",
    endDate: "endDate",
    region: "region",
    organizador: "organizer",
    organizer: "organizer",
    registrationUrl: "registrationUrl",
    city: "city",
    distance: "distance",
    description: "description"
  };
  for (const [key, errorMsg] of Object.entries(errors)) {
    let fieldName = fieldMap[key] || key;
    let inputElem = form.querySelector(`[name="${fieldName}"]`) || form.querySelector(`#form-${fieldName}`) || form.querySelector(`#edit-form-${fieldName}`);
    if (isMultiDay && (key === "date" || key === "startDate")) {
      inputElem = form.querySelector('[name="startDate"]') || form.querySelector("#form-start-date") || form.querySelector("#edit-form-start-date") || inputElem;
    }
    if (inputElem) {
      inputElem.classList.add("border-secondary", "ring-1", "ring-secondary");
      const errEl = document.createElement("p");
      errEl.className = "field-error-msg text-secondary text-xs font-semibold mt-1 flex items-center gap-1";
      errEl.innerHTML = `<span class="material-symbols-outlined text-sm">error</span> ${errorMsg}`;
      const parent = inputElem.closest(".space-y-2") || inputElem.parentNode;
      if (parent) {
        parent.appendChild(errEl);
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
  const filteredList = races.filter((race) => {
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
  filteredList.sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(a.date) - new Date(b.date);
  });
  return filteredList;
}
function renderSkeletons(container, count = 3) {
  if (!container) return;
  let html = "";
  for (let i = 0; i < count; i++) {
    html += `
      <div class="bg-surface border border-outline-variant/30 rounded-3xl overflow-hidden shadow-sm animate-pulse">
        <div class="h-48 bg-surface-container-high w-full"></div>
        <div class="p-6 space-y-4">
          <div class="h-4 bg-surface-container-high rounded w-1/3"></div>
          <div class="h-6 bg-surface-container-high rounded w-3/4"></div>
          <div class="h-4 bg-surface-container-high rounded w-1/2"></div>
          <div class="pt-4 border-t border-outline-variant/20 flex justify-between items-center">
            <div class="h-4 bg-surface-container-high rounded w-1/4"></div>
            <div class="h-8 bg-surface-container-high rounded w-1/3"></div>
          </div>
        </div>
      </div>
    `;
  }
  container.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">${html}</div>`;
}
async function updateCalendar() {
  const cardsContainer = document.getElementById("races-container");
  if (activeViewMode === "cards" || !activeViewMode) {
    if (cardsContainer) {
      cardsContainer.classList.remove("hidden");
      renderSkeletons(cardsContainer, 3);
    }
  }
  const filteredRaces = await getFilteredRaces();
  const monthContainer = document.getElementById("month-grid-container");
  const weekContainer = document.getElementById("week-grid-container");
  const dayContainer = document.getElementById("day-grid-container");
  if (cardsContainer) cardsContainer.classList.add("hidden");
  if (monthContainer) monthContainer.classList.add("hidden");
  if (weekContainer) weekContainer.classList.add("hidden");
  if (dayContainer) dayContainer.classList.add("hidden");
  if (activeViewMode === "month") {
    if (monthContainer) {
      monthContainer.classList.remove("hidden");
      renderMonthGrid(monthContainer, filteredRaces, currentMonth);
    }
  } else if (activeViewMode === "week") {
    if (weekContainer) {
      weekContainer.classList.remove("hidden");
      renderWeekGrid(weekContainer, filteredRaces);
    }
  } else if (activeViewMode === "day") {
    if (dayContainer) {
      dayContainer.classList.remove("hidden");
      renderDayGrid(dayContainer, filteredRaces);
    }
  } else {
    if (cardsContainer) {
      cardsContainer.classList.remove("hidden");
      renderRaceCards(cardsContainer, filteredRaces, isAdmin);
    }
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
function setupImageUploadHandlers() {
  const configureForm = (zoneId, fileInputId, urlInputId, previewContainerId, previewImgId, removeBtnId) => {
    const zone = document.getElementById(zoneId);
    const fileInput = document.getElementById(fileInputId);
    const urlInput = document.getElementById(urlInputId);
    const previewContainer = document.getElementById(previewContainerId);
    const previewImg = document.getElementById(previewImgId);
    const removeBtn = document.getElementById(removeBtnId);
    if (!zone || !fileInput || !urlInput) return;
    zone.addEventListener("click", () => fileInput.click());
    ["dragenter", "dragover"].forEach((eventName) => {
      zone.addEventListener(eventName, (e) => {
        e.preventDefault();
        zone.classList.add("border-primary", "bg-primary/5");
      }, false);
    });
    ["dragleave", "drop"].forEach((eventName) => {
      zone.addEventListener(eventName, (e) => {
        e.preventDefault();
        zone.classList.remove("border-primary", "bg-primary/5");
      }, false);
    });
    zone.addEventListener("drop", (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files && files.length > 0) {
        processImageFile(files[0]);
      }
    });
    fileInput.addEventListener("change", (e) => {
      if (e.target.files && e.target.files.length > 0) {
        processImageFile(e.target.files[0]);
      }
    });
    urlInput.addEventListener("input", (e) => {
      const val = e.target.value.trim();
      if (val) {
        if (previewImg) previewImg.src = val;
        if (previewContainer) previewContainer.classList.remove("hidden");
      } else {
        if (previewContainer) previewContainer.classList.add("hidden");
      }
    });
    if (removeBtn) {
      removeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        fileInput.value = "";
        urlInput.value = "";
        if (previewContainer) previewContainer.classList.add("hidden");
        if (previewImg) previewImg.src = "";
      });
    }
    async function processImageFile(file) {
      if (!file.type.startsWith("image/")) {
        showNotificationToast("\u26A0\uFE0F Por favor selecciona un archivo de imagen v\xE1lido.");
        return;
      }
      const originalHtml = zone.innerHTML;
      zone.innerHTML = `
        <span class="material-symbols-outlined text-primary text-3xl animate-spin">sync</span>
        <span class="text-xs font-bold text-primary">Subiendo...</span>
      `;
      zone.style.pointerEvents = "none";
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Data = event.target.result;
        if (previewImg) previewImg.src = base64Data;
        if (previewContainer) previewContainer.classList.remove("hidden");
        let finalUrl = base64Data;
        try {
          const uploadRes = await uploadRaceImageSupabase(file);
          if (uploadRes && uploadRes.success && uploadRes.url) {
            finalUrl = uploadRes.url;
            showNotificationToast("\u{1F4F8} Imagen subida a Storage correctamente.");
          } else {
            console.warn("Fallo Storage, usando fallback Base64:", uploadRes?.error);
            showNotificationToast("\u{1F4BE} Imagen procesada localmente.");
          }
        } catch (err) {
          console.warn("Error subiendo imagen, usando Base64:", err);
        }
        urlInput.value = finalUrl;
        zone.innerHTML = originalHtml;
        zone.style.pointerEvents = "auto";
      };
      reader.readAsDataURL(file);
    }
  };
  configureForm(
    "form-upload-zone",
    "form-image-file",
    "form-image",
    "form-image-preview-container",
    "form-image-preview",
    "btn-remove-form-image"
  );
  configureForm(
    "edit-form-upload-zone",
    "edit-form-image-file",
    "edit-form-image",
    "edit-form-image-preview-container",
    "edit-form-image-preview",
    "btn-remove-edit-image"
  );
}
function setupEventHandlers() {
  setupImageUploadHandlers();
  const viewModes = ["cards", "month", "week", "day"];
  viewModes.forEach((mode) => {
    const btn = document.getElementById(`btn-view-${mode}`);
    if (btn) {
      btn.addEventListener("click", () => {
        activeViewMode = mode;
        viewModes.forEach((m) => {
          const b = document.getElementById(`btn-view-${m}`);
          if (b) {
            if (m === mode) {
              b.className = "view-mode-btn px-3.5 py-2 rounded-xl bg-primary text-white font-bold transition-all flex items-center gap-1.5 shadow-sm";
            } else {
              b.className = "view-mode-btn px-3.5 py-2 rounded-xl text-outline hover:text-primary transition-all flex items-center gap-1.5";
            }
          }
        });
        updateCalendar();
      });
    }
  });
  const isMultiDayCheck = document.getElementById("form-is-multiday");
  if (isMultiDayCheck) {
    isMultiDayCheck.addEventListener("change", (e) => {
      const checked = e.target.checked;
      const singleContainer = document.getElementById("form-single-date-container");
      const startContainer = document.getElementById("form-start-date-container");
      const endContainer = document.getElementById("form-end-date-container");
      if (checked) {
        if (singleContainer) singleContainer.classList.add("hidden");
        if (startContainer) startContainer.classList.remove("hidden");
        if (endContainer) endContainer.classList.remove("hidden");
        const singleVal = document.getElementById("form-date")?.value;
        if (singleVal && !document.getElementById("form-start-date")?.value) {
          document.getElementById("form-start-date").value = singleVal;
        }
      } else {
        if (singleContainer) singleContainer.classList.remove("hidden");
        if (startContainer) startContainer.classList.add("hidden");
        if (endContainer) endContainer.classList.add("hidden");
      }
    });
  }
  const editIsMultiDayCheck = document.getElementById("edit-form-is-multiday");
  if (editIsMultiDayCheck) {
    editIsMultiDayCheck.addEventListener("change", (e) => {
      const checked = e.target.checked;
      const singleContainer = document.getElementById("edit-form-single-date-container");
      const startContainer = document.getElementById("edit-form-start-date-container");
      const endContainer = document.getElementById("edit-form-end-date-container");
      if (checked) {
        if (singleContainer) singleContainer.classList.add("hidden");
        if (startContainer) startContainer.classList.remove("hidden");
        if (endContainer) endContainer.classList.remove("hidden");
        const singleVal = document.getElementById("edit-form-date")?.value;
        if (singleVal && !document.getElementById("edit-form-start-date")?.value) {
          document.getElementById("edit-form-start-date").value = singleVal;
        }
      } else {
        if (singleContainer) singleContainer.classList.remove("hidden");
        if (startContainer) startContainer.classList.add("hidden");
        if (endContainer) endContainer.classList.add("hidden");
      }
    });
  }
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
        navigateTo("/");
      });
    }
  });
  navAgendaIds.forEach((id) => {
    const elem = document.getElementById(id);
    if (elem) {
      elem.addEventListener("click", (e) => {
        e.preventDefault();
        navigateTo("/agenda");
      });
    }
  });
  navPublishIds.forEach((id) => {
    const elem = document.getElementById(id);
    if (elem) {
      elem.addEventListener("click", (e) => {
        e.preventDefault();
        navigateTo("/publicar");
      });
    }
  });
  navLogoIds.forEach((id) => {
    const elem = document.getElementById(id);
    if (elem) {
      elem.addEventListener("click", (e) => {
        e.preventDefault();
        navigateTo("/");
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
      const editBtn = e.target.closest("[data-edit-id]");
      if (editBtn) {
        e.stopPropagation();
        const raceId = editBtn.getAttribute("data-edit-id");
        openEditModal2(raceId);
        return;
      }
      const deleteBtn = e.target.closest("[data-delete-id]");
      if (deleteBtn) {
        e.stopPropagation();
        const raceId = deleteBtn.getAttribute("data-delete-id");
        handleDeleteRace(raceId);
        return;
      }
      const detailBtn = e.target.closest("[data-race-id]");
      if (detailBtn) {
        const raceId = detailBtn.getAttribute("data-race-id");
        if (raceId) {
          navigateTo(`/evento/${raceId}`);
        }
      }
    });
  }
  const detailContainer = document.getElementById("detail-content");
  if (detailContainer) {
    detailContainer.addEventListener("click", async (e) => {
      const backBtn = e.target.closest("#btn-back-to-calendar");
      if (backBtn) {
        navigateTo("/");
        return;
      }
      const editBtn = e.target.closest("[data-edit-id]");
      if (editBtn) {
        const raceId = editBtn.getAttribute("data-edit-id");
        const { openEditModal: openEditModal3 } = await Promise.resolve().then(() => (init_admin(), admin_exports));
        const races = await getAllRaces();
        const race = races.find((r) => String(r.id) === String(raceId));
        if (race) openEditModal3(race);
        return;
      }
      const deleteBtn = e.target.closest("[data-delete-id]");
      if (deleteBtn) {
        const raceId = deleteBtn.getAttribute("data-delete-id");
        handleDeleteRace(raceId);
        return;
      }
      const bookmarkBtn = e.target.closest("[data-bookmark-id]");
      if (bookmarkBtn) {
        const raceId = bookmarkBtn.getAttribute("data-bookmark-id");
        toggleBookmark(raceId);
        const races = await getAllRaces();
        const race = races.find((r) => r.id === raceId);
        if (race) {
          renderDetailView(detailContainer, race, isAdmin);
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
      const originalSubmitHtml = submitBtn ? submitBtn.innerHTML : "";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add("opacity-50", "cursor-not-allowed");
        submitBtn.innerHTML = `
          <span class="material-symbols-outlined text-lg animate-spin">sync</span>
          <span>Publicando...</span>
        `;
      }
      const formData = new FormData(raceForm);
      const isFree = document.getElementById("form-is-free")?.checked || false;
      const dateStr = formData.get("date") || "";
      const isMultiDay = document.getElementById("form-is-multiday")?.checked || false;
      const startDateVal = document.getElementById("form-start-date")?.value || "";
      const endDateVal = document.getElementById("form-end-date")?.value || "";
      const singleDateVal = formData.get("date") || "";
      const rawFormData = {
        name: formData.get("name") || "",
        discipline: formData.get("discipline") || "",
        isMultiDay,
        date: isMultiDay ? startDateVal || singleDateVal : singleDateVal,
        startDate: isMultiDay ? startDateVal || singleDateVal : singleDateVal,
        endDate: isMultiDay ? endDateVal || startDateVal || singleDateVal : singleDateVal,
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
          submitBtn.innerHTML = originalSubmitHtml;
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
          submitBtn.innerHTML = originalSubmitHtml;
        }
        return;
      }
      showNotificationToast("\xA1Propuesta de carrera enviada a moderaci\xF3n! Tu evento ha sido registrado en estado 'pendiente' y se mostrar\xE1 en el calendario p\xFAblico una vez sea revisado y aprobado por el administrador.");
      raceForm.reset();
      const singleContainer = document.getElementById("form-single-date-container");
      const startContainer = document.getElementById("form-start-date-container");
      const endContainer = document.getElementById("form-end-date-container");
      if (singleContainer) singleContainer.classList.remove("hidden");
      if (startContainer) startContainer.classList.add("hidden");
      if (endContainer) endContainer.classList.add("hidden");
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.remove("opacity-50", "cursor-not-allowed");
        submitBtn.innerHTML = originalSubmitHtml;
      }
      activeTab = "all";
      switchView("calendar");
      await updateCalendar();
    });
  }
  const loginModal = document.getElementById("login-modal");
  const editModal = document.getElementById("edit-modal");
  const openLoginBtns = ["nav-admin-login", "mobile-nav-admin-login"];
  openLoginBtns.forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("click", async (e) => {
        e.preventDefault();
        const { openLoginModal: openLoginModal2, setAuthChangeCallback: setAuthChangeCallback2 } = await Promise.resolve().then(() => (init_admin(), admin_exports));
        setAuthChangeCallback2((loggedIn) => {
          isAdmin = loggedIn;
          updateAuthUI();
          if (loggedIn) updateCalendar();
        });
        openLoginModal2();
      });
    }
  });
  const logoutBtns = ["nav-admin-logout", "mobile-nav-admin-logout"];
  logoutBtns.forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("click", async (e) => {
        e.preventDefault();
        const res = await logoutAdmin();
        if (res.success) {
          isAdmin = false;
          updateAuthUI();
          navigateTo("/");
          showNotificationToast("\u{1F512} Sesi\xF3n de administrador cerrada.");
          await updateCalendar();
        }
      });
    }
  });
  const adminPanelBtns = ["nav-admin-panel", "mobile-nav-admin-panel"];
  adminPanelBtns.forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        navigateTo("/admin");
      });
    }
  });
  const closeEditBtn = document.getElementById("btn-close-edit");
  if (closeEditBtn) {
    closeEditBtn.addEventListener("click", () => {
      if (editModal) editModal.classList.add("hidden");
    });
  }
  const cancelEditBtn = document.getElementById("btn-cancel-edit");
  if (cancelEditBtn) {
    cancelEditBtn.addEventListener("click", () => {
      if (editModal) editModal.classList.add("hidden");
    });
  }
  const pendingRacesList = document.getElementById("pending-races-list");
  if (pendingRacesList) {
    pendingRacesList.addEventListener("click", async (e) => {
      const approveBtn = e.target.closest("[data-approve-id]");
      if (approveBtn) {
        const id = approveBtn.getAttribute("data-approve-id");
        approveBtn.disabled = true;
        const res = await updateRaceStatusSupabase(id, "aprobada");
        if (res.success) {
          showNotificationToast("\u2705 Carrera aprobada con \xE9xito. Ya es visible en el calendario.");
          await loadPendingRacesList2();
          await updateCalendar();
        } else {
          showNotificationToast("\u26A0\uFE0F No se pudo aprobar la carrera: " + res.error);
          approveBtn.disabled = false;
        }
        return;
      }
      const rejectBtn = e.target.closest("[data-reject-id]");
      if (rejectBtn) {
        const id = rejectBtn.getAttribute("data-reject-id");
        rejectBtn.disabled = true;
        const res = await updateRaceStatusSupabase(id, "rechazada");
        if (res.success) {
          showNotificationToast("\u274C Propuesta rechazada.");
          await loadPendingRacesList2();
          await updateCalendar();
        } else {
          showNotificationToast("\u26A0\uFE0F No se pudo rechazar la carrera: " + res.error);
          rejectBtn.disabled = false;
        }
      }
    });
  }
  const editForm = document.getElementById("edit-form");
  if (editForm) {
    editForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const raceId = document.getElementById("edit-race-id")?.value;
      if (!raceId) return;
      const submitBtn = document.getElementById("btn-save-edit");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add("opacity-50");
      }
      const isFree = document.getElementById("edit-form-is-free")?.checked || false;
      const formData = new FormData(editForm);
      const isMultiDay = document.getElementById("edit-form-is-multiday")?.checked || false;
      const startDateVal = document.getElementById("edit-form-start-date")?.value || "";
      const endDateVal = document.getElementById("edit-form-end-date")?.value || "";
      const singleDateVal = formData.get("date") || "";
      const rawFormData = {
        name: formData.get("name") || "",
        discipline: formData.get("discipline") || "",
        isMultiDay,
        date: isMultiDay ? startDateVal || singleDateVal : singleDateVal,
        startDate: isMultiDay ? startDateVal || singleDateVal : singleDateVal,
        endDate: isMultiDay ? endDateVal || startDateVal || singleDateVal : singleDateVal,
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
        renderFormErrors(editForm, validationResult.errors);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove("opacity-50");
        }
        return;
      }
      clearFormErrors(editForm);
      const res = await updateRace(raceId, validationResult.sanitizedData);
      if (res.success) {
        showNotificationToast("\u{1F4BE} Cambios guardados con \xE9xito.");
        if (editModal) editModal.classList.add("hidden");
        await updateCalendar();
        if (document.getElementById("view-detail")?.classList.contains("hidden") === false && currentRaceId === raceId) {
          const races = await getAllRaces();
          const updatedRace = races.find((r) => r.id === raceId);
          if (updatedRace) {
            renderDetailView(document.getElementById("detail-content"), updatedRace, isAdmin);
          }
        }
      } else {
        showNotificationToast("\u26A0\uFE0F Error al guardar los cambios: " + res.error);
      }
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.remove("opacity-50");
      }
    });
  }
}
function updateAuthUI() {
  const adminPanelBtns = [document.getElementById("nav-admin-panel"), document.getElementById("mobile-nav-admin-panel")];
  const adminLogoutBtns = [document.getElementById("nav-admin-logout"), document.getElementById("mobile-nav-admin-logout")];
  const adminLoginBtns = [document.getElementById("nav-admin-login"), document.getElementById("mobile-nav-admin-login")];
  adminPanelBtns.forEach((btn) => {
    if (btn) {
      if (isAdmin) btn.classList.remove("hidden");
      else btn.classList.add("hidden");
    }
  });
  adminLogoutBtns.forEach((btn) => {
    if (btn) {
      if (isAdmin) btn.classList.remove("hidden");
      else btn.classList.add("hidden");
    }
  });
  adminLoginBtns.forEach((btn) => {
    if (btn) {
      if (isAdmin) btn.classList.add("hidden");
      else btn.classList.remove("hidden");
    }
  });
}
async function loadPendingRacesList2() {
  const container = document.getElementById("pending-races-list");
  const countEl = document.getElementById("pending-count");
  if (!container) return;
  const pending = await fetchPendingRacesSupabase();
  if (countEl) countEl.textContent = pending.length;
  renderPendingRaces(container, pending);
}
async function openEditModal2(raceId) {
  const editModal = document.getElementById("edit-modal");
  if (!editModal) return;
  const races = await getAllRaces();
  const race = races.find((r) => r.id === raceId);
  if (!race) return;
  document.getElementById("edit-race-id").value = raceId;
  document.getElementById("edit-form-name").value = race.name || "";
  document.getElementById("edit-form-discipline").value = race.discipline || "Ruta";
  const startDate = race.startDate || race.fecha_inicio || race.date || "";
  const endDate = race.endDate || race.fecha_fin || startDate;
  const isMultiDay = !!(startDate && endDate && startDate !== endDate);
  const isMultiDayCheck = document.getElementById("edit-form-is-multiday");
  if (isMultiDayCheck) {
    isMultiDayCheck.checked = isMultiDay;
    const singleContainer = document.getElementById("edit-form-single-date-container");
    const startContainer = document.getElementById("edit-form-start-date-container");
    const endContainer = document.getElementById("edit-form-end-date-container");
    if (isMultiDay) {
      if (singleContainer) singleContainer.classList.add("hidden");
      if (startContainer) startContainer.classList.remove("hidden");
      if (endContainer) endContainer.classList.remove("hidden");
    } else {
      if (singleContainer) singleContainer.classList.remove("hidden");
      if (startContainer) startContainer.classList.add("hidden");
      if (endContainer) endContainer.classList.add("hidden");
    }
  }
  document.getElementById("edit-form-date").value = startDate;
  if (document.getElementById("edit-form-start-date")) {
    document.getElementById("edit-form-start-date").value = startDate;
  }
  if (document.getElementById("edit-form-end-date")) {
    document.getElementById("edit-form-end-date").value = endDate;
  }
  document.getElementById("edit-form-city").value = race.city || "";
  document.getElementById("edit-form-distance").value = race.distance || "";
  document.getElementById("edit-form-elevation").value = race.elevation || "";
  document.getElementById("edit-form-price").value = race.price || 0;
  document.getElementById("edit-form-is-free").checked = !!race.isFree || race.price === 0;
  document.getElementById("edit-form-status").value = race.status || "Inscripciones Abiertas";
  document.getElementById("edit-form-organizer").value = race.organizer || race.organizador || "";
  document.getElementById("edit-form-url").value = race.registrationUrl || "";
  document.getElementById("edit-form-image").value = race.heroImage || "";
  const editPreviewContainer = document.getElementById("edit-form-image-preview-container");
  const editPreviewImg = document.getElementById("edit-form-image-preview");
  if (editPreviewContainer && editPreviewImg && race.heroImage) {
    editPreviewImg.src = race.heroImage;
    editPreviewContainer.classList.remove("hidden");
  } else if (editPreviewContainer) {
    editPreviewContainer.classList.add("hidden");
  }
  document.getElementById("edit-form-categories").value = Array.isArray(race.categories) ? race.categories.join(", ") : "";
  document.getElementById("edit-form-description").value = race.description || "";
  const editRegionSelect = document.getElementById("edit-form-region");
  if (editRegionSelect) {
    const filterRegions = REGIONS_CHILE.filter((r) => r !== "Todas las regiones");
    renderRegionSelect(editRegionSelect, filterRegions, race.region || filterRegions[0]);
  }
  const editForm = document.getElementById("edit-form");
  if (editForm) clearFormErrors(editForm);
  editModal.classList.remove("hidden");
}
async function handleDeleteRace(raceId) {
  const confirmed = confirm("\u26A0\uFE0F \xBFEst\xE1s seguro de que deseas eliminar esta carrera de forma permanente? Esta acci\xF3n no se puede deshacer.");
  if (!confirmed) return;
  const res = await deleteRace(raceId);
  if (res.success) {
    showNotificationToast("\u{1F5D1}\uFE0F Carrera eliminada con \xE9xito.");
    switchView("calendar");
    await updateCalendar();
  } else {
    showNotificationToast("\u26A0\uFE0F No se pudo eliminar la carrera: " + res.error);
  }
}
async function initApp() {
  const regionSelectContainer = document.getElementById("region-select");
  if (regionSelectContainer) {
    renderRegionSelect(regionSelectContainer, REGIONS_CHILE, currentRegion);
  }
  const filterRegions = REGIONS_CHILE.filter((r) => r !== "Todas las regiones");
  const publishRegionSelect = document.getElementById("form-region");
  if (publishRegionSelect) {
    renderRegionSelect(publishRegionSelect, filterRegions, filterRegions[0]);
  }
  const editRegionSelect = document.getElementById("edit-form-region");
  if (editRegionSelect) {
    renderRegionSelect(editRegionSelect, filterRegions, filterRegions[0]);
  }
  const disciplineChipsContainer = document.getElementById("discipline-chips");
  if (disciplineChipsContainer) {
    renderDisciplineChips(disciplineChipsContainer, currentDiscipline);
  }
  setupEventHandlers();
  const user = await getCurrentUser();
  if (user) {
    isAdmin = await checkIsAdmin(user.id);
  } else {
    isAdmin = false;
  }
  updateAuthUI();
  initRouter(async (route) => {
    const { viewName, params } = route;
    const urlParams = new URLSearchParams(window.location.search);
    const discParam = urlParams.get("disciplina");
    if (discParam) {
      currentDiscipline = discParam;
      const disciplineChipsContainer2 = document.getElementById("discipline-chips");
      if (disciplineChipsContainer2) {
        renderDisciplineChips(disciplineChipsContainer2, currentDiscipline);
      }
    }
    if (viewName === "admin-panel") {
      const { ensureAdminElementsMounted: ensureAdminElementsMounted2, loadPendingRacesList: loadPendingRacesList3, openLoginModal: openLoginModal2 } = await Promise.resolve().then(() => (init_admin(), admin_exports));
      ensureAdminElementsMounted2();
      if (!isAdmin) {
        openLoginModal2();
        navigateTo("/");
        return;
      }
      switchView("admin-panel");
      await loadPendingRacesList3();
      return;
    }
    if (viewName === "detail" && params.id) {
      const races = await getAllRaces();
      const race = races.find((r) => String(r.id) === String(params.id));
      if (race) {
        currentRaceId = race.id;
        const detailContainer = document.getElementById("detail-content");
        if (detailContainer) {
          renderDetailView(detailContainer, race, isAdmin);
        }
        switchView("detail");
        return;
      }
    }
    if (viewName === "agenda") {
      activeTab = "my-calendar";
      switchView("agenda");
      await updateCalendar();
      return;
    }
    if (viewName === "register") {
      switchView("register");
      return;
    }
    activeTab = "all";
    switchView("calendar");
    await updateCalendar();
  });
}
var currentDiscipline, currentRegion, currentMonth, searchQuery, activeTab, activeViewMode, currentRaceId, isAdmin;
var init_app = __esm({
  "js/app.js"() {
    init_router();
    init_data();
    init_storage();
    init_ui();
    init_validation();
    init_supabase();
    currentDiscipline = "Todas";
    currentRegion = "Todas las regiones";
    currentMonth = "Todos";
    searchQuery = "";
    activeTab = "all";
    activeViewMode = "cards";
    currentRaceId = null;
    isAdmin = false;
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initApp);
    } else {
      initApp();
    }
  }
});
init_app();
export {
  clearFormErrors,
  getFilteredRaces,
  handleDeleteRace,
  loadPendingRacesList2 as loadPendingRacesList,
  openEditModal2 as openEditModal,
  renderFormErrors,
  renderSkeletons,
  showNotificationToast,
  updateAuthUI,
  updateCalendar
};
