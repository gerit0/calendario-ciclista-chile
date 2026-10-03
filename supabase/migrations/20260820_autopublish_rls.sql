-- Migración: Auto-publicación y permisos de organizador
-- Fecha: 2026-08-20

-- ─────────────────────────────────────────────────────
-- ELIMINAR políticas antiguas que ya no aplican
-- ─────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Proponer carreras en estado pendiente" ON public.carreras;
DROP POLICY IF EXISTS "Creadores ven sus propias propuestas no aprobadas" ON public.carreras;
DROP POLICY IF EXISTS "Creadores editan sus propias propuestas no aprobadas" ON public.carreras;

-- ─────────────────────────────────────────────────────
-- NUEVAS POLÍTICAS
-- ─────────────────────────────────────────────────────

-- Organizadores publican directamente como aprobada
CREATE POLICY "Organizadores publican directamente"
ON public.carreras FOR INSERT TO authenticated
WITH CHECK (
  estado = 'aprobada'
  AND creado_por = auth.uid()
);

-- Organizadores ven sus propias carreras
CREATE POLICY "Organizadores ven sus propias carreras"
ON public.carreras FOR SELECT TO authenticated
USING (auth.uid() = creado_por);

-- Organizadores editan sus propias carreras (excluye admins que tienen FOR ALL)
CREATE POLICY "Organizadores editan sus propias carreras"
ON public.carreras FOR UPDATE TO authenticated
USING (
  auth.uid() = creado_por
  AND NOT EXISTS (SELECT 1 FROM public.usuarios_admin WHERE user_id = auth.uid())
)
WITH CHECK (auth.uid() = creado_por);

-- Organizadores eliminan sus propias carreras
CREATE POLICY "Organizadores eliminan sus propias carreras"
ON public.carreras FOR DELETE TO authenticated
USING (
  auth.uid() = creado_por
  AND NOT EXISTS (SELECT 1 FROM public.usuarios_admin WHERE user_id = auth.uid())
);
