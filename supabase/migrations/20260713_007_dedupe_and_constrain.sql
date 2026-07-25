-- =============================================================================
-- Migración 007: dedupe + constraints únicos en recommendations y reviews
-- Proyecto: Tesoro del Valle — Concierge Digital
--
-- Bug detectado en Fase 4 (QA visual de "Actividades"/"Alojamientos destacados"):
-- ni recommendations ni reviews tenían un unique constraint, así que el
-- "on conflict do nothing" de sus semillas (003 y 005) nunca detectaba
-- conflicto real (el id es un uuid aleatorio nuevo en cada insert). Cada
-- vez que se corrió `npm run apply:migrations` completo, las 8 filas de
-- recommendations y las 3 de reviews se duplicaron de nuevo.
-- Verificado en remoto: 24 filas en recommendations (deberían ser 8),
-- 6 en reviews (deberían ser 3), todas duplicados exactos.
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- 1) Eliminar duplicados, dejando una sola fila por clave natural.
-- ─────────────────────────────────────────────────────────────────────────────
delete from public.recommendations a
using public.recommendations b
where a.property_id = b.property_id
  and a.name = b.name
  and a.ctid < b.ctid;

delete from public.reviews a
using public.reviews b
where a.property_id = b.property_id
  and a.author_name = b.author_name
  and a.ctid < b.ctid;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2) Índices únicos para que el "on conflict do nothing" (ya presente en
--    003 y 005, sin cambios) tenga contra qué comparar de ahora en adelante.
--    CREATE UNIQUE INDEX IF NOT EXISTS es idempotente: esta migración
--    también se puede reejecutar sin error.
-- ─────────────────────────────────────────────────────────────────────────────
create unique index if not exists recommendations_property_name_unique
  on public.recommendations (property_id, name);

create unique index if not exists reviews_property_author_unique
  on public.reviews (property_id, author_name);
