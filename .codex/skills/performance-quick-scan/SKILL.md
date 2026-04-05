---
name: performance-quick-scan
description: Revisión rápida de performance y carga percibida del ecommerce Geodas del Uruguay, enfocada en storefront, imágenes, render, motion y costo real para usuarios finales.
tools: [filesystem, git, playwright, shell, reasoning, context7]
---

## 1. Propósito
Esta skill sirve para detectar cuellos de botella visibles y baratos de corregir.

No persigue micro-optimizaciones. Prioriza lo que hace que la tienda se sienta pesada, lenta o torpe para un usuario que quiere ver productos y comprar.

## 2. Criterios de uso
Aplicar esta skill cuando:

- El sitio se siente pesado o tarda en volverse usable.
- Se agregaron imágenes, motion o nuevas secciones visuales.
- Se quiere hacer una pasada de performance antes de deploy.
- Se detectan re-renders o fetches repetidos.

No usarla cuando:

- El problema es puramente backend o de seguridad.
- Se necesita profiling profundo a nivel producción.
- El cambio pedido es solo visual menor sin impacto en carga.

## 3. Proceso paso a paso
1. Revisar el routing y el code splitting existente en `src/App.tsx`.
2. Probar con `playwright` el tiempo percibido en:
   - Home
   - Tienda
   - Detalle
   - Checkout
3. Inspeccionar primero assets y motion:
   - imágenes hero
   - imágenes de categorías
   - animaciones de entrada
   - hover effects
4. Revisar si hay duplicación de fetch, renderizado redundante o lógica de mapeo repetida en cliente.
5. Revisar el costo de interacciones que no aportan conversión.
6. Confirmar con `context7` solo si hace falta validar una práctica concreta de React o Vite.
7. Priorizar hallazgos por impacto visible y facilidad de arreglo.

## 4. Criterios de calidad
El resultado está bien hecho si:

- Distingue carga real de percepción de lentitud.
- Detecta primero lo costoso y visible.
- Evita optimizaciones especulativas.
- Propone fixes compatibles con la estética sobria del proyecto.
- Considera mobile y conexiones medias, no solo desktop local.

## 5. Anti-patrones
Evitar:

- Recomendar `useMemo` y `useCallback` por reflejo.
- Hacer tuning fino de React sin medir un problema visible.
- Sugerir reescrituras grandes por deuda menor.
- Defender animaciones porque se ven lindas si retrasan el contenido.
- Optimizar CPU y dejar intactas imágenes pesadas o flujos lentos.

## 6. Ejemplos concretos
- Revisar si la hero de `Home.tsx` justifica su alto costo visual y espacial frente al contenido comercial que empuja hacia abajo.
- Revisar si las imágenes de categorías cargadas desde URLs externas afectan estabilidad y performance comparado con assets controlados.
- Revisar si `Home.tsx` y otras páginas están duplicando patrones de card en vez de reutilizar la `ProductCard`.
- Revisar si el loading actual del `Suspense` y las llamadas iniciales al catálogo dejan demasiado tiempo sin contenido útil.
