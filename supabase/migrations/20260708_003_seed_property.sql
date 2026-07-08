-- =============================================================================
-- Migración 003: Semilla — datos NO sensibles de La Rana
-- Proyecto: Tesoro del Valle
-- ⚠️  Los secrets (WiFi, puerta, access_code) NO están aquí.
--     Se insertan via scripts/seed-secrets.mjs leyendo .env.local
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- Propiedad: Alojamiento La Rana
-- ─────────────────────────────────────────────────────────────────────────────
insert into public.properties (
  id,
  slug,
  name,
  tagline_es,
  tagline_en,
  access_code,    -- placeholder; se sobreescribe con seed-secrets.mjs
  is_active,
  checkin_time,
  checkout_time,
  airbnb_url,
  waze_url,
  gmaps_url,
  address_es,
  address_en,
  host_phone
) values (
  '00000000-0000-0000-0000-000000000001',
  'la-rana',
  'Alojamiento La Rana',
  'El verdadero lujo es despertar con el canto de las aves.',
  'True luxury is waking up to birdsong.',
  'PLACEHOLDER-CODE',
  true,
  '3:00 PM',
  '11:00 AM',
  'https://www.airbnb.co.cr/rooms/1717679310722862638',
  'https://waze.com/ul/hd1gfgc1s2',
  'https://maps.app.goo.gl/uynMzMVmjwVPmREQA',
  'Valle Azul, San Carlos, Costa Rica',
  'Valle Azul, San Carlos, Costa Rica',
  '+506 8887-5683'
) on conflict (slug) do update set
  name          = excluded.name,
  tagline_es    = excluded.tagline_es,
  tagline_en    = excluded.tagline_en,
  checkin_time  = excluded.checkin_time,
  checkout_time = excluded.checkout_time,
  airbnb_url    = excluded.airbnb_url,
  waze_url      = excluded.waze_url,
  gmaps_url     = excluded.gmaps_url,
  address_es    = excluded.address_es,
  address_en    = excluded.address_en,
  host_phone    = excluded.host_phone,
  updated_at    = now();

-- ─────────────────────────────────────────────────────────────────────────────
-- Secciones de la guía (guide_sections)
-- ─────────────────────────────────────────────────────────────────────────────
insert into public.guide_sections (property_id, slug, title_es, title_en, content_es, content_en, icon, icon_color, sort_order, is_published)
values

-- 1. Entrada / Check-in
(
  '00000000-0000-0000-0000-000000000001',
  'entrada',
  'Entrada',
  'Check-in',
  E'**Check-in: 3:00 PM en adelante**\n\nTu alojamiento estará listo a partir de las 3:00 PM.\n\nToca el botón de abajo para ver tu código de acceso.',
  E'**Check-in: 3:00 PM onwards**\n\nYour accommodation will be ready from 3:00 PM.\n\nTap the button below to reveal your access code.',
  'Key',
  '#DBEAFE',
  1,
  true
),

-- 2. WiFi
(
  '00000000-0000-0000-0000-000000000001',
  'wifi',
  'WiFi',
  'WiFi',
  E'Toca los campos para copiar el nombre de red y la contraseña.',
  E'Tap the fields to copy the network name and password.',
  'Wifi',
  '#D1FAE5',
  2,
  true
),

-- 3. Jacuzzi
(
  '00000000-0000-0000-0000-000000000001',
  'jacuzzi',
  'Jacuzzi',
  'Jacuzzi',
  E'Tu jacuzzi privado al aire libre está listo para disfrutar. Sigue la guía paso a paso antes de usarlo por primera vez.\n\n[Ver guía paso a paso del jacuzzi 🔗](https://tesorodelvalle-larana-guia-jacuzzi.netlify.app/)\n\n---\n\n<!-- ESPACIO RESERVADO: puedes pegar aquí los pasos nativos desde /admin cuando lo decidas -->',
  E'Your private outdoor jacuzzi is ready to enjoy. Please follow the step-by-step guide before using it for the first time.\n\n[View the jacuzzi step-by-step guide 🔗](https://tesorodelvalle-larana-guia-jacuzzi.netlify.app/)\n\n---\n\n<!-- RESERVED SPACE: you can paste the native steps here from /admin when you decide to -->',
  'Waves',
  '#FDE68A',
  3,
  true
),

