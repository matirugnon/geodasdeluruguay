# FIX 06 - Legal pages and footer links

## Problema original
El footer público tenía enlaces legales placeholder:

- `Privacidad` → `#`
- `Términos` → `#`

Eso debilitaba la percepción de tienda real, afectaba confianza comercial y dejaba al sitio sin páginas básicas de referencia para usuarios que necesitan validar cómo se maneja la información o qué esperar de una compra.

## Estrategia elegida
Se aplicó una solución chica, sobria y creíble:

1. Crear un layout reutilizable para páginas informativas simples.
2. Publicar cuatro páginas mínimas y honestas:
   - privacidad
   - términos y condiciones
   - envíos
   - devoluciones
3. Reutilizar solo datos confirmados en el repo, especialmente el canal de contacto por WhatsApp.
4. Mantener SEO mínimo consistente con `SEOHead`.
5. Reemplazar los links placeholder del footer por rutas reales y sumar `Envíos` y `Devoluciones` en la sección de ayuda.

## Páginas creadas
- `/privacidad`
- `/terminos`
- `/envios`
- `/devoluciones`

## Archivos tocados
- `src/components/InfoPageLayout.tsx`
- `src/pages/PrivacyPage.tsx`
- `src/pages/TermsPage.tsx`
- `src/pages/ShippingPage.tsx`
- `src/pages/ReturnsPage.tsx`
- `src/App.tsx`
- `src/components/Footer.tsx`

## Enlaces reemplazados
### Footer inferior
- `Privacidad` ahora apunta a `/privacidad`
- `Términos` ahora apunta a `/terminos`

### Columna de ayuda
Se agregaron enlaces reales a:

- `/envios`
- `/devoluciones`

## Criterios de contenido usados
- texto breve y claro
- tono prudente, sin lenguaje pseudo-corporativo
- sin promesas o garantías que el negocio no confirmó
- uso de información ya presente en el sitio:
  - catálogo público
  - contacto por WhatsApp
  - referencia a envíos dentro de Uruguay
- foco en utilidad real para una tienda pequeña/artesanal

## Qué cubre cada página
### Privacidad
- qué datos básicos se usan
- para qué se usan
- aclaración de que no se venden datos personales
- canal de contacto para consultas

### Términos y condiciones
- uso general del sitio
- carácter orientativo de imágenes y colores
- disponibilidad sujeta a stock
- posibilidad de actualizar precios y contenido

### Envíos
- modalidades generales de entrega o coordinación
- tiempos estimados como referencia
- uso de contacto para coordinación

### Devoluciones
- qué hacer si hay un problema real con el pedido
- revisión caso a caso
- aclaración prudente sobre variaciones propias de piezas naturales

## Validaciones realizadas
- `npm run build`
- búsqueda de wiring legal en código para confirmar reemplazo de placeholders
- validación real en browser:
  - click desde footer a `/privacidad`
  - carga correcta de `/terminos`
  - carga correcta de `/envios`
  - carga correcta de `/devoluciones`
- verificación de título SEO en rutas informativas
- revisión visual desktop y mobile para confirmar:
  - jerarquía de títulos
  - ancho de lectura cómodo
  - CTA de contacto sobrio
  - footer sin links legales `#`

## Límites o pendientes futuros
- El contenido es intencionalmente mínimo y no reemplaza asesoría legal formal.
- Si más adelante el negocio define políticas más específicas, convendría actualizar estas páginas con información operativa confirmada.
- No quedaría mal sumar un email de contacto explícito si el canal se estabiliza, pero no se inventó en esta iteración porque el repo no lo expone en frontend.
