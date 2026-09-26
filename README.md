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
- `lib/data.ts` — contenido, precios, horario y catálogo. **Edita aquí** textos, clases y horarios.
- `lib/bookings.ts` — lógica de reservas (cupos, horarios, validación).
- `app/globals.css` — el diseño (fondos rosados, marcos redondeados, bordes durazno) portado del tema WordPress `releve-premium`.
- `public/img/` — imágenes.

## Variables de entorno (opcionales)

| Variable | Uso |
|---|---|
| `NEXT_PUBLIC_WHATSAPP` | Número de WhatsApp sin `+` (por defecto el del sitio actual) |
| `NEXT_PUBLIC_SITE_URL` | URL pública, para metadatos/Open Graph |

## Pendientes antes de producción

1. **Reservas**: `lib/bookings.ts` guarda en memoria y en Vercel no persiste. Conecta una base de datos (Vercel KV / Upstash / Postgres) y agrega el panel de administración (en WordPress existía).
2. **Contacto**: el formulario abre WhatsApp con el mensaje; sustitúyelo por un servicio de correo si lo prefieres.
3. **Tienda**: es un catálogo con botón a WhatsApp (sin precios ni carrito). El carrito/checkout de WooCommerce no se migró.
4. Las tipografías (Playfair Display + Jost) mantienen el diseño original; Geist queda como fuente de respaldo.
