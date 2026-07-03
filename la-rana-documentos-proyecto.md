# 🐸 TESORO DEL VALLE — Documentos del Proyecto
### Sitio: **Tesoro del Valle** · Primer alojamiento: **La Rana** · Los 6 Documentos Esenciales de Vibe Coding
### Fuente de verdad para Antigravity + Claude Code — v2

> **Instrucción para el agente de IA:** Estos 6 documentos son la fuente de verdad de todo el proyecto. Úsalos para cada decisión de producto, técnica, de diseño y de datos. Si algo no está definido aquí, pregunta antes de asumir.

---

## 📄 DOCUMENTO 01 — PRD (Requisitos de Producto)

| Campo | Definición |
|---|---|
| **Nombre** | **Tesoro del Valle** (marca del sitio) — subtítulo/primer alojamiento: **Alojamiento La Rana** |
| **Tagline** | "El verdadero lujo es despertar con el canto de las aves." (EN: "True luxury is waking up to birdsong.") |
| **Problema** | (1) Tesoro del Valle necesita una carta de presentación digital propia y premium para enamorar a futuros huéspedes, más allá del listing de Airbnb. (2) Los huéspedes con reserva necesitan toda la info práctica de su estadía (claves, instrucciones, horarios, recomendaciones) en un solo link, sin bombardear al anfitrión con mensajes. |
| **Visión** | Plataforma **multi-alojamiento**: hoy solo La Rana, pero la arquitectura debe permitir agregar más alojamientos de Tesoro del Valle sin reescribir nada. |
| **Usuario Objetivo** | **Visitante** — parejas y viajeros (ES/EN) que buscan descanso y naturaleza en Valle Azul de San Carlos, cerca de La Fortuna. **Huésped** — persona con reserva confirmada que recibe un link directo (`/g/CODIGO`) con su Concierge Digital. **Anfitrión** — administra alojamientos, claves y contenido desde /admin. |
| **Propuesta de valor** | Web premium con fotos animadas (parallax estilo Apple) que vende la experiencia — jacuzzi privado, tucanes, perezosos, ranas Blue Jeans, Volcán Arenal — y un **Concierge Digital** por alojamiento: un link, cero fricción, toda la estadía resuelta. |

### Funcionalidades Principales (Imprescindibles)
1. **Landing pública de Tesoro del Valle** con hero, galería parallax, presentación del Alojamiento La Rana ("El espacio"), "La zona y actividades" (Volcán Arenal, Catarata La Fortuna, aguas termales, puentes colgantes), ubicación con mapa + botones **Waze** y **Google Maps**, y CTA a reservar en Airbnb (`airbnb.com/h/luxuryrainforestretreat`). Preparada para listar más alojamientos a futuro.
2. **Concierge Digital del huésped** en `/g/[CODIGO]` — el código viaja **en el link** (el huésped no escribe nada). Estructura calcada de la referencia visual aprobada:
   - **Hero**: foto del alojamiento, badge "VALLE AZUL · COSTA RICA", nombre "LA RANA", "Bienvenido a tu estancia / Welcome to your stay".
   - **Tarjeta destacada de Entrada**: hora de check-in ("3:00 PM en adelante") + "Toca aquí para ver tu código de acceso" (revela clave de la puerta).
   - **Grid de tarjetas Concierge**: WiFi · Ubicación · Guía y reglamento de la propiedad · Preguntas frecuentes · Salida (check-out) · Restaurantes (incl. "chinos" cercanos) · Tours y experiencias · Cómo usar el jacuzzi · Cómo usar la cocina · Contacto del anfitrión.
   - **Experiencias destacadas**: tarjetas grandes con foto de actividades seleccionadas (ej. termales, Arenal).
   - **Formulario de feedback** al final.
3. **Formulario de feedback**: ⭐ 1–5, qué disfrutaste más, qué mejorar, ¿la guía fue clara? (Sí/Más o menos/No), ¿volverías o recomendarías? (Sí/Tal vez/No), nombre opcional → guardado en Supabase + correo al anfitrión vía Resend.
4. **Panel /admin con login** (Supabase Auth): gestionar alojamientos (nombre, fotos, código de acceso), claves (WiFi, puerta), horarios, secciones de la guía, restaurantes/actividades, experiencias destacadas, y ver feedback por alojamiento.
5. **Bilingüe ES/EN** con selector de idioma en toda la web.

