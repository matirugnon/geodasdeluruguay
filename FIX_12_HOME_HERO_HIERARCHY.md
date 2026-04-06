# FIX 12 - Home Hero Hierarchy

## Problema original
La Home priorizaba demasiado el hero frente a la entrada rápida al catálogo:

- el hero ocupaba casi todo el primer viewport en desktop
- la colección aparecía demasiado tarde
- había varias animaciones en cascada que reforzaban la teatralidad del bloque inicial

## Causa raíz
La jerarquía estaba sesgada por tres decisiones combinadas:

- altura casi full-screen en la sección hero
- contenedor interno también muy alto
- motion repartido entre contenedor, título, párrafo, divisor, CTA e imagen

Eso hacía que el usuario viera más “escena” que producto útil al aterrizar en Home.

## Estrategia elegida
Se aplicó un ajuste controlado sobre `Home.tsx`, sin rehacer la página:

- compactar altura y padding del hero
- reducir tamaño y spacing del bloque textual
- bajar motion no esencial
- acercar la sección `Nuestra Colección`
- sumar una línea breve de señales comerciales dentro del hero

## Archivos tocados
- `src/pages/Home.tsx`

## Qué cambió en la jerarquía del hero
- La sección pasó de un hero casi full-screen a un bloque más contenido.
- El contenedor principal dejó de depender de `h-[calc(100vh-5rem)] min-h-[700px]`.
- La altura mínima del hero quedó más baja:
  - antes: hero externo casi pantalla completa + contenedor interno `85vh / min-h-[500px]`
  - ahora: hero con padding controlado + contenedor interno `min-h-[430px] / md:[480px] / lg:[500px]`
- El título y el copy quedaron un poco más compactos para liberar espacio vertical.
- La colección pasó a entrar antes:
  - se redujo también el padding superior de `Nuestra Colección`

## Qué motion se redujo o eliminó
- Se eliminaron las animaciones individuales de:
  - título
  - párrafo
  - divisor
  - wrapper del CTA
- Se mantuvo solo motion suave en:
  - contenedor principal del hero
  - imagen del hero
- También se acortaron duración y desplazamiento para que el arranque se sienta menos teatral.

## Validaciones realizadas
- `npm run build`
- inspección del DOM renderizado del build local
- capturas headless con Edge en:
  - desktop `1440x900`
  - mobile `390x844`
- comparación visual del pliegue:
  - en desktop ya entra el encabezado de `Nuestra Colección` en el primer viewport
  - en mobile también aparece el arranque de la colección sin romper el tono visual

## Pendientes o mejoras futuras
- El MCP de Playwright no estuvo disponible en esta sesión (`Transport closed`), así que la validación interactiva quedó resuelta con browser local headless en lugar de ese tool.
- En una segunda pasada, si querés seguir afinando Home sin abrir un rediseño, lo siguiente lógico sería revisar:
  - imágenes externas de categorías
  - consistencia visual entre cards inline de Home y `ProductCard`
  - jerarquía de la sección de confianza respecto de categorías