-- 4. Cocina
(
  '00000000-0000-0000-0000-000000000001',
  'cocina',
  'Cocina',
  'Kitchen',
  E'## Cocina de inducción digital — pantalla táctil\n\n### Cómo encender\n1. **Desbloquear**: presiona el botón de 🔒 candado — aparecerá "Lo" en pantalla.\n2. Mantén presionado el mismo botón ~5 segundos hasta que desaparezca "Lo".\n3. Presiona el botón de **encendido/apagado**.\n4. Cuando aparezcan líneas en los controles, la cocina está lista.\n5. Toca el **disco** que deseas usar.\n6. Ajusta la potencia con **+** / **−** (niveles 1 al 9).\n7. Presiona nuevamente el disco seleccionado para confirmar.\n\n### Cómo apagar\nPresiona una vez el botón de encendido/apagado.\n\n> ⚠️ **Importante**: la superficie queda caliente unos minutos después de apagar. Aparecerá "H" junto al disco usado — espera a que enfríe antes de limpiar.',
  E'## Digital induction cooktop — touch screen\n\n### How to turn on\n1. **Unlock**: press the 🔒 lock button — "Lo" will appear on screen.\n2. Hold the same button for ~5 seconds until "Lo" disappears.\n3. Press the **power button**.\n4. When lines appear on the controls, the cooktop is ready.\n5. Touch the **burner** you want to use.\n6. Adjust power with **+** / **−** (levels 1 to 9).\n7. Press the selected burner again to confirm.\n\n### How to turn off\nPress the power button once.\n\n> ⚠️ **Important**: the surface stays hot for a few minutes after turning off. "H" will appear next to the burner used — wait for it to cool before cleaning.',
  'ChefHat',
  '#FCE7F3',
  4,
  true
),

-- 5. Reglamento
(
  '00000000-0000-0000-0000-000000000001',
  'reglamento',
  'Reglamento',
  'House Rules',
  E'Las reglas de la propiedad ayudan a que todos disfruten la estadía.\n\n*El contenido detallado estará disponible pronto.*',
  E'Property rules help everyone enjoy their stay.\n\n*Detailed content coming soon.*',
  'BookOpen',
  '#EDE9FE',
  5,
  true
),

-- 6. FAQ
(
  '00000000-0000-0000-0000-000000000001',
  'faq',
  'Preguntas frecuentes',
  'FAQs',
  E'Respuestas a las preguntas más comunes de nuestros huéspedes.\n\n*Contenido disponible pronto.*',
  E'Answers to the most common questions from our guests.\n\n*Content coming soon.*',
  'CircleHelp',
  '#DBEAFE',
  6,
  true
),

-- 7. Salida / Check-out
(
  '00000000-0000-0000-0000-000000000001',
  'salida',
  'Salida',
  'Check-out',
  E'**Check-out: 11:00 AM**\n\n### Antes de partir\n- Deja las llaves en el lugar indicado al momento del check-in.\n- Cierra bien ventanas y puertas.\n- Apaga luces, aire acondicionado y cocina.\n\n¡Gracias por quedarte con nosotros! 🐸',
  E'**Check-out: 11:00 AM**\n\n### Before you leave\n- Leave the keys in the designated spot from check-in.\n- Make sure windows and doors are properly closed.\n- Turn off lights, air conditioning, and the cooktop.\n\nThank you for staying with us! 🐸',
  'LogOut',
  '#FEE2E2',
  7,
  true
),

-- 8. Contacto
(
  '00000000-0000-0000-0000-000000000001',
  'contacto',
  'Contacto',
  'Contact',
  E'¿Necesitas ayuda? Tu anfitrión está disponible.\n\n📞 **+506 8887-5683**\n\n[💬 Escribir por WhatsApp](https://wa.me/50688875683)\n[📞 Llamar](tel:+50688875683)',
  E'Need help? Your host is available.\n\n📞 **+506 8887-5683**\n\n[💬 Message on WhatsApp](https://wa.me/50688875683)\n[📞 Call](tel:+50688875683)',
  'Phone',
  '#D1FAE5',
  8,
  true
)

on conflict (property_id, slug) do update set
  title_es     = excluded.title_es,
  title_en     = excluded.title_en,
  content_es   = excluded.content_es,
  content_en   = excluded.content_en,
  icon         = excluded.icon,
  icon_color   = excluded.icon_color,
  sort_order   = excluded.sort_order,
  is_published = excluded.is_published;

