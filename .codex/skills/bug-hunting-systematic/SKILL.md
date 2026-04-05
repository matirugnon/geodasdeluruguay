---
name: bug-hunting-systematic
description: Guía de debugging sistemático para Geodas del Uruguay: reproducir, aislar por capa, probar hipótesis y validar fixes sin parchear a ciegas.
tools: [filesystem, git, shell, playwright, reasoning]
---

## 1. Propósito
Esta skill sirve para depurar bugs reales del ecommerce sin saltar directo a editar archivos.

Está pensada para flujos visibles y mixtos de este proyecto: catálogo, carrito, checkout, redirects, admin, auth y comunicación frontend-backend.

## 2. Criterios de uso
Aplicar esta skill cuando:

- Hay un bug reportado sin causa clara.
- El error atraviesa UI, estado y backend.
- Un flujo dejó de funcionar después de cambios recientes.
- La falla aparece solo en ciertas rutas, dispositivos o estados del carrito.

No usarla cuando:

- El problema es un typo obvio ya identificado.
- La tarea es una mejora o refactor sin bug.
- No existe una conducta observada que reproducir.

## 3. Proceso paso a paso
1. Escribir el síntoma exacto en una frase:
   - qué esperaba el usuario
   - qué pasó realmente
   - en qué pantalla o flujo
2. Reproducir el bug antes de tocar código.
3. Delimitar la capa probable:
   - UI/render
   - estado cliente
   - request/response
   - backend
   - servicio externo
4. Revisar cambios recientes con `git` para detectar sospechosos.
5. Usar `playwright` para capturar el paso exacto donde el flujo se rompe.
6. Leer solo los archivos relevantes al flujo observado y construir 2 o 3 hipótesis concretas.
7. Validar hipótesis una por una, no todas a la vez.
8. Aplicar el fix más chico que resuelva la causa raíz.
9. Verificar:
   - caso original
   - caso vecino
   - ausencia de regresión evidente
10. Documentar en una frase qué causaba el bug y por qué el fix lo elimina.

## 4. Criterios de calidad
El resultado está bien hecho si:

- Existe reproducción clara.
- La causa raíz queda demostrada, no supuesta.
- El fix es más pequeño que el problema.
- La validación cubre flujo normal y borde cercano.
- No se usó refactor masivo como excusa para arreglar un bug puntual.

## 5. Anti-patrones
Evitar:

- Editar antes de reproducir.
- Meter logs por todos lados sin hipótesis.
- Corregir el síntoma visual cuando el error viene del backend.
- Atribuir todo a un estado raro de React sin evidencia.
- Decir que debería estar arreglado sin volver a correr el flujo.

## 6. Ejemplos concretos
- Si el checkout vuelve de Mercado Pago y muestra éxito pero no trae `verifiedOrderId`, separar si falla el redirect, la verificación `/api/payments/verify-payment` o el update de estado en `Checkout.tsx`.
- Si el admin deja de autenticarse, revisar primero el circuito `localStorage -> Authorization header -> /api/admin/verify`.
- Si una ruta de producto por slug no carga al entrar directo, revisar `App.tsx`, `slugify.ts`, `dataService.getProductBySlug` y resolución backend del endpoint.
- Si el carrito queda en estado inconsistente, verificar `CartContext.tsx` y la persistencia en `cart_geodas` antes de tocar UI.