### Opcionales (v2)
- Más alojamientos publicados en la landing con página propia cada uno.
- Códigos por reserva con caducidad automática al check-out.
- Subdominio `guia.tesorodelvalle.com` cuando exista dominio propio.
- Testimonios en la landing a partir del feedback.
- Notificación por WhatsApp además del correo.

### Fuera del Alcance (esta versión NO hace)
- Reservas ni pagos (todo vía Airbnb).
- Calendario de disponibilidad.
- Cuentas de usuario para huéspedes (solo link con código).
- Venta/comisión de tours (las experiencias son solo recomendaciones informativas).

### Historias de Usuario
- Como **visitante**, quiero recorrer fotos y descripción con una experiencia visual premium, para decidir reservar en Airbnb.
- Como **visitante extranjero**, quiero cambiar la web a inglés, para entender todo.
- Como **huésped**, quiero abrir el link que me enviaron y ver de inmediato mi Concierge Digital, sin escribir códigos ni crear cuentas.
- Como **huésped**, quiero tocar "Entrada" y ver la clave de la puerta, para entrar sin llamar a nadie.
- Como **huésped**, quiero instrucciones claras del jacuzzi y la cocina, para usarlos sin dañar nada.
- Como **huésped**, quiero abrir la ubicación en Waze con un toque, para llegar sin perderme.
- Como **huésped**, quiero ver restaurantes y actividades cercanas con "cómo llegar", para planear mi estadía.
- Como **anfitrión**, quiero cambiar el código del link y las claves desde /admin, para invalidar links viejos al instante.
- Como **anfitrión**, quiero poder crear un segundo alojamiento en el futuro, sin tocar código.
- Como **anfitrión**, quiero recibir un correo con cada feedback, para conocer expectativas y puntos de mejora.

### Métricas de Éxito
- ≥80% de los huéspedes abren su link de Concierge Digital.
- Reducción notable de preguntas repetitivas por chat (WiFi, cómo llegar, jacuzzi).
- ≥50% de huéspedes completan el feedback.
- Landing carga en <3 s en móvil.

---

## 🔧 DOCUMENTO 02 — TRD (Requisitos Técnicos)

| Campo | Decisión |
|---|---|
| **Herramientas de desarrollo** | Antigravity + Claude Code (agente), repositorio en **GitHub** |
| **Frontend** | **Next.js 14+ (App Router) con TypeScript** y **Tailwind CSS** |
| **Animaciones** | **Framer Motion** (parallax, tilt 3D sutil, scroll-driven — estilo Apple). Sin Three.js ni modelos 3D pesados. |
| **Backend** | Server Actions / API Routes de Next.js + Supabase |
| **Base de Datos** | **PostgreSQL vía Supabase** — esquema multi-alojamiento desde el día 1 |
| **Auth** | **Supabase Auth** solo para el anfitrión (/admin). Huéspedes: acceso por **código en la URL** (`/g/[codigo]`), validado server-side. |
| **Storage** | Supabase Storage, bucket `photos` (público solo lectura), organizado por alojamiento |
| **Emails** | **Resend** (gratis) — notificación de feedback al anfitrión |
| **i18n** | **next-intl** — rutas `/es` y `/en`, selector en header |
| **Hosting** | **Vercel** (dominio `*.vercel.app` por ahora). Futuro: dominio propio con `guia.tesorodelvalle.com` como alias del mismo route `/g/[codigo]`. |
| **Mapas** | Embed Google Maps + deep links Waze (`https://waze.com/ul/hd1gfgc1s2`) y Google Maps (`https://maps.app.goo.gl/uynMzMVmjwVPmREQA`) |
| **Librerías clave** | framer-motion, next-intl, zod, lucide-react, resend, @supabase/ssr |

