# Relevé Ballet Studio — Next.js

Migración del sitio WordPress (LocalWP) a **Next.js 16.3 (App Router) · React 19.2 · TypeScript · Tailwind CSS 4 · ESLint 9**.

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build && npm start
```

## Estructura

- `app/` — páginas: `/`, `/servicios`, `/reservar-clase`, `/tienda` y API (`/api/availability`, `/api/book`).
- `components/` — cabecera, pie, animaciones (`MotionProvider`), secciones del inicio y el calendario de reservas.
- `lib/data.ts` — precios, horario, catálogo e imágenes (datos estructurales).
- `lib/content.ts` — **todos los textos en español e inglés**. Edita aquí cualquier copy; el idioma se elige con el selector ES/EN de la cabecera (cookie `releve-locale`, sin cambiar las URLs).
- `lib/bookings.ts` — lógica de reservas (cupos, horarios, validación).
- `app/globals.css` — el diseño (fondos rosados, marcos redondeados, bordes durazno) portado del tema WordPress `releve-premium`.
- `public/img/` — imágenes.

## Variables de entorno (opcionales)

| Variable | Uso |
|---|---|
| `NEXT_PUBLIC_WHATSAPP` | Número de WhatsApp sin `+` (por defecto el del sitio actual) |
| `NEXT_PUBLIC_SITE_URL` | URL pública, para metadatos/Open Graph |

## Panel de administración

`/admin` (protegido con la variable `ADMIN_PASSWORD`) muestra las clases reservadas por día y horario, con datos de contacto, cambio de estado (pendiente / confirmada / pagada / cancelada) y los mensajes del formulario de contacto.

Los datos se guardan en Upstash Redis (`KV_REST_API_URL` + `KV_REST_API_TOKEN`, claves `releve:bookings` y `releve:messages`). Sin esas variables, en local se usa `.data/*.json`.

## Notas

1. **Tienda**: catálogo con botón a WhatsApp; todos los productos con precio provisional de $45.000 (editar `PRODUCTS` en `lib/data.ts`). El carrito/checkout de WooCommerce no se migró.
2. Las tipografías (Playfair Display + Jost) mantienen el diseño original; Geist queda como fuente de respaldo.
3. La base Redis se comparte con otro proyecto; las claves llevan prefijo `releve:`.
