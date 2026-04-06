# FIX 04 - ProductDetail not found

## Problema original
La ficha de producto no distinguía correctamente entre estados distintos del flujo de carga:

- `loading` inicial
- producto inexistente
- error real de red o backend

En la práctica, una slug inválida o un enlace compartido incorrectamente podía caer en un estado opaco porque `ProductDetail` dependía de `product === null` como fallback genérico.

## Causa raíz
- `ProductDetail.tsx` usaba `product === null` como proxy de varios estados distintos.
- `dataService.getProductBySlug()` devolvía `undefined` tanto para `404` como para errores reales de fetch o respuestas no exitosas.
- El componente no tenía una máquina de estados mínima para diferenciar `loading`, `notFound`, `success` y `error`.
- El `SEOHead` de la ficha solo se resolvía bien para el caso exitoso.

## Estrategia elegida
Se aplicó una corrección chica y de bajo riesgo:

1. Mantener la ficha exitosa actual sin rediseñarla.
2. Separar explícitamente el estado de la página en `loading`, `success`, `notFound` y `error`.
3. Cambiar `dataService.getProductBySlug()` para que:
   - `404` devuelva `undefined`
   - errores reales de carga o respuestas no `404` lancen excepción
4. Hacer que `ProductDetail` trate `notFound` y `error` como escenarios distintos.
5. Agregar UI sobria y útil para `notFound` y `error`, con CTA claros de recuperación.
6. Ajustar metadata para esos estados usando `SEOHead` con título coherente y `noindex`.

## Archivos tocados
- `src/pages/ProductDetail.tsx`
- `src/services/dataService.ts`

## Estados finales implementados
### `loading`
- Spinner y mensaje breve de carga.
- `SEOHead` con título `Cargando producto`.
- `noindex` mientras la ficha todavía no resolvió su estado real.

### `success`
- Se mantiene la ficha actual del producto.
- Sigue usando metadata del producto real y JSON-LD existente.

### `notFound`
- Título claro: `Producto no encontrado`.
- Explicación breve y humana.
- CTA principal: `Volver a la tienda`.
- CTA secundaria: `Ir al inicio`.
- `SEOHead` con título coherente y `noindex`.

### `error`
- Mensaje diferenciado de un `notFound`.
- CTA principal: `Reintentar`.
- CTA secundaria: `Volver a la tienda`.
- `SEOHead` con título `Error al cargar producto` y `noindex`.

## Validaciones realizadas
- `npm run build`
- validación visual local con una ficha existente:
  - `http://localhost:5175/producto/cristal-de-prueba`
  - resultado: carga correcta y título `Cristal de Prueba | Geodas del Uruguay`
- validación visual local con una slug inexistente:
  - `http://localhost:5175/producto/slug-inexistente-prueba`
  - resultado: estado `Producto no encontrado`, CTA a tienda y título correcto
- validación visual local de error real:
  - backend detenido intencionalmente
  - misma ficha existente cargada en frontend preview
  - resultado: estado `No pudimos cargar este producto`, botón `Reintentar` y título `Error al cargar producto | Geodas del Uruguay`
- verificación de contrato de fetch:
  - `404` ahora se interpreta como `notFound`
  - fallos de red o backend se interpretan como `error`

## Riesgos pendientes o mejoras futuras
- El patrón quedó resuelto para `ProductDetail`, pero otras páginas de detalle podrían beneficiarse de una convención similar si se busca consistencia futura.
- Los errores reales hoy muestran un mensaje funcional y seguro; si más adelante hiciera falta observabilidad, convendría centralizar logging o telemetry sin mezclarlo en esta iteración.
- La canonical en `notFound` y `error` usa la URL solicitada con `noindex`; es una opción segura y acotada para esta mejora, pero podría revisarse junto con una pasada SEO más amplia si el proyecto la necesita.
