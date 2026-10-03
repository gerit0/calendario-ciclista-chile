import crypto from 'crypto';
import busboy from 'busboy';
import { getSupabaseClient, extractToken } from './lib/supabase-server.js';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

const EXTENSION_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/webp': 'webp'
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Se requiere POST.' });
  }

  const contentType = req.headers['content-type'] || '';
  if (!contentType.includes('multipart/form-data')) {
    return res.status(400).json({ error: 'El contenido debe ser multipart/form-data.' });
  }

  const token = extractToken(req);
  const supabase = getSupabaseClient(token);

  return new Promise((resolve) => {
    let bb;
    try {
      bb = busboy({ headers: req.headers, limits: { fileSize: MAX_FILE_SIZE, files: 1 } });
    } catch (err) {
      res.status(400).json({ error: 'Cabeceras de multipart inválidas.', details: err.message });
      return resolve();
    }

    let fileBuffer = [];
    let fileMime = '';
    let fileTruncated = false;
    let fileUploaded = false;

    bb.on('file', (name, fileStream, info) => {
      const { mimeType } = info;
      fileMime = (mimeType || '').toLowerCase();

      if (!ALLOWED_MIME_TYPES.includes(fileMime)) {
        fileStream.resume();
        return;
      }

      fileStream.on('data', (data) => {
        fileBuffer.push(data);
      });

      fileStream.on('limit', () => {
        fileTruncated = true;
      });

      fileStream.on('end', () => {
        fileUploaded = true;
      });
    });

    bb.on('error', (err) => {
      res.status(500).json({ error: 'Error procesando archivo.', details: err.message });
      resolve();
    });

    bb.on('finish', async () => {
      if (fileTruncated) {
        res.status(413).json({ error: 'El archivo excede el tamaño máximo permitido de 5 MB.' });
        return resolve();
      }

      if (!fileUploaded || fileBuffer.length === 0) {
        res.status(400).json({
          error: 'No se subió ningún archivo de imagen válido. Formatos permitidos: PNG, JPEG, WEBP.'
        });
        return resolve();
      }

      if (!ALLOWED_MIME_TYPES.includes(fileMime)) {
        res.status(415).json({
          error: `Tipo de archivo no permitido (${fileMime}). Solo se aceptan PNG, JPEG y WEBP.`
        });
        return resolve();
      }

      const totalBuffer = Buffer.concat(fileBuffer);
      if (totalBuffer.length > MAX_FILE_SIZE) {
        res.status(413).json({ error: 'El archivo excede el tamaño máximo de 5 MB.' });
        return resolve();
      }

      const ext = EXTENSION_MAP[fileMime] || 'jpg';
      const uuid = crypto.randomUUID();
      const fileName = `${Date.now()}-${uuid}.${ext}`;
      const filePath = `hero-images/${fileName}`;

      try {
        const { error: uploadError } = await supabase.storage
          .from('race-images')
          .upload(filePath, totalBuffer, {
            contentType: fileMime,
            cacheControl: '31536000',
            upsert: false
          });

        if (uploadError) {
          res.status(500).json({
            error: 'No se pudo almacenar la imagen en el storage.',
            details: uploadError.message
          });
          return resolve();
        }

        const { data: publicUrlData } = supabase.storage
          .from('race-images')
          .getPublicUrl(filePath);

        res.status(200).json({
          success: true,
          url: publicUrlData.publicUrl
        });
        resolve();
      } catch (uploadEx) {
        res.status(500).json({
          error: 'Excepción al subir imagen al bucket.',
          details: uploadEx.message
        });
        resolve();
      }
    });

    req.pipe(bb);
  });
}
