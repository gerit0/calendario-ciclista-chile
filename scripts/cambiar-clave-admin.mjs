/**
 * scripts/cambiar-clave-admin.mjs
 * 
 * Script de utilidad para restablecer la contraseña del usuario administrador en Supabase.
 * Usa las credenciales maestras de .env.local para actualizar la contraseña vía Supabase Admin API.
 * 
 * Uso:
 *   node scripts/cambiar-clave-admin.mjs "TuNuevaContraseñaSegura"
 */

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// 1. Cargar variables desde .env.local
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

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Error: Falta SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local');
  process.exit(1);
}

const newPassword = process.argv[2];

if (!newPassword || newPassword.trim().length < 6) {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('⚠️  USO:');
  console.log('   node scripts/cambiar-clave-admin.mjs "<nueva_contraseña>"');
  console.log('');
  console.log('Ejemplo:');
  console.log('   node scripts/cambiar-clave-admin.mjs "MiClaveSegura2026!"');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  console.log('🔍 Buscando usuario administrador...');

  // 1. Obtener usuario admin desde tabla usuarios_admin
  const { data: admins, error: adminErr } = await supabase
    .from('usuarios_admin')
    .select('user_id');

  if (adminErr || !admins || admins.length === 0) {
    console.error('❌ No se encontró ningún administrador en la tabla usuarios_admin:', adminErr?.message);
    process.exit(1);
  }

  const adminUserId = admins[0].user_id;

  // 2. Obtener datos del usuario
  const { data: userData, error: userErr } = await supabase.auth.admin.getUserById(adminUserId);
  if (userErr || !userData?.user) {
    console.error('❌ No se pudo encontrar el usuario en Auth:', userErr?.message);
    process.exit(1);
  }

  const adminEmail = userData.user.email;
  console.log(`👤 Administrador encontrado: ${adminEmail} (ID: ${adminUserId})`);

  // 3. Actualizar contraseña
  const { error: updateErr } = await supabase.auth.admin.updateUserById(adminUserId, {
    password: newPassword.trim()
  });

  if (updateErr) {
    console.error('❌ Error al cambiar la contraseña:', updateErr.message);
    process.exit(1);
  }

  console.log('');
  console.log('✅ ¡Contraseña actualizada con éxito!');
  console.log(`📧 Correo: ${adminEmail}`);
  console.log('🔑 La nueva contraseña ya está activa.');
  console.log('👉 Ahora puedes ingresar al panel de administración en la web.');
}

main().catch(err => {
  console.error('❌ Error inesperado:', err);
  process.exit(1);
});