### Estructura de carpetas
```
/src
  /app
    /[locale]
      /page.tsx              # Landing Tesoro del Valle
      /g/[code]/page.tsx     # Concierge Digital del huésped (server component)
      /admin/...             # Panel del anfitrión (Supabase Auth)
    /api                     # feedback, helpers
  /components
    /landing  /concierge  /admin  /ui
  /lib                       # supabase, resend, validate-code, helpers
  /messages                  # es.json, en.json
/supabase/migrations
```

### Variables de entorno
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY      # solo server-side
RESEND_API_KEY
HOST_NOTIFICATION_EMAIL
```

### Restricciones inamovibles
- **Mobile-first** (el Concierge se abre casi siempre desde el celular).
- **Todo en nivel gratuito**: Vercel Hobby, Supabase Free, Resend Free.
- **Código limpio y documentado**: TypeScript estricto, componentes pequeños, comentarios en lógica no trivial, README completo.
- **Seguridad**: la página `/g/[code]` se renderiza **en el servidor**; si el código no existe o está inactivo → 404 amable. Las claves (WiFi, puerta) jamás aparecen en el bundle del cliente ni en `NEXT_PUBLIC_*`. La ruta lleva `noindex` (robots) para que Google no la indexe.
- **Multi-alojamiento**: ninguna tabla ni componente asume "una sola casa". Todo cuelga de `property_id`.
- Commits frecuentes y descriptivos (`feat:`, `fix:`, `docs:`...).

---

## 🗺️ DOCUMENTO 03 — Flujo de la App

### Lista de páginas
| Ruta | Descripción |
|---|---|
| `/{locale}` | Landing pública de Tesoro del Valle (hoy protagoniza La Rana; preparada para grid de alojamientos) |
| `/{locale}/g/[code]` | **Concierge Digital** del alojamiento cuyo código coincida. Código inválido → 404 amable con contacto del anfitrión |
| `/{locale}/admin/login` | Login del anfitrión |
| `/{locale}/admin` | Dashboard: alojamientos, claves, guía, recomendaciones, experiencias, feedback |

### Navegación
- **Landing**: header transparente → sólido al scroll — logo Tesoro del Valle 🐸, anclas (Inicio · El alojamiento · La zona · Ubicación), selector ES/EN, CTA "Reservar".
- **Concierge** (calcado de la referencia aprobada): hero foto + nombre → tarjeta destacada **Entrada** → título "Concierge Digital — Todo lo que necesitas saber" → **grid de tarjetas 2 columnas** con icono de color + nombre + chevron (WiFi, Ubicación, Guía y reglamento, FAQ, Salida, Restaurantes, Jacuzzi, Cocina, Tours y experiencias, Contacto) → sección "Experiencias Destacadas" con tarjetas grandes de foto → feedback. Cada tarjeta abre un **modal/página de detalle**.
- **Admin**: sidebar (Alojamientos · Claves · Guía · Recomendaciones · Experiencias · Feedback · Salir).

### Punto de entrada
Visitante → `/es` o `/en` según navegador. Huésped → recibe por WhatsApp/Airbnb el link directo `tesorodelvalle.vercel.app/es/g/RANA2026` (ejemplo) — un toque y está dentro.

### Flujo de acceso del huésped
1. Anfitrión confirma reserva → copia el link del alojamiento desde /admin → lo envía al huésped.
2. Huésped toca el link → el servidor valida el código contra la tabla `properties` → renderiza el Concierge completo.
3. Código inexistente/desactivado → página 404 amable: "Este link ya no está activo. Escríbele a tu anfitrión 💬".
4. La tarjeta "Entrada" y "WiFi" muestran las claves con un toque (patrón *tap to reveal* + botón copiar).

### Flujo admin
`/admin` sin sesión → `/admin/login` → Supabase Auth → dashboard. Al cambiar el código de un alojamiento, el link viejo deja de funcionar al instante.

### Recorridos principales
1. **Visitante que evalúa**: Landing → galería parallax → "El espacio" → "La zona" → Ubicación → clic "Reservar en Airbnb" (pestaña nueva).
2. **Huésped en su estadía**: toca link `/g/RANA2026` → ve hero de bienvenida → toca "Entrada" → copia clave de puerta → luego "WiFi" → copia contraseña → en la noche abre "Jacuzzi" → sigue instrucciones → al día siguiente "Restaurantes" → toca "Cómo llegar" → se abre Waze → último día: "Salida" (hora + checklist) → completa feedback → gracias → correo llega al anfitrión.
3. **Anfitrión**: login → cambia clave WiFi y código del link tras una temporada → guarda → verifica que el link viejo da 404 y el nuevo funciona.

### Estados
- **Vacíos**: sin recomendaciones → "Pronto agregaremos recomendaciones"; sin feedback en admin → "Aún no hay respuestas".
- **Error**: código inválido → 404 amable; fallo al enviar feedback → reintentar sin perder lo escrito; error al guardar en admin → toast.
- **Carga**: blur-up placeholders en imágenes, skeletons en grids, spinner en botones de envío.

### Redirecciones
- `/g/[code]` inválido → 404 amable (no redirige a la landing automáticamente, pero ofrece link a ella).
- `/admin` sin sesión → `/admin/login`; tras login → `/admin`; logout → landing.
- Tras feedback → pantalla de agradecimiento con botón "Volver a mi Concierge".

---

## 🎨 DOCUMENTO 04 — Brief de Diseño UI/UX

| Campo | Definición |
|---|---|
| **Estética** | **Claro, natural y premium** — "eco-lodge boutique". Fotografía protagonista, aire, verdes de bosque. La guía del huésped sigue el patrón visual de la referencia aprobada (Concierge Digital con grid de tarjetas). Referencias: Airbnb Luxe, hoteles boutique, Apple (animaciones). |
| **Color primario** | Verde bosque `#1B4332` |
| **Color secundario** | Verde hoja `#52B788` |
| **Fondo** | Crema natural `#FAF7F0` / blanco `#FFFFFF`; el Concierge usa fondo gris muy claro `#F6F7F5` para que las tarjetas blancas floten |
| **Texto** | Casi negro cálido `#1C1C1A`; secundario `#5A5A54` |
| **Acento / CTA** | Rojo rana Blue Jeans `#E63946` (con moderación: CTAs y detalles 🐸) |
| **Iconos del grid Concierge** | Como la referencia: cada tarjeta con icono lucide dentro de un círculo/cuadrado de color pastel distinto (azul WiFi, rojo ubicación, morado FAQ, verde contacto, etc.) |
| **Tipografía** | Títulos: **Fraunces** (serif elegante y natural). Cuerpo/UI: **Inter**. |
| **Bordes** | 16px en tarjetas, 12px en botones, 20px en tarjetas de experiencias — suave y orgánico |
| **Sombras** | Sutiles y difusas; tarjetas del Concierge con borde 1px gris claro + shadow-sm (como la referencia) |
| **Modo** | Solo claro |
| **Móvil** | Mobile-first total. Grid Concierge de 2 columnas en móvil; botones ≥44px; *tap to reveal + copiar* para claves |

