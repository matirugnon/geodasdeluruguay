---
name: env-and-secrets-audit
description: Revisa el manejo de variables de entorno y secretos en Geodas del Uruguay para detectar leaks, drift entre ejemplos y producción, uso indebido en frontend y configuraciones inseguras.
tools: [filesystem, git, reasoning]
---

## 1. Propósito
Esta skill sirve para auditar el circuito completo de secretos y configuración sensible del proyecto.

No se limita a mirar `.env`. También revisa si las variables correctas están documentadas, si hay naming consistente, si el frontend solo expone variables públicas y si existen credenciales reales donde no deberían estar.

## 2. Criterios de uso
Aplicar esta skill cuando:

- Se agregan nuevas variables de entorno.
- Cambia auth, pagos, correo, uploads o CORS.
- Se prepara un deploy o handoff.
- Hay sospecha de que secretos quedaron en el repo o en el workspace.

No usarla cuando:

- La tarea no toca configuración ni credenciales.
- Se necesita un security scan más amplio.
- Solo se revisa UI o copy.

## 3. Proceso paso a paso
1. Inventariar todos los archivos `.env*` relevantes en raíz y backend.
2. Comparar `backend/.env.example` con lo que realmente consume el backend.
3. Revisar `src/services/dataService.ts`, `vite.config.ts`, `vercel.json`, README y Docker si aplica para entender qué variables cruzan frontend y backend.
4. Validar la regla base:
   - `VITE_*` solo para datos públicos
   - secretos solo del lado servidor
5. Identificar drift:
   - variables usadas pero no documentadas
   - variables documentadas pero obsoletas
   - naming ambiguo
   - duplicación de URL base
6. Si aparecen credenciales reales en el workspace, tratarlas como incidente:
   - no reproducir valores
   - recomendar rotación
   - limpiar fuente de exposición
7. Entregar un informe corto con faltantes y acciones concretas.

## 4. Criterios de calidad
El resultado está bien hecho si:

- Diferencia secretos privados de valores públicos.
- Detecta drift entre código, docs y `.env.example`.
- Señala superficies donde un leak terminaría en frontend o logs.
- Produce una lista accionable de rotación, limpieza y documentación.

## 5. Anti-patrones
Evitar:

- Copiar variables sensibles en el reporte.
- Asumir que `.gitignore` alcanza como control de seguridad.
- Mezclar en la misma bolsa `MP_PUBLIC_KEY` y un access token privado.
- Dejar pasar variables hardcodeadas solo porque funcionan.
- Dar por bueno un `.env.example` incompleto.

## 6. Ejemplos concretos
- Verificar que `VITE_API_URL` siga siendo la única variable pública del frontend y que no aparezcan secretos bajo `import.meta.env`.
- Comparar `backend/.env.example` con necesidades reales de correo, `BACKEND_URL` y `STOREFRONT_URL`.
- Confirmar que `FRONTEND_URL` y `STOREFRONT_URL` no estén resolviendo el mismo problema con semántica confusa.
- Si hay un `backend/.env` con credenciales vivas en el workspace, documentar rotación y limpieza sin imprimir ningún valor.
