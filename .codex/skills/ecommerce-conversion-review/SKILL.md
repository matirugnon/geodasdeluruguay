---
name: ecommerce-conversion-review
description: Analiza el flujo de compra de Geodas del Uruguay con foco en conversión real: claridad de CTA, confianza, continuidad, fricción y señales comerciales útiles para un público adulto.
tools: [filesystem, git, playwright, reasoning]
---

## 1. Propósito
Esta skill sirve para revisar la tienda como embudo comercial: descubrir, evaluar, agregar, avanzar y pagar.

No es una review de marketing genérica. Evalúa si la interfaz ayuda a concretar compras sin manipulación, sin ruido y sin pasos ambiguos.

## 2. Criterios de uso
Aplicar esta skill cuando:

- Se cambió Home, tienda, detalle, carrito o checkout.
- Las visitas existen pero se sospecha fricción en compra.
- Se quiere mejorar CTA, señales de confianza o continuidad del flujo.
- Se va a lanzar una mejora comercial.

No usarla cuando:

- El trabajo es exclusivamente backend o seguridad.
- Solo hay que corregir un bug visual aislado.
- El objetivo es branding, no conversión.

## 3. Proceso paso a paso
1. Recorrer el flujo completo como visitante nuevo:
   - entrada a Home
   - exploración de tienda
   - detalle de producto
   - agregado al carrito
   - checkout
2. En cada paso evaluar:
   - qué acción principal espera la página
   - si esa acción está clara
   - qué dudas quedan abiertas
3. Revisar confianza:
   - claridad de precio
   - claridad de envío
   - métodos de pago entendibles
   - señales de negocio real
4. Revisar fricción:
   - demasiadas decisiones
   - CTAs con poco contraste
   - beneficios importantes visibles demasiado tarde
   - copy ambiguo
5. Revisar continuidad:
   - el usuario siempre sabe cuál es el siguiente paso
   - no hay callejones sin salida
6. Entregar un ranking de fricciones con impacto en conversión y acción sugerida.

## 4. Criterios de calidad
El resultado está bien hecho si:

- Los hallazgos están pensados desde el recorrido completo.
- Cada recomendación mejora claridad o reduce fricción.
- Se protege la confianza por encima de tácticas agresivas.
- El análisis considera el perfil adulto del público.

## 5. Anti-patrones
Evitar:

- Recomendar dark patterns, urgencia falsa o presión artificial.
- Reemplazar claridad por marketing.
- Medir conversión solo por cantidad de CTAs.
- Ignorar dudas típicas de confianza: pago, envío, contacto, seriedad.
- Dar consejos abstractos sin decir en qué parte del flujo impactan.

## 6. Ejemplos concretos
- Revisar si el descuento por transferencia aparece demasiado tarde y debería anticiparse antes del checkout.
- Revisar si el umbral de envío o la diferencia entre retiro y delivery se explican en el momento correcto.
- Revisar si el CTA de agregado al carrito compite mal con `Ver Detalle` o queda escondido por hover.
- Revisar si el flujo de transferencia por WhatsApp transmite confianza y continuidad suficientes después de crear la orden.
