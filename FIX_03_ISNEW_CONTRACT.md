# FIX 03 - Contrato isNew / isNewProduct

## Problema original
La feature "Nuevo" estaba desalineada entre capas:

- backend persistía y exponía `isNewProduct`
- frontend consumía `product.isNew`

Eso hacía que la UI del badge "Nuevo" quedara rota o dependiera de datos casuales en lugar de un contrato consistente.

## Causa raíz
- El schema de Mongo define `isNewProduct`.
- `dataService.ts` mapeaba `_id -> id`, pero no traducía `isNewProduct -> isNew`.
- La UI de catálogo y ficha ya estaba implementada sobre `product.isNew`.
- El flujo de guardado de producto tampoco normalizaba `isNew` hacia `isNewProduct`, así que cualquier cliente que enviara `isNew` podía perder el dato.

## Estrategia elegida
Se eligió la opción de menor riesgo:

1. Mantener `isNewProduct` como campo interno de persistencia en backend.
2. Unificar el contrato frontend sobre `Product.isNew`.
3. Resolver la traducción en la capa adaptadora de `dataService`.
4. Agregar compatibilidad mínima en backend para aceptar `isNew` en create/update.

Con esto no hay migración de datos, no se cambia el schema persistido y el storefront queda consistente.

## Archivos tocados
- `src/services/dataService.ts`
- `backend/controllers/productController.js`

## Contrato final resultante
### Frontend
- El contrato vigente en frontend es `product.isNew`.
- El objeto `Product` consumido por componentes ya no depende de `isNewProduct`.

### Backend
- El campo persistido sigue siendo `isNewProduct`.
- `createProduct` y `updateProduct` aceptan `isNew` como alias y lo normalizan a `isNewProduct`.

### Compatibilidad
- Lectura: `dataService` transforma `isNewProduct` a `isNew`.
- Escritura: `dataService.saveProduct()` transforma `isNew` a `isNewProduct`.
- Backward compatibility: si un cliente manda `isNew` directo al backend, el controlador lo acepta.

## Validaciones realizadas
- `node --check src/services/dataService.ts`
- `node --check backend/controllers/productController.js`
- `npm run build`
- búsqueda residual de referencias:
  - frontend UI sigue leyendo `isNew`
  - `isNewProduct` quedó restringido al mapper y a compatibilidad backend
- validación con datos reales:
  - existen productos visibles con `isNewProduct: true`
  - ejemplo validado: `cristal-de-prueba`
- validación visual local con Playwright:
  - en ficha de producto se mostró `Nuevo`
  - en listado de tienda también hubo badge `Nuevo` visible

## Riesgos pendientes o cleanup futuro
- El backend público sigue persistiendo `isNewProduct`; si en una segunda pasada se quisiera unificar toda la API, habría que hacerlo como cambio de contrato explícito.
- `dataService` sigue concentrando bastante lógica de adaptación de productos; este fix lo mantiene acotado, pero a futuro podría separarse por dominio si se sigue ampliando.
