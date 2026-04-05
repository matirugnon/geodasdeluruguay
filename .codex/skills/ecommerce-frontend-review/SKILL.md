---
name: ecommerce-frontend-review
description: Audita la experiencia del storefront de Geodas del Uruguay con foco en claridad para público +45, confianza, jerarquía visual, cards de producto y facilidad real de compra.
tools: [filesystem, git, playwright, shell, reasoning]
---

## 1. Propósito
Esta skill sirve para revisar el frontend público del ecommerce como experiencia de compra real, no como ejercicio de diseño.

Usarla cuando haya cambios en `src/pages`, `src/components`, navegación, cards, carrito o checkout, y se necesite detectar fricción, ruido visual o decisiones que resten confianza.

El criterio central es simple: una persona +45 debe poder entender qué se vende, cuánto cuesta, cómo seguir y por qué confiar en la tienda sin tener que descifrar la interfaz.

## 2. Criterios de uso
Aplicar esta skill cuando:

- Se modificó `Home`, `Shop`, `ProductDetail`, `Checkout`, `Navbar`, `CartDrawer` o `ProductCard`.
- Hay dudas sobre claridad, legibilidad, jerarquía visual o fricción de compra.
- Se quiere auditar si la UI cayó en estética decorativa o poco confiable.
- Se necesita priorizar hallazgos antes de refactorizar.

No usarla cuando:

- El problema es puramente técnico y no afecta la experiencia visible.
- Solo hay que corregir un bug aislado de layout ya identificado.
- La tarea es backend, SEO técnico o seguridad sin impacto directo en interfaz.

## 3. Proceso paso a paso
1. Leer primero el mapa de rutas y componentes visibles en `src/App.tsx`, `src/pages/*` y `src/components/*`.
2. Revisar el contexto de cambios con `git` para entender si la auditoría es global o sobre superficies concretas.
3. Levantar la app si hace falta y recorrer con `playwright` estas pantallas como mínimo:
   - Home
   - Tienda
   - Detalle de producto
   - Carrito
   - Checkout
4. Probar al menos desktop y mobile. En este proyecto no alcanza con desktop porque varias affordances dependen de hover.
5. Evaluar cada pantalla con estas preguntas:
   - ¿Se entiende en 5 segundos qué vende la tienda?
   - ¿El CTA principal es obvio?
   - ¿Precio, imagen, nombre y acción están bien jerarquizados?
   - ¿Hay acciones escondidas detrás de hover, iconos ambiguos o texto débil?
   - ¿La UI transmite sobriedad y confianza?
6. Revisar especialmente las cards:
   - consistencia entre `Home` y `ProductCard`
   - tamaño de tipografía
   - claridad de CTA
   - legibilidad del precio
   - badges y labels
7. Revisar fricción de compra:
   - carrito visible
   - continuidad hacia checkout
   - mensajes de error y estados vacíos
   - claridad de métodos de pago y envío
8. Entregar findings priorizados por severidad y por impacto comercial.

## 4. Criterios de calidad
El resultado está bien hecho si:

- Los hallazgos están ordenados por impacto y no por gusto personal.
- Cada hallazgo indica pantalla o componente afectado.
- Cada hallazgo explica por qué perjudica a un usuario +45 o a la conversión.
- Las recomendaciones son concretas y aplicables en este repo, sin rehacer todo.
- Se distingue claramente entre problema de claridad, problema visual y problema de flujo.

## 5. Anti-patrones
Evitar:

- Hacer una crítica de diseño sin probar la compra completa.
- Confundir minimalismo con interfaz vacía o poco orientativa.
- Aprobar interacciones que dependen de hover como si fueran suficientemente claras.
- Recomendar más motion o más efectos para modernizar.
- Pedir cambios de branding radicales cuando el problema real es jerarquía o copy.
- Decir que algo se ve bien sin validar confianza, legibilidad y continuidad de compra.

## 6. Ejemplos concretos
- Revisar si la `ProductCard` actual depende demasiado del hover para revelar `Agregar`, algo débil para desktop y directamente irrelevante para muchos usuarios +45.
- Revisar si la hero de `Home.tsx` usa demasiada altura, animación y espacio en blanco antes de mostrar catálogo útil.
- Revisar si las categorías de `Home.tsx` se ven consistentes y confiables aunque algunas imágenes vengan de URLs externas y otras de assets locales.
- Revisar si el paso a checkout deja suficientemente claro el costo de envío, el descuento por transferencia y el siguiente paso real del usuario.
