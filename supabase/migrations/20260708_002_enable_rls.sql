-- =============================================================================
-- Migración 002: Row Level Security (RLS) completo
-- Proyecto: Tesoro del Valle — Concierge Digital
-- SEGURIDAD CRÍTICA: cliente anónimo = cero acceso directo
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- Activar RLS en todas las tablas
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.properties       enable row level security;
alter table public.property_secrets enable row level security;
alter table public.guide_sections   enable row level security;
alter table public.recommendations  enable row level security;
alter table public.feedback         enable row level security;

-- ─────────────────────────────────────────────────────────────────────────────
-- properties: anónimo NO puede leer nada
-- El Concierge se sirve server-side con service_role (bypass RLS).
-- El anfitrión autenticado puede leer y escribir sus propiedades.
-- ─────────────────────────────────────────────────────────────────────────────
create policy "properties: solo autenticado puede leer"
  on public.properties for select
  using (auth.role() = 'authenticated');

create policy "properties: solo autenticado puede modificar"
  on public.properties for all
  using (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────────────────────
-- property_secrets: cero acceso cliente (solo service_role server-side)
-- No se crean policies para anónimo ni autenticado normal.
-- service_role ignora RLS → accede desde server actions y scripts.
-- ─────────────────────────────────────────────────────────────────────────────
-- (Sin policies = tabla denegada para todos excepto service_role)

-- ─────────────────────────────────────────────────────────────────────────────
-- guide_sections: anónimo NO puede leer; autenticado (admin) sí
-- ─────────────────────────────────────────────────────────────────────────────
create policy "guide_sections: solo autenticado puede leer"
  on public.guide_sections for select
  using (auth.role() = 'authenticated');

create policy "guide_sections: solo autenticado puede modificar"
  on public.guide_sections for all
  using (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────────────────────
-- recommendations: anónimo NO puede leer; autenticado (admin) sí
-- ─────────────────────────────────────────────────────────────────────────────
create policy "recommendations: solo autenticado puede leer"
  on public.recommendations for select
  using (auth.role() = 'authenticated');

create policy "recommendations: solo autenticado puede modificar"
  on public.recommendations for all
  using (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────────────────────
-- feedback: anónimo puede INSERT (vía endpoint server-side con zod)
-- Solo anfitrión autenticado puede SELECT (ver feedback en /admin)
-- ─────────────────────────────────────────────────────────────────────────────
create policy "feedback: anónimo puede insertar"
  on public.feedback for insert
  with check (true);

create policy "feedback: solo autenticado puede leer"
  on public.feedback for select
  using (auth.role() = 'authenticated');

create policy "feedback: solo autenticado puede eliminar"
  on public.feedback for delete
  using (auth.role() = 'authenticated');
