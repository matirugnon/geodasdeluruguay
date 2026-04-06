# FIX 01 - Pricing y stock validados 100% en backend

## Problema original
El backend aceptaba `items` completos desde el frontend y usaba `item.price` para calcular subtotal, total y payloads de pago. Eso permitía alterar precios sensibles desde el cliente. Además, no había validación real de stock en la creación de órdenes.

## Causa raíz
- `backend/controllers/paymentController.js` calculaba totales directamente desde `req.body.items`.
- La creación de preferencia Mercado Pago y la orden por transferencia confiaban en `price`, `title` y demás campos enviados por el cliente.
- El flujo no rehidrataba productos desde MongoDB ni validaba disponibilidad antes de crear la orden.

## Archivos tocados
- `backend/services/orderPricingService.js`
- `backend/controllers/paymentController.js`
- `src/pages/Checkout.tsx`

## Enfoque aplicado
Se agregó una capa backend aislada para pricing seguro:

1. Recibe `items`, `shipping`, `deliveryMethod` y `paymentMethod`.
2. Valida shape mínimo del payload.
3. Extrae un identificador fiable del producto desde `productId`, `id` o `_id`.
4. Reconsulta productos reales en MongoDB.
5. Rechaza productos inexistentes, no visibles o sin stock suficiente.
6. Ignora `price`, `title`, `subtotal` y cualquier dato sensible del cliente.
7. Recalcula subtotal, shipping, descuento y total únicamente desde datos de DB.
8. Devuelve una estructura normalizada y segura para persistir la orden y crear el pago.

Luego esa lógica se aplicó a ambos flujos:
- `createPreference`
- `createTransferOrder`

## Decisiones tomadas
- Se mantuvo backward compatibility con el frontend actual aceptando `id`, `_id` o `productId`.
- No se cambió el contrato público de checkout más de lo necesario.
- Se devolvieron errores `400` claros para problemas del cliente.
- Se endureció también `verifyPayment` para no marcar una orden como verificada si falta la referencia, falta la orden o el monto pagado no coincide con `order.total`.
- En transferencia, el frontend ahora usa los `items` y el `total` normalizados por backend para el mensaje de WhatsApp.

## Casos cubiertos
- Precio manipulado en el payload.
- Subtotales y totales manipulados desde cliente.
- Producto inexistente.
- ID de producto inválido.
- Cantidad inválida.
- Producto no disponible para venta (`visible === false`).
- Stock insuficiente.
- Shipping inválido o incompleto.
- Monto aprobado en Mercado Pago distinto al total de la orden al verificar el pago.

## Riesgos pendientes
- El stock se valida al crear la orden, pero todavía no se reserva ni descuenta transaccionalmente. Dos compras simultáneas del último ítem podrían seguir compitiendo entre sí.
- El frontend sigue mostrando subtotales estimados con datos del carrito antes de enviar. La autoridad final ahora es backend, pero una segunda pasada podría sincronizar mejor ese resumen con la respuesta segura del servidor.
- No se agregaron tests automatizados de backend en esta iteración porque el proyecto no tiene una base de tests ya montada para este flujo.

## Cómo validar manualmente
### Build
- Ejecutar `npm run build` en la raíz.

### Validación del pricing seguro
1. Crear una orden de transferencia o preferencia enviando un `price` manipulado en `items`.
2. Confirmar que la orden guardada y la respuesta del backend usan el precio real de MongoDB.
3. Confirmar que el total final coincide con subtotal + envío - descuento calculados en backend.

### Validación de stock
1. Enviar una cantidad mayor al `stock` real.
2. Confirmar respuesta `400` con código `INSUFFICIENT_STOCK`.

### Validación HTTP mínima realizada en esta tarea
- Build OK con `npm run build`.
- Validación manual de servicio contra Mongo:
  - `clientSentPrice: 1`
  - `secureUnitPrice: 11111`
- Validación HTTP de `POST /api/payments/create-transfer-order`:
  - el endpoint devolvió `secureOrderPrice: 11111` aunque el cliente envió `price: 1`
  - devolvió `400` con `code: INSUFFICIENT_STOCK` para cantidad mayor al stock disponible
