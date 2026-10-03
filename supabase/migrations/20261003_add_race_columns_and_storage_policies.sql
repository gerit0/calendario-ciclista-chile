-- Migración: Columnas para fechas, estado, distancia, desnivel, políticas de storage y restricción de Base64
-- Fecha: 2026-10-03

-- 1. Agregar columnas faltantes en la tabla public.carreras
ALTER TABLE public.carreras ADD COLUMN IF NOT EXISTS distancia TEXT;
ALTER TABLE public.carreras ADD COLUMN IF NOT EXISTS desnivel TEXT;
ALTER TABLE public.carreras ADD COLUMN IF NOT EXISTS fecha_inicio DATE;
ALTER TABLE public.carreras ADD COLUMN IF NOT EXISTS fecha_fin DATE;
ALTER TABLE public.carreras ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Inscripciones Abiertas';

-- 2. Retro-compatibilidad de fechas: inicializar fecha_inicio y fecha_fin a partir de fecha existente si son nulos
UPDATE public.carreras
SET fecha_inicio = fecha
WHERE fecha_inicio IS NULL AND fecha IS NOT NULL;

UPDATE public.carreras
SET fecha_fin = fecha
WHERE fecha_fin IS NULL AND fecha IS NOT NULL;

-- 3. Restricción para impedir data URIs base64 en hero_image
-- NOT VALID permite aplicar la restricción inmediatamente a nuevos registros y ediciones
-- sin fallar por las 3 carreras antiguas en base64 hasta que se ejecute la migración de datos.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'check_no_base64_hero_image'
  ) THEN
    ALTER TABLE public.carreras
    ADD CONSTRAINT check_no_base64_hero_image
    CHECK (hero_image IS NULL OR hero_image NOT LIKE 'data:%')
    NOT VALID;
  END IF;
END $$;

-- 4. Configurar bucket 'race-images' en Supabase Storage
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'race-images',
  'race-images',
  true,
  5242880, -- 5 MB en bytes
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

-- 5. Políticas RLS para storage.objects en el bucket 'race-images'

-- Lectura pública para cualquier usuario/visitante
DROP POLICY IF EXISTS "Lectura publica de imagenes de carreras" ON storage.objects;
CREATE POLICY "Lectura publica de imagenes de carreras"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'race-images');

-- Subida permitida a usuarios autenticados
DROP POLICY IF EXISTS "Insercion de imagenes para usuarios autenticados" ON storage.objects;
CREATE POLICY "Insercion de imagenes para usuarios autenticados"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'race-images');

-- Subida permitida al rol anon (para registro inicial antes de crear cuenta de organizador si aplica)
DROP POLICY IF EXISTS "Insercion de imagenes anon" ON storage.objects;
CREATE POLICY "Insercion de imagenes anon"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'race-images');
