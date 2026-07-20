-- Migración de Supabase: Tabla public.carreras, public.usuarios_admin, Índices y Políticas RLS

-- 1. Crear tabla public.carreras
CREATE TABLE IF NOT EXISTS public.carreras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL CHECK (char_length(nombre) >= 3 AND char_length(nombre) <= 100),
    fecha DATE NOT NULL,
    disciplina TEXT NOT NULL CHECK (disciplina IN ('Ruta', 'MTB', 'Gravel', 'Pista', 'BMX', 'Virtual')),
    region TEXT,
    ubicacion TEXT,
    organizador TEXT,
    link_inscripcion TEXT CHECK (link_inscripcion IS NULL OR link_inscripcion ~* '^https?://[^\s/$.?#].[^\s]*$'),
    categoria TEXT,
    precio NUMERIC(10, 2),
    hero_image TEXT,
    descripcion TEXT,
    creado_por UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'aprobada', 'rechazada')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Crear tabla public.usuarios_admin
CREATE TABLE IF NOT EXISTS public.usuarios_admin (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Crear índices
CREATE INDEX IF NOT EXISTS idx_carreras_fecha ON public.carreras(fecha);
CREATE INDEX IF NOT EXISTS idx_carreras_disciplina_region ON public.carreras(disciplina, region);

-- 4. Habilitar Row Level Security (RLS)
ALTER TABLE public.carreras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios_admin ENABLE ROW LEVEL SECURITY;

-- 5. Políticas RLS para public.carreras

-- 5.1. Lectura pública de carreras aprobadas (estado = 'aprobada')
DROP POLICY IF EXISTS "Lectura publica de carreras aprobadas" ON public.carreras;
CREATE POLICY "Lectura publica de carreras aprobadas"
ON public.carreras
FOR SELECT
TO public
USING (estado = 'aprobada');

-- 5.2. Proponer carreras en estado pendiente
DROP POLICY IF EXISTS "Proponer carreras en estado pendiente" ON public.carreras;
CREATE POLICY "Proponer carreras en estado pendiente"
ON public.carreras
FOR INSERT
TO public
WITH CHECK (estado = 'pendiente');

-- 5.3. Creadores ven y editan sus propias propuestas mientras estado <> 'aprobada'
DROP POLICY IF EXISTS "Creadores ven sus propias propuestas no aprobadas" ON public.carreras;
CREATE POLICY "Creadores ven sus propias propuestas no aprobadas"
ON public.carreras
FOR SELECT
TO authenticated
USING (auth.uid() = creado_por AND estado <> 'aprobada');

DROP POLICY IF EXISTS "Creadores editan sus propias propuestas no aprobadas" ON public.carreras;
CREATE POLICY "Creadores editan sus propias propuestas no aprobadas"
ON public.carreras
FOR UPDATE
TO authenticated
USING (auth.uid() = creado_por AND estado <> 'aprobada')
WITH CHECK (auth.uid() = creado_por AND estado <> 'aprobada');

-- 5.4. Admins (presentes en usuarios_admin) moderan todas las carreras
DROP POLICY IF EXISTS "Admins moderan todas las carreras" ON public.carreras;
CREATE POLICY "Admins moderan todas las carreras"
ON public.carreras
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.usuarios_admin
        WHERE user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.usuarios_admin
        WHERE user_id = auth.uid()
    )
);

-- Política RLS auxiliar para public.usuarios_admin
DROP POLICY IF EXISTS "Usuarios admin ven su propia membresia" ON public.usuarios_admin;
CREATE POLICY "Usuarios admin ven su propia membresia"
ON public.usuarios_admin
FOR SELECT
TO authenticated
USING (user_id = auth.uid());
