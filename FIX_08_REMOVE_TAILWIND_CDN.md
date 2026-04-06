# FIX 08 - Remover Tailwind CDN y compilar estilos localmente

## Problema original

El frontend cargaba Tailwind desde `https://cdn.tailwindcss.com` en `index.html`.

Eso implicaba:

- generación de estilos en runtime
- warning real de Tailwind en consola
- trabajo extra en el navegador
- peor performance percibida que un build CSS compilado

## Causa raíz

El proyecto no tenía pipeline local de Tailwind.

Faltaban:

- `tailwind.config`
- `postcss.config`
- un CSS global compilado con `@tailwind`
- import del CSS en el entrypoint

Además, el theme y helpers globales estaban definidos inline en `index.html`.

## Estrategia elegida

Se migró al pipeline clásico y estable de Tailwind v3 para minimizar riesgo visual:

- Tailwind local compilado por Vite
- PostCSS + Autoprefixer
- theme movido a `tailwind.config.cjs`
- helpers globales movidos a `src/index.css`
- `index.html` limpio, sin CDN ni config runtime

Se eligió esta variante porque replica mejor el comportamiento actual sin abrir una migración más grande a otra sintaxis/configuración.

## Archivos tocados

- `package.json`
- `package-lock.json`
- `tailwind.config.cjs`
- `postcss.config.cjs`
- `src/index.css`
- `src/index.tsx`
- `index.html`
- `src/pages/ProductDetail.tsx`

## Cómo quedó el pipeline de estilos

Dependencias locales:

- `tailwindcss`
- `postcss`
- `autoprefixer`
- `@tailwindcss/forms`
- `@tailwindcss/typography`

Flujo final:

1. `src/index.tsx` importa `src/index.css`
2. `src/index.css` incluye `@tailwind base/components/utilities`
3. `postcss.config.cjs` procesa Tailwind + Autoprefixer
4. `tailwind.config.cjs` provee el theme extendido del proyecto
5. `vite build` genera CSS compilado en `dist/assets/*.css`

Además:

- se movieron a CSS compilado los helpers globales:
  - `material-symbols-outlined`
  - `bg-pattern`
  - `scrollbar-hide`
  - `no-scrollbar`
  - `blob-shape-*`
  - `texture-overlay`

## Qué se eliminó de `index.html`

- script del CDN de Tailwind
- `tailwind.config = { ... }` inline
- bloque `<style>` con helpers globales que dependían de esa carga runtime

## Validaciones realizadas

- `npm run build` OK
- build generado con CSS compilado local:
  - `dist/assets/index-*.css`
- búsqueda final:
  - sin `cdn.tailwindcss.com` en runtime del proyecto
  - sin `tailwind.config =` inline en runtime del proyecto
- validación en browser con Playwright:
  - `home`
  - `tienda`
  - `ficha`
  - `checkout`
  - `privacidad`
- validación de consola:
  - 0 warnings de Tailwind CDN luego de la migración

## Diferencias visuales detectadas

No detecté cambios visuales relevantes en la estructura general.

La validación visual de páginas con datos se hizo con respuestas mockeadas en Playwright porque el backend local estaba inestable durante esta tarea; para el objetivo de styling eso alcanzó para verificar que:

- la UI siguió renderizando
- no quedó dependencia al CDN
- el layout principal no colapsó

## Pendientes o cleanup futuro

- Eliminar referencias históricas al CDN en documentos de auditoría o archivos archivados (`AUDITORIA_COMPLETA_GEODAS.md`, `geodas frontend/...`) en una pasada separada.
- Si más adelante se quiere optimizar aún más, revisar fuentes externas y estilos globales remanentes, pero eso ya es otra iteración.
