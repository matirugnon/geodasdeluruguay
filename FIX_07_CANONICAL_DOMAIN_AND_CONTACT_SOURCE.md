# FIX 07 - Fuente única para dominio canónico y contacto público

## Problema original

El proyecto mezclaba referencias públicas del sitio en varios archivos:

- el dominio real es `https://www.geodasdeluruguay.com`
- todavía había referencias activas a `https://geodasdeluruguay.vercel.app`
- el número de WhatsApp estaba duplicado y no era consistente en todas las vistas

Eso generaba SEO inconsistente, riesgo de canonical incorrecto y contacto fragmentado.

## Causa raíz

Los valores públicos del sitio estaban hardcodeados en múltiples capas:

- utilidades SEO
- páginas informativas
- Navbar / Footer
- Checkout
- ficha de producto
- rutas backend de `robots.txt` y `sitemap.xml`

No existía una fuente única de verdad para `siteUrl` y `whatsappNumber`.

## Estrategia elegida

Se implementó una fuente única de verdad pequeña y explícita:

- `site.public.json` en la raíz como configuración pública compartida
- `src/config/site.ts` como wrapper frontend para exponer:
  - `SITE_NAME`
  - `SITE_URL`
  - `WHATSAPP_NUMBER`
  - `WHATSAPP_URL`
  - `createWhatsAppLink(message?)`

Con eso se reemplazaron hardcodes activos en frontend y backend sin abrir una refactorización mayor.

## Archivos tocados

- `site.public.json`
- `tsconfig.json`
- `src/config/site.ts`
- `src/utils/slugify.ts`
- `src/components/Navbar.tsx`
- `src/components/Footer.tsx`
- `src/components/InfoPageLayout.tsx`
- `src/pages/Checkout.tsx`
- `src/pages/ProductDetail.tsx`
- `src/pages/Tips.tsx`
- `backend/routes/seoRoutes.js`
- `backend/server.js`
- `index.html`

## Fuente única creada

Archivo central:

```json
{
  "siteName": "Geodas del Uruguay",
  "siteUrl": "https://www.geodasdeluruguay.com",
  "whatsappNumber": "59891458797"
}
```

Contrato final:

- dominio canónico oficial: `https://www.geodasdeluruguay.com`
- WhatsApp oficial: `59891458797`
- los links públicos de contacto salen de `WHATSAPP_URL`
- los links con mensaje salen de `createWhatsAppLink()`
- el canonical frontend sale de `SITE_URL`
- `robots.txt` y `sitemap.xml` backend salen de `site.public.json`

## Referencias corregidas

Se corrigieron las referencias activas más importantes del runtime:

- canonical base heredado en `src/utils/slugify.ts`
- canonical hardcodeado en `src/pages/Tips.tsx`
- número viejo de WhatsApp en `src/pages/ProductDetail.tsx`
- links de WhatsApp duplicados en `src/components/Navbar.tsx`
- links de WhatsApp duplicados en `src/components/Footer.tsx`
- contacto de páginas informativas en `src/components/InfoPageLayout.tsx`
- generación de links de comprobante/contacto en `src/pages/Checkout.tsx`
- dominio base en `backend/routes/seoRoutes.js`
- origen público permitido en `backend/server.js`
- canonical estático de `index.html`

No quedaron referencias activas a `geodasdeluruguay.vercel.app` ni al WhatsApp viejo en `src`, `backend`, `index.html` ni `dist`.

## Validaciones realizadas

- `npm run build` OK
- búsqueda activa en código y bundle:
  - sin residuos de `geodasdeluruguay.vercel.app`
  - sin residuos de `59894899544`
- validación en browser sobre `/privacidad`:
  - título: `Privacidad | Geodas del Uruguay`
  - canonical único: `https://www.geodasdeluruguay.com/privacidad`
  - links de WhatsApp visibles apuntando a `https://wa.me/59891458797`

## Pendientes o cleanup futuro

Quedaron referencias residuales solo en documentación o archivos no runtime:

- `AUDITORIA_COMPLETA_GEODAS.md`
- `PORTFOLIO_PROMPT.md`
- `docs/SECURITY_AUDIT.md`
- material archivado en `geodas frontend/...`

No afectan el funcionamiento público del sitio, pero conviene limpiarlas en una pasada documental aparte para evitar confusión futura.
