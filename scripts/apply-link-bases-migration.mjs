/**
 * scripts/apply-link-bases-migration.mjs
 * 
 * Script para verificar y ejecutar/aplicar la migración que añade la columna `link_bases TEXT`
 * a la tabla `carreras` en Supabase.
 * 
 * Uso:
 *   node scripts/apply-link-bases-migration.mjs
 */

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Cargar variables de entorno desde .env.local
function loadEnvLocal() {
  const envPath = path.resolve('.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('❌ Error: Archivo .env.local no encontrado.');
    process.exit(1);
  }
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

loadEnvLocal();

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://mhzktzvxdmhanqkhhaqm.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_KEY) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY no está definido en .env.local');
  process.exit(1);
}

console.log('================================================================');
console.log('🚴 VERIFICACIÓN Y MIGRACIÓN DE COLUMNA link_bases EN SUPABASE');
console.log(`📡 URL Supabase: ${SUPABASE_URL}`);
console.log('================================================================');

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false }
});

const MIGRATION_SQL = `ALTER TABLE public.carreras ADD COLUMN IF NOT EXISTS link_bases TEXT;`;

async function main() {
  console.log('\n1. Verificando si la columna `link_bases` ya existe en la tabla `carreras`...');
  
  const { data, error } = await supabase
    .from('carreras')
    .select('id, link_bases')
    .limit(1);

  if (!error) {
    console.log('✅ ¡La columna `link_bases` YA EXISTE y está disponible en la tabla `carreras`!');
    console.log('   Muestra de registro obtenido:', data);
    return;
  }

  // Si hubo error, verificar si es porque la columna no existe
  console.warn(`⚠️ Aviso: La columna 'link_bases' no pudo ser consultada directamente.`);
  console.warn(`   Detalle del error: ${error.message} (Código: ${error.code})`);

  console.log('\n2. Intentando aplicar migración DDL vía RPC si existe...');
  const possibleRpcs = ['exec_sql', 'run_sql', 'execute_sql', 'query'];
  let appliedViaRpc = false;

  for (const rpcName of possibleRpcs) {
    try {
      const { data: rpcData, error: rpcErr } = await supabase.rpc(rpcName, { sql: MIGRATION_SQL, query: MIGRATION_SQL });
      if (!rpcErr) {
        console.log(`✅ Migración ejecutada exitosamente mediante RPC '${rpcName}'!`);
        appliedViaRpc = true;
        break;
      }
    } catch {
      // Ignorar rpc no existente
    }
  }

  if (appliedViaRpc) {
    // Re-verificar
    const { data: recheckData, error: recheckErr } = await supabase
      .from('carreras')
      .select('id, link_bases')
      .limit(1);

    if (!recheckErr) {
      console.log('🎉 Verificación posterior: Columna `link_bases` confirmada en `carreras`.');
      return;
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📌 INSTRUCCIONES MANUALES DE MIGRACIÓN:');
  console.log('Supabase PostgREST no permite ejecución arbitraria de DDL sin función RPC previa.');
  console.log('Si la columna aún no está creada, ejecuta la siguiente sentencia en:');
  console.log(`🔗 ${SUPABASE_URL}/project/sql`);
  console.log('\nSentencia SQL:');
  console.log('------------------------------------------------------------');
  console.log(MIGRATION_SQL);
  console.log('------------------------------------------------------------');
  console.log('Archivo de migración correspondiente:');
  console.log('supabase/migrations/20261005_add_link_bases_column.sql');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main().catch(err => {
  console.error('❌ Error fatal al ejecutar script de migración:', err);
  process.exit(1);
});
