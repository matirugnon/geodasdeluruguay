# FIX 13 - Señales visibles de confianza en frontend

## Problema original

El storefront ya tenía bases sólidas de confianza resueltas en otras iteraciones, pero esas señales seguían poco visibles en las zonas donde más ayudan a decidir una compra: la Home cerca de la entrada al catálogo y la ficha de producto junto a los CTAs principales.

Eso dejaba dudas prácticas sin resolver con suficiente claridad:

- cómo se coordina el envío o retiro
- cómo se puede pagar
- qué esperar de una pieza natural
- dónde consultar políticas o contactar al negocio

## Causa raíz

La información de confianza existía, pero estaba dispersa o demasiado abajo en la jerarquía visual:

- en Home había señales útiles, pero no quedaban lo bastante cerca de la entrada principal al catálogo
- en ProductDetail había un bloque muy liviano (`Auténtica`, `Envío disponible`, `Origen natural`) que no respondía dudas reales de compra
- los accesos a envíos, devoluciones y contacto no estaban lo bastante integrados al momento de decisión

## Estrategia elegida

Se aplicó una mejora chica y sobria sobre dos vistas clave, sin rediseñar layout ni sumar bloques ruidosos:

1. reforzar en Home una capa de confianza comercial justo en la entrada a la colección
2. reemplazar en ProductDetail la franja débil de confianza por un bloque breve y útil de acompañamiento a la compra
3. reutilizar enlaces ya existentes y confiables (`/envios`, `/devoluciones`, WhatsApp oficial)
4. mantener paleta, ritmo tipográfico y tono artesanal del sitio

## Archivos tocados

- `src/pages/Home.tsx`
- `src/pages/ProductDetail.tsx`

## Qué señales de confianza se reforzaron

### Home

Se reforzaron señales visibles cerca de `Nuestra Colección`:

- pago online o transferencia
- envíos coordinados
- piezas naturales
- acceso directo a envíos
- acceso directo a devoluciones
- acceso directo a consulta por WhatsApp

La intención fue que el usuario vea producto útil antes, pero también tenga una capa de tranquilidad comercial muy cerca del catálogo.

### ProductDetail

Se reemplazó la franja de confianza demasiado genérica por un bloque `Compra con tranquilidad` con soporte más útil:

- envío o retiro a coordinar
- pago online o por transferencia
- aclaración de variación natural entre piezas
- acceso rápido a envíos
- acceso rápido a devoluciones
- acceso directo a WhatsApp para consultar esa pieza

## Vistas impactadas

- Home
- ficha de producto (`ProductDetail`)

## Validaciones realizadas

- `npm run build` ejecutó correctamente
- validación visual de Home en desktop y mobile con browser local headless
- confirmación de que las señales nuevas se ven y no rompen la composición
- validación de que el backend responde correctamente para un producto real por `GET /api/products/:slug`

### Requiere validación

La validación completa de la ficha en browser quedó parcialmente bloqueada por un problema local preexistente en el entorno de desarrollo:

- la llamada desde el frontend local a `/api/products/:slug` devolvió `500`
- la misma ruta consultada directamente al backend respondió `200`

Por eso pudo verificarse el cambio en código y el build, pero la comprobación final del estado exitoso de `ProductDetail` en navegador queda pendiente hasta resolver ese desajuste local entre frontend y API.

Además, el MCP de Playwright no estuvo disponible en esta sesión (`Transport closed`), por lo que la validación visual se hizo con browser local/headless.

## Pendientes o mejoras futuras

- cerrar el problema local de proxy o consumo API para validar en browser la ficha con datos reales
- si más adelante se quiere extender el mismo criterio, revisar una mejora sobria equivalente en carrito lateral o resumen previo al checkout
- mantener esta lógica de confianza compacta, evitando convertirla en banners o bloques de marketing ruidosos
