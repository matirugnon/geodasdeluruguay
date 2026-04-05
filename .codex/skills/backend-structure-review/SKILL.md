---
name: backend-structure-review
description: Audita la estructura del backend Express de Geodas del Uruguay con foco en separación de capas, lógica de negocio, side effects, validación y mantenibilidad real del código.
tools: [filesystem, git, shell, reasoning, context7]
---

## 1. Propósito
Esta skill sirve para revisar si el backend está organizado de forma que permita evolucionar catálogo, admin y pagos sin convertir cada cambio en una operación riesgosa.

No busca imponer una arquitectura ideal. Busca detectar dónde la lógica de negocio, validación, integración externa y wiring del servidor están demasiado juntos.

## 2. Criterios de uso
Aplicar esta skill cuando:

- Hay que tocar controladores de pagos, productos, tips o admin.
- Se quiere introducir una feature nueva en backend.
- Aparecen bugs difíciles de aislar por mezcla de responsabilidades.
- Se sospecha que `server.js` o un controller centralizaron demasiado.

No usarla cuando:

- Solo hay que cambiar una query simple ya localizada.
- El trabajo es puramente de frontend.
- La revisión pedida es exclusivamente de seguridad.

## 3. Proceso paso a paso
1. Revisar `backend/server.js` para entender middleware global, CORS, headers, rutas y configuración.
2. Leer controladores y rutas siguiendo el flujo request -> controller -> model -> side effects.
3. Señalar dónde hoy viven reglas de negocio que deberían ser reutilizables.
4. Revisar si la validación ocurre antes de tocar base de datos o integraciones externas.
5. Identificar side effects sensibles:
   - creación de órdenes
   - integración con Mercado Pago
   - envío de emails
   - auth admin
6. Evaluar si falta una capa intermedia simple, por ejemplo servicios de pago o helpers de validación, antes de recomendar cambios mayores.
7. Cuando haga falta validar convenciones o mejores prácticas, apoyarse en `context7`, pero aterrizar todo al stack actual.
8. Entregar findings y un camino de refactor incremental.

## 4. Criterios de calidad
El resultado está bien hecho si:

- Marca exactamente qué archivo mezcla demasiadas responsabilidades.
- Distingue entre wiring, validación, reglas de negocio e integración externa.
- Propone refactors pequeños y con orden lógico.
- Evita recomendaciones incompatibles con el tamaño del proyecto.
- Ayuda a tocar pagos o admin con menos miedo en iteraciones futuras.

## 5. Anti-patrones
Evitar:

- Sugerir una reescritura total a TypeScript como primer paso.
- Proponer repositorios, factories y capas ceremoniales sin necesidad real.
- Criticar el backend como si fuera un sistema distribuido.
- Ignorar side effects críticos solo porque el código funciona.
- Mezclar review estructural con una lista genérica de seguridad.

## 6. Ejemplos concretos
- `paymentController.js` hoy concentra mapeo de categorías, cálculo de totales, persistencia de órdenes, armado de preferencia MP, redirects y emails.
- `server.js` contiene CORS, security headers y setup global inline; revisar si parte de ese wiring merece middleware separado.
- `adminRoutes.js` resuelve rate limiting y auth en la misma capa de ruta; evaluar si conviene encapsular ese comportamiento.
- `config/db.js` es simple y correcto, pero sirve como referencia del tipo de módulo chico que sí conviene preservar.