### Animaciones (el diferenciador de la landing)
- **Hero**: foto full-screen con zoom-out lento + texto fade-up.
- **Galería parallax**: capas a distintas velocidades, tilt 3D sutil (`perspective` + `rotateX/Y` con Framer Motion).
- **Secciones**: fade + slide-up al entrar al viewport (una vez).
- **Concierge**: animaciones más discretas (el huésped busca información, no espectáculo): stagger suave de las tarjetas al cargar, transición fluida al abrir detalle.
- **Regla de oro**: premium, nunca marear. `prefers-reduced-motion` respetado. 60fps (solo `transform`/`opacity`).

### Patrones de UI clave
- **Tarjeta Entrada** (destacada, como referencia): badge verde con horario, icono de llave, "Toca aquí para ver tu código de acceso".
- **Grid Concierge**: tarjetas blancas, icono de color, título, chevron.
- **Experiencias destacadas**: tarjeta grande con foto, badge de duración, título sobre la imagen.
- Tarjetas de restaurantes: nombre, tipo (soda/chino/restaurante), distancia, botón "Cómo llegar".
- Feedback: una columna, estrellas grandes táctiles.

### Accesibilidad
Contraste AA, base 16px+, foco visible, alt bilingüe en fotos, labels reales.

---

## 🗄️ DOCUMENTO 05 — Esquema de Backend (multi-alojamiento)

### Tablas

