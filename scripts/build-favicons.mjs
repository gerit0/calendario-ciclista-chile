/**
 * scripts/build-favicons.mjs
 * 
 * Genera de forma precisa todos los formatos de favicon para compatibilidad universal con navegadores:
 * - favicon.svg (SVG limpio escalable)
 * - favicon-32x32.png (32x32 rasterizado real)
 * - favicon-16x16.png (16x16 rasterizado real)
 * - apple-touch-icon.png (180x180 para iOS y Android)
 * - favicon.ico (contenedor multi-resolución con PNG 16x16 y 32x32)
 */

import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

// SVG optimizado y escalable sin ancho/alto fijo para escalar en cualquier resolución
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#232525"/>
      <stop offset="100%" stop-color="#141515"/>
    </linearGradient>
  </defs>
  <!-- Squircle container oscuro -->
  <rect width="512" height="512" rx="115" fill="url(#bgGrad)"/>
  <rect x="6" y="6" width="500" height="500" rx="110" fill="none" stroke="#d8ef00" stroke-width="6" stroke-opacity="0.25"/>

  <!-- Ciclista & Bicicleta en Volt/Lime (#d8ef00) con casco Terracota (#a73918) -->
  <g transform="translate(64, 64) scale(16)">
    <!-- Casco / Cabeza -->
    <circle cx="15.5" cy="3.5" r="2.2" fill="#a73918"/>
    
    <!-- Rueda trasera -->
    <circle cx="5" cy="17" r="4.8" fill="none" stroke="#d8ef00" stroke-width="1.8"/>
    <circle cx="5" cy="17" r="1.2" fill="#d8ef00"/>

    <!-- Rueda delantera -->
    <circle cx="19" cy="17" r="4.8" fill="none" stroke="#d8ef00" stroke-width="1.8"/>
    <circle cx="19" cy="17" r="1.2" fill="#d8ef00"/>

    <!-- Cuadro y Ciclista en movimiento -->
    <path d="M10.8 10.5l2.4-2.4.8.8c1.3 1.3 3 2.1 5 2.1V9c-1.5 0-2.9-.6-3.9-1.6l-1.8-1.8c-.5-.5-1.1-.8-1.8-.8s-1.3.3-1.8.8L6.1 9.2c-.4.4-.7 1-.7 1.6 0 .6.3 1.2.7 1.6l3.3 3.3V20h2v-5l-2.6-2.6 2-2.1z" fill="#d8ef00"/>
  </g>
</svg>`;

function buildIco(images) {
  // images: array of { width, height, buffer }
  const count = images.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type ICO
  header.writeUInt16LE(count, 4); // count

  let offset = 6 + (16 * count);
  const entries = [];
  const buffers = [];

  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2); // colors
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bpp
    entry.writeUInt32LE(img.buffer.length, 8); // size
    entry.writeUInt32LE(offset, 12); // offset

    entries.push(entry);
    buffers.push(img.buffer);
    offset += img.buffer.length;
  }

  return Buffer.concat([header, ...entries, ...buffers]);
}

async function generate() {
  console.log('🚴 Generando favicons...');
  fs.writeFileSync('favicon.svg', svgContent, 'utf8');

  const browser = await chromium.launch({ headless: true });

  const renderPng = async (size) => {
    const page = await browser.newPage({ viewport: { width: size, height: size } });
    await page.setContent(`<!DOCTYPE html><html><head><style>html, body { margin:0; padding:0; width:${size}px; height:${size}px; overflow:hidden; background:transparent; }</style></head><body>${svgContent}</body></html>`);
    const buffer = await page.screenshot({ omitBackground: true, type: 'png' });
    await page.close();
    return buffer;
  };

  const png16 = await renderPng(16);
  const png32 = await renderPng(32);
  const png180 = await renderPng(180);
  const png192 = await renderPng(192);

  await browser.close();

  fs.writeFileSync('favicon-16x16.png', png16);
  fs.writeFileSync('favicon-32x32.png', png32);
  fs.writeFileSync('apple-touch-icon.png', png180);

  const icoBuffer = buildIco([
    { width: 16, height: 16, buffer: png16 },
    { width: 32, height: 32, buffer: png32 }
  ]);
  fs.writeFileSync('favicon.ico', icoBuffer);

  console.log(`✅ favicon.svg generado (${svgContent.length} bytes)`);
  console.log(`✅ favicon-16x16.png generado (${png16.length} bytes)`);
  console.log(`✅ favicon-32x32.png generado (${png32.length} bytes)`);
  console.log(`✅ apple-touch-icon.png generado (${png180.length} bytes)`);
  console.log(`✅ favicon.ico generado (${icoBuffer.length} bytes, multi-resolución 16x16 + 32x32)`);

  // Copiar a public/ si existe
  if (!fs.existsSync('public')) {
    fs.mkdirSync('public', { recursive: true });
  }
  for (const f of ['favicon.svg', 'favicon-16x16.png', 'favicon-32x32.png', 'apple-touch-icon.png', 'favicon.ico']) {
    fs.copyFileSync(f, path.resolve('public', f));
  }
  console.log('📂 Todos los favicons sincronizados en public/.');
}

generate().catch(err => {
  console.error('Error generando favicons:', err);
  process.exit(1);
});
