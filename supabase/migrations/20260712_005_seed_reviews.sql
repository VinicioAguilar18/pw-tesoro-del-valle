-- =============================================================================
-- Migración 005: Semilla — reseñas placeholder de La Rana
-- Proyecto: Tesoro del Valle
-- ⚠️  Marcadas como placeholder para reemplazar por reseñas reales desde /admin.
-- =============================================================================

insert into public.reviews (
  property_id, author_name, rating, text_es, text_en, review_date, is_published, sort_order
) values

(
  '00000000-0000-0000-0000-000000000001',
  '[PLACEHOLDER] Huésped de ejemplo 1',
  5,
  '[Reseña de ejemplo — reemplazar desde /admin] Un lugar mágico, despertar con el canto de las aves fue exactamente como lo describían. El jacuzzi privado fue el punto más alto de nuestra estadía.',
  '[Sample review — replace from /admin] A magical place, waking up to birdsong was exactly as described. The private jacuzzi was the highlight of our stay.',
  '2026-06-01',
  true,
  1
),
(
  '00000000-0000-0000-0000-000000000001',
  '[PLACEHOLDER] Huésped de ejemplo 2',
  5,
  '[Reseña de ejemplo — reemplazar desde /admin] Excelente comunicación con el anfitrión y el Concierge Digital hizo la estadía sin fricciones, todo estaba a un toque de distancia.',
  '[Sample review — replace from /admin] Great communication with the host and the Digital Concierge made the stay frictionless, everything was one tap away.',
  '2026-05-15',
  true,
  2
),
(
  '00000000-0000-0000-0000-000000000001',
  '[PLACEHOLDER] Huésped de ejemplo 3',
  4,
  '[Reseña de ejemplo — reemplazar desde /admin] Ubicación tranquila y cerca de las actividades de La Fortuna. Volveríamos sin duda.',
  '[Sample review — replace from /admin] Quiet location and close to La Fortuna''s activities. We would definitely come back.',
  '2026-04-20',
  true,
  3
)

on conflict do nothing;
