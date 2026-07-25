-- =============================================================================
-- Migración 009: soporte para el panel /admin (Fase 7)
-- Proyecto: Tesoro del Valle — Concierge Digital
--
-- 1) properties.host_email — para que el correo de feedback (cuando se
--    active Resend) lea el destinatario desde la BD en vez de una env var
--    fija, editable desde /admin sin redeploy.
-- 2) property_secrets no tenía NINGUNA policy (a propósito, Fase 2: cero
--    acceso salvo service_role). El admin ahora necesita editar door_code/
--    wifi vía sesión autenticada (no via service_role, que se reserva para
--    el Concierge anónimo) — se agregan las mismas policies "authenticated"
--    que ya tienen properties/guide_sections/recommendations/reviews.
-- =============================================================================

alter table public.properties
  add column if not exists host_email text;

alter table public.property_secrets enable row level security;

drop policy if exists "property_secrets: solo autenticado puede leer" on public.property_secrets;
create policy "property_secrets: solo autenticado puede leer"
  on public.property_secrets for select
  using (auth.role() = 'authenticated');

drop policy if exists "property_secrets: solo autenticado puede modificar" on public.property_secrets;
create policy "property_secrets: solo autenticado puede modificar"
  on public.property_secrets for all
  using (auth.role() = 'authenticated');
