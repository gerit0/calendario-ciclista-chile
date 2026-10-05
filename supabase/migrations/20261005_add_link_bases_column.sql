-- Migración: Agregar columna link_bases para almacenar el enlace a las bases de la carrera
-- Fecha: 2026-10-05

ALTER TABLE public.carreras ADD COLUMN IF NOT EXISTS link_bases TEXT;
