-- =============================================================================
-- Migración 001: Crear tablas multi-alojamiento
-- Proyecto: Tesoro del Valle — Concierge Digital
-- =============================================================================

-- Extensión para UUIDs
create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLA: properties
-- Cada alojamiento de Tesoro del Valle
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.properties (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,                    -- ej. "la-rana"
  name            text not null,                           -- "Alojamiento La Rana"
  tagline_es      text,
  tagline_en      text,
  access_code     text unique,                             -- código del link /g/[code]
  is_active       boolean not null default true,
  checkin_time    text,                                    -- "3:00 PM"
  checkout_time   text,                                    -- "11:00 AM"
  hero_photo_url  text,
  airbnb_url      text,
  waze_url        text,
  gmaps_url       text,
  address_es      text,
  address_en      text,
  host_phone      text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLA: property_secrets
-- Claves sensibles separadas a propósito (WiFi, puerta)
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.property_secrets (
  property_id     uuid primary key references public.properties(id) on delete cascade,
  wifi_name       text,
  wifi_password   text,
  door_code       text,
  updated_at      timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLA: guide_sections
-- Tarjetas del Concierge Digital (bilingüe)
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.guide_sections (
  id              uuid primary key default gen_random_uuid(),
  property_id     uuid not null references public.properties(id) on delete cascade,
  slug            text not null,                           -- "jacuzzi", "cocina", etc.
  title_es        text not null,
  title_en        text not null,
  content_es      text,                                    -- markdown
  content_en      text,                                    -- markdown
  icon            text,                                    -- nombre icono lucide-react
  icon_color      text,                                    -- color del fondo del icono
  sort_order      int not null default 0,
  is_published    boolean not null default true,
  unique(property_id, slug)
);

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLA: recommendations
-- Restaurantes, tours, actividades y servicios (bilingüe)
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.recommendations (
  id              uuid primary key default gen_random_uuid(),
  property_id     uuid not null references public.properties(id) on delete cascade,
  category        text not null,                           -- restaurante|soda|tour|actividad|servicio
  is_featured     boolean not null default false,          -- true → aparece en "Experiencias Destacadas"
  name            text not null,
  description_es  text,
  description_en  text,
  distance_label  text,                                    -- "5 min en carro"
  duration_label  text,                                    -- "4+ horas"
  price_label     text,                                    -- "Desde $15" (nullable)
  maps_url        text,
  photo_url       text,
  sort_order      int not null default 0,
  is_published    boolean not null default true
);

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLA: feedback
-- Valoraciones de huéspedes por alojamiento
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.feedback (
  id              uuid primary key default gen_random_uuid(),
  property_id     uuid not null references public.properties(id) on delete cascade,
  rating          int check (rating >= 1 and rating <= 5),
  liked_most      text,
  to_improve      text,
  guide_clarity   text check (guide_clarity in ('si', 'mas_o_menos', 'no')),
  would_return    text check (would_return in ('si', 'tal_vez', 'no')),
  guest_name      text,                                    -- nullable
  created_at      timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Trigger: updated_at automático para properties y property_secrets
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger trg_properties_updated_at
  before update on public.properties
  for each row execute function public.set_updated_at();

create or replace trigger trg_property_secrets_updated_at
  before update on public.property_secrets
  for each row execute function public.set_updated_at();
