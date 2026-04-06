# FIX 11 - Desktop Search Discoverability

## Problema original
La búsqueda de desktop en el `Navbar` existía, pero era poco descubrible porque el input nacía colapsado (`w-0`) y oculto (`opacity-0`). En la práctica, el usuario tenía que adivinar que el icono expandía un campo de búsqueda.

## Causa raíz
El patrón visual priorizaba ocultar el input hasta recibir foco. Eso mantenía el navbar limpio, pero sacrificaba affordance: la búsqueda no se percibía como funcionalidad disponible a simple vista.

## Estrategia elegida
Se aplicó la corrección de menor riesgo:

- mantener la misma lógica de búsqueda, debounce y dropdown
- tocar solo la superficie desktop del `Navbar`
- reemplazar el input colapsado por un campo siempre visible, compacto y sobrio
- conservar mobile sin cambios

## Archivos tocados
- `src/components/Navbar.tsx`

## Comportamiento anterior vs nuevo
### Antes
- input desktop oculto por defecto
- ancho `0`
- opacidad `0`
- dependencia de foco o click indirecto en el icono para descubrir la búsqueda

### Ahora
- input desktop visible de forma permanente
- ancho moderado (`w-36`, `lg:w-44`, `xl:w-52`)
- placeholder más claro: `Buscar productos`
- contenedor con presencia suave pero visible
- foco más evidente mediante `focus-within`
- icono integrado como apoyo visual, sin agregar un trigger separado innecesario

## Validaciones realizadas
- `npm run build`
- diff final del `Navbar` para confirmar que desapareció el patrón `w-0 / opacity-0`
- render del build local en `http://127.0.0.1:4173/`
- validación visual con Edge headless:
  - screenshot desktop: el campo queda visible en el navbar sin romper la sobriedad
  - screenshot mobile: la búsqueda desktop no invade el layout mobile
- `--dump-dom` sobre la home renderizada para verificar `role="search"` y `placeholder="Buscar productos"`

## Pendientes o mejoras futuras
- La sesión MCP de Playwright falló con `Transport closed`, así que esta iteración no dejó un E2E interactivo automatizado de tipeo y dropdown.
- En una segunda pasada, cuando el browser MCP esté estable, conviene verificar con teclado:
  - foco en el input
  - tipeo
  - apertura/cierre del dropdown
  - selección de resultados

