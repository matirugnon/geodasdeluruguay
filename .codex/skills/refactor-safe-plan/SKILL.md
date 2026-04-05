---
name: refactor-safe-plan
description: Diseña planes de refactor incrementales y seguros para Geodas del Uruguay, minimizando riesgo de regresión en storefront, admin, pagos y rutas existentes.
tools: [filesystem, git, reasoning]
---

## 1. Propósito
Esta skill sirve para planear cambios estructurales sin romper comportamientos que hoy sostienen ventas, navegación o administración.

Está orientada a convertir un refactor difuso en una secuencia corta de pasos verificables y reversibles.

## 2. Criterios de uso
Aplicar esta skill cuando:

- Un módulo necesita refactor pero da miedo tocarlo.
- Hay mezcla de responsabilidades y se quiere separar por capas.
- El cambio afecta checkout, pagos, auth, catálogo o componentes compartidos.
- Hace falta ordenar una iteración grande en entregas chicas.

No usarla cuando:

- La tarea es un fix pequeño y directo.
- El usuario pidió implementación inmediata sin necesidad de plan.
- No hay claridad mínima del comportamiento actual a preservar.

## 3. Proceso paso a paso
1. Definir el objetivo del refactor en una frase concreta.
2. Listar qué comportamientos no se pueden romper.
3. Identificar archivos tocados y contratos que deben mantenerse:
   - rutas
   - props
   - shape de datos
   - keys de `localStorage`
   - endpoints
4. Separar el trabajo en cambios pequeños que puedan validarse por sí solos.
5. Ordenar los pasos del más seguro al más riesgoso.
6. Para cada paso, dejar explícito:
   - qué se mueve
   - qué no cambia
   - cómo se valida
   - qué rollback mental existe si algo falla
7. No mezclar en el mismo paso refactor estructural y rediseño visual salvo necesidad real.
8. Cerrar con un checklist breve de verificación final.

## 4. Criterios de calidad
El resultado está bien hecho si:

- El plan es ejecutable en varias iteraciones cortas.
- Cada paso tiene una validación clara.
- Los contratos sensibles quedan explícitos.
- Reduce riesgo antes de aumentar ambición.
- Permite pausar en cualquier paso sin dejar el repo inconsistente.

## 5. Anti-patrones
Evitar:

- Big-bang refactor.
- Mezclar cleanup, cambio visual, nueva feature y cambio de API en un solo lote.
- Borrar código viejo antes de validar la pieza nueva.
- Renombrar y mover todo junto solo para ordenar.
- Tocar checkout o pagos sin checkpoints intermedios.

## 6. Ejemplos concretos
- Separar `dataService.ts` en servicios por dominio manteniendo primero la misma API pública para no romper páginas.
- Extraer lógica de Mercado Pago desde `paymentController.js` a una capa de servicio antes de cambiar comportamiento del checkout.
- Unificar cards de producto comenzando por shared styles y markup, y recién después tocar animaciones o copy.
- Refactorizar `Checkout.tsx` dividiéndolo por pasos y helpers sin alterar de entrada el flujo de redirects y verificación.
