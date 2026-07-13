-- =============================================================================
-- Migración 004: Tabla reviews + RLS
-- Proyecto: Tesoro del Valle — Concierge Digital
-- Reseñas mostradas en "Alojamientos destacados" de la landing (server-side)
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLA: reviews
-- Reseñas de huéspedes por alojamiento (curadas manualmente desde /admin)
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.reviews (
  id              uuid primary key default gen_random_uuid(),
  property_id     uuid not null references public.properties(id) on delete cascade,
  author_name     text not null,
  rating          int not null check (rating >= 1 and rating <= 5),
  text_es         text,
  text_en         text,
  review_date     date,
  is_published    boolean not null default true,
  sort_order      int not null default 0
);

-- ─────────────────────────────────────────────────────────────────────────────
-- RLS: mismo patrón que guide_sections / recommendations.
-- Cliente anónimo: cero acceso directo. La landing lee reviews publicadas
-- server-side con service_role (igual que /g/[code]).
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.reviews enable row level security;

create policy "reviews: solo autenticado puede leer"
  on public.reviews for select
  using (auth.role() = 'authenticated');

create policy "reviews: solo autenticado puede modificar"
  on public.reviews for all
  using (auth.role() = 'authenticated');
