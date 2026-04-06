# FIX 05 - Remove test products from public catalog

## Problema original
El storefront público estaba mostrando productos de prueba y placeholder en producción. Eso afectaba de inmediato la confianza comercial porque el usuario veía piezas con nombres y descripciones claramente no publicables.

Ejemplos confirmados en datos reales:

- `Cristal de Prueba`
- `aaaaaaa`
- `prueba external`
- `prueba slug`
- `collar 1`

## Causa raíz
- El criterio oficial de publicación pública ya existía: `visible: true`.
- Sin embargo, no había ninguna protección mínima para evitar que placeholders obvios quedaran `visible: true`.
- El backend público listaba productos visibles sin una segunda validación de publicación real.
- El endpoint público de detalle también permitía acceder a productos no aptos para storefront si se conocía la slug.

## Estrategia elegida
Se eligió la opción de menor riesgo y menor superficie:

1. Mantener `visible` como contrato oficial de catálogo público.
2. Agregar una regla backend mínima para detectar placeholders obvios.
3. Filtrar esas piezas en los endpoints públicos de listado y detalle.
4. Forzar `visible: false` cuando alguien intente guardar un placeholder como público.
5. Ocultar explícitamente en Mongo los placeholders ya confirmados, sin tocar productos reales.
6. Mantener compatibilidad admin agregando un endpoint protegido para leer productos individuales sin filtro público.

## Archivos tocados
- `backend/utils/publicProductRules.js`
- `backend/controllers/productController.js`
- `backend/routes/productRoutes.js`
- `src/services/dataService.ts`

## Cambios realizados
### Código
- Se creó `publicProductRules.js` con tres helpers:
  - `looksLikePlaceholderProduct`
  - `isPublicCatalogProduct`
  - `enforceSafePublicVisibility`
- `GET /api/products` ahora devuelve solo productos realmente publicables.
- `GET /api/products/:id` ahora responde `404` para productos ocultos o placeholder.
- `POST /api/products` y `PUT /api/products/:id` fuerzan `visible: false` si el payload parece un placeholder y alguien intenta publicarlo.
- Se agregó `GET /api/products/admin/:id` protegido para que el flujo admin pueda seguir leyendo productos individuales, incluso si no son públicos.
- `dataService.getProductById()` usa el endpoint admin protegido cuando hay token, manteniendo compatibilidad para lectura administrativa.

### Datos
Se actualizó la base real para marcar `visible: false` en estos productos confirmados:

- `collar 1`
- `prueba slug`
- `prueba external`
- `aaaaaaa`
- `Cristal de Prueba`

No se modificó el producto real `Collar de amatista geoda - Violeta`.

## Criterio final de visibilidad pública
Un producto aparece en storefront público solo si:

1. `visible === true`
2. no coincide con patrones obvios de placeholder/test

Patrones cubiertos en esta iteración:

- palabras como `prueba`, `test`, `placeholder`, `demo`, `mock`
- títulos/slug de ruido como `aaaaaaa`
- nombres genéricos mínimos del tipo `collar 1`, `producto 2`, etc.

## Validaciones realizadas
- `node --check backend/controllers/productController.js`
- `node --check backend/utils/publicProductRules.js`
- `node --check src/services/dataService.ts`
- `npm run build`
- consulta Mongo antes y después del cambio para confirmar el set público visible
- validación API local:
  - `GET /api/products` devolvió solo el producto real visible
  - `GET /api/products/cristal-de-prueba` devolvió `404`
- validación browser local con Playwright:
  - home sin placeholders visibles
  - tienda sin placeholders visibles
  - ficha real `collar-de-amatista-geoda-violeta` cargando correctamente
  - ficha vieja `cristal-de-prueba` cayendo en `Producto no encontrado`

## Riesgos pendientes o mejoras futuras
- La protección es deliberadamente mínima y heurística; cubre placeholders obvios, no un sistema editorial completo.
- Si más adelante aparece un admin frontend dentro de este repo, convendría reflejar visualmente que un producto fue auto-ocultado por regla de publicación.
- Si se quiere un flujo más formal, el paso siguiente sería separar `draft/publicado` como estado explícito, pero no hizo falta para este fix.
