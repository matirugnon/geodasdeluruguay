---
name: component-architecture-review
description: Revisa la arquitectura de componentes y módulos del frontend de Geodas del Uruguay para detectar responsabilidades mezcladas, reusable mal planteado, props incómodas y puntos de acoplamiento innecesario.
tools: [filesystem, git, reasoning]
---

## 1. Propósito
Esta skill sirve para auditar cómo está organizado el frontend a nivel de componentes, contextos, páginas y servicios.

Su objetivo no es componentizar más, sino separar responsabilidades donde hoy el código mezcla demasiadas cosas y dificulta mantener, testear o iterar features.

## 2. Criterios de uso
Aplicar esta skill cuando:

- Un archivo creció demasiado y cuesta tocarlo con seguridad.
- Hay lógica repetida entre páginas y componentes.
- La API de un componente se volvió incómoda o difícil de extender.
- Se quiere planear una extracción sin romper UX.

No usarla cuando:

- Solo hace falta un ajuste visual pequeño.
- El problema es exclusivamente backend.
- La supuesta complejidad todavía está contenida y no afecta cambios futuros.

## 3. Proceso paso a paso
1. Mapear primero el frontend en cuatro grupos:
   - páginas
   - componentes compartidos
   - estado compartido
   - servicios/helpers
2. Revisar archivos de mayor riesgo de mezcla:
   - `src/pages/Checkout.tsx`
   - `src/services/dataService.ts`
   - `src/components/ProductCard.tsx`
   - `src/context/CartContext.tsx`
3. Para cada módulo, responder:
   - ¿Renderiza UI o coordina lógica?
   - ¿Hace demasiadas cosas distintas?
   - ¿Depende de detalles que deberían vivir en otra capa?
   - ¿Expone una API clara o obliga a conocer implementación interna?
4. Detectar duplicación real:
   - markup repetido
   - fetch duplicado
   - mapeos `_id -> id` repartidos
   - variantes de card que divergen sin motivo
5. Proponer cortes de responsabilidad con bajo riesgo:
   - extraer hook
   - extraer helper
   - extraer componente presentacional
   - separar servicio por dominio
6. Documentar el valor del cambio en términos de mantenibilidad futura, no en términos académicos.

## 4. Criterios de calidad
El resultado está bien hecho si:

- Identifica módulos concretos con responsabilidades mezcladas.
- Propone límites nuevos que reducen acoplamiento de verdad.
- Evita abstracciones prematuras.
- Deja claro qué quedaría más fácil después del refactor.
- Mantiene una complejidad compatible con el tamaño actual del proyecto.

## 5. Anti-patrones
Evitar:

- Partir todo en microcomponentes sin beneficio real.
- Inventar capas genéricas solo porque suenan limpias.
- Crear hooks o helpers que esconden lógica pero no la simplifican.
- Forzar patrones enterprise en un storefront relativamente chico.
- Hacer una migración de arquitectura grande mezclada con cambios visuales.

## 6. Ejemplos concretos
- `dataService.ts` mezcla catálogo público, CRUD admin, tips y autenticación; es candidato claro a separarse por dominio.
- `Checkout.tsx` concentra validación, cálculo de envío, descuento, integración con Mercado Pago, redirecciones y pantallas de resultado.
- `ProductCard.tsx` mezcla navegación, feedback temporal, CTA de carrito y markup de card; revisar si conviene separar comportamiento de presentación.
- `CartContext.tsx` resuelve estado y persistencia en `localStorage`; revisar si esa persistencia conviene aislarla para poder evolucionar el carrito sin tocar el reducer.
