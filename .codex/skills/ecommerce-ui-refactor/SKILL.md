---
name: ecommerce-ui-refactor
description: Refactoriza UI del storefront de Geodas del Uruguay para mejorar claridad, consistencia y accesibilidad sin romper la sobriedad visual ni convertir la tienda en un rediseño innecesario.
tools: [filesystem, git, playwright, reasoning, shadcn]
---

## 1. Propósito
Esta skill sirve para mejorar la interfaz visible del ecommerce manteniendo una dirección visual sobria, confiable y fácil de usar.

Está pensada para refactors visuales medidos: ajustar componentes, spacing, tipografía, CTAs, cards y secciones del storefront sin caer en ornamentación, library-churn ni rediseños de portafolio.

## 2. Criterios de uso
Aplicar esta skill cuando:

- Ya existe UI funcional pero inconsistente o confusa.
- Se quiere unificar componentes visuales entre Home, tienda, detalle y checkout.
- Hay que mejorar accesibilidad, legibilidad o contraste.
- Se detectó ruido visual, motion excesivo o componentes que no transmiten confianza.

No usarla cuando:

- El cambio principal es de arquitectura o lógica de datos.
- Solo hace falta arreglar un bug puntual de CSS.
- El pedido implica rehacer identidad de marca completa.

## 3. Proceso paso a paso
1. Identificar primero el problema visible exacto antes de tocar clases o estructura.
2. Tomar inventario de patrones existentes:
   - botones
   - cards
   - labels de categoría
   - bloques de precio
   - formularios
   - estados vacíos
3. Definir una dirección de refactor explícita para este proyecto:
   - sobrio
   - claro
   - cálido
   - sin apariencia de template generativo
4. Reducir variación antes de agregar novedad:
   - menos tipos de CTA
   - menos estilos de card
   - menos tamaños arbitrarios
   - menos motion decorativo
5. Si se consulta `shadcn`, usarlo solo como referencia estructural de ergonomía y composición, no como estética importada por defecto.
6. Implementar cambios por superficie, no por ocurrencia aislada:
   - primero base visual
   - luego card/listado
   - luego formularios
   - luego pantallas específicas
7. Validar en `playwright` desktop y mobile, prestando atención a:
   - targets táctiles
   - lectura rápida
   - consistencia entre páginas
8. Ajustar hasta que el resultado se vea intencional y tranquilo, no genérico ni demasiado diseñado.

## 4. Criterios de calidad
El resultado está bien hecho si:

- La interfaz queda más simple de entender que antes.
- La paleta, spacing y tipografía se sienten coherentes entre páginas.
- Los CTAs principales destacan sin gritar.
- La accesibilidad mejora o al menos no empeora.
- El refactor no introduce patrones ajenos al proyecto solo por novedad.

## 5. Anti-patrones
Evitar:

- Glassmorphism, sombras pesadas, gradients llamativos o UI premium falsa.
- Meter componentes de librería que no dialogan con el resto del sitio.
- Cambiar todo a la vez sin una regla visual clara.
- Agregar microanimaciones en cada interacción.
- Usar iconos en lugar de texto cuando el texto ayuda más.
- Optimizar lo lindo y dejar intacta la claridad del flujo de compra.

## 6. Ejemplos concretos
- Unificar el lenguaje visual entre la `ProductCard` reutilizable y las cards inline de `Home.tsx`, que hoy resuelven CTA, precio e imagen con criterios distintos.
- Reducir la teatralidad de la hero de `Home.tsx` si desplaza contenido comercial útil demasiado abajo.
- Rehacer botones del checkout para que los estados primarios, secundarios y de error sean consistentes y fáciles de distinguir.
- Ordenar categorías y bloques de confianza para que parezcan parte de una tienda real, no de una landing armada por secciones independientes.
