-- =============================================================================
-- Migración 008: separar "Volcán Arenal y Catarata La Fortuna" en dos filas
-- Proyecto: Tesoro del Valle — Concierge Digital
--
-- El usuario tiene fotos reales y distintas para cada atractivo, así que se
-- separan en dos recomendaciones destacadas independientes en vez de forzar
-- una sola tarjeta combinada.
--
-- Idempotencia (fix): como apply-migrations.mjs reaplica TODA la cadena de
-- migraciones cada vez (no hay tabla de control de qué ya corrió), la
-- migración 003 vuelve a insertar la fila vieja "Volcán Arenal y Catarata
-- La Fortuna" en cada corrida completa — su "on conflict do nothing" no
-- detecta nada porque ese nombre exacto ya no existe una vez renombrado.
-- Si luego este archivo intenta renombrar esa fila "resucitada" a
-- "Volcán Arenal", choca con la unique key porque esa fila ya existe de
-- la corrida anterior. Por eso primero se limpia cualquier remanente
-- obsoleto ANTES de intentar el rename.
-- =============================================================================

-- Si "Volcán Arenal" ya existe (esta migración ya corrió con éxito antes),
-- cualquier fila "Volcán Arenal y Catarata La Fortuna" que haya vuelto a
-- aparecer (por el re-seed de 003) es un remanente obsoleto: se borra en
-- vez de intentar renombrarla.
delete from public.recommendations
where property_id = '00000000-0000-0000-0000-000000000001'
  and name = 'Volcán Arenal y Catarata La Fortuna'
  and exists (
    select 1 from public.recommendations r2
    where r2.property_id = '00000000-0000-0000-0000-000000000001'
      and r2.name = 'Volcán Arenal'
  );

-- Primera vez: "Volcán Arenal" todavía no existe, así que el DELETE de
-- arriba no tocó nada — aquí sí se renombra la fila combinada original.
update public.recommendations
set name = 'Volcán Arenal'
where property_id = '00000000-0000-0000-0000-000000000001'
  and name = 'Volcán Arenal y Catarata La Fortuna';

insert into public.recommendations
  (property_id, category, is_featured, name, description_es, description_en, distance_label, duration_label, sort_order, is_published)
values (
  '00000000-0000-0000-0000-000000000001', 'actividad', true, 'Catarata La Fortuna',
  'La catarata de 70 m, uno de los atractivos más fotografiados de La Fortuna.',
  'The 70 m waterfall, one of La Fortuna''s most photographed attractions.',
  '~45 min en carro', 'Medio día', 9, true
)
on conflict (property_id, name) do nothing;