**`properties`** — cada alojamiento de Tesoro del Valle
| columna | tipo | notas |
|---|---|---|
| id | uuid PK | |
| slug | text unique | `la-rana` |
| name | text | "Alojamiento La Rana" |
| tagline_es / tagline_en | text | |
| access_code | text unique | código del link `/g/[code]` — ej. `RANA2026` |
| is_active | boolean | desactivar = el link deja de funcionar |
| checkin_time / checkout_time | text | "3:00 PM" / "11:00 AM" |
| hero_photo_url | text | |
| airbnb_url | text | |
| waze_url / gmaps_url | text | |
| address_es / address_en | text | "300 m norte de Erian y su Arte..." |
| host_phone | text | para tarjeta Contacto |
| created_at / updated_at | timestamptz | |

**`property_secrets`** — claves sensibles, separadas a propósito
| columna | tipo | notas |
|---|---|---|
| property_id | uuid PK FK → properties.id | |
| wifi_name / wifi_password | text | |
| door_code | text | |
| updated_at | timestamptz | |

**`guide_sections`** — tarjetas del Concierge (bilingüe)
| columna | tipo | notas |
|---|---|---|
| id | uuid PK | |
| property_id | uuid FK → properties.id | |
| slug | text | `jacuzzi`, `cocina`, `reglamento`, `faq`, `salida`... (unique por property) |
| title_es / title_en | text | |
| content_es / content_en | text (markdown) | |
| icon | text | lucide |
| icon_color | text | pastel de la tarjeta |
| sort_order | int | |
| is_published | boolean | |

**`recommendations`** — restaurantes, chinos, tours, actividades (bilingüe)
| columna | tipo | notas |
|---|---|---|
| id | uuid PK | |
| property_id | uuid FK → properties.id | |
| category | text | `restaurante` · `soda` · `chino` · `tour` · `actividad` |
| is_featured | boolean | true → aparece en "Experiencias Destacadas" |
| name | text | |
| description_es / description_en | text | |
| distance_label / duration_label | text | "5 min en carro" / "4+ horas" |
| price_label | text nullable | "Desde $XX" |
| maps_url | text nullable | |
| photo_url | text nullable | |
| sort_order | int · is_published boolean | |

**`feedback`**
| columna | tipo |
|---|---|
| id uuid PK · property_id FK → properties.id · rating int 1–5 · liked_most text · to_improve text · guide_clarity text (`si`/`mas_o_menos`/`no`) · would_return text (`si`/`tal_vez`/`no`) · guest_name text nullable · created_at timestamptz |

### Relaciones
`property_secrets`, `guide_sections`, `recommendations`, `feedback` → todas cuelgan de `properties.id` (muchos a uno). Agregar un alojamiento nuevo = 1 fila en `properties` + sus hijos.

### Seguridad (crítico)
- **RLS activado en TODAS las tablas.** Cliente anónimo: **cero acceso directo** a `properties`, `property_secrets` y demás.
- Lectura del Concierge: **solo server-side** (service role) en `/g/[code]` → busca `properties where access_code = code AND is_active` → si no existe, 404. Las secrets solo se incluyen si el código validó.
- `feedback`: insert solo vía endpoint server-side con validación zod; select solo anfitrión autenticado.
- Escrituras de admin: Server Actions protegidas por sesión Supabase Auth.
- `/g/[code]`: header `X-Robots-Tag: noindex` + meta noindex.
- Claves jamás en el cliente hasta validar; jamás en `NEXT_PUBLIC_*`.

### Storage
Bucket `photos` (público solo lectura): `/{property_slug}/gallery/`, `/{property_slug}/recommendations/`.

### Endpoints / acciones
- `GET /{locale}/g/[code]` — página server-rendered del Concierge (valida y arma todo).
- `POST /api/feedback` — valida (zod) + inserta + correo Resend a `HOST_NOTIFICATION_EMAIL`.
- Server Actions admin: CRUD de properties, secrets, sections, recommendations; regenerar `access_code`.

---

## 🚀 DOCUMENTO 06 — Plan de Implementación

