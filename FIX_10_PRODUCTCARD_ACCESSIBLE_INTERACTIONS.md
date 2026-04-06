# FIX 10 - Interacciones accesibles en ProductCard

## Problema original

Las cards del storefront mezclaban superficies interactivas conflictivas:

- `ProductCard` usaba el `article` completo como pseudo-botón con `role="button"` y `tabIndex`
- dentro de esa misma card había un botón real para agregar al carrito
- además había una CTA visual de detalle dentro de la misma superficie

Eso generaba una semántica débil y una interacción poco robusta para teclado, foco y mantenimiento.

## Causa raíz

La navegación al detalle estaba resuelta desde un contenedor clickeable improvisado en lugar de links reales separados.

El botón de carrito coexistía dentro de esa misma superficie, obligando a usar `preventDefault` y `stopPropagation` para evitar conflictos.

## Estrategia elegida

Se reemplazó el patrón viejo por uno más claro:

- `article` volvió a ser solo contenedor semántico, no interactivo
- la navegación al detalle quedó en links reales
  - link sobre la imagen
  - link sobre el título
  - link/CTA de “Ver Detalle”
- el botón “Agregar” quedó separado como `button` real y sibling del link de imagen

En `Home` se mantuvo la variante existente, pero se corrigió lo mínimo para no dejar un patrón contradictorio:

- se removió `cursor-pointer` del wrapper no interactivo
- se agregaron nombres accesibles y foco visible a link y botón

## Archivos tocados

- `src/components/ProductCard.tsx`
- `src/pages/Home.tsx`

## Patrón semántico final

Patrón final de card:

- `article` no interactivo
- uno o más `a` reales para ir al detalle
- `button` real para agregar al carrito
- sin `button` dentro de `a`
- sin `a` dentro de `button`
- sin contenedor con `role="button"` improvisado

## Vistas impactadas

- `Shop` / `Tienda` a través de `ProductCard`
- `Category` a través de `ProductCard`
- Home en la sección “Nuestra Colección”

## Validaciones realizadas

- `npm run build` OK
- validación en browser con Playwright sobre `tienda` y `home`
- validación DOM en `ProductCard`:
  - `role` eliminado
  - `tabIndex` eliminado
  - sin nesting interactivo (`a button`, `button a`)
- validación de foco y teclado en tienda:
  - foco inicial en link de detalle
  - siguiente tab en botón “Agregar”
  - siguiente tab en link del título
- activación con teclado:
  - `Enter` sobre botón agregó al carrito
  - `Enter` sobre link abrió la ficha de producto
- validación en home:
  - wrapper ya no finge ser clickeable
  - sin nesting interactivo
  - botón con `aria-label` correcto

## Pendientes o mejoras futuras

- `ProductCard` hoy expone varios links al mismo destino para maximizar click area sin nesting; si más adelante se quiere simplificar, puede evaluarse una variante con una sola superficie principal de link y CTA secundaria más contenida.
- Conviene revisar otras cards no-producto si en el futuro aparecen patrones similares, pero no fue necesario tocar más superficies en esta iteración.