-- ─────────────────────────────────────────────────────────────────────────────
-- Recomendaciones
-- ─────────────────────────────────────────────────────────────────────────────
insert into public.recommendations (
  property_id, category, is_featured, name,
  description_es, description_en,
  distance_label, duration_label, price_label,
  maps_url, sort_order, is_published
) values

-- 1. Termales del Valle ⭐ DESTACADA
(
  '00000000-0000-0000-0000-000000000001',
  'actividad',
  true,
  'Termales del Valle',
  'Las famosas aguas termominerales de Valle Azul, a pocos minutos del alojamiento. Reservar al 4001-5126 o 6042-1500.',
  'The famous thermomineral hot springs of Valle Azul, just a few minutes from the property. Book at 4001-5126 or 6042-1500.',
  '5 min en carro',
  '2–4 horas',
  null,
  null,
  1,
  true
),

-- 2. Volcán Arenal y Catarata La Fortuna ⭐ DESTACADA
(
  '00000000-0000-0000-0000-000000000001',
  'tour',
  true,
  'Volcán Arenal y Catarata La Fortuna',
  'El icónico volcán, la catarata de 70 m y los principales atractivos de La Fortuna. Un día completo que vale cada minuto.',
  'The iconic volcano, the 70 m waterfall, and La Fortuna''s top attractions. A full-day experience worth every minute.',
  '~45 min en carro',
  'Día completo',
  null,
  null,
  2,
  true
),

-- 3. Puentes Colgantes (Místico Park)
(
  '00000000-0000-0000-0000-000000000001',
  'actividad',
  false,
  'Puentes Colgantes (Místico Park)',
  'Caminata entre las copas de los árboles del bosque tropical en la zona de La Fortuna. Ideal para avistar aves y monos.',
  'Walk among the treetops of the tropical rainforest near La Fortuna. Perfect for birdwatching and spotting monkeys.',
  '~50 min en carro',
  '2–3 horas',
  null,
  null,
  3,
  true
),

-- 4. Lago Arenal
(
  '00000000-0000-0000-0000-000000000001',
  'actividad',
  false,
  'Lago Arenal',
  'Kayak, paddle y paseos en bote con vista directa al Volcán Arenal. Uno de los lagos más bellos de Costa Rica.',
  'Kayaking, paddleboarding, and boat tours with direct views of Arenal Volcano. One of Costa Rica''s most beautiful lakes.',
  '~1 hora en carro',
  'Medio día',
  null,
  null,
  4,
  true
),

-- 5. Carbon Culture CR
(
  '00000000-0000-0000-0000-000000000001',
  'restaurante',
  false,
  'Carbon Culture CR',
  'Parrilla y cortes de res en la zona. Ambiente relajado con sabores auténticos.',
  'Grilled meats and cuts in the area. Relaxed atmosphere with authentic flavors.',
  null,
  null,
  null,
  'https://www.instagram.com/carbonculturecr/',
  5,
  true
),

-- 6. Pizza JJ
(
  '00000000-0000-0000-0000-000000000001',
  'restaurante',
  false,
  'Pizza JJ',
  'Pizzería local muy querida en la zona.',
  'A beloved local pizzeria in the area.',
  null,
  null,
  null,
  'https://www.instagram.com/pizzajj2026/',
  6,
  true
),

-- 7. Pollos La Diabla
(
  '00000000-0000-0000-0000-000000000001',
  'restaurante',
  false,
  'Pollos La Diabla',
  'Pollo al estilo local, jugoso y sabroso. Un clásico de la zona.',
  'Juicy, flavorful local-style chicken. A regional classic.',
  null,
  null,
  null,
  'https://www.instagram.com/pollosladiabla',
  7,
  true
),

-- 8. Gasolinera H2M
(
  '00000000-0000-0000-0000-000000000001',
  'servicio',
  false,
  'Gasolinera H2M',
  'Gasolinera más cercana al alojamiento.',
  'The closest gas station to the property.',
  '5 min en carro',
  null,
  null,
  'https://www.google.com/maps/place/Gasolinera+H2M/@10.3474349,-84.522649,17z',
  8,
  true
)

on conflict do nothing;
