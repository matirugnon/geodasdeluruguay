# FIX 09 - Selectores accesibles en checkout

## Problema original

El checkout usaba tarjetas `div` clickeables con `onClick` para elegir:

- método de entrega
- método de pago

Visualmente funcionaban, pero la semántica era débil:

- sin radios reales
- sin agrupación semántica clara
- peor soporte para teclado
- peor soporte para lectores de pantalla

## Causa raíz

La selección estaba resuelta solo desde UI visual y estado React, sin controles de formulario nativos.

Eso obligaba a simular radios con `div`, borde y círculo custom, pero sin la estructura HTML correcta.

## Estrategia elegida

Se mantuvo el estado actual del checkout y se cambió únicamente el patrón de selección:

- `fieldset` para agrupar opciones
- `legend` para nombrar el grupo
- `input type="radio"` reales
- `label` como tarjeta completa clickeable
- foco visible aplicado sobre la tarjeta usando `peer-focus-visible`

Así se preservó el look actual y se mejoró la accesibilidad sin tocar pricing, pasos, envío ni pago.

## Archivos tocados

- `src/pages/Checkout.tsx`

## Qué selectores se corrigieron

- selector de método de entrega
  - `Retiro en Prado`
  - `Envío a domicilio`
- selector de método de pago
  - `Mercado Pago`
  - `Transferencia bancaria`

## Qué patrón semántico quedó

Patrón final:

- grupo visible de opciones dentro de `fieldset`
- nombre del grupo con `legend`
- cada tarjeta es un `label`
- cada tarjeta contiene un `input type="radio"` real y focusable
- el usuario puede:
  - hacer click en toda la tarjeta
  - tabular hasta el radio
  - cambiar opción con teclado

## Validaciones realizadas

- `npm run build` OK
- validación en browser sobre `/checkout`
- foco de teclado verificado sobre radios reales:
  - `delivery-pickup`
  - `payment-mercadopago`
- cambio con teclado verificado:
  - `ArrowRight` cambió entrega de retiro a envío
  - `ArrowRight` cambió pago de Mercado Pago a transferencia
- validación funcional:
  - al cambiar entrega a envío aparecieron campos de dirección
  - al avanzar al paso de pago siguieron presentes radios reales
  - al cambiar pago a transferencia apareció el panel bancario correcto

## Pendientes o mejoras futuras

- Los `Field` del formulario todavía usan labels visuales sin `htmlFor`; no bloquea este fix, pero sería una buena segunda pasada de accesibilidad.
- Si más adelante se separa `Checkout.tsx`, este `CheckoutOptionCard` puede extraerse sin cambiar el contrato del flujo.
