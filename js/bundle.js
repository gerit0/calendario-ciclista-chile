var Ht=Object.defineProperty;var V=(e,t,n)=>()=>{if(n)throw n[0];try{return e&&(t=e(e=0)),t}catch(a){throw n=[a],a}};var Vt=(e,t)=>{for(var n in t)Ht(e,n,{get:t[n],enumerable:!0})};function Oe(){let e=window.location.pathname||"/";if(e==="/"||e===""||e==="/index.html")return{viewName:"calendar",params:{},path:"/"};if(e==="/agenda"||e==="/agenda/")return{viewName:"agenda",params:{},path:"/agenda"};if(e==="/publicar"||e==="/publicar/")return{viewName:"register",params:{},path:"/publicar"};if(e==="/admin"||e==="/admin/")return{viewName:"admin-panel",params:{},path:"/admin"};let t=e.match(/^\/evento\/([^/]+)/);return t?{viewName:"detail",params:{id:t[1]},path:e}:{viewName:"calendar",params:{},path:"/"}}function U(e,t={}){window.location.pathname!==e&&window.history.pushState(t,"",e),typeof te=="function"&&te(Oe())}function st(e){te=e,window.addEventListener("popstate",()=>{typeof te=="function"&&te(Oe())}),document.addEventListener("click",t=>{let n=t.target.closest("a");if(!n)return;let a=n.getAttribute("href");a&&a.startsWith("/")&&!a.startsWith("//")&&!n.hasAttribute("target")&&!n.hasAttribute("download")&&(t.preventDefault(),U(a))}),typeof te=="function"&&te(Oe())}var te,ot=V(()=>{te=null});var K,Pe,Le=V(()=>{K=["Todas las regiones","Regi\xF3n de Arica y Parinacota","Regi\xF3n de Tarapac\xE1","Regi\xF3n de Antofagasta","Regi\xF3n de Atacama","Regi\xF3n de Coquimbo","Regi\xF3n de Valpara\xEDso","Regi\xF3n Metropolitana de Santiago","Regi\xF3n del Libertador General Bernardo O'Higgins","Regi\xF3n del Maule","Regi\xF3n de \xD1uble","Regi\xF3n del Biob\xEDo","Regi\xF3n de La Araucan\xEDa","Regi\xF3n de Los R\xEDos","Regi\xF3n de Los Lagos","Regi\xF3n de Ays\xE9n del General Carlos Ib\xE1\xF1ez del Campo","Regi\xF3n de Magallanes y de la Ant\xE1rtica Chilena"],Pe=[]});function Ue(e){return e?String(e).trim().split("T")[0].replace(/-/g,""):""}function lt(e,t){let n=(e||"").trim().split("T")[0],a=(t||n).trim().split("T")[0];if(!a)return"";let i=a.split("-").map(Number);if(i.length<3||isNaN(i[0])||isNaN(i[1])||isNaN(i[2]))return"";let o=new Date(i[0],i[1]-1,i[2]+1),s=o.getFullYear(),r=String(o.getMonth()+1).padStart(2,"0"),l=String(o.getDate()).padStart(2,"0");return`${s}${r}${l}`}function qt(e){if(!e)return"";let t=e.name||e.nombre||"Carrera de Ciclismo",n=Ue(e.startDate||e.fecha_inicio||e.date||e.fecha),a=lt(e.startDate||e.fecha_inicio||e.date||e.fecha,e.endDate||e.fecha_fin),i=e.city||e.ubicacion||"",o=e.region||"",s=[i,o].filter(Boolean).join(", ")||"Chile",r=e.discipline||e.disciplina||"Ciclismo",l=e.distance||e.distancia||"N/A",d=e.elevation||e.desnivel||"N/A",m=e.description||e.descripcion||"",g=`Disciplina: ${r}
Distancia: ${l} | Desnivel: ${d}
${m}

M\xE1s informaci\xF3n en CalendarioCiclista Chile: https://calendariociclista.vercel.app/evento/${e.id}`,h=x=>String(x||"").replace(/\\/g,"\\\\").replace(/;/g,"\\;").replace(/,/g,"\\,").replace(/\n/g,"\\n");return["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//CalendarioCiclista Chile//NONSGML v1.0//ES","CALSCALE:GREGORIAN","METHOD:PUBLISH","BEGIN:VEVENT",`UID:carrera-${e.id}@calendariociclista.vercel.app`,`DTSTAMP:${Ue(new Date().toISOString())}T000000Z`,`DTSTART;VALUE=DATE:${n}`,`DTEND;VALUE=DATE:${a}`,`SUMMARY:${h(t)}`,`DESCRIPTION:${h(g)}`,`LOCATION:${h(s)}`,`URL:https://calendariociclista.vercel.app/evento/${e.id}`,"STATUS:CONFIRMED","END:VEVENT","END:VCALENDAR"].join(`\r
`)}function dt(e){if(!e)return"#";let t=e.name||e.nombre||"Carrera de Ciclismo",n=Ue(e.startDate||e.fecha_inicio||e.date||e.fecha),a=lt(e.startDate||e.fecha_inicio||e.date||e.fecha,e.endDate||e.fecha_fin),i=e.city||e.ubicacion||"",o=e.region||"",s=[i,o].filter(Boolean).join(", ")||"Chile",r=e.discipline||e.disciplina||"Ciclismo",l=e.distance||e.distancia||"N/A",d=e.elevation||e.desnivel||"N/A",m=e.description||e.descripcion||"",g=`Disciplina: ${r}
Distancia: ${l} | Desnivel: ${d}
${m}

M\xE1s informaci\xF3n: https://calendariociclista.vercel.app/evento/${e.id}`,h="https://calendar.google.com/calendar/render",x=new URLSearchParams({action:"TEMPLATE",text:t,dates:`${n}/${a}`,details:g,location:s});return`${h}?${x.toString()}`}function ct(e){let t=qt(e);if(!t)return;let n=new Blob([t],{type:"text/calendar;charset=utf-8"}),a=URL.createObjectURL(n),i=document.createElement("a"),o=(e.name||e.nombre||"carrera").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");i.href=a,i.download=`${o}.ics`,document.body.appendChild(i),i.click(),document.body.removeChild(i),URL.revokeObjectURL(a)}var ut=V(()=>{});import{createClient as Gt}from"@supabase/supabase-js";function mt(){let e=typeof window<"u"&&window.SUPABASE_URL?String(window.SUPABASE_URL).trim():Jt,t=typeof window<"u"&&window.SUPABASE_ANON_KEY?String(window.SUPABASE_ANON_KEY).trim():Yt;return{url:e,key:t}}function X(){let{url:e,key:t}=mt();if(!e||!t||e.includes("YOUR_SUPABASE_URL")||t.includes("YOUR_SUPABASE_ANON_KEY"))return!1;try{let n=new URL(e);return n.protocol==="http:"||n.protocol==="https:"}catch{return!1}}function N(){if(Se)return Se;if(!X())return null;let{url:e,key:t}=mt();try{return Se=Gt(e,t),Se}catch(n){return console.error("Error al inicializar el cliente de Supabase:",n),null}}function Fe(e){let t=e.precio!=null?Number(e.precio):0,n=e.fecha||"",a="";if(e.fecha)try{let r=new Date(e.fecha+"T00:00:00");if(!isNaN(r.getTime())){let l=r.toLocaleDateString("es-CL",{month:"long"});a=l.charAt(0).toUpperCase()+l.slice(1),n=r.toLocaleDateString("es-CL",{day:"numeric",month:"long",year:"numeric"})}}catch{n=e.fecha}let i=[];Array.isArray(e.categoria)?i=e.categoria:typeof e.categoria=="string"&&e.categoria.trim()!==""?i=e.categoria.split(",").map(r=>r.trim()):i=["General"];let o=e.fecha_inicio||e.fecha||"",s=e.fecha_fin||e.fecha_inicio||e.fecha||"";return{id:e.id,name:e.nombre||"",discipline:e.disciplina||"",date:o||e.fecha||"",startDate:o,endDate:s,month:a,displayDate:n,region:e.region||"",city:e.ubicacion||"",distance:e.distancia||"N/A",elevation:e.desnivel||"N/A",price:t,isFree:t===0,status:e.status||(e.estado==="aprobada"?"Inscripciones Abiertas":e.estado),organizer:e.organizador||"",registrationUrl:e.link_inscripcion||"",heroImage:e.hero_image||"",description:e.descripcion||"",categories:i,participants:e.participantes!=null?e.participantes:0,creadoPor:e.creado_por||null}}async function pt(){let e=N();if(!e)return console.warn("Supabase no est\xE1 configurado. Retornando array vac\xEDo."),[];try{let t=new Date,n=`${t.getFullYear()}-01-01`,a=`${t.getFullYear()+1}-12-31`,{data:i,error:o}=await e.from("carreras").select("*").eq("estado","aprobada").gte("fecha",n).lte("fecha",a).order("fecha",{ascending:!0}).limit(500);return o?(console.error("Error al consultar carreras aprobadas en Supabase:",o),[]):Array.isArray(i)?i.map(Fe):[]}catch(t){return console.error("Excepci\xF3n al consultar carreras en Supabase:",t),[]}}async function ft(e){let t=N();if(!t||!e)return null;try{let{data:n,error:a}=await t.from("carreras").select("*").eq("id",e).maybeSingle();return a||!n?null:Fe(n)}catch(n){return console.error("Error al obtener carrera por ID en Supabase:",n),null}}async function gt(e,t){let n=N();if(!n)return{success:!1,error:new Error("Supabase no est\xE1 configurado.")};if(!t)return{success:!1,error:"Se requiere una cuenta de organizador para publicar."};try{let a=e.link_inscripcion||e.registrationUrl||null,i=a&&typeof a=="string"&&a.trim()!=="#"&&/^https?:\/\//i.test(a.trim())?a.trim():null,o={nombre:e.nombre||e.name,fecha:e.fecha||e.date,disciplina:e.disciplina||e.discipline,region:e.region||null,ubicacion:e.ubicacion||e.city||null,distancia:e.distancia||e.distance||null,desnivel:e.desnivel||e.elevation||null,organizador:e.organizador||e.organizer||null,link_inscripcion:i,categoria:Array.isArray(e.categories)?e.categories.join(", "):e.categoria||e.categories||null,precio:e.precio!=null?e.precio:e.price!=null?e.price:0,hero_image:e.hero_image||e.heroImage||null,descripcion:e.descripcion||e.description||null,estado:"aprobada",creado_por:t},s=n.from("carreras").insert([o]),r=new Promise((m,g)=>setTimeout(()=>g(new Error("TIMEOUT_EXCEEDED")),6e3)),{data:l,error:d}=await Promise.race([s,r]);if(d&&(d.code==="PGRST204"||String(d.message||d).includes("column"))){console.warn("Reintentando inserci\xF3n sin columnas de distancia/desnivel...");let m={...o};delete m.distancia,delete m.desnivel;let g=o.distancia?`Distancia: ${o.distancia}`:"",h=o.desnivel?`Desnivel: ${o.desnivel}`:"",x=[g,h].filter(Boolean).join(" | ");x&&(m.descripcion=m.descripcion?`${x}

${m.descripcion}`:x);let y=await n.from("carreras").insert([m]);l=y.data,d=y.error}return d?(console.error("Error al insertar carrera en Supabase:",d),{success:!1,error:d.message||d}):{success:!0,data:l&&l.length>0?l[0]:null}}catch(a){return console.error("Excepci\xF3n al crear carrera en Supabase:",a),{success:!1,error:a.message||a}}}async function bt(e,t){let n=N();if(!n)return{success:!1,error:"Supabase no est\xE1 configurado."};try{let{data:a,error:i}=await n.auth.signUp({email:e,password:t});if(i&&(i.message?.includes("already")||i.message?.includes("registered")||i.status===400)){let{data:s,error:r}=await n.auth.signInWithPassword({email:e,password:t});return r?{success:!1,error:r.message||r}:{success:!0,userId:s.user?.id||null}}return i?{success:!1,error:i.message||i}:{success:!0,userId:a.user?.id||null}}catch(a){return console.error("Error en signUpOrLoginOrganizer:",a),{success:!1,error:a.message||a}}}async function xt(e,t){let n=N();if(!n)return{success:!1,error:"Supabase no est\xE1 configurado."};try{let{data:a,error:i}=await n.auth.signInWithPassword({email:e,password:t});return i?{success:!1,error:i.message||i}:{success:!0,userId:a.user?.id||null}}catch(a){return console.error("Error en loginOrganizer:",a),{success:!1,error:a.message||a}}}async function yt(e,t){let n=N();if(!n)return{success:!1,error:"Supabase no est\xE1 configurado."};try{let{data:a,error:i}=await n.auth.signInWithPassword({email:e,password:t});if(i)throw i;return{success:!0,session:a.session,user:a.user}}catch(a){return console.error("Error al iniciar sesi\xF3n de admin:",a),{success:!1,error:a.message||a}}}async function fe(){let e=N();if(!e)return{success:!1,error:"Supabase no est\xE1 configurado."};try{let{error:t}=await e.auth.signOut();if(t)throw t;return{success:!0}}catch(t){return console.error("Error al cerrar sesi\xF3n:",t),{success:!1,error:t.message||t}}}async function vt(){let e=N();if(!e)return null;try{let{data:{user:t}}=await e.auth.getUser();return t}catch{return null}}async function ge(e){let t=N();if(!t||!e)return!1;try{let{data:n,error:a}=await t.from("usuarios_admin").select("user_id").eq("user_id",e).maybeSingle();if(a)throw a;return!!n}catch(n){return console.error("Error al verificar rol de admin:",n),!1}}async function ke(){let e=N();if(!e)return{success:!1,error:"Supabase no est\xE1 configurado."};try{let{data:t,error:n}=await e.from("carreras").select("*").eq("estado","pendiente").order("fecha",{ascending:!0});return n?(console.error("Error al consultar carreras pendientes:",n),{success:!1,error:n.message||String(n)}):Array.isArray(t)?{success:!0,data:t.map(Fe)}:{success:!0,data:[]}}catch(t){return console.error("Excepci\xF3n al consultar carreras pendientes:",t),{success:!1,error:t.message||String(t)}}}async function se(e,t){let n=N();if(!n)return{success:!1,error:"Supabase no est\xE1 configurado."};try{let{error:a}=await n.from("carreras").update({estado:t}).eq("id",e);if(a)throw a;return{success:!0}}catch(a){return console.error("Error al actualizar estado de carrera:",a),{success:!1,error:a.message||a}}}async function ht(e){let t=N();if(!t)return{success:!1,error:"Supabase no est\xE1 configurado."};try{let{error:n}=await t.from("carreras").delete().eq("id",e);if(n)throw n;return{success:!0}}catch(n){return console.error("Error al eliminar carrera de Supabase:",n),{success:!1,error:n.message||n}}}async function wt(e,t){let n=N();if(!n)return{success:!1,error:"Supabase no est\xE1 configurado."};try{let a=t.registrationUrl||t.link_inscripcion||null,i=a&&typeof a=="string"&&a.trim()!=="#"&&/^https?:\/\//i.test(a.trim())?a.trim():null,o={nombre:t.name||t.nombre,fecha:t.date||t.fecha,disciplina:t.discipline||t.disciplina,region:t.region,ubicacion:t.city||t.ubicacion,distancia:t.distance||t.distancia||null,desnivel:t.elevation||t.desnivel||null,organizador:t.organizer||t.organizador,link_inscripcion:i,categoria:Array.isArray(t.categories)?t.categories.join(", "):t.categoria||t.categories,precio:t.price!=null?Number(t.price):0},l={hero_image:t.heroImage||t.hero_image||null,descripcion:t.description||t.descripcion||null},{error:s}=await n.from("carreras").update(o).eq("id",e);if(s&&(s.code==="PGRST204"||String(s.message||s).includes("column"))){let r={...o};delete r.distancia,delete r.desnivel,s=(await n.from("carreras").update(r).eq("id",e)).error}if(s)throw s;let{error:c}=await n.from("carreras").update(l).eq("id",e);if(c)throw c;return{success:!0}}catch(a){return console.error("Error al actualizar carrera en Supabase:",a),{success:!1,error:a.message||a}}}}async function Et(e){let t=N();if(!t)return{success:!1,error:"Supabase no est\xE1 configurado."};try{let n=e.name.split(".").pop(),i=`hero-images/${`${Date.now()}-${Math.random().toString(36).substring(2,15)}.${n}`}`,{data:o,error:s}=await t.storage.from("race-images").upload(i,e,{cacheControl:"3600",upsert:!1});if(s)throw s;let{data:r}=t.storage.from("race-images").getPublicUrl(i);return{success:!0,url:r.publicUrl}}catch(n){return console.error("Error en uploadRaceImageSupabase:",n),{success:!1,error:n.message||n}}}var Jt,Yt,Se,Ce=V(()=>{Jt="",Yt="",Se=null});function oe(){try{let e=localStorage.getItem(It);if(!e)return[];let t=JSON.parse(e);return Array.isArray(t)?t:[]}catch(e){return console.error("Error leyendo bookmarks de localStorage:",e),[]}}function He(e){if(!e)return oe();let t=oe(),n=t.indexOf(e);n>=0?t.splice(n,1):t.push(e);try{localStorage.setItem(It,JSON.stringify(t))}catch(a){console.error("Error guardando bookmarks en localStorage:",a)}return t}function Ve(e){return e?oe().includes(e):!1}function be(){try{let e=localStorage.getItem($e);if(!e)return[];let t=JSON.parse(e);return Array.isArray(t)?t:[]}catch(e){return console.error("Error leyendo custom races de localStorage:",e),[]}}function Wt(e){if(!e)return be();let t=be();t.unshift(e);try{localStorage.setItem($e,JSON.stringify(t))}catch(n){console.error("Error guardando custom race en localStorage:",n)}return t}async function q(){let e=[];if(X())try{e=await pt()}catch(l){console.error("Error al obtener carreras desde Supabase:",l)}let t=be(),n="calendariociclista_deleted_initial_races",a=[];try{let l=localStorage.getItem(n);l&&(a=JSON.parse(l))}catch(l){console.error("Error leyendo deleted_initial_races:",l)}let i=Pe.filter(l=>!a.includes(l.id)),o=[...e,...t,...i],s=new Set,r=[];for(let l of o)l&&l.id&&!s.has(l.id)&&(s.add(l.id),r.push(l));return r}async function Dt(e,t){if(!e)return{success:!1,source:"none"};if(X())try{let a=await gt(e,t);if(a&&a.success)return{success:!0,source:"supabase",data:a.data};if(a&&a.error)return{success:!1,source:"supabase",error:a.error}}catch(a){return console.error("Error al enviar carrera a Supabase:",a),{success:!1,source:"supabase",error:a.message||a}}return{success:!0,source:"localStorage",data:Wt(e)}}async function Bt(e){if(!e)return{success:!1,error:"ID de carrera inv\xE1lido"};if(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(e)&&X())try{let s=await ht(e);return s.success?{success:!0,source:"supabase"}:{success:!1,error:s.error}}catch(s){return{success:!1,error:s.message||s}}let a=be(),i=a.filter(s=>s.id!==e);if(a.length!==i.length)try{return localStorage.setItem($e,JSON.stringify(i)),{success:!0,source:"localStorage"}}catch(s){return{success:!1,error:"Error al actualizar localStorage: "+s.message}}let o="calendariociclista_deleted_initial_races";try{let s=localStorage.getItem(o),r=s?JSON.parse(s):[];return r.includes(e)||(r.push(e),localStorage.setItem(o,JSON.stringify(r))),{success:!0,source:"localStorage_initial"}}catch(s){return{success:!1,error:"Error al eliminar carrera inicial localmente: "+s.message}}}async function Lt(e,t){if(!e)return{success:!1,error:"ID de carrera inv\xE1lido"};if(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(e)&&X())try{let r=await wt(e,t);return r.success?{success:!0,source:"supabase"}:{success:!1,error:r.error}}catch(r){return{success:!1,error:r.message||r}}let i=be(),o=i.findIndex(r=>r.id===e),s={...t,id:e};if(t.categories&&typeof t.categories=="string"&&(s.categories=t.categories.split(",").map(r=>r.trim()).filter(Boolean)),o>=0)i[o]={...i[o],...s};else{let r=Pe.find(l=>l.id===e)||{};i.unshift({...r,...s})}try{return localStorage.setItem($e,JSON.stringify(i)),{success:!0,source:"localStorage"}}catch(r){return{success:!1,error:"Error al actualizar localStorage: "+r.message}}}var It,$e,Ae=V(()=>{Le();Ce();It="calendariociclista_bookmarks",$e="calendariociclista_custom_races"});function le(e){if(!e||typeof e!="string")return null;let t=e.trim().split("T")[0].split("-");if(t.length!==3)return null;let n=parseInt(t[0],10),a=parseInt(t[1],10)-1,i=parseInt(t[2],10);return isNaN(n)||isNaN(a)||isNaN(i)?null:new Date(n,a,i)}function G(e){if(!e)return{esMultiDia:!1,duracionDias:1,startDateStr:"",endDateStr:"",startDateObj:null,endDateObj:null};let t=(e.startDate||e.fecha_inicio||e.date||"").split("T")[0].trim(),n=(e.endDate||e.fecha_fin||t).split("T")[0].trim(),a=le(t),i=le(n||t);if(!a||!i||isNaN(a.getTime())||isNaN(i.getTime()))return{esMultiDia:!1,duracionDias:1,startDateStr:t,endDateStr:n||t,startDateObj:a,endDateObj:i};let o=i.getTime()-a.getTime(),s=Math.round(o/(1e3*60*60*24)),r=Math.max(1,s+1);return{esMultiDia:r>1,duracionDias:r,startDateStr:t,endDateStr:n,startDateObj:a,endDateObj:i}}function St(e,t){let n=G(e);if(!n.esMultiDia)return null;let a=typeof t=="string"?le(t):t;if(!a||!n.startDateObj||!n.endDateObj||a<n.startDateObj||a>n.endDateObj)return null;let i=a.getTime()-n.startDateObj.getTime();return`D\xEDa ${Math.round(i/(1e3*60*60*24))+1} de ${n.duracionDias}`}function Kt(){let e=new Date;return new Intl.DateTimeFormat("en-CA",{timeZone:"America/Santiago",year:"numeric",month:"2-digit",day:"2-digit"}).format(e)}function Me(e,t){let n=G(e),a=t||Kt(),i=n.startDateStr||"",o=n.endDateStr||i,s=!1,r=!1,l=!1;return o&&o<a?s=!0:i&&i<=a&&a<=o?r=!0:l=!0,{esFinalizada:s,esEnCurso:r,esFutura:l,todayStr:a,startDateStr:i,endDateStr:o}}function qe(e,t){return t||!e||e===0?"Gratis":"$"+Number(e).toLocaleString("es-CL")}function de(e){switch(e){case"Ruta":return"bg-[#181919] text-white";case"MTB":return"bg-[#a73918] text-white";case"Gravel":return"bg-[#1b4332] text-white";case"Pista":return"bg-[#334155] text-white";case"BMX":return"bg-[#d97706] text-white";case"Virtual":return"bg-[#2563eb] text-white";default:return"bg-gray-800 text-white"}}function Ge(e){switch(e){case"Ruta":return"directions_bike";case"MTB":return"terrain";case"Gravel":return"explore";case"Pista":return"sports_score";case"BMX":return"two_wheeler";case"Virtual":return"devices";default:return"directions_bike"}}function Re(e,t="Todas"){e&&(e.innerHTML=Xt.map(n=>`
      <button 
        type="button" 
        data-discipline="${n}" 
        class="chip-discipline px-4 py-2 rounded-xl text-xs sm:text-sm transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${n===t?"bg-primary text-tertiary-fixed font-bold shadow-sm ring-2 ring-primary":"bg-white text-primary hover:bg-surface-container border border-outline-variant/40 font-medium"}"
      >
        <span class="material-symbols-outlined text-base">${n==="Todas"?"apps":Ge(n)}</span>
        ${n}
      </button>
    `).join(""))}function xe(e,t=[],n="Todas las regiones"){if(!e)return;let a=e.tagName==="SELECT"?e:e.querySelector("select");a&&(a.innerHTML=t.map(i=>`
    <option value="${i}" ${i===n?"selected":""}>
      ${i}
    </option>
  `).join(""))}function kt(e,t=[],n=!1,a=null){if(e){if(t.length===0){e.innerHTML=`
      <div class="col-span-full py-16 text-center bg-white rounded-3xl border border-dashed border-outline-variant/60 p-8 space-y-4">
        <div class="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mx-auto text-outline">
          <span class="material-symbols-outlined text-4xl">search_off</span>
        </div>
        <h3 class="font-display font-bold text-xl text-primary">No se encontraron carreras</h3>
        <p class="text-outline text-sm max-w-md mx-auto">
          Intenta cambiar los filtros de disciplina, regi\xF3n, mes o t\xE9rmino de b\xFAsqueda.
        </p>
      </div>
    `;return}e.innerHTML=t.map(i=>{let o=Ve(i.id),s=de(i.discipline),r=qe(i.price,i.isFree),l=G(i),d=Me(i),m=l.esMultiDia?`<span class="px-2.5 py-1 rounded-full text-xs font-black bg-purple-100 text-purple-900 border border-purple-300 flex items-center gap-1 shadow-sm"><span class="material-symbols-outlined text-xs">date_range</span> ${l.duracionDias} d\xEDas</span>`:"",g="";d.esFinalizada?g='<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-700 border border-slate-300">Finalizada</span>':d.esEnCurso?g='<span class="px-2.5 py-1 rounded-full text-xs font-black bg-blue-600 text-white border border-blue-500 shadow-sm animate-pulse flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-white animate-ping"></span> En Curso</span>':i.status==="\xDAltimos Cupos"?g='<span class="px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">\xDAltimos Cupos</span>':i.status==="Inscripciones Abiertas"?g='<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">Inscripciones Abiertas</span>':i.status==="Cupos Agotados"?g='<span class="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">Cupos Agotados</span>':g=`<span class="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">${i.status||"Pr\xF3ximamente"}</span>`;let h=i.isFree||i.price===0?'<span class="px-2.5 py-1 rounded-full text-xs font-black bg-tertiary-fixed text-primary border border-lime-400">Gratuita</span>':"";return`
      <article class="race-card ${d.esFinalizada?"opacity-65 grayscale-[30%] bg-slate-50/80 hover:opacity-100 hover:grayscale-0 transition-all":"bg-white"} rounded-3xl border border-outline-variant/40 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
        
        <!-- Hero Image Header -->
        <div class="relative h-48 w-full overflow-hidden bg-surface-container">
          <img 
            src="${i.heroImage||"https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=800&q=80"}" 
            alt="${i.name}" 
            loading="lazy"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          >
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          
          <!-- Badges superiores (Disciplina, Multi-D\xEDa y Gratuita) -->
          <div class="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            <span class="px-3 py-1 rounded-lg text-xs font-bold shadow-md flex items-center gap-1 ${s}">
              <span class="material-symbols-outlined text-sm">${Ge(i.discipline)}</span>
              ${i.discipline}
            </span>
            ${m}
            ${h}
          </div>

          <!-- Bot\xF3n Bookmark / Favorito -->
          <button 
            type="button" 
            data-bookmark-id="${i.id}" 
            aria-label="Guardar en favoritos" 
            class="btn-bookmark absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-primary hover:bg-white flex items-center justify-center shadow-md transition-all active:scale-90 z-10"
          >
            <span class="material-symbols-outlined ${o?"filled text-secondary":"text-outline"}">
              ${o?"bookmark":"bookmark_border"}
            </span>
          </button>

          <!-- Fecha y Ubicaci\xF3n sobre la imagen -->
          <div class="absolute bottom-3 left-3 right-3 text-white z-10 flex items-center justify-between text-xs">
            <span class="font-bold flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-md">
              <span class="material-symbols-outlined text-sm text-tertiary-fixed">calendar_today</span>
              ${i.displayDate||i.date}
            </span>
            <span class="font-medium bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-md truncate max-w-[50%]">
              ${i.city}
            </span>
          </div>

        </div>

        <!-- Card Body -->
        <div class="p-6 flex-grow flex flex-col justify-between space-y-4">
          
          <div class="space-y-2">
            <!-- Estado & Precio -->
            <div class="flex items-center justify-between gap-2">
              <div>${g}</div>
              <span class="font-display font-black text-lg text-primary">
                ${r}
              </span>
            </div>

            <!-- T\xEDtulo de la Carrera -->
            <h3 class="font-display font-bold text-xl text-primary group-hover:text-secondary transition-colors line-clamp-2 leading-snug">
              ${i.name}
            </h3>

            <!-- Especificaciones t\xE9cnicas (Distancia & Desnivel) -->
            <div class="flex items-center gap-4 text-xs font-semibold text-outline pt-1">
              <span class="flex items-center gap-1">
                <span class="material-symbols-outlined text-base">straighten</span>
                ${i.distance}
              </span>
              <span class="flex items-center gap-1">
                <span class="material-symbols-outlined text-base">landscape</span>
                ${i.elevation}
              </span>
              <span class="flex items-center gap-1 truncate">
                <span class="material-symbols-outlined text-base">map</span>
                ${i.region.replace("Regi\xF3n de ","").replace("Regi\xF3n del Libertador General ","").replace("Regi\xF3n del ","")}
              </span>
            </div>

            <!-- Descripci\xF3n corta -->
            <p class="text-xs text-gray-600 line-clamp-2 leading-relaxed pt-1">
              ${i.description}
            </p>
          </div>

          <!-- Card Footer & CTA -->
          <div class="pt-4 border-t border-outline-variant/30 flex flex-col gap-2">
            <button 
              type="button" 
              data-race-id="${i.id}" 
              class="btn-view-detail w-full bg-[#d8ef00] text-[#181919] font-display font-bold text-sm hover:brightness-105 shadow-sm rounded-xl py-3 px-4 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              Ver Detalle
              <span class="material-symbols-outlined text-base">arrow_forward</span>
            </button>

            <!-- Dropdown A\xF1adir a mi calendario -->
            <div class="relative inline-block w-full">
              <button 
                type="button" 
                data-calendar-trigger="${i.id}" 
                class="w-full bg-surface-container hover:bg-surface-container-high text-primary font-display font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-outline-variant/50"
                aria-expanded="false"
              >
                <span class="material-symbols-outlined text-sm">calendar_add_on</span>
                A\xF1adir a mi calendario
                <span class="material-symbols-outlined text-xs">expand_more</span>
              </button>

              <div 
                id="calendar-dropdown-${i.id}" 
                class="calendar-dropdown-menu hidden absolute left-0 right-0 bottom-full mb-2 bg-white rounded-2xl shadow-xl border border-outline-variant/40 p-1.5 z-50 animate-fadeIn"
              >
                <button type="button" data-calendar-action="google" data-race-id="${i.id}" class="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-primary hover:bg-surface-container flex items-center gap-2 transition-colors">
                  <span class="text-base">\u{1F4C5}</span> Google Calendar
                </button>
                <button type="button" data-calendar-action="apple" data-race-id="${i.id}" class="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-primary hover:bg-surface-container flex items-center gap-2 transition-colors">
                  <span class="text-base">\u{1F34E}</span> Apple Calendar (.ics)
                </button>
                <button type="button" data-calendar-action="outlook" data-race-id="${i.id}" class="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-primary hover:bg-surface-container flex items-center gap-2 transition-colors">
                  <span class="text-base">\u{1F4C6}</span> Outlook (.ics)
                </button>
                <button type="button" data-calendar-action="copy" data-race-id="${i.id}" class="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-primary hover:bg-surface-container flex items-center gap-2 transition-colors border-t border-outline-variant/30 mt-1 pt-2">
                  <span class="material-symbols-outlined text-sm text-outline">content_copy</span> Copiar Fecha
                </button>
              </div>
            </div>

            ${n||a&&i.creadoPor===a?`
            <div class="flex gap-2 w-full pt-1">
              <button type="button" data-edit-id="${i.id}" class="flex-grow py-2.5 rounded-xl bg-surface-container border border-outline-variant/60 text-primary font-bold text-xs hover:bg-surface-container-high transition-colors flex items-center justify-center gap-1">
                <span class="material-symbols-outlined text-sm">edit</span> Editar
              </button>
              <button type="button" data-delete-id="${i.id}" class="py-2.5 px-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 font-bold text-xs hover:bg-red-500/20 transition-colors flex items-center justify-center gap-1" title="Eliminar Carrera">
                <span class="material-symbols-outlined text-sm">delete</span>
              </button>
            </div>
            `:""}
          </div>

        </div>

      </article>
    `}).join("")}}function Te(e,t,n=!1,a=null){if(!e||!t)return;let i=Ve(t.id),o=de(t.discipline),s=qe(t.price,t.isFree),r=G(t),l=Me(t),d=Array.isArray(t.categories)&&t.categories.length>0?t.categories.map(x=>`<span class="px-3 py-1 rounded-xl text-xs font-semibold bg-surface-container text-primary border border-outline-variant/40">${x}</span>`).join(""):'<span class="text-xs text-outline italic">No se especificaron categor\xEDas.</span>',m="",g=t.status||"Pr\xF3ximamente";l.esFinalizada?(m='<span class="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-200 text-slate-800 border border-slate-300 shadow-md">Finalizada</span>',g="Finalizada"):l.esEnCurso&&(m='<span class="px-3.5 py-1.5 rounded-xl text-xs font-black bg-blue-600 text-white border border-blue-500 shadow-md animate-pulse flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-white animate-ping"></span> En Curso</span>',g="En Curso");let h=n||a&&t.creadoPor===a;e.innerHTML=`
    <div class="space-y-8 animate-fadeIn">
      
      <!-- Top Action Bar (Volver, Favoritos & Admin Actions) -->
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
          ${h?`
            <button type="button" data-edit-id="${t.id}" class="px-4 py-2.5 rounded-xl bg-surface-container border border-outline-variant/55 text-primary font-display font-bold text-sm flex items-center gap-2 hover:bg-surface-container-high transition-all shadow-sm">
              <span class="material-symbols-outlined text-base">edit</span> Editar
            </button>
            <button type="button" data-delete-id="${t.id}" class="px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 font-display font-bold text-sm flex items-center gap-2 hover:bg-red-500/20 transition-all shadow-sm">
              <span class="material-symbols-outlined text-base">delete</span> Eliminar
            </button>
          `:""}
          <button 
            type="button" 
            data-bookmark-id="${t.id}" 
            class="btn-bookmark px-4 py-2.5 rounded-xl bg-white border border-outline-variant/50 text-primary font-display font-bold text-sm flex items-center gap-2 hover:bg-surface-container transition-all shadow-sm"
          >
            <span class="material-symbols-outlined ${i?"filled text-secondary":"text-outline"}">
              ${i?"bookmark":"bookmark_border"}
            </span>
            ${i?"Guardada en Agenda":"Guardar en Agenda"}
          </button>
        </div>
      </div>

      <!-- Hero Banner Details -->
      <div class="relative rounded-3xl bg-primary text-white overflow-hidden shadow-2xl">
        <div class="relative h-72 sm:h-96 w-full">
          <img 
            src="${t.heroImage||"https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=1600&q=80"}" 
            alt="${t.name}" 
            class="w-full h-full object-cover"
          >
          <div class="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent"></div>
          
          <!-- Badges superiores -->
          <div class="absolute top-6 left-6 flex flex-wrap gap-2 z-10">
            <span class="px-3.5 py-1.5 rounded-xl text-xs font-extrabold shadow-lg flex items-center gap-1.5 ${o}">
              <span class="material-symbols-outlined text-base">${Ge(t.discipline)}</span>
              ${t.discipline}
            </span>
            ${m}
            ${t.isFree?'<span class="px-3.5 py-1.5 rounded-xl text-xs font-black bg-tertiary-fixed text-primary shadow-lg">Evento Gratuito</span>':""}
          </div>

          <!-- Informaci\xF3n Overlay sobre banner -->
          <div class="absolute bottom-6 left-6 right-6 z-10 space-y-3">
            <div class="flex items-center gap-2 text-tertiary-fixed font-display font-bold text-xs uppercase tracking-widest">
              <span class="material-symbols-outlined text-sm">location_on</span>
              ${t.city}, ${t.region}
            </div>
            <h1 class="text-2xl sm:text-4xl md:text-5xl font-display font-black tracking-tight text-white leading-tight">
              ${t.name}
            </h1>
          </div>

        </div>
      </div>

      <!-- Grid Principal: Detalles y Sidebar CTA -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Columna Izquierda: Informaci\xF3n Completa -->
        <div class="lg:col-span-8 space-y-8">
          
          <!-- Stats R\xE1pidos -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div class="bg-white p-4 rounded-2xl border border-outline-variant/40 shadow-sm flex flex-col gap-1">
              <span class="text-xs font-bold text-outline uppercase tracking-wider flex items-center gap-1">
                <span class="material-symbols-outlined text-sm text-secondary">calendar_today</span>
                Fecha
              </span>
              <span class="font-display font-bold text-sm sm:text-base text-primary">
                ${t.displayDate||t.date}
              </span>
            </div>

            <div class="bg-white p-4 rounded-2xl border border-outline-variant/40 shadow-sm flex flex-col gap-1">
              <span class="text-xs font-bold text-outline uppercase tracking-wider flex items-center gap-1">
                <span class="material-symbols-outlined text-sm text-secondary">straighten</span>
                Distancia
              </span>
              <span class="font-display font-bold text-sm sm:text-base text-primary">
                ${t.distance}
              </span>
            </div>

            <div class="bg-white p-4 rounded-2xl border border-outline-variant/40 shadow-sm flex flex-col gap-1">
              <span class="text-xs font-bold text-outline uppercase tracking-wider flex items-center gap-1">
                <span class="material-symbols-outlined text-sm text-secondary">landscape</span>
                Desnivel
              </span>
              <span class="font-display font-bold text-sm sm:text-base text-primary">
                ${t.elevation}
              </span>
            </div>

            <div class="bg-white p-4 rounded-2xl border border-outline-variant/40 shadow-sm flex flex-col gap-1">
              <span class="text-xs font-bold text-outline uppercase tracking-wider flex items-center gap-1">
                <span class="material-symbols-outlined text-sm text-secondary">payments</span>
                Precio
              </span>
              <span class="font-display font-bold text-sm sm:text-base text-primary">
                ${s}
              </span>
            </div>
          </div>

          <!-- Descripci\xF3n del Evento -->
          <div class="bg-white p-6 sm:p-8 rounded-3xl border border-outline-variant/40 shadow-sm space-y-4">
            <h3 class="font-display font-bold text-xl text-primary flex items-center gap-2">
              <span class="material-symbols-outlined text-secondary">description</span>
              Descripci\xF3n del Evento
            </h3>
            <p class="text-gray-700 text-base leading-relaxed whitespace-pre-line">
              ${t.description}
            </p>
          </div>

          <!-- Categor\xEDas Disponibles -->
          <div class="bg-white p-6 sm:p-8 rounded-3xl border border-outline-variant/40 shadow-sm space-y-4">
            <h3 class="font-display font-bold text-xl text-primary flex items-center gap-2">
              <span class="material-symbols-outlined text-secondary">military_tech</span>
              Categor\xEDas Habilitadas
            </h3>
            <div class="flex flex-wrap gap-2">
              ${d}
            </div>
          </div>

        </div>

        <!-- Columna Derecha: Sidebar Inscripci\xF3n & Organizador -->
        <div class="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
          
          <div class="bg-white p-6 sm:p-8 rounded-3xl border border-outline-variant/40 shadow-lg space-y-6">
            
            <div class="space-y-1">
              <span class="text-xs font-bold text-outline uppercase tracking-wider">Precio de Inscripci\xF3n</span>
              <div class="font-display font-black text-3xl text-primary">
                ${s}
              </div>
            </div>

            <div class="space-y-3 pt-2">
              <div class="flex justify-between items-center text-sm py-2 border-b border-outline-variant/30">
                <span class="text-outline font-medium">Estado:</span>
                <span class="font-bold text-primary">${g}</span>
              </div>
              <div class="flex justify-between items-center text-sm py-2 border-b border-outline-variant/30">
                <span class="text-outline font-medium">Organiza:</span>
                <span class="font-bold text-primary truncate max-w-[60%]">${t.organizer}</span>
              </div>
              <div class="flex justify-between items-center text-sm py-2">
                <span class="text-outline font-medium">Ubicaci\xF3n:</span>
                <span class="font-bold text-primary">${t.city}</span>
              </div>
            </div>

            <!-- CTA Button -->
            ${l.esFinalizada?`
              <div class="w-full bg-slate-100 text-slate-600 border border-slate-300 font-display font-bold text-base rounded-2xl py-4 px-6 flex items-center justify-center gap-2 shadow-sm text-center">
                <span class="material-symbols-outlined text-xl">event_busy</span>
                Evento Finalizado
              </div>
            `:`
              <a 
                href="${t.registrationUrl||"#"}" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="w-full bg-[#d8ef00] text-[#181919] font-display font-bold text-base hover:brightness-105 shadow-md rounded-2xl py-4 px-6 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                Ir a Formulario de Inscripci\xF3n
                <span class="material-symbols-outlined text-xl">open_in_new</span>
              </a>
            `}

            <!-- Dropdown A\xF1adir a mi calendario (Vista Detalle) -->
            <div class="relative inline-block w-full pt-1">
              <button 
                type="button" 
                data-calendar-trigger="${t.id}" 
                class="w-full bg-surface-container hover:bg-surface-container-high text-primary font-display font-bold text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors border border-outline-variant/50 shadow-sm"
                aria-expanded="false"
              >
                <span class="material-symbols-outlined text-base">calendar_add_on</span>
                A\xF1adir a mi calendario
                <span class="material-symbols-outlined text-sm">expand_more</span>
              </button>

              <div 
                id="calendar-dropdown-${t.id}" 
                class="calendar-dropdown-menu hidden absolute left-0 right-0 bottom-full mb-2 bg-white rounded-2xl shadow-xl border border-outline-variant/40 p-2 z-50 animate-fadeIn"
              >
                <button type="button" data-calendar-action="google" data-race-id="${t.id}" class="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-primary hover:bg-surface-container flex items-center gap-2 transition-colors">
                  <span class="text-base">\u{1F4C5}</span> Google Calendar
                </button>
                <button type="button" data-calendar-action="apple" data-race-id="${t.id}" class="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-primary hover:bg-surface-container flex items-center gap-2 transition-colors">
                  <span class="text-base">\u{1F34E}</span> Apple Calendar (.ics)
                </button>
                <button type="button" data-calendar-action="outlook" data-race-id="${t.id}" class="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-primary hover:bg-surface-container flex items-center gap-2 transition-colors">
                  <span class="text-base">\u{1F4C6}</span> Outlook (.ics)
                </button>
                <button type="button" data-calendar-action="copy" data-race-id="${t.id}" class="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-primary hover:bg-surface-container flex items-center gap-2 transition-colors border-t border-outline-variant/30 mt-1 pt-2">
                  <span class="material-symbols-outlined text-sm text-outline">content_copy</span> Copiar Fecha
                </button>
              </div>
            </div>

            <p class="text-[11px] text-center text-outline leading-tight">
              Ser\xE1s redirigido al sitio web oficial del organizador para completar tu registro.
            </p>

          </div>

        </div>

      </div>

    </div>
  `}function H(e){let t=document.getElementById("view-calendar"),n=document.getElementById("view-detail"),a=document.getElementById("view-register"),i=document.getElementById("view-admin-panel"),o=document.getElementById("nav-explore"),s=document.getElementById("nav-agenda"),r=document.getElementById("nav-register"),l=document.getElementById("nav-admin-panel");t&&t.classList.add("hidden"),n&&n.classList.add("hidden"),a&&a.classList.add("hidden"),i&&i.classList.add("hidden");let d="text-outline hover:text-primary hover:bg-surface-container-low",m="text-primary bg-surface-container-low font-bold";o&&(o.className=`nav-btn px-4 py-2 rounded-lg font-display font-bold text-sm transition-colors flex items-center gap-2 ${e==="calendar"?m:d}`),s&&(s.className=`nav-btn px-4 py-2 rounded-lg font-display font-bold text-sm transition-colors flex items-center gap-2 ${e==="agenda"?m:d}`),l&&(l.className=`nav-btn px-4 py-2 rounded-lg font-display font-bold text-sm transition-colors flex items-center gap-2 ${e==="admin-panel"?m:d}`),e==="calendar"||e==="agenda"?t&&t.classList.remove("hidden"):e==="detail"?n&&n.classList.remove("hidden"):e==="register"?a&&a.classList.remove("hidden"):e==="admin-panel"&&i&&i.classList.remove("hidden"),window.scrollTo({top:0,behavior:"smooth"})}function Ne(e,t=[]){if(e){if(t.length===0){e.innerHTML=`
      <div class="col-span-full py-16 text-center bg-white rounded-3xl border border-dashed border-outline-variant/60 p-8 space-y-4">
        <div class="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mx-auto text-outline">
          <span class="material-symbols-outlined text-4xl">task_alt</span>
        </div>
        <h3 class="font-display font-bold text-xl text-primary">No hay propuestas pendientes</h3>
        <p class="text-outline text-sm max-w-md mx-auto">Buen trabajo, el calendario est\xE1 al d\xEDa y moderado.</p>
      </div>
    `;return}e.innerHTML=t.map(n=>`
      <article class="bg-white rounded-3xl border border-outline-variant/40 overflow-hidden shadow-sm flex flex-col group p-6 space-y-4">
        <div class="flex items-center justify-between">
          <span class="px-2.5 py-1 rounded-lg text-xs font-bold ${de(n.discipline)}">
            ${n.discipline}
          </span>
          <span class="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            Pendiente
          </span>
        </div>
        <div>
          <h3 class="font-display font-bold text-lg text-primary line-clamp-2">${n.name}</h3>
          <p class="text-xs text-outline font-semibold">${n.displayDate||n.date} \u2014 ${n.city}, ${n.region}</p>
        </div>
        <p class="text-xs text-gray-600 line-clamp-3">${n.description}</p>
        <div class="pt-4 border-t border-outline-variant/30 grid grid-cols-2 gap-2">
          <button type="button" data-id="${n.id}" data-approve-id="${n.id}" class="btn-approve-race py-2.5 rounded-xl bg-emerald-600 text-white font-display font-bold text-xs hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1 shadow-sm">
            <span class="material-symbols-outlined text-sm">check_circle</span> Aprobar
          </button>
          <button type="button" data-id="${n.id}" data-reject-id="${n.id}" class="btn-reject-race py-2.5 rounded-xl bg-red-600 text-white font-display font-bold text-xs hover:bg-red-700 transition-colors flex items-center justify-center gap-1 shadow-sm">
            <span class="material-symbols-outlined text-sm">cancel</span> Rechazar
          </button>
        </div>
      </article>
    `).join("")}}function Ct(e,t=[],n="Todos"){if(!e)return;let a=2026,i=9;if(n&&n!=="Todos"){let I=n.split(" "),D={Enero:0,Febrero:1,Marzo:2,Abril:3,Mayo:4,Junio:5,Julio:6,Agosto:7,Septiembre:8,Octubre:9,Noviembre:10,Diciembre:11};D[I[0]]!==void 0&&(i=D[I[0]]),I[1]&&!isNaN(parseInt(I[1],10))&&(a=parseInt(I[1],10))}else if(t.length>0){let I=t.find(D=>D.startDate||D.date);if(I){let D=le(I.startDate||I.date);D&&(a=D.getFullYear(),i=D.getMonth())}}let s=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"][i],r=new Date(a,i,1),l=new Date(a,i+1,0),d=r.getDay(),m=d===0?6:d-1,g=new Date(r);g.setDate(g.getDate()-m);let h=m+l.getDate(),x=Math.ceil(h/7),y=`
    <div class="space-y-4 animate-fadeIn">
      <!-- Header del Mes -->
      <div class="flex items-center justify-between pb-2 border-b border-outline-variant/30">
        <h3 class="font-display font-black text-xl text-primary flex items-center gap-2">
          <span class="material-symbols-outlined text-secondary text-2xl">calendar_month</span>
          ${s} ${a}
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
  `,E=new Date(g);for(let I=0;I<x;I++){let D=new Date(E),L=new Date(E);L.setDate(L.getDate()+6);let Y=[];for(let R=0;R<7;R++)Y.push(new Date(E)),E.setDate(E.getDate()+1);let C=[];t.forEach(R=>{let S=G(R);if(!(!S.startDateObj||!S.endDateObj)&&S.startDateObj<=L&&S.endDateObj>=D){let F=1,O=7;if(S.startDateObj>D){let W=S.startDateObj.getTime()-D.getTime();F=Math.round(W/(1e3*60*60*24))+1}if(S.endDateObj<L){let W=S.endDateObj.getTime()-D.getTime();O=Math.round(W/(1e3*60*60*24))+1}C.push({race:R,dur:S,colStart:Math.max(1,Math.min(7,F)),colEnd:Math.max(1,Math.min(7,O)),span:Math.max(1,O-F+1)})}}),C.sort((R,S)=>R.dur.esMultiDia!==S.dur.esMultiDia?R.dur.esMultiDia?-1:1:R.colStart!==S.colStart?R.colStart-S.colStart:S.span-R.span),y+=`
      <div class="relative bg-surface-container-low/50 rounded-2xl p-2.5 border border-outline-variant/30 min-h-[110px] sm:min-h-[130px] flex flex-col justify-between space-y-2">
        
        <!-- N\xFAmeros de los D\xEDas -->
        <div class="grid grid-cols-7 gap-1 sm:gap-2 text-right">
          ${Y.map(R=>{let S=R.getMonth()===i,F=new Date().toDateString()===R.toDateString(),O=R.getDate();return`
              <div class="pr-1 font-display font-bold text-xs ${S?"text-primary":"text-outline-variant/50"}">
                <span class="${F?"bg-secondary text-white px-1.5 py-0.5 rounded-full":""}">
                  ${O}
                </span>
              </div>
            `}).join("")}
        </div>

        <!-- Renderizado de Barras de Eventos -->
        <div class="grid grid-cols-7 gap-1 sm:gap-2 gap-y-1.5 z-10">
          ${C.map(R=>{let{race:S,dur:F,colStart:O,span:W}=R,me=de(S.discipline);return F.esMultiDia?`
                <div 
                  data-race-id="${S.id}"
                  style="grid-column: ${O} / span ${W};"
                  class="cursor-pointer group relative bg-gradient-to-r from-primary via-primary/95 to-primary/80 text-white rounded-xl px-2.5 py-1.5 text-xs font-bold shadow-sm hover:brightness-110 transition-all flex items-center justify-between overflow-hidden border-l-4 border-tertiary-fixed"
                  title="${S.name} (${F.duracionDias} d\xEDas)"
                >
                  <div class="flex items-center gap-1.5 truncate">
                    <span class="px-1.5 py-0.5 rounded text-[10px] font-black uppercase ${me}">${S.discipline}</span>
                    <span class="truncate font-display font-extrabold text-white">${S.name}</span>
                  </div>
                  <span class="shrink-0 text-[10px] font-bold bg-white/20 px-1.5 py-0.5 rounded-full text-tertiary-fixed ml-1">
                    ${F.duracionDias}d
                  </span>
                </div>
              `:`
                <div 
                  data-race-id="${S.id}"
                  style="grid-column: ${O} / span 1;"
                  class="cursor-pointer group relative bg-white border border-outline-variant/60 hover:border-primary text-primary rounded-xl px-2 py-1 text-[11px] font-bold shadow-2xs hover:shadow-md transition-all flex items-center gap-1 truncate"
                  title="${S.name}"
                >
                  <span class="w-2 h-2 rounded-full ${me} shrink-0"></span>
                  <span class="truncate font-medium">${S.name}</span>
                </div>
              `}).join("")}
        </div>

      </div>
    `}y+=`
      </div>
    </div>
  `,e.innerHTML=y}function $t(e,t=[],n=new Date){if(!e)return;let a=typeof n=="string"?le(n)||new Date:n,i=a.getDay(),o=i===0?6:i-1,s=new Date(a);s.setDate(s.getDate()-o);let r=[];for(let x=0;x<7;x++){let y=new Date(s);y.setDate(y.getDate()+x),r.push(y)}let l=r[6],d=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],g=`
    <div class="space-y-6 animate-fadeIn">
      <div class="flex items-center justify-between pb-2 border-b border-outline-variant/30">
        <h3 class="font-display font-black text-xl text-primary flex items-center gap-2">
          <span class="material-symbols-outlined text-secondary text-2xl">view_week</span>
          ${`Semana del ${s.getDate()} de ${d[s.getMonth()]} al ${l.getDate()} de ${d[l.getMonth()]}, ${l.getFullYear()}`}
        </h3>
        <span class="text-xs font-bold px-3 py-1 rounded-full bg-surface-container text-outline uppercase tracking-wider">
          Vista Semanal
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-7 gap-4">
  `,h=["Lunes","Martes","Mi\xE9rcoles","Jueves","Viernes","S\xE1bado","Domingo"];r.forEach((x,y)=>{let E=new Date().toDateString()===x.toDateString(),I=t.filter(D=>{let L=G(D);return L.startDateObj&&L.endDateObj&&x>=L.startDateObj&&x<=L.endDateObj});g+=`
      <div class="bg-surface-container-low/50 rounded-2xl p-3 border border-outline-variant/30 flex flex-col space-y-3 min-h-[160px]">
        <div class="flex items-center justify-between border-b border-outline-variant/20 pb-2">
          <span class="font-display font-bold text-xs text-primary">${h[y]}</span>
          <span class="text-xs font-extrabold ${E?"bg-secondary text-white px-2 py-0.5 rounded-full":"text-outline"}">
            ${x.getDate()}
          </span>
        </div>

        <div class="space-y-2 flex-grow">
          ${I.length===0?`
            <p class="text-[11px] text-outline italic py-2 text-center">Sin eventos</p>
          `:I.map(D=>{let L=G(D),Y=de(D.discipline),C=St(D,x);return`
              <div 
                data-race-id="${D.id}" 
                class="cursor-pointer bg-white border border-outline-variant/40 hover:border-primary p-2.5 rounded-xl shadow-2xs hover:shadow-md transition-all space-y-1.5"
              >
                <div class="flex items-center justify-between gap-1">
                  <span class="px-1.5 py-0.5 rounded text-[10px] font-black uppercase ${Y}">${D.discipline}</span>
                  ${L.esMultiDia&&C?`
                    <span class="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-purple-100 text-purple-900 border border-purple-300">
                      ${C}
                    </span>
                  `:""}
                </div>
                <h5 class="font-display font-bold text-xs text-primary line-clamp-2">${D.name}</h5>
                <p class="text-[10px] text-outline font-medium truncate">${D.city}</p>
              </div>
            `}).join("")}
        </div>
      </div>
    `}),g+=`
      </div>
    </div>
  `,e.innerHTML=g}function At(e,t=[],n=new Date){if(!e)return;let a=typeof n=="string"?le(n)||new Date:n,i=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],s=`${["Domingo","Lunes","Martes","Mi\xE9rcoles","Jueves","Viernes","S\xE1bado"][a.getDay()]} ${a.getDate()} de ${i[a.getMonth()]}, ${a.getFullYear()}`,r=t.filter(d=>{let m=G(d);return m.startDateObj&&m.endDateObj&&a>=m.startDateObj&&a<=m.endDateObj}),l=`
    <div class="space-y-6 animate-fadeIn">
      <div class="flex items-center justify-between pb-2 border-b border-outline-variant/30">
        <h3 class="font-display font-black text-xl text-primary flex items-center gap-2">
          <span class="material-symbols-outlined text-secondary text-2xl">today</span>
          ${s}
        </h3>
        <span class="text-xs font-bold px-3 py-1 rounded-full bg-surface-container text-outline uppercase tracking-wider">
          Vista Diaria (${r.length} evento${r.length===1?"":"s"})
        </span>
      </div>

      <div class="space-y-4">
        ${r.length===0?`
          <div class="py-16 text-center bg-white rounded-3xl border border-dashed border-outline-variant/60 p-8 space-y-3">
            <span class="material-symbols-outlined text-4xl text-outline">event_busy</span>
            <h4 class="font-display font-bold text-lg text-primary">No hay eventos para este d\xEDa</h4>
            <p class="text-xs text-outline">Prueba seleccionando otra fecha o cambiando las disciplinas.</p>
          </div>
        `:r.map(d=>{let m=G(d),g=de(d.discipline),h=St(d,a);return`
            <article 
              data-race-id="${d.id}" 
              class="cursor-pointer bg-white p-6 rounded-3xl border border-outline-variant/40 hover:border-primary shadow-sm hover:shadow-lg transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
            >
              <div class="space-y-2 max-w-xl">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="px-2.5 py-1 rounded-lg text-xs font-bold ${g}">${d.discipline}</span>
                  ${m.esMultiDia&&h?`
                    <span class="px-3 py-1 rounded-full text-xs font-black bg-purple-100 text-purple-900 border border-purple-300 shadow-2xs flex items-center gap-1">
                      <span class="material-symbols-outlined text-xs">flag</span> ${h}
                    </span>
                  `:`
                    <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-surface-container text-outline">Un solo d\xEDa</span>
                  `}
                </div>
                <h4 class="font-display font-black text-xl text-primary group-hover:text-secondary transition-colors">${d.name}</h4>
                <p class="text-xs text-gray-600 line-clamp-2">${d.description}</p>
                <div class="flex items-center gap-4 text-xs text-outline font-semibold">
                  <span>\u{1F4CD} ${d.city}, ${d.region}</span>
                  <span>\u{1F4CF} ${d.distance}</span>
                </div>
              </div>

              <div class="sm:text-right shrink-0 space-y-2">
                <span class="font-display font-black text-xl text-primary block">${qe(d.price,d.isFree)}</span>
                <button type="button" class="px-4 py-2 rounded-xl bg-tertiary-fixed text-primary font-bold text-xs hover:brightness-105 shadow-sm inline-flex items-center gap-1">
                  Ver Detalles <span class="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </article>
          `}).join("")}
      </div>
    </div>
  `;e.innerHTML=l}var Xt,Je=V(()=>{Ae();Xt=["Todas","Ruta","MTB","Gravel","Pista","BMX","Virtual"]});function J(e){if(typeof e!="string")return"";let t={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"};return e.trim().replace(/[&<>"']/g,n=>t[n])}function Qt(e){if(!e||typeof e!="string")return!0;let t=e.trim();if(t==="")return!0;/^https?:\/\//i.test(t)||(t="https://"+t);try{let n=new URL(t);return n.protocol==="http:"||n.protocol==="https:"}catch{return!1}}function Ye(e){let t=e||{},n={},a={},i=J(t.name);a.name=i,(!i||i.length<3||i.length>100)&&(n.name="El nombre de la carrera debe tener entre 3 y 100 caracteres.");let o=typeof t.discipline=="string"?t.discipline.trim():"";a.discipline=o,Zt.includes(o)||(n.discipline="Debe seleccionar una disciplina v\xE1lida (Ruta, MTB, Gravel, Pista, BMX, Virtual).");let s=t.isMultiDay===!0||t.isMultiDay==="on"||t.isMultiDay==="true",r=typeof t.date=="string"?t.date.trim():"",l=s&&typeof t.startDate=="string"&&t.startDate.trim()!==""?t.startDate.trim():r,d=s&&typeof t.endDate=="string"&&t.endDate.trim()!==""?t.endDate.trim():l,m=/^\d{4}-\d{2}-\d{2}$/;a.date=l||r,a.startDate=l||r,a.endDate=d||l||r,!a.startDate||!m.test(a.startDate)||isNaN(Date.parse(a.startDate))?n.date="La fecha de inicio debe tener un formato v\xE1lido (AAAA-MM-DD).":s&&(!a.endDate||!m.test(a.endDate)||isNaN(Date.parse(a.endDate)))?n.endDate="La fecha de t\xE9rmino debe tener un formato v\xE1lido (AAAA-MM-DD).":s&&a.endDate<a.startDate&&(n.endDate="La fecha de t\xE9rmino no puede ser anterior a la fecha de inicio.");let g=J(t.region);a.region=g,g||(n.region="La regi\xF3n es obligatoria.");let h=J(t.organizador);a.organizador=h,(!h||h.length<2||h.length>100)&&(n.organizador="El organizador debe tener entre 2 y 100 caracteres.");let x=typeof t.registrationUrl=="string"?t.registrationUrl.trim():"";x&&!/^https?:\/\//i.test(x)&&(x="https://"+x),a.registrationUrl=x,Qt(x)||(n.registrationUrl="La URL de inscripci\xF3n debe ser una URL v\xE1lida (ej: https://ejemplo.cl).");let y=J(t.city);a.city=y,(!y||y.length<1||y.length>100)&&(n.city="La ciudad / comuna es obligatoria (m\xE1ximo 100 caracteres).");let E=J(t.distance);a.distance=E,(!E||E.length<1||E.length>30)&&(n.distance="La distancia es obligatoria (ej: 120 km) y no puede superar 30 caracteres.");let I=J(t.description);return a.description=I,(!I||I.length<10||I.length>2e3)&&(n.description="La descripci\xF3n es obligatoria (entre 10 y 2000 caracteres)."),a.elevation=J(t.elevation),a.price=J(t.price),a.heroImage=J(t.heroImage),{isValid:Object.keys(n).length===0,errors:n,sanitizedData:a}}var Zt,We=V(()=>{Zt=["Ruta","MTB","Gravel","Pista","BMX","Virtual"]});var ve={};Vt(ve,{ensureAdminElementsMounted:()=>ze,loadPendingRacesList:()=>Ke,openEditModal:()=>aa,openLoginModal:()=>ta,setAuthChangeCallback:()=>ea});function ea(e){ye=e}function ze(){if(!Mt){if(!document.getElementById("view-admin-panel")){let e=document.querySelector("main");if(e){let t=document.createElement("section");t.id="view-admin-panel",t.className="hidden space-y-8",t.innerHTML=`
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
      `,e.appendChild(t)}}if(!document.getElementById("login-modal")){let e=document.createElement("div");e.id="login-modal",e.className="hidden fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn",e.innerHTML=`
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
    `,document.body.appendChild(e)}if(!document.getElementById("edit-modal")){let e=document.createElement("div");e.id="edit-modal",e.className="hidden fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto",e.innerHTML=`
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
    `,document.body.appendChild(e);let t=document.getElementById("edit-form-region");t&&K&&(t.innerHTML=K.filter(n=>n!=="Todas las regiones").map(n=>`<option value="${n}">${n}</option>`).join(""))}Mt=!0,ra()}}function ta(){ze();let e=document.getElementById("login-modal"),t=document.getElementById("login-error-container");t&&t.classList.add("hidden"),document.getElementById("login-form")?.reset(),e&&e.classList.remove("hidden")}function aa(e){if(!e)return;ze();let t=document.getElementById("edit-modal");document.getElementById("edit-race-id").value=e.id||"",document.getElementById("edit-form-name").value=e.name||"",document.getElementById("edit-form-discipline").value=e.discipline||"Ruta";let n=!!e.endDate&&e.endDate!==e.date,a=document.getElementById("edit-form-is-multiday");a&&(a.checked=n,na(n)),n?(document.getElementById("edit-form-start-date").value=e.date||e.startDate||"",document.getElementById("edit-form-end-date").value=e.endDate||""):document.getElementById("edit-form-date").value=e.date||"",document.getElementById("edit-form-region").value=e.region||K[0],document.getElementById("edit-form-city").value=e.city||"",document.getElementById("edit-form-distance").value=e.distance||"",document.getElementById("edit-form-elevation").value=e.elevation||"",document.getElementById("edit-form-price").value=e.price||0,document.getElementById("edit-form-is-free").checked=!!e.isFree,document.getElementById("edit-form-status").value=e.status||"Inscripciones Abiertas",document.getElementById("edit-form-organizer").value=e.organizer||e.organizador||"",document.getElementById("edit-form-url").value=e.registrationUrl||"",document.getElementById("edit-form-image").value=e.heroImage||"",document.getElementById("edit-form-categories").value=Array.isArray(e.categories)?e.categories.join(", "):e.categories||"",document.getElementById("edit-form-description").value=e.description||"",t&&t.classList.remove("hidden")}function na(e){let t=document.getElementById("edit-form-single-date-container"),n=document.getElementById("edit-form-start-date-container"),a=document.getElementById("edit-form-end-date-container");e?(t&&t.classList.add("hidden"),n&&n.classList.remove("hidden"),a&&a.classList.remove("hidden")):(t&&t.classList.remove("hidden"),n&&n.classList.add("hidden"),a&&a.classList.add("hidden"))}async function Ke(){ze();let e=document.getElementById("pending-races-list"),t=document.getElementById("pending-count");if(!e)return;let n=await ke();if(n&&n.success){let a=Array.isArray(n.data)?n.data:[];t&&(t.textContent=a.length),Ne(e,a),ia()}else{t&&(t.textContent="0");let a=n&&n.error?n.error.message||String(n.error):"Error al conectar con la base de datos.";e.innerHTML=`<p class="col-span-full text-center text-red-500 font-bold">Error al cargar propuestas: ${a}</p>`}}function ia(){let e=document.getElementById("pending-races-list");e&&(e.querySelectorAll(".btn-approve-race, [data-approve-id]").forEach(t=>{t.addEventListener("click",async n=>{let a=t.getAttribute("data-id")||t.getAttribute("data-approve-id")||t.dataset.id;if(!a)return;t.disabled=!0,t.textContent="Aprobando...";let i=await se(a,"aprobada");if(i.success)B("\u2705 Carrera aprobada con \xE9xito. Ahora es visible en el calendario p\xFAblico."),await Ke();else{let o=i.error?.message||(typeof i.error=="string"?i.error:JSON.stringify(i.error));alert("Error al aprobar la carrera: "+o),t.disabled=!1,t.textContent="Aprobar"}})}),e.querySelectorAll(".btn-reject-race, [data-reject-id]").forEach(t=>{t.addEventListener("click",async n=>{let a=t.getAttribute("data-id")||t.getAttribute("data-reject-id")||t.dataset.id;if(!a||!confirm("\xBFEst\xE1s seguro de que deseas rechazar esta propuesta?"))return;t.disabled=!0,t.textContent="Rechazando...";let i=await se(a,"rechazada");if(i.success)B("\u{1F6AB} Carrera rechazada."),await Ke();else{let o=i.error?.message||(typeof i.error=="string"?i.error:JSON.stringify(i.error));alert("Error al rechazar la carrera: "+o),t.disabled=!1,t.textContent="Rechazar"}})}))}function ra(){let e=document.getElementById("btn-close-login");e&&e.addEventListener("click",()=>{document.getElementById("login-modal")?.classList.add("hidden")});let t=document.getElementById("login-form");t&&t.addEventListener("submit",async a=>{a.preventDefault();let i=document.getElementById("login-email")?.value||"",o=document.getElementById("login-password")?.value||"",s=document.getElementById("btn-submit-login"),r=document.getElementById("login-error-container"),l=document.getElementById("login-error-msg");s&&(s.disabled=!0,s.classList.add("opacity-50"));let d=await yt(i,o);d.success&&d.user?await ge(d.user.id)?(Rt=!0,typeof ye=="function"&&ye(!0),document.getElementById("login-modal")?.classList.add("hidden"),B("\u{1F513} \xA1Sesi\xF3n iniciada con \xE9xito! Has ingresado como Administrador del sistema.")):(await fe(),Rt=!1,typeof ye=="function"&&ye(!1),r&&l&&(l.textContent="Acceso denegado: El usuario no es administrador.",r.classList.remove("hidden"))):r&&l&&(l.textContent=d.error||"Credenciales incorrectas o problema de conexi\xF3n.",r.classList.remove("hidden")),s&&(s.disabled=!1,s.classList.remove("opacity-50"))});let n=document.getElementById("btn-close-edit");n&&n.addEventListener("click",()=>{document.getElementById("edit-modal")?.classList.add("hidden")})}var Mt,Rt,ye,he=V(()=>{Ce();Le();Ae();Je();Tt();We();Mt=!1,Rt=!1,ye=null});function ue(e){e&&(e.querySelectorAll(".field-error-msg").forEach(t=>t.remove()),e.querySelectorAll("input, select, textarea").forEach(t=>{t.classList.remove("border-secondary","ring-1","ring-secondary")}))}function Nt(e,t){if(ue(e),!e||!t)return;let n=e.querySelector('[name="isMultiDay"]')?.checked||!1,a={name:"name",discipline:"discipline",date:n?"startDate":"date",startDate:"startDate",endDate:"endDate",region:"region",organizador:"organizer",organizer:"organizer",registrationUrl:"registrationUrl",city:"city",distance:"distance",description:"description"};for(let[i,o]of Object.entries(t)){let s=a[i]||i,r=e.querySelector(`[name="${s}"]`)||e.querySelector(`#form-${s}`)||e.querySelector(`#edit-form-${s}`);if(n&&(i==="date"||i==="startDate")&&(r=e.querySelector('[name="startDate"]')||e.querySelector("#form-start-date")||e.querySelector("#edit-form-start-date")||r),r){r.classList.add("border-secondary","ring-1","ring-secondary");let l=document.createElement("p");l.className="field-error-msg text-secondary text-xs font-semibold mt-1 flex items-center gap-1",l.innerHTML=`<span class="material-symbols-outlined text-sm">error</span> ${o}`;let d=r.closest(".space-y-2")||r.parentNode;d&&d.appendChild(l)}}}function B(e){let t=document.getElementById("toast-notification");t&&t.remove();let n=document.createElement("div");n.id="toast-notification",n.className="fixed bottom-6 right-6 z-50 max-w-lg bg-primary text-white p-5 rounded-2xl shadow-2xl border border-tertiary-fixed/50 flex items-start gap-4 transition-all duration-300 transform translate-y-0",n.innerHTML=`
    <div class="w-10 h-10 rounded-xl bg-tertiary-fixed text-primary flex items-center justify-center flex-shrink-0 font-bold shadow-md">
      <span class="material-symbols-outlined text-2xl">published_with_changes</span>
    </div>
    <div class="flex-grow text-sm space-y-1">
      <h4 class="font-display font-bold text-tertiary-fixed text-base">Notificaci\xF3n del Sistema</h4>
      <p class="text-gray-200 leading-relaxed font-medium">${e}</p>
    </div>
    <button type="button" id="close-toast-btn" aria-label="Cerrar notificaci\xF3n" class="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
      <span class="material-symbols-outlined text-xl">close</span>
    </button>
  `,document.body.appendChild(n);let a=n.querySelector("#close-toast-btn");a&&a.addEventListener("click",()=>{n.remove()}),setTimeout(()=>{document.body.contains(n)&&(n.classList.add("opacity-0","translate-y-2"),setTimeout(()=>{document.body.contains(n)&&n.remove()},300))},9e3)}async function sa(){let e=await q(),t=oe(),n=e.filter(a=>{let i=Me(a);if(!Ot&&i.esFinalizada||(ne==="my-calendar"||ne==="agenda")&&!t.includes(a.id)||Z&&Z!=="Todas"&&a.discipline!==Z||we&&we!=="Todas las regiones"&&a.region!==we)return!1;if(ae&&ae!=="Todos"){let o=a.monthYear||"";if(!o&&a.date){let l=new Date(a.date+"T00:00:00");o=`${["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"][l.getMonth()]} ${l.getFullYear()}`}let s=o===ae,r=ae.split(" ").length===1&&o.startsWith(ae);if(!s&&!r)return!1}if(Xe.trim()!==""){let o=Xe.toLowerCase().trim(),s=a.name?a.name.toLowerCase().includes(o):!1,r=a.city?a.city.toLowerCase().includes(o):!1,l=a.organizer||a.organizador?(a.organizer||a.organizador).toLowerCase().includes(o):!1,d=a.description?a.description.toLowerCase().includes(o):!1;if(!s&&!r&&!l&&!d)return!1}return!0});return n.sort((a,i)=>a.date?i.date?new Date(a.date)-new Date(i.date):-1:1),n}function oa(e,t=3){if(!e)return;let n="";for(let a=0;a<t;a++)n+=`
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
    `;e.innerHTML=`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">${n}</div>`}async function M(){let e=document.getElementById("races-container");(ce==="cards"||!ce)&&e&&(e.classList.remove("hidden"),oa(e,3));let t=await sa(),n=document.getElementById("month-grid-container"),a=document.getElementById("week-grid-container"),i=document.getElementById("day-grid-container");e&&e.classList.add("hidden"),n&&n.classList.add("hidden"),a&&a.classList.add("hidden"),i&&i.classList.add("hidden"),ce==="month"?n&&(n.classList.remove("hidden"),Ct(n,t,ae)):ce==="week"?a&&(a.classList.remove("hidden"),$t(a,t)):ce==="day"?i&&(i.classList.remove("hidden"),At(i,t)):e&&(e.classList.remove("hidden"),kt(e,t,T,z));let o=document.getElementById("races-count");o&&(o.textContent=`${t.length} carrera${t.length===1?"":"s"}`);let s=document.getElementById("agenda-badge"),r=oe().length;s&&(s.textContent=r,r>0?s.classList.remove("hidden"):s.classList.add("hidden"));let l=document.getElementById("calendar-title");l&&(ne==="my-calendar"||ne==="agenda"?l.textContent="Mi Agenda de Carreras Guardadas":l.textContent="Pr\xF3ximas Carreras")}function la(){let e=(t,n,a,i,o,s)=>{let r=document.getElementById(t),l=document.getElementById(n),d=document.getElementById(a),m=document.getElementById(i),g=document.getElementById(o),h=document.getElementById(s);if(!r||!l||!d)return;r.addEventListener("click",()=>l.click()),["dragenter","dragover"].forEach(y=>{r.addEventListener(y,E=>{E.preventDefault(),r.classList.add("border-primary","bg-primary/5")},!1)}),["dragleave","drop"].forEach(y=>{r.addEventListener(y,E=>{E.preventDefault(),r.classList.remove("border-primary","bg-primary/5")},!1)}),r.addEventListener("drop",y=>{let I=y.dataTransfer.files;I&&I.length>0&&x(I[0])}),l.addEventListener("change",y=>{y.target.files&&y.target.files.length>0&&x(y.target.files[0])}),d.addEventListener("input",y=>{let E=y.target.value.trim();E?(g&&(g.src=E),m&&m.classList.remove("hidden")):m&&m.classList.add("hidden")}),h&&h.addEventListener("click",y=>{y.preventDefault(),y.stopPropagation(),l.value="",d.value="",m&&m.classList.add("hidden"),g&&(g.src="")});async function x(y){if(!y.type.startsWith("image/")){B("\u26A0\uFE0F Por favor selecciona un archivo de imagen v\xE1lido.");return}let E=r.innerHTML;r.innerHTML=`
        <span class="material-symbols-outlined text-primary text-3xl animate-spin">sync</span>
        <span class="text-xs font-bold text-primary">Subiendo...</span>
      `,r.style.pointerEvents="none";let I=new FileReader;I.onload=async D=>{let L=D.target.result;g&&(g.src=L),m&&m.classList.remove("hidden");let Y=L;try{let C=await Et(y);C&&C.success&&C.url?(Y=C.url,B("\u{1F4F8} Imagen subida a Storage correctamente.")):(console.warn("Fallo Storage, usando fallback Base64:",C?.error),B("\u{1F4BE} Imagen procesada localmente."))}catch(C){console.warn("Error subiendo imagen, usando Base64:",C)}d.value=Y,r.innerHTML=E,r.style.pointerEvents="auto"},I.readAsDataURL(y)}};e("form-upload-zone","form-image-file","form-image","form-image-preview-container","form-image-preview","btn-remove-form-image"),e("edit-form-upload-zone","edit-form-image-file","edit-form-image","edit-form-image-preview-container","edit-form-image-preview","btn-remove-edit-image")}function da(){la();let e=["cards","month","week","day"];e.forEach(u=>{let c=document.getElementById(`btn-view-${u}`);c&&c.addEventListener("click",()=>{ce=u,e.forEach(p=>{let f=document.getElementById(`btn-view-${p}`);f&&(p===u?f.className="view-mode-btn px-3.5 py-2 rounded-xl bg-primary text-white font-bold transition-all flex items-center gap-1.5 shadow-sm":f.className="view-mode-btn px-3.5 py-2 rounded-xl text-outline hover:text-primary transition-all flex items-center gap-1.5")}),M()})});let t=document.getElementById("form-is-multiday");t&&t.addEventListener("change",u=>{let c=u.target.checked,p=document.getElementById("form-single-date-container"),f=document.getElementById("form-start-date-container"),b=document.getElementById("form-end-date-container");if(c){p&&p.classList.add("hidden"),f&&f.classList.remove("hidden"),b&&b.classList.remove("hidden");let v=document.getElementById("form-date")?.value;v&&!document.getElementById("form-start-date")?.value&&(document.getElementById("form-start-date").value=v)}else p&&p.classList.remove("hidden"),f&&f.classList.add("hidden"),b&&b.classList.add("hidden")});let n=document.getElementById("edit-form-is-multiday");n&&n.addEventListener("change",u=>{let c=u.target.checked,p=document.getElementById("edit-form-single-date-container"),f=document.getElementById("edit-form-start-date-container"),b=document.getElementById("edit-form-end-date-container");if(c){p&&p.classList.add("hidden"),f&&f.classList.remove("hidden"),b&&b.classList.remove("hidden");let v=document.getElementById("edit-form-date")?.value;v&&!document.getElementById("edit-form-start-date")?.value&&(document.getElementById("edit-form-start-date").value=v)}else p&&p.classList.remove("hidden"),f&&f.classList.add("hidden"),b&&b.classList.add("hidden")});let a=document.getElementById("search-input");a&&a.addEventListener("input",u=>{Xe=u.target.value,M()});let i=document.getElementById("region-select");i&&i.addEventListener("change",u=>{we=u.target.value,M()});let o=document.getElementById("month-select");o&&o.addEventListener("change",u=>{ae=u.target.value,M()});let s=document.getElementById("toggle-past-races");s&&s.addEventListener("change",u=>{Ot=u.target.checked,M()});let r=document.getElementById("discipline-chips");r&&r.addEventListener("click",u=>{let c=u.target.closest("[data-discipline]");c&&(Z=c.getAttribute("data-discipline"),Re(r,Z),M())});let l=["nav-explore","mobile-nav-explore"],d=["nav-agenda","nav-my-calendar","mobile-nav-agenda"],m=["nav-register","nav-publish-btn","hero-publish-btn","mobile-nav-register"],g=["brand-logo","nav-logo"];l.forEach(u=>{let c=document.getElementById(u);c&&c.addEventListener("click",p=>{p.preventDefault(),U("/")})}),d.forEach(u=>{let c=document.getElementById(u);c&&c.addEventListener("click",p=>{p.preventDefault(),U("/agenda")})}),m.forEach(u=>{let c=document.getElementById(u);c&&c.addEventListener("click",p=>{p.preventDefault(),U("/publicar")})}),g.forEach(u=>{let c=document.getElementById(u);c&&c.addEventListener("click",p=>{p.preventDefault(),U("/")})});let h=document.getElementById("btn-back-from-register");h&&h.addEventListener("click",()=>{let u=document.getElementById("race-form");u&&ue(u),H("calendar")});let x=document.getElementById("btn-cancel-register");x&&x.addEventListener("click",()=>{let u=document.getElementById("race-form");u&&ue(u),H("calendar")});let y=document.getElementById("mobile-menu-toggle"),E=document.getElementById("mobile-menu");y&&E&&y.addEventListener("click",()=>{E.classList.toggle("hidden")});let I=document.getElementById("races-container");I&&I.addEventListener("click",async u=>{let c=u.target.closest("[data-bookmark-id]");if(c){u.stopPropagation();let v=c.getAttribute("data-bookmark-id");He(v),await M();return}let p=u.target.closest("[data-edit-id]");if(p){u.stopPropagation();let v=p.getAttribute("data-edit-id");ca(v);return}let f=u.target.closest("[data-delete-id]");if(f){u.stopPropagation();let v=f.getAttribute("data-delete-id");jt(v);return}if(u.target.closest("[data-calendar-trigger], [data-calendar-action]"))return;let b=u.target.closest("[data-race-id], .btn-view-detail");if(b){let v=b.getAttribute("data-race-id");v&&U(`/evento/${v}`)}});let D=document.getElementById("detail-content");D&&D.addEventListener("click",async u=>{if(u.target.closest("#btn-back-to-calendar")){U("/");return}let p=u.target.closest("[data-edit-id]");if(p){let v=p.getAttribute("data-edit-id"),{openEditModal:j}=await Promise.resolve().then(()=>(he(),ve)),A=(await q()).find(_=>String(_.id)===String(v));A&&j(A);return}let f=u.target.closest("[data-delete-id]");if(f){let v=f.getAttribute("data-delete-id");jt(v);return}let b=u.target.closest("[data-bookmark-id]");if(b){let v=b.getAttribute("data-bookmark-id");He(v);let $=(await q()).find(A=>A.id===v);$&&Te(D,$,T,z),await M()}}),document.addEventListener("click",async u=>{let c=u.target.closest("[data-calendar-trigger]");if(c){u.stopPropagation();let f=c.getAttribute("data-calendar-trigger"),b=document.getElementById(`calendar-dropdown-${f}`);document.querySelectorAll(".calendar-dropdown-menu").forEach(v=>{v!==b&&v.classList.add("hidden")}),b&&b.classList.toggle("hidden");return}let p=u.target.closest("[data-calendar-action]");if(p){u.stopPropagation();let f=p.getAttribute("data-calendar-action"),b=p.getAttribute("data-race-id"),v=document.getElementById(`calendar-dropdown-${b}`);v&&v.classList.add("hidden");let $=(await q()).find(A=>String(A.id)===String(b));if(!$)return;if(f==="google"){let A=dt($);window.open(A,"_blank","noopener,noreferrer")}else if(f==="apple"||f==="outlook")ct($),B("\u{1F4C6} Descargando archivo .ics de calendario...");else if(f==="copy"){let A=$.displayDate||$.date,_=`${$.name||$.nombre} \u2014 ${A} en ${$.city||$.ubicacion||$.region}`;try{await navigator.clipboard.writeText(_),B("\u{1F4CB} Fecha copiada al portapapeles")}catch{B("\u{1F4CB} Fecha del evento: "+A)}}return}u.target.closest(".calendar-dropdown-menu")||document.querySelectorAll(".calendar-dropdown-menu").forEach(f=>{f.classList.add("hidden")})});let L=document.getElementById("race-form");L&&(L.noValidate=!0,L.addEventListener("submit",async u=>{u.preventDefault();let c=L.querySelector('[type="submit"]'),p=c?c.innerHTML:"";c&&(c.disabled=!0,c.classList.add("opacity-50","cursor-not-allowed"),c.innerHTML=`
          <span class="material-symbols-outlined text-lg animate-spin">sync</span>
          <span>Publicando...</span>
        `);let f=new FormData(L),b=document.getElementById("form-is-free")?.checked||!1,v=f.get("date")||"",j=document.getElementById("form-is-multiday")?.checked||!1,$=document.getElementById("form-start-date")?.value||"",A=document.getElementById("form-end-date")?.value||"",_=f.get("date")||"",ie={name:f.get("name")||"",discipline:f.get("discipline")||"",isMultiDay:j,date:j&&$||_,startDate:j&&$||_,endDate:j&&(A||$)||_,region:f.get("region")||"",organizador:f.get("organizer")||"",organizer:f.get("organizer")||"",registrationUrl:f.get("registrationUrl")||"",city:f.get("city")||"",distance:f.get("distance")||"",elevation:f.get("elevation")||"",price:b?0:f.get("price")||0,heroImage:f.get("heroImage")||"",description:f.get("description")||"",categories:f.get("categories")||""},re=Ye(ie);if(!re.isValid){Nt(L,re.errors),c&&(c.disabled=!1,c.classList.remove("opacity-50","cursor-not-allowed"),c.innerHTML=p);let w=L.querySelector(".field-error-msg");w&&w.scrollIntoView({behavior:"smooth",block:"center"});return}ue(L);let k=re.sanitizedData,Q="Todos",Ee="",Ze=k.date||"";if(k.date)try{let w=new Date(k.date+"T00:00:00");if(!isNaN(w.getTime())){Q=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"][w.getMonth()];let P=w.getDate(),Be=w.getFullYear();Ee=`${Q} ${Be}`,Ze=`${P} de ${Q}, ${Be}`}}catch{}let Ie=(await q()).filter(w=>{if(!w.date||!k.date)return!1;let ee=w.date===k.date,P=w.region===k.region,Be=w.discipline===k.discipline;return ee&&P&&Be});if(Ie.length>0){let w=Ie.map(P=>`"${P.name}"`).join(", "),ee=document.getElementById("form-conflict-warning");if(ee)ee.innerHTML=`
            <span class="material-symbols-outlined text-lg align-middle">warning</span>
            <strong>Advertencia de Conflicto:</strong> Ya existe(n) ${Ie.length} carrera(s) en esta misma fecha, regi\xF3n y disciplina: ${w}.
            Verifica antes de publicar o cambia la fecha/disciplina/regi\xF3n.
          `,ee.classList.remove("hidden"),ee.scrollIntoView({behavior:"smooth",block:"center"});else{let P=document.createElement("div");P.id="form-conflict-warning",P.className="w-full p-4 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-700 dark:text-amber-300 text-sm font-semibold flex flex-col gap-2 mb-2",P.innerHTML=`
            <span class="material-symbols-outlined text-lg align-middle">warning</span>
            <strong>Advertencia de Conflicto:</strong> Ya existe(n) ${Ie.length} carrera(s) en esta misma fecha, regi\xF3n y disciplina: ${w}.
            Verifica antes de publicar o cambia la fecha/disciplina/regi\xF3n.
          `,L.insertBefore(P,L.firstChild),P.scrollIntoView({behavior:"smooth",block:"center"})}c&&(c.disabled=!1,c.classList.remove("opacity-50","cursor-not-allowed"));return}let Qe=document.getElementById("form-conflict-warning");Qe&&Qe.remove();let et=f.get("categories")||"",Ut=typeof et=="string"?et.split(",").map(w=>w.trim()).filter(Boolean):[],Ft={id:"race-"+Date.now(),name:k.name||"Nueva Carrera",discipline:k.discipline||"Ruta",date:k.date||"",month:Q,monthYear:Ee,displayDate:Ze,region:k.region||"Regi\xF3n Metropolitana de Santiago",city:k.city||"",distance:k.distance||"0 km",elevation:k.elevation||"0 m",price:b?0:Number(k.price)||0,isFree:b,status:"Pendiente",organizer:k.organizador||k.organizer||"",organizador:k.organizador||k.organizer||"",registrationUrl:k.registrationUrl||"",heroImage:k.heroImage||"https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=1200&q=80",description:k.description||"",categories:Ut,participants:1},De=z,tt=(document.getElementById("form-organizer-email")?.value||"").trim(),at=(document.getElementById("form-organizer-password")?.value||"").trim();if(!De){if(!tt||!at){B("\u26A0\uFE0F Debes ingresar tu email y contrase\xF1a de organizador para publicar la carrera."),c&&(c.disabled=!1,c.classList.remove("opacity-50","cursor-not-allowed"),c.innerHTML=p),document.getElementById("form-organizer-email")?.focus();return}let w=await bt(tt,at);if(!w.success||!w.userId){B("\u26A0\uFE0F Error al verificar tu cuenta: "+(w.error||"Email o contrase\xF1a incorrectos.")),c&&(c.disabled=!1,c.classList.remove("opacity-50","cursor-not-allowed"),c.innerHTML=p);return}De=w.userId,z=De,je()}try{let w=await Dt(Ft,De);if(w&&w.success===!1)throw new Error(w.error?.message||w.error||"Error al guardar en la base de datos")}catch(w){console.error("Error al guardar la carrera:",w),B("\u26A0\uFE0F Error al publicar la carrera: "+(w.message||w)),c&&(c.disabled=!1,c.classList.remove("opacity-50","cursor-not-allowed"),c.innerHTML=p);return}B("\u2705 \xA1Carrera publicada con \xE9xito! Ya aparece en el calendario. Puedes editarla o eliminarla iniciando sesi\xF3n con tu cuenta de organizador."),L.reset();let nt=document.getElementById("form-single-date-container"),it=document.getElementById("form-start-date-container"),rt=document.getElementById("form-end-date-container");nt&&nt.classList.remove("hidden"),it&&it.classList.add("hidden"),rt&&rt.classList.add("hidden"),c&&(c.disabled=!1,c.classList.remove("opacity-50","cursor-not-allowed"),c.innerHTML=p),ne="all",H("calendar"),await M()}));let Y=document.getElementById("login-modal"),C=document.getElementById("edit-modal");["nav-admin-login","mobile-nav-admin-login"].forEach(u=>{let c=document.getElementById(u);c&&c.addEventListener("click",async p=>{p.preventDefault();let{openLoginModal:f,setAuthChangeCallback:b}=await Promise.resolve().then(()=>(he(),ve));b(v=>{T=v,_e(),v&&M()}),f()})}),["nav-admin-logout","mobile-nav-admin-logout"].forEach(u=>{let c=document.getElementById(u);c&&c.addEventListener("click",async p=>{p.preventDefault(),(await fe()).success&&(T=!1,_e(),U("/"),B("\u{1F512} Sesi\xF3n de administrador cerrada."),await M())})}),["nav-admin-panel","mobile-nav-admin-panel"].forEach(u=>{let c=document.getElementById(u);c&&c.addEventListener("click",p=>{p.preventDefault(),U("/admin")})});let O=document.getElementById("btn-close-edit");O&&O.addEventListener("click",()=>{C&&C.classList.add("hidden")});let W=document.getElementById("btn-cancel-edit");W&&W.addEventListener("click",()=>{C&&C.classList.add("hidden")});let me=document.getElementById("pending-races-list");me&&me.addEventListener("click",async u=>{let c=u.target.closest("[data-approve-id]");if(c){let f=c.getAttribute("data-approve-id");c.disabled=!0;let b=await se(f,"aprobada");b.success?(B("\u2705 Carrera aprobada con \xE9xito. Ya es visible en el calendario."),await zt(),await M()):(B("\u26A0\uFE0F No se pudo aprobar la carrera: "+b.error),c.disabled=!1);return}let p=u.target.closest("[data-reject-id]");if(p){let f=p.getAttribute("data-reject-id");p.disabled=!0;let b=await se(f,"rechazada");b.success?(B("\u274C Propuesta rechazada."),await zt(),await M()):(B("\u26A0\uFE0F No se pudo rechazar la carrera: "+b.error),p.disabled=!1)}});let pe=document.getElementById("edit-form");pe&&pe.addEventListener("submit",async u=>{u.preventDefault();let c=document.getElementById("edit-race-id")?.value;if(!c)return;let p=document.getElementById("btn-save-edit");p&&(p.disabled=!0,p.classList.add("opacity-50"));let f=document.getElementById("edit-form-is-free")?.checked||!1,b=new FormData(pe),v=document.getElementById("edit-form-is-multiday")?.checked||!1,j=document.getElementById("edit-form-start-date")?.value||"",$=document.getElementById("edit-form-end-date")?.value||"",A=b.get("date")||"",_={name:b.get("name")||"",discipline:b.get("discipline")||"",isMultiDay:v,date:v&&j||A,startDate:v&&j||A,endDate:v&&($||j)||A,region:b.get("region")||"",organizador:b.get("organizer")||"",organizer:b.get("organizer")||"",registrationUrl:b.get("registrationUrl")||"",city:b.get("city")||"",distance:b.get("distance")||"",elevation:b.get("elevation")||"",price:f?0:b.get("price")||0,heroImage:b.get("heroImage")||"",description:b.get("description")||"",categories:b.get("categories")||""},ie=Ye(_);if(!ie.isValid){Nt(pe,ie.errors),p&&(p.disabled=!1,p.classList.remove("opacity-50"));return}ue(pe);let re=await Lt(c,ie.sanitizedData);if(re.success){if(B("\u{1F4BE} Cambios guardados con \xE9xito."),C&&C.classList.add("hidden"),await M(),document.getElementById("view-detail")?.classList.contains("hidden")===!1&&Pt===c){let Q=(await q()).find(Ee=>Ee.id===c);Q&&Te(document.getElementById("detail-content"),Q,T,z)}}else B("\u26A0\uFE0F Error al guardar los cambios: "+re.error);p&&(p.disabled=!1,p.classList.remove("opacity-50"))})}function _e(){let e=[document.getElementById("nav-admin-panel"),document.getElementById("mobile-nav-admin-panel")],t=[document.getElementById("nav-admin-logout"),document.getElementById("mobile-nav-admin-logout")],n=[document.getElementById("nav-admin-login"),document.getElementById("mobile-nav-admin-login")];e.forEach(a=>{a&&(T?a.classList.remove("hidden"):a.classList.add("hidden"))}),t.forEach(a=>{a&&(T?a.classList.remove("hidden"):a.classList.add("hidden"))}),n.forEach(a=>{a&&(T?a.classList.add("hidden"):a.classList.remove("hidden"))})}function je(){let e=document.getElementById("nav-organizer-login"),t=document.getElementById("nav-organizer-logout"),n=document.getElementById("mobile-nav-organizer-login"),a=document.getElementById("mobile-nav-organizer-logout"),i=!!z&&!T;[e,n].forEach(o=>{o&&(i?o.classList.add("hidden"):o.classList.remove("hidden"))}),[t,a].forEach(o=>{o&&(i?o.classList.remove("hidden"):o.classList.add("hidden"))})}async function zt(){let e=document.getElementById("pending-races-list"),t=document.getElementById("pending-count");if(!e)return;let n=await ke(),a=Array.isArray(n)?n:n&&n.success?n.data:[];t&&(t.textContent=a.length),Ne(e,a)}async function ca(e){let{ensureAdminElementsMounted:t}=await Promise.resolve().then(()=>(he(),ve));t();let n=document.getElementById("edit-modal");if(!n)return;let i=(await q()).find(x=>String(x.id)===String(e));if(!i)return;document.getElementById("edit-race-id").value=e,document.getElementById("edit-form-name").value=i.name||"",document.getElementById("edit-form-discipline").value=i.discipline||"Ruta";let o=i.startDate||i.fecha_inicio||i.date||"",s=i.endDate||i.fecha_fin||o,r=!!(o&&s&&o!==s),l=document.getElementById("edit-form-is-multiday");if(l){l.checked=r;let x=document.getElementById("edit-form-single-date-container"),y=document.getElementById("edit-form-start-date-container"),E=document.getElementById("edit-form-end-date-container");r?(x&&x.classList.add("hidden"),y&&y.classList.remove("hidden"),E&&E.classList.remove("hidden")):(x&&x.classList.remove("hidden"),y&&y.classList.add("hidden"),E&&E.classList.add("hidden"))}document.getElementById("edit-form-date").value=o,document.getElementById("edit-form-start-date")&&(document.getElementById("edit-form-start-date").value=o),document.getElementById("edit-form-end-date")&&(document.getElementById("edit-form-end-date").value=s),document.getElementById("edit-form-city").value=i.city||"",document.getElementById("edit-form-distance").value=i.distance||"",document.getElementById("edit-form-elevation").value=i.elevation||"",document.getElementById("edit-form-price").value=i.price||0,document.getElementById("edit-form-is-free").checked=!!i.isFree||i.price===0,document.getElementById("edit-form-status").value=i.status||"Inscripciones Abiertas",document.getElementById("edit-form-organizer").value=i.organizer||i.organizador||"",document.getElementById("edit-form-url").value=i.registrationUrl||"",document.getElementById("edit-form-image").value=i.heroImage||"";let d=document.getElementById("edit-form-image-preview-container"),m=document.getElementById("edit-form-image-preview");d&&m&&i.heroImage?(m.src=i.heroImage,d.classList.remove("hidden")):d&&d.classList.add("hidden"),document.getElementById("edit-form-categories").value=Array.isArray(i.categories)?i.categories.join(", "):"",document.getElementById("edit-form-description").value=i.description||"";let g=document.getElementById("edit-form-region");if(g){let x=K.filter(y=>y!=="Todas las regiones");xe(g,x,i.region||x[0])}let h=document.getElementById("edit-form");h&&ue(h),n.classList.remove("hidden")}async function jt(e){if(!confirm("\u26A0\uFE0F \xBFEst\xE1s seguro de que deseas eliminar esta carrera de forma permanente? Esta acci\xF3n no se puede deshacer."))return;let n=await Bt(e);n.success?(B("\u{1F5D1}\uFE0F Carrera eliminada con \xE9xito."),H("calendar"),await M()):B("\u26A0\uFE0F No se pudo eliminar la carrera: "+n.error)}async function _t(){let e=document.getElementById("region-select");e&&xe(e,K,we);let t=K.filter(o=>o!=="Todas las regiones"),n=document.getElementById("form-region");n&&xe(n,t,t[0]);let a=document.getElementById("edit-form-region");a&&xe(a,t,t[0]);let i=document.getElementById("discipline-chips");i&&Re(i,Z),da(),st(async o=>{let{viewName:s,params:r}=o,d=new URLSearchParams(window.location.search).get("disciplina");if(d){Z=d;let m=document.getElementById("discipline-chips");m&&Re(m,Z)}if(s==="admin-panel"){let{ensureAdminElementsMounted:m,loadPendingRacesList:g,openLoginModal:h}=await Promise.resolve().then(()=>(he(),ve));if(m(),!T){h(),U("/");return}H("admin-panel"),await g();return}if(s==="detail"&&r.id){H("detail");let m=document.getElementById("detail-content");m&&(m.innerHTML=`
          <div class="py-24 text-center space-y-4">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto"></div>
            <p class="text-sm font-bold text-outline">Cargando detalles de la carrera...</p>
          </div>
        `);let g=null;if(X()&&(g=await ft(r.id)),g||(g=(await q()).find(x=>String(x.id)===String(r.id))),g){Pt=g.id,m&&Te(m,g,T,z);return}else{m&&(m.innerHTML=`
            <div class="py-16 text-center bg-white rounded-3xl border border-dashed border-outline-variant/60 p-8 space-y-4 max-w-lg mx-auto">
              <div class="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mx-auto text-outline">
                <span class="material-symbols-outlined text-4xl">search_off</span>
              </div>
              <h3 class="font-display font-bold text-xl text-primary">Carrera no encontrada</h3>
              <p class="text-outline text-sm">El evento que buscas no existe o ha sido eliminado.</p>
              <button type="button" onclick="window.history.pushState({}, '', '/'); window.dispatchEvent(new Event('popstate'));" class="px-6 py-2.5 rounded-xl bg-primary text-white font-display font-bold text-sm hover:bg-black transition-all">
                Volver al Calendario
              </button>
            </div>
          `);return}}if(s==="agenda"){ne="my-calendar",H("agenda"),await M();return}if(s==="register"){H("register");return}ne="all",H("calendar"),await M()}),vt().then(async o=>{o&&(await ge(o.id)?(T=!0,z=null,_e()):(T=!1,z=o.id,je(),await M()))}).catch(()=>{T=!1,z=null}),["nav-organizer-login","mobile-nav-organizer-login"].forEach(o=>{let s=document.getElementById(o);s&&s.addEventListener("click",async()=>{let r=prompt("Email de tu cuenta de organizador:");if(!r)return;let l=prompt("Contrase\xF1a:");if(!l)return;let d=await xt(r,l);d.success&&d.userId?(await ge(d.userId)?(T=!0,z=null,_e(),B("\u{1F513} Sesi\xF3n de administrador iniciada.")):(z=d.userId,je(),B("\u2705 Sesi\xF3n de organizador iniciada. Ahora puedes editar tus carreras.")),await M()):B("\u26A0\uFE0F Email o contrase\xF1a incorrectos: "+(d.error||""))})}),["nav-organizer-logout","mobile-nav-organizer-logout"].forEach(o=>{let s=document.getElementById(o);s&&s.addEventListener("click",async()=>{await fe(),z=null,je(),B("\u{1F44B} Sesi\xF3n de organizador cerrada."),await M()})})}var Z,we,ae,Xe,Ot,ne,ce,Pt,T,z,Tt=V(()=>{ot();Le();ut();Ae();Je();We();Ce();Z="Todas",we="Todas las regiones",ae="Todos",Xe="",Ot=!1,ne="all",ce="cards",Pt=null,T=!1,z=null;document.readyState==="loading"?document.addEventListener("DOMContentLoaded",_t):_t()});Tt();export{ue as clearFormErrors,sa as getFilteredRaces,jt as handleDeleteRace,zt as loadPendingRacesList,ca as openEditModal,Nt as renderFormErrors,oa as renderSkeletons,B as showNotificationToast,_e as updateAuthUI,M as updateCalendar,je as updateOrganizerUI};
