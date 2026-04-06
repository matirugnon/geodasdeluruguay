# FIX 15 - ProductDetail como superficie de conversión visual

## Problema original

La ficha de producto ya tenía buena base funcional, pero la superficie de decisión seguía algo dispersa:

- el precio quedaba demasiado solo
- el CTA principal no tenía suficiente contexto inmediato
- la descripción y los datos competían con la acción principal
- el bloque de apoyo comercial estaba bien intencionado, pero acompañaba tarde y con poca jerarquía

La consecuencia era una ficha prolija, pero no todo lo clara que podría ser para decidir una compra con calma.

## Causa raíz

La columna derecha estaba ordenada más como una acumulación lineal de datos que como una secuencia clara de decisión:

- categoría y título funcionaban bien
- después aparecían precio, descripción, specs, tags y CTAs casi al mismo nivel visual
- el bloque de `Compra con tranquilidad` respondía dudas reales, pero llegaba después de un tramo que todavía no guiaba suficientemente la compra

## Estrategia elegida

Se aplicó una mejora pequeña/media, sin tocar lógica ni backend:

1. crear un bloque principal de decisión para agrupar precio, disponibilidad, CTA y apoyo inmediato
2. mover la descripción a una segunda capa más tranquila bajo `Sobre esta pieza`
3. ordenar mejor specs y tags para que acompañen sin competir
4. mantener el bloque de confianza, pero con menos peso visual que el panel principal de compra

El ángulo de conversión se cubrió manualmente en esta iteración porque la skill `ecommerce-conversion-review` no estaba disponible en la sesión.

## Archivos tocados

- `src/pages/ProductDetail.tsx`

## Qué mejoró en jerarquía y conversión visual

- el precio ahora vive dentro de un panel de compra más claro
- se agregó una señal de estado simple (`Disponible para compra` / `Consultar disponibilidad`)
- el CTA principal gana protagonismo al quedar dentro del mismo bloque de decisión
- se agregó microcopy corto para explicar qué pasa después de sumar la pieza al carrito
- la descripción ya no empuja la acción principal; quedó ordenada bajo `Sobre esta pieza`
- specs y tags siguen visibles, pero con un rol más secundario y más escaneable
- el bloque `Compra con tranquilidad` se mantiene como apoyo útil, no como competidor del CTA

## Validaciones realizadas

- `npm run build` ejecutó correctamente
- revisión del diff para confirmar que el cambio quedó concentrado en `ProductDetail`
- control de que no se tocó lógica de carrito, navegación, carga de datos ni checkout

## Requiere validación

La validación en browser automatizado no pudo completarse en esta sesión porque el MCP de Playwright siguió devolviendo `Transport closed`.

Por eso esta iteración queda validada por build y revisión estructural del resultado, pero conviene hacer una pasada visual manual o con browser automation estable para revisar:

- lectura en desktop
- lectura en mobile
- relación visual entre imagen, panel de compra y bloque de apoyo
- ritmo real del contenido en una pieza cargada

## Pendientes o mejoras futuras

- validar visualmente con una pieza real apenas vuelva a estar operativo Playwright o una alternativa estable
- si se quiere afinar aún más la ficha, el siguiente paso razonable sería revisar el tratamiento de thumbnails e imagen principal, no sumar más texto ni más cajas
- mantener la superficie sobria: no convertir este bloque en promociones, badges extra o venta agresiva
