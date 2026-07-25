-- =============================================================================
-- Migración 006: reviews.review_url
-- Proyecto: Tesoro del Valle — Concierge Digital
-- Deep-link opcional a la reseña específica en Airbnb
-- (formato: https://www.airbnb.co.cr/rooms/{id}?scroll_to_review={review_id}).
-- Si es null, la tarjeta de reseña en la landing no es clickeable.
-- =============================================================================

alter table public.reviews
  add column if not exists review_url text;
