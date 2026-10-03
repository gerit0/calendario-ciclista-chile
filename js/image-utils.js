/**
 * Módulo de Utilidades para Imágenes (js/image-utils.js)
 * Maneja la compresión en cliente mediante HTML5 Canvas y la subida de archivos multipart.
 */

import { getAuthToken, uploadRaceImageSupabase } from './supabase.js';

const MAX_WIDTH = 1600;
const MAX_HEIGHT = 1600;
const MAX_INPUT_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

/**
 * Comprime y redimensiona una imagen en el navegador antes de subirla.
 * @param {File} file
 * @returns {Promise<Blob>}
 */
export async function compressImage(file) {
  if (!file || !file.type.startsWith('image/')) {
    throw new Error('El archivo seleccionado no es una imagen válida.');
  }

  if (file.size > MAX_INPUT_FILE_SIZE) {
    throw new Error('La imagen original no puede superar los 5 MB.');
  }

  // Si ya es muy liviana (< 150 KB) y en formato webp/jpeg/png, no requiere compresión agresiva
  if (file.size <= 150 * 1024 && ['image/webp', 'image/jpeg', 'image/png'].includes(file.type)) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;
      if (width > MAX_WIDTH || height > MAX_HEIGHT) {
        if (width > height) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        } else {
          width = Math.round((width * MAX_HEIGHT) / height);
          height = MAX_HEIGHT;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return resolve(file); // Fallback al archivo original
      }

      ctx.drawImage(img, 0, 0, width, height);

      // Preferir formato WebP para máxima compresión y calidad
      const targetType = 'image/webp';
      canvas.toBlob((blob) => {
        if (!blob) {
          return resolve(file);
        }
        resolve(blob);
      }, targetType, 0.82);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('No se pudo decodificar el archivo de imagen.'));
    };

    img.src = objectUrl;
  });
}

/**
 * Sube un archivo de imagen comprimido al servidor o a Supabase Storage.
 * Garantiza que nunca se devuelva una data URI base64.
 * @param {File|Blob} file
 * @param {string} [originalName]
 * @returns {Promise<{ success: boolean, url?: string, error?: string }>}
 */
export async function uploadImage(file, originalName = 'carrera.webp') {
  try {
    const compressedBlob = await compressImage(file);
    const token = await getAuthToken();

    const formData = new FormData();
    const finalName = file.name || originalName;
    formData.append('image', compressedBlob, finalName);

    // 1. Intentar endpoint /api/upload-image
    try {
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/upload-image', {
        method: 'POST',
        headers,
        body: formData
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.url) {
          return { success: true, url: json.url };
        }
      }
    } catch (apiErr) {
      console.warn('API /api/upload-image no disponible, usando fallback directo a Supabase:', apiErr);
    }

    // 2. Fallback a cliente Supabase Storage directo
    const uploadRes = await uploadRaceImageSupabase(compressedBlob);
    if (uploadRes && uploadRes.success && uploadRes.url) {
      return { success: true, url: uploadRes.url };
    }

    return {
      success: false,
      error: uploadRes?.error || 'No se pudo subir la imagen al almacenamiento.'
    };
  } catch (err) {
    return {
      success: false,
      error: err.message || 'Error procesando la imagen.'
    };
  }
}
