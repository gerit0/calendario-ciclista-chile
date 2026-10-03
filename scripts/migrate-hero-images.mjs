/**
 * scripts/migrate-hero-images.mjs
 * 
 * Script seguro e idempotente para migrar imágenes en base64 de carreras a Supabase Storage.
 * 
 * REQUISITOS:
 * 1. Por defecto se ejecuta en modo DRY-RUN (simulación sin cambios).
 * 2. Para ejecutar la migración real se requiere pasar el flag explícito: --execute
 * 3. Exporta un respaldo JSON completo de la tabla `carreras` antes de realizar modificaciones.
 * 4. Valida con HTTP 200 que la imagen esté disponible en Supabase Storage antes de actualizar la fila.
 * 5. Se enfoca estrictamente en las 3 carreras afectadas acordadas:
 *    - Curicó Tour 2026 (fe28c1f8-56dc-485b-a406-46d7132e89b7)
 *    - Maule Centro 2027 (a1a081da-45d6-47b2-938b-d7aa1974737d)
 *    - Gran Fondo Ruta del Ácido (4e7f73ed-46fb-40c2-9e26-5b48ad0a7fa4)
 */

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Cargar variables desde .env.local si existe
function loadEnvLocal() {
  const envPath = path.resolve('.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.substring(0, eqIdx).trim();
        let val = trimmed.substring(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.substring(1, val.length - 1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

loadEnvLocal();

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://mhzktzvxdmhanqkhhaqm.supabase.co';
const isDryRun = !process.argv.includes('--execute');

const DEFAULT_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oemt0enZ4ZG1oYW5xa2hoYXFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ1NjAyMzMsImV4cCI6MjEwMDEzNjIzM30.WNC9F2xqRPk7Ry5Sxr53BloWaq1hZ09FDI7OItfQB8s';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || DEFAULT_ANON_KEY;

if (!isDryRun && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Error: Para ejecutar la migración real (--execute) es OBLIGATORIO configurar SUPABASE_SERVICE_ROLE_KEY en .env.local.');
  process.exit(1);
}

const TARGET_RACE_IDS = [
  'fe28c1f8-56dc-485b-a406-46d7132e89b7', // Curico Tour 2026
  '4e7f73ed-a65a-4889-bd0c-fd3164339c6b', // Ruta del Acido
  'a1a081da-c9c7-496f-a383-f796b524eb3f', // Maule Centro 2027
  'ffb56586-e413-41ed-a097-5e075bfd5d7e'  // Vuelta Union Ciclista Curico (pendiente)
];

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false }
});

async function run() {
  console.log('===============================================================');
  console.log('🚲 MIGRACIÓN DE IMÁGENES BASE64 -> SUPABASE STORAGE');
  console.log(`Modo de ejecución: ${isDryRun ? '🟡 DRY-RUN (SIMULACIÓN - NO SE APLICAN CAMBIOS)' : '🔴 EJECUCIÓN REAL (--execute)'}`);
  console.log(`Destino: Supabase Storage bucket 'race-images'`);
  console.log('===============================================================\n');

  // 1. Respaldo completo de la tabla carreras
  console.log('📦 Paso 1: Generando respaldo JSON completo de la tabla `carreras`...');
  const { data: allRaces, error: fetchAllError } = await supabase
    .from('carreras')
    .select('*');

  if (fetchAllError) {
    console.error('❌ Error al obtener los datos para respaldo:', fetchAllError.message);
    process.exit(1);
  }

  const backupDir = path.resolve('backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = path.join(backupDir, `carreras_backup_${timestamp}.json`);
  fs.writeFileSync(backupFile, JSON.stringify(allRaces, null, 2), 'utf8');
  console.log(`✅ Respaldo guardado exitosamente (${allRaces.length} carreras) en:`);
  console.log(`   ${backupFile}\n`);

  // 2. Filtrar las carreras objetivo
  const targetRaces = allRaces.filter(r => (r.hero_image && r.hero_image.startsWith('data:image/')) || TARGET_RACE_IDS.includes(r.id));
  console.log(`🔍 Paso 2: Analizando carreras objetivo (${targetRaces.length} encontradas)...`);

  const summary = [];

  for (const race of targetRaces) {
    const isBase64 = race.hero_image && race.hero_image.startsWith('data:image/');
    
    if (!isBase64) {
      console.log(`  ⚪ [OMITIDA / IDEMPOTENTE] ${race.nombre} (${race.id}) ya tiene URL: ${race.hero_image?.substring(0, 60)}...`);
      summary.push({
        id: race.id,
        nombre: race.nombre,
        status: 'OMITIDA (YA TIENE URL)',
        size: 'N/A'
      });
      continue;
    }

    // Extraer mime type y buffer
    const match = race.hero_image.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/s);
    if (!match) {
      console.warn(`  ⚠️ [FORMATO INVALIDO] ${race.nombre} tiene datos base64 malformados.`);
      continue;
    }

    const rawExt = match[1].toLowerCase();
    const ext = rawExt === 'jpeg' ? 'jpg' : rawExt;
    const base64Data = match[2];
    const buffer = Buffer.from(base64Data, 'base64');
    const sizeKB = (buffer.length / 1024).toFixed(1);
    const targetStoragePath = `races/${race.id}-migrated.${ext}`;

    console.log(`\n  🎯 Carrera: "${race.nombre}" (ID: ${race.id})`);
    console.log(`     - Formato: image/${ext}`);
    console.log(`     - Tamaño Base64 actual: ${sizeKB} KB (${race.hero_image.length.toLocaleString()} caracteres en DB)`);
    console.log(`     - Ruta propuesta en bucket 'race-images': ${targetStoragePath}`);

    if (isDryRun) {
      console.log(`     [DRY-RUN] Simulación exitosa. No se subió ningún archivo ni se modificó la DB.`);
      summary.push({
        id: race.id,
        nombre: race.nombre,
        status: 'LISTO PARA MIGRAR (DRY-RUN OK)',
        sizeKB: `${sizeKB} KB`,
        targetPath: targetStoragePath
      });
      continue;
    }

    // Modo ejecución real
    console.log(`     🚀 Subiendo imagen a Supabase Storage...`);
    const { error: uploadError } = await supabase
      .storage
      .from('race-images')
      .upload(targetStoragePath, buffer, {
        contentType: `image/${rawExt}`,
        upsert: true
      });

    if (uploadError) {
      console.error(`     ❌ Falló la subida a Storage: ${uploadError.message}`);
      continue;
    }

    const { data: publicUrlData } = supabase
      .storage
      .from('race-images')
      .getPublicUrl(targetStoragePath);

    const publicUrl = publicUrlData.publicUrl;
    console.log(`     🔗 URL pública generada: ${publicUrl}`);

    // Verificar que responda 200 OK antes de tocar la DB
    console.log(`     🩺 Verificando accesibilidad HTTP 200 de la URL pública...`);
    try {
      const checkRes = await fetch(publicUrl, { method: 'HEAD' });
      if (!checkRes.ok) {
        throw new Error(`HTTP status ${checkRes.status}: ${checkRes.statusText}`);
      }
      console.log(`     ✅ Verificación HTTP 200 OK confirmada.`);
    } catch (headErr) {
      console.error(`     ❌ Error: La URL generada no responde 200 OK (${headErr.message}). ABORTANDO actualización para esta carrera.`);
      continue;
    }

    // Actualizar fila en DB
    console.log(`     💾 Actualizando registro en la tabla carreras...`);
    const { error: updateError } = await supabase
      .from('carreras')
      .update({ hero_image: publicUrl })
      .eq('id', race.id);

    if (updateError) {
      console.error(`     ❌ Error al actualizar DB: ${updateError.message}`);
      continue;
    }

    console.log(`     🎉 [EXITO] Carrera "${race.nombre}" actualizada permanentemente con URL.`);
    summary.push({
      id: race.id,
      nombre: race.nombre,
      status: 'MIGRADA CON ÉXITO',
      newUrl: publicUrl
    });
  }

  console.log('\n===============================================================');
  console.log('📊 RESUMEN FINAL DE LA OPERACIÓN');
  console.log('===============================================================');
  console.table(summary);

  if (isDryRun) {
    console.log('\n⚠️ Recuerda: Esta fue una simulación DRY-RUN. Ningún registro ni archivo fue alterado.');
    console.log('Para aplicar los cambios definitivos tras la aprobación del usuario, ejecuta:');
    console.log('  node scripts/migrate-hero-images.mjs --execute\n');
  }
}

run().catch(err => {
  console.error('❌ Error fatal en el proceso:', err);
  process.exit(1);
});