**Fase 1 — Configuración** · Repo GitHub, Next.js 14 + TS + Tailwind, instalar framer-motion, next-intl, zod, lucide-react, resend, @supabase/ssr. Estructura del TRD, env vars, proyecto Supabase. ✅ *Hecho cuando: corre en local, lint pasa, primer commit subido.*

**Fase 2 — Base de datos multi-alojamiento** · Migraciones de las 5 tablas, RLS completo, bucket `photos`, semilla: property "La Rana" con código, secrets, secciones (entrada, wifi, jacuzzi, cocina, reglamento, FAQ, salida, contacto) y 6–8 recomendaciones (incl. 2 destacadas). ✅ *Hecho cuando: anónimo NO puede leer nada sensible (probado), semilla completa cargada.*

**Fase 3 — i18n + layout base** · next-intl con `/es` y `/en`, `es.json`/`en.json`, header con selector, footer, fuentes (Fraunces + Inter), tokens de color Tailwind. ✅ *Hecho cuando: se alterna idioma en cualquier página.*

**Fase 4 — Landing pública** · Hero animado, galería parallax/tilt 3D, "El alojamiento", "La zona", ubicación (mapa + Waze + Maps), CTA Airbnb. `next/image` + blur placeholders. ✅ *Hecho cuando: premium en móvil y desktop, 60fps, `prefers-reduced-motion` ok.*

**Fase 5 — Concierge Digital `/g/[code]`** · Validación server-side del código (404 amable si falla), hero de bienvenida, tarjeta Entrada (tap-to-reveal + copiar), grid de tarjetas con modal/detalle por sección, tarjetas WiFi (reveal + copiar), Ubicación, Restaurantes, Experiencias Destacadas, Salida, Contacto. noindex. ✅ *Hecho cuando: con código correcto se ve todo en ES y EN; con código inválido, 404; nada sensible visible en HTML/network sin código válido.*

**Fase 6 — Feedback** · Formulario (estrellas + preguntas aprobadas), zod, guardado + correo Resend, pantalla de gracias. ✅ *Hecho cuando: una respuesta de prueba llega a la tabla Y al correo.*

**Fase 7 — Panel /admin** · Login Supabase Auth, sidebar, CRUD alojamientos (incl. cambiar/regenerar código de acceso y copiar link listo para enviar), secrets, secciones ES/EN, recomendaciones/experiencias, listado de feedback por alojamiento. ✅ *Hecho cuando: el anfitrión cambia el código y el link viejo muere al instante; puede copiar el link nuevo en un clic.*

**Fase 8 — Pulido** · Estados vacíos/error/carga, responsive fino, accesibilidad, SEO de la landing (metadatos ES/EN + Open Graph con foto), favicon 🐸. ✅ *Hecho cuando: Lighthouse ≥90 en Performance/Accesibilidad/SEO móvil.*

**Fase 9 — Testing manual** · Los 3 recorridos completos en celular real: visitante → Airbnb; huésped → link → entrada → wifi → jacuzzi → restaurante (Waze) → salida → feedback; anfitrión → rotar código. Probar link inválido, red lenta. ✅ *Hecho cuando: los 3 flujos pasan sin errores.*

**Fase 10 — Despliegue** · Vercel + env vars de producción, dominio `*.vercel.app`, Resend en producción, README con manual del anfitrión (cómo crear el link, rotarlo y editar contenido). ✅ *Hecho cuando: el link de producción funciona completo y se envía el primer Concierge real a un huésped.*

### Criterio de completitud global
Un huésped real recibe por WhatsApp el link `/g/RANA2026`, lo abre desde su celular, copia la clave de la puerta y el WiFi, usa el jacuzzi con las instrucciones, llega a un restaurante con Waze, revisa la hora de salida y deja su feedback — que llega al correo del anfitrión. Y cuando Tesoro del Valle crezca, el segundo alojamiento se agrega desde /admin sin escribir código. 🐸✅

---
*Documentos v2 · Cambios respecto a v1: marca Tesoro del Valle multi-alojamiento, acceso por link directo `/g/[codigo]`, guía rediseñada como "Concierge Digital" según referencia visual aprobada.*
*Basado en la metodología "Los 6 Documentos Esenciales de Vibe Coding" de Jose Andonaire.*
