# FIX 02 - No secrets in client

## Problema original
`vite.config.ts` exponía un riesgo real de filtrado al frontend porque usaba `define` para inyectar:

- `process.env.API_KEY`
- `process.env.GEMINI_API_KEY`

ambas resolviendo contra `env.GEMINI_API_KEY` en tiempo de build.

## Riesgo real
Si `GEMINI_API_KEY` existía en el entorno de build o en un `.env*` cargado por Vite, el valor podía terminar embebido en el bundle del cliente. Eso convertía un secreto privado en un dato accesible desde navegador, DevTools o inspección del bundle publicado.

## Causa raíz
- `vite.config.ts` usaba `loadEnv(mode, '.', '')`, lo que cargaba variables sin restringir prefijo.
- Luego `define` exponía explícitamente un secreto privado al cliente.
- No había un `.env.example` de frontend que dejara documentado que el storefront solo debe consumir variables públicas `VITE_*`.

## Archivos tocados
- `vite.config.ts`
- `.env.example`

## Cambios realizados
1. Se eliminó por completo la inyección de `GEMINI_API_KEY` y `API_KEY` desde `vite.config.ts`.
2. Se removió `loadEnv(...)` porque ya no era necesario para la configuración del frontend.
3. Se dejó explícito `envPrefix: 'VITE_'` para reforzar que solo variables públicas pueden llegar al cliente.
4. Se agregó un `.env.example` en la raíz con la única variable pública detectada hoy:
   - `VITE_API_URL`
5. Se confirmó que no existe uso real de Gemini en el código cliente; la configuración era heredada / muerta y fue eliminada.

## Qué quedó protegido
- El bundle cliente ya no puede recibir `GEMINI_API_KEY` vía `define`.
- El frontend quedó restringido al patrón correcto de Vite: `import.meta.env.VITE_*`.
- La configuración pública del storefront quedó documentada explícitamente.

## Validaciones hechas
- `npm run build` OK.
- Búsqueda sin resultados en superficie cliente:
  - `GEMINI_API_KEY`
  - `process.env.*`
  - referencias a secretos/tokens vía `import.meta.env`
- Revisión de `src/services/dataService.ts`: solo usa `import.meta.env.VITE_API_URL`.
- Escaneo de `dist`: no aparecen nombres de secretos sensibles.
- Verificación adicional sin imprimir valores: si existe `GEMINI_API_KEY` en `.env` o `.env.local`, su valor no quedó presente en `dist`.

## Riesgos pendientes o siguientes pasos
- Siguen existiendo referencias históricas a este riesgo en documentos de auditoría del repo. No son runtime leaks, pero pueden limpiarse en una pasada de documentación si se quiere dejar todo consistente.
- `backend/.env` y otros secretos operativos del workspace deben seguir tratándose como material sensible del lado servidor; este fix solo cierra la superficie cliente.
- En una pasada futura conviene revisar si hay otras configuraciones heredadas de build que ya no se usan y simplificarlas del mismo modo.
