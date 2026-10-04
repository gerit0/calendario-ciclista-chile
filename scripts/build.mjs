import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import esbuild from 'esbuild';

async function build() {
  console.log('📦 Compilando bundle frontend con esbuild...');
  
  await esbuild.build({
    entryPoints: ['js/app.js'],
    bundle: true,
    outfile: 'js/bundle.js',
    format: 'esm',
    platform: 'browser',
    external: ['@supabase/supabase-js'],
    minify: true,
    sourcemap: true,
    target: ['es2022']
  });

  const bundleContent = fs.readFileSync('js/bundle.js');
  const hash = crypto.createHash('md5').update(bundleContent).digest('hex').substring(0, 8);
  console.log(`✅ Bundle generado con éxito. Hash: ${hash}`);

  // Actualizar index.html con el nuevo hash de cache-busting (ruta absoluta /js/bundle.js para soportar rutas profundas como /editar/:id)
  const htmlPath = path.resolve('index.html');
  let html = fs.readFileSync(htmlPath, 'utf8');
  html = html.replace(/\/?js\/bundle\.js(\?v=[a-zA-Z0-9_-]+)?/g, `/js/bundle.js?v=${hash}`);
  fs.writeFileSync(htmlPath, html, 'utf8');

  console.log(`🚀 index.html actualizado con script: js/bundle.js?v=${hash}`);

  // Sincronizar directorio public/ como respaldo de seguridad para Vercel
  try {
    if (!fs.existsSync('public')) {
      fs.mkdirSync('public', { recursive: true });
    }
    fs.copyFileSync(htmlPath, path.resolve('public/index.html'));
    if (!fs.existsSync('public/js')) {
      fs.mkdirSync('public/js', { recursive: true });
    }
    fs.copyFileSync('js/bundle.js', path.resolve('public/js/bundle.js'));
    if (fs.existsSync('js/bundle.js.map')) {
      fs.copyFileSync('js/bundle.js.map', path.resolve('public/js/bundle.js.map'));
    }
    console.log('📂 Carpeta public/ sincronizada para máxima compatibilidad con Vercel.');
  } catch (syncErr) {
    console.warn('Advertencia al sincronizar public/:', syncErr.message);
  }
}

build().catch(err => {
  console.error('❌ Error en el build:', err);
  process.exit(1);
});
