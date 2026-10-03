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
}

build().catch(err => {
  console.error('❌ Error en el build:', err);
  process.exit(1);
});
