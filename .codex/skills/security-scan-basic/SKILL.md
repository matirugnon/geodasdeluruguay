---
name: security-scan-basic
description: Ejecuta un barrido rápido pero serio de seguridad sobre Geodas del Uruguay, priorizando secretos expuestos, auth admin, validaciones, uploads, pagos y malas prácticas frecuentes en este repo.
tools: [filesystem, git, shell, reasoning, context7]
---

## 1. Propósito
Esta skill sirve para detectar riesgos de seguridad comunes y concretos sin convertir la revisión en una checklist OWASP sin contexto.

Está orientada a este proyecto: frontend React público, backend Express, admin con JWT, uploads, MongoDB y Mercado Pago.

## 2. Criterios de uso
Aplicar esta skill cuando:

- Se va a deployar o abrir acceso externo.
- Se tocaron auth, pagos, uploads, envs o rutas admin.
- Se necesita una revisión rápida antes de mergear cambios sensibles.
- Hay sospecha de exposición de secretos o de validaciones débiles.

No usarla cuando:

- Se busca un pentest profundo o hardening de infraestructura.
- La tarea es exclusivamente visual.
- Ya existe un incidente confirmado y hay que ejecutar respuesta, no auditoría.

## 3. Proceso paso a paso
1. Revisar `.gitignore`, `.env.example`, docs de seguridad y cualquier `.env` presente en el workspace sin copiar valores al reporte.
2. Leer `backend/server.js`, `backend/routes/adminRoutes.js`, `backend/middleware/authMiddleware.js`, `backend/routes/uploadRoutes.js` y `backend/controllers/paymentController.js`.
3. Buscar estos vectores primero:
   - secretos en archivos versionables
   - JWT expuesto en frontend o `localStorage`
   - validación insuficiente de `req.body`
   - CORS demasiado permisivo
   - webhooks sin verificación adicional
   - logs que exponen datos sensibles
4. Revisar el frontend para ver si consume información sensible o guarda auth de forma persistente.
5. Si hay dudas de mejores prácticas actuales, confirmar con `context7` antes de recomendar cambios de seguridad más finos.
6. Entregar findings por severidad con:
   - riesgo
   - archivo afectado
   - escenario de abuso
   - fix mínimo razonable

## 4. Criterios de calidad
El resultado está bien hecho si:

- No expone secretos encontrados.
- Diferencia entre riesgo real y deuda menor.
- Ata cada finding a una superficie concreta del repo.
- Propone mitigaciones proporcionadas al tamaño del proyecto.
- Prioriza primero lo explotable y luego lo deseable.

## 5. Anti-patrones
Evitar:

- Volcar una lista genérica de OWASP sin leer el código.
- Publicar valores de credenciales encontradas.
- Marcar todo como crítico.
- Suponer que usar JWT ya resuelve la seguridad del admin.
- Ignorar pagos, webhooks o emails por estar del lado del backend.

## 6. Ejemplos concretos
- Revisar el uso de `localStorage` para `geodas_auth` en `dataService.ts`, porque eleva el riesgo frente a XSS comparado con una estrategia httpOnly.
- Revisar `paymentController.js` para confirmar que la idempotencia y el chequeo de montos son suficientes, y qué falta para endurecer el webhook.
- Revisar `server.js` para validar si los headers y CORS están alineados con producción real y no solo con el README.
- Si existe un `backend/.env` con credenciales reales en el workspace, tratarlo como hallazgo operativo y no reproducir secretos en la salida.
