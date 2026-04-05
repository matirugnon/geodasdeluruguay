# Auditoría Completa - Geodas del Uruguay

Fecha: 2026-04-05

## Alcance y método
Skills usadas explícitamente:

- Frontend: `ecommerce-frontend-review` + `ecommerce-conversion-review` + `performance-quick-scan` + `component-architecture-review`
- Backend: `backend-structure-review` + `refactor-safe-plan`
- Seguridad: `security-scan-basic` + `env-and-secrets-audit`
- Debugging de bugs confirmados: `bug-hunting-systematic`
- Mejoras visuales sugeridas: `ecommerce-ui-refactor`

Fuentes de evidencia usadas:

- Lectura directa del código en `src/`, `backend/`, `index.html`, `vite.config.ts`, `vercel.json` y archivos de entorno locales.
- Build local validada con `npm run build` en esta sesión.
- Validación UI real con Playwright sobre `https://www.geodasdeluruguay.com` recorriendo home, tienda, ficha, carrito y checkout en desktop y mobile.

Nota de alcance:

- La validación UI se hizo sobre la versión desplegada porque en esta sesión no se dejó un dev server local persistente corriendo.
- Cualquier diferencia entre deploy y branch actual queda marcada como `requiere validación`.
- La exposición de secretos encontrada en `.env` y `backend/.env` corresponde al workspace local actual, no al contenido de `HEAD`.

# 1. Resumen ejecutivo
Estado general: base funcional y comercialmente utilizable, pero con deuda relevante en seguridad, arquitectura y consistencia del flujo de compra.

Fortalezas:

- La dirección visual general es sobria y transmite mejor confianza que un storefront recargado.
- El carrito lateral y el resumen de checkout son simples de entender.
- Existe `SEOHead` reutilizable y lazy loading de rutas en `src/App.tsx`.
- El backend ya tiene algunos cimientos razonables: auth middleware, allowlist de CORS, rate limit de login y separación básica por rutas/modelos.

Debilidades principales:

- El flujo de pagos confía en datos sensibles enviados por el cliente.
- La experiencia pública muestra señales de baja confianza en producción: productos de prueba, links legales vacíos y metadatos inconsistentes.
- Hay módulos con demasiadas responsabilidades: `dataService.ts`, `Checkout.tsx` y `paymentController.js`.
- La performance percibida está penalizada por usar Tailwind CDN en producción y por decisiones evitables de carga/render.

Riesgos principales:

- Vulnerabilidad crítica en cálculo de precios del pedido.
- Riesgo operativo por secretos vivos en archivos locales.
- Riesgo de exposición futura de secretos vía `vite.config.ts`.
- Riesgo de accesibilidad y fricción real para público +45 en puntos clave del flujo.

Oportunidades:

- Resolver los 5 problemas prioritarios elevaría confianza, seguridad y mantenibilidad sin rehacer la app.
- El proyecto está lo bastante contenido como para mejorar mucho con refactors incrementales, no con una reescritura.

# 2. Frontend
Skills: `ecommerce-frontend-review` + `ecommerce-conversion-review` + `performance-quick-scan` + `component-architecture-review`

## 2.1 Productos de prueba visibles en producción
Severidad: alta

Impacto: erosiona confianza comercial de inmediato. En un ecommerce para público +45, ver nombres como `Cristal de Prueba`, `aaaaaaa` o `prueba external` reduce credibilidad y sugiere tienda incompleta.

Evidencia:

- Playwright sobre home y tienda mostró productos con nombres de prueba en producción.
- La API pública `/api/products` devuelve esos productos visibles.

Recomendación:

- Limpiar datos de prueba en producción.
- Agregar un checklist de publicación para impedir productos placeholder visibles.
- Si se necesita staging, separar claramente base de datos o banderas de visibilidad.

## 2.2 Ficha de producto inexistente sin estado útil de “no encontrado”
Severidad: alta

Impacto: una URL rota o compartida incorrectamente lleva a un estado opaco. Eso empeora UX, SEO y confianza.

Evidencia:

- `src/pages/ProductDetail.tsx:24` hace `setProduct(null)` cuando no encuentra el producto.
- `src/pages/ProductDetail.tsx:38` usa `if (!product)` para mostrar el mismo retorno base, sin distinguir entre `loading` y `not found`.
- En Playwright, `https://www.geodasdeluruguay.com/producto/no-existe-geoda-audit` produjo 404 en consola y no ofreció una pantalla útil de recuperación.

Recomendación:

- Introducir `loading`, `notFound` y `error` por separado.
- Mostrar CTA de vuelta a tienda y sugerencias relacionadas.
- Ajustar `document.title`/SEO para ese estado.

## 2.3 Las cards del storefront mezclan interacciones y degradan accesibilidad
Severidad: alta

Impacto: teclado, lectores de pantalla y usuarios menos precisos tienen una experiencia más frágil. También aumenta errores de click y hace más difícil mantener el patrón.

Evidencia:

- `src/components/ProductCard.tsx:35` usa `tabIndex={0}` sobre un contenedor clickeable.
- `src/components/ProductCard.tsx:53` contiene un `<button>` interno dentro de una card cuyo contenedor ya opera como botón.
- El snapshot de Playwright en tienda muestra botones anidados: “Ver detalle de …” conteniendo “Agregar al carrito”.

Recomendación:

- Convertir la card en un enlace estructural claro y dejar el CTA secundario como control separado.
- Evitar nesting de elementos interactivos.
- Reusar el mismo patrón visual y semántico también en las cards inline de `Home.tsx`.

## 2.4 Checkout con buena intención visual, pero con semántica débil y metadatos incompletos
Severidad: media

Impacto: la experiencia se entiende, pero es menos accesible y menos robusta de lo que parece.

Evidencia:

- `src/pages/Checkout.tsx:519` y bloques equivalentes usan `div` con `onClick` para elegir entrega y pago, no radios semánticos.
- `rg` muestra `SEOHead` en Home, Shop, Tips y ProductDetail, pero no en Checkout.
- En Playwright, al pasar de producto a checkout, el título quedó como `Collar de amatista geoda - Violeta | Geodas del Uruguay`.

Recomendación:

- Reemplazar selectores visuales por radio groups accesibles.
- Agregar `SEOHead` mínimo al checkout o al menos actualizar título y canonical de esa ruta.
- Mantener el resumen y desglose de costos, que sí están bien resueltos.

## 2.5 Links legales placeholder en footer
Severidad: alta

Impacto: afecta confianza, cumplimiento y sensación de tienda real.

Evidencia:

- `src/components/Footer.tsx:72` y `src/components/Footer.tsx:73` apuntan a `href="#"`.
- Playwright confirmó que `Privacidad` y `Términos` siguen resolviendo a `#`.

Recomendación:

- Publicar aunque sea páginas mínimas de privacidad, términos, envíos y devoluciones.
- Si aún no existen, ocultar el enlace hasta tener contenido real.

## 2.6 Home privilegia presencia visual por encima de entrada rápida al catálogo
Severidad: media

Impacto: la home se ve cuidada, pero para un usuario +45 tarda demasiado en llevar a producto útil.

Evidencia:

- `src/pages/Home.tsx` usa hero a pantalla alta con múltiples `motion.*`.
- En desktop, la hero ocupa mucho espacio antes de la colección.
- `src/pages/Home.tsx:50-115` concentra la mayor parte del motion visible.

Recomendación:

- Reducir altura real de hero y subir la colección.
- Mantener el tono sobrio, pero bajar teatralidad.
- Priorizar producto, categorías y confianza antes que escena.

## 2.7 Búsqueda desktop poco descubrible
Severidad: baja

Impacto: un usuario que no intuya la interacción puede no descubrir que existe búsqueda.

Evidencia:

- `src/components/Navbar.tsx:89` define el input con `w-0`, `opacity-0` y expansión solo al foco.

Recomendación:

- Darle presencia visible mínima en desktop o al menos un estado expandido más evidente.

## 2.8 Inconsistencia de contacto
Severidad: media

Impacto: daña confianza y puede derivar consultas a números distintos.

Evidencia:

- `src/pages/Checkout.tsx:28` usa `59891458797`.
- `src/pages/ProductDetail.tsx:46` usa `59894899544`.
- Navbar y Footer usan `59891458797`.

Recomendación:

- Centralizar contacto en una única constante compartida.

# 3. Backend
Skills: `backend-structure-review` + `refactor-safe-plan`

## 3.1 `paymentController.js` concentra demasiadas responsabilidades
Severidad: alta

Impacto: cada cambio en pagos mezcla cálculo comercial, persistencia, integración externa y email. Eso aumenta probabilidad de regresiones.

Evidencia:

- `backend/controllers/paymentController.js` calcula totales, crea órdenes, arma payload Mercado Pago, define redirects, procesa webhook y envía emails.

Recomendación:

- Separar en pasos incrementales:
  1. `orderPricingService`
  2. `mercadoPagoService`
  3. `orderNotificationService`
  4. controller más delgado

## 3.2 Validación de entrada insuficiente en endpoints de negocio
Severidad: alta

Impacto: errores del cliente terminan como 500 o datos inconsistentes en vez de 400 claros.

Evidencia:

- `paymentController.js` asume shape de `items`, `shipping` y `deliveryMethod` sin validación estructural robusta.
- `productController.js` hace `new Product(req.body)` y `Object.assign(product, req.body)` casi sin sanitización.
- `tipRoutes.js` implementa CRUD inline sin capa de validación dedicada.

Recomendación:

- Validar payloads antes de tocar base de datos o servicios externos.
- Normalizar respuestas de error por tipo: validación, auth, integración externa.

## 3.3 No hay enforcement de stock en el flujo de compra
Severidad: alta

Impacto: el sistema puede vender productos sin confirmar disponibilidad real.

Evidencia:

- `backend/models/Product.js` define `stock`.
- `rg` muestra que en frontend/backend el stock prácticamente solo se usa en `ProductDetail.tsx` para JSON-LD de disponibilidad.
- No hay revalidación de stock en `createPreference` ni `createTransferOrder`.

Recomendación:

- Reconsultar productos por ID en backend antes de generar orden/pago.
- Rechazar cantidades no disponibles.
- Considerar reserva temporal o decremento transaccional simple según el modelo de negocio.

## 3.4 Rutas de tips con controladores inline y sin módulo dedicado
Severidad: media

Impacto: menor consistencia y más deuda al crecer el contenido editorial.

Evidencia:

- `backend/routes/tipRoutes.js` contiene la lógica completa.
- No existe `backend/controllers/tipController.js`.

Recomendación:

- Extraer controller de tips y mantener la misma API pública.

## 3.5 Logs excesivos en operaciones sensibles
Severidad: media

Impacto: ensucia observabilidad y aumenta riesgo de exponer detalles internos en logs.

Evidencia:

- `productController.js` y `uploadRoutes.js` incluyen logging verbose de requests y estado de configuración.

Recomendación:

- Reducir logs a eventos operativos y errores relevantes.
- Nunca loguear payloads completos de entidades sensibles en producción.

# 4. Seguridad
Skills: `security-scan-basic` + `env-and-secrets-audit`

## 4.1 Precios manipulables desde el cliente
Tipo: vulnerabilidad
Severidad: crítica

Impacto: un cliente puede alterar `price` en el payload y pagar menos sin que el servidor lo corrija contra la base.

Evidencia:

- `backend/controllers/paymentController.js:33` usa `unit_price: Number(item.price)`.
- `backend/controllers/paymentController.js:39` recalcula subtotal con `Number(item.price)`.
- `backend/controllers/paymentController.js:199` repite la misma lógica para transferencia.
- El webhook compara el pago contra `order.total`, pero esa orden ya fue calculada con precios del cliente.

Recomendación:

- Ignorar precio, título y subtotal enviados por el cliente.
- Rehidratar productos por ID desde MongoDB.
- Calcular total únicamente desde backend.
- Revalidar stock y visibilidad en el mismo paso.

## 4.2 Secretos reales presentes en el workspace local
Tipo: riesgo
Severidad: alta

Impacto: compromiso operativo inmediato si ese entorno local, backup o captura se filtra.

Evidencia:

- Existen `.env` y `backend/.env` con credenciales reales en el workspace actual.
- `git check-ignore` confirma que están ignorados y `git show HEAD:.env` / `HEAD:backend/.env` confirma que no están versionados en `HEAD`.

Recomendación:

- Rotar todas las credenciales activas presentes en `backend/.env`.
- Mantener solo `.env.example` como referencia compartible.
- Tratar este hallazgo como operativo, no como exposición confirmada del repositorio.

## 4.3 JWT admin almacenado en `localStorage`
Tipo: riesgo
Severidad: alta

Impacto: cualquier XSS pasa a comprometer sesión admin más fácilmente.

Evidencia:

- `src/services/dataService.ts:17` lee `localStorage.getItem('geodas_auth')`.
- `backend/routes/adminRoutes.js` devuelve el token en JSON para almacenamiento cliente.

Recomendación:

- Mover a cookie segura si la arquitectura lo permite.
- Si no, endurecer CSP, sanitización y superficie XSS mientras se migra.

## 4.4 `vite.config.ts` puede inyectar secretos al bundle cliente
Tipo: mejora preventiva
Severidad: alta

Impacto: si `GEMINI_API_KEY` está configurada en entorno de build, se expone al frontend.

Evidencia:

- `vite.config.ts:29` define `'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)`.

Recomendación:

- Eliminar esa inyección del cliente.
- Exponer solo variables públicas `VITE_*`.
- Si se necesita IA o secretos, usar backend/proxy seguro.

## 4.5 Headers frontend permisivos para framing
Tipo: riesgo
Severidad: media

Impacto: facilita framing no deseado y abre puerta a clickjacking del storefront.

Evidencia:

- `vercel.json:8` usa `ALLOWALL`.
- `vercel.json:24` define `frame-ancestors *`.

Recomendación:

- Quitar `ALLOWALL`.
- Definir una política de `frame-ancestors` estricta o eliminarla si no hay necesidad real de embebido.

## 4.6 HTML editorial sin sanitización
Tipo: riesgo
Severidad: media

Impacto: contenido malicioso en tips puede convertirse en XSS persistente.

Evidencia:

- `src/pages/Tips.tsx:97` usa `dangerouslySetInnerHTML`.
- `src/pages/TipDetail.tsx:115` usa `dangerouslySetInnerHTML`.
- `backend/models/Tip.js` trata `content` como HTML libre.

Recomendación:

- Sanitizar HTML al guardar o al renderizar.
- Restringir tags permitidos.

# 5. Performance
Skills: `performance-quick-scan`

## 5.1 Tailwind CDN en producción
Severidad: alta

Impacto: CSS generado en navegador, warning real en consola y peor tiempo de carga/percepción.

Evidencia:

- `index.html:18` carga `https://cdn.tailwindcss.com?...`.
- Playwright reportó warning de Tailwind CDN en producción en cada página recorrida.

Recomendación:

- Migrar a Tailwind build-time o a CSS compilado localmente.
- Eliminar dependencia de CDN en runtime.

## 5.2 ProductCard carga imágenes como `background-image`
Severidad: media

Impacto: peor control de loading y lazy loading que con `img`.

Evidencia:

- `src/components/ProductCard.tsx:42` usa `style={{ backgroundImage: ... }}`.

Recomendación:

- Migrar a `img` con `loading="lazy"` cuando sea posible.

## 5.3 Motion no esencial en superficies comerciales
Severidad: media

Impacto: más trabajo visual y de render sin mejorar conversión.

Evidencia:

- `src/pages/Home.tsx:50-115` usa varios `motion.*`.
- `src/pages/Shop.tsx:207-343` usa `AnimatePresence` y `motion.div` para grilla y drawer.

Recomendación:

- Reservar motion para 1 o 2 transiciones útiles.
- Reducir layout animation en el grid de tienda.

## 5.4 Fuentes externas múltiples y assets remotos dispersos
Severidad: media

Impacto: más requests y más variabilidad de carga.

Evidencia:

- `index.html` carga varias familias desde Google Fonts y Material Symbols.
- Home y categorías usan mezcla de assets locales y URLs externas.

Recomendación:

- Reducir familias.
- Consolidar assets críticos.

## 5.5 Estado general de build
Severidad: observación

Impacto: la build compila bien, pero eso no refleja por sí solo calidad de runtime.

Evidencia:

- `npm run build` pasó correctamente.
- El chunk principal no es descomunal, pero el problema dominante es el runtime styling por CDN.

# 6. Arquitectura y mantenibilidad
Skills: `component-architecture-review` + `backend-structure-review` + `refactor-safe-plan`

## 6.1 `dataService.ts` es un módulo demasiado ancho
Severidad: alta

Impacto: acopla catálogo público, admin, tips y auth en la misma superficie.

Evidencia:

- El archivo contiene productos, tips, búsqueda, auth y helpers de requests autenticados.

Recomendación:

- Separar por dominio manteniendo API estable de transición:
  1. `catalogService`
  2. `tipsService`
  3. `adminProductService`
  4. `authService`

## 6.2 `Checkout.tsx` concentra demasiada lógica
Severidad: alta

Impacto: cualquier cambio en envío, pago o UX obliga a tocar una pantalla monolítica.

Evidencia:

- `src/pages/Checkout.tsx` mezcla validación, cálculo, redirects, verificación de pago, estados de resultado y UX completa.

Recomendación:

- Separar en:
  1. `useCheckoutPricing`
  2. `useMercadoPagoReturn`
  3. `ShippingStep`
  4. `PaymentStep`
  5. `OrderSummary`

## 6.3 Mismatch `isNew` vs `isNewProduct`
Severidad: alta

Impacto: el backend expone un campo distinto al que consume el frontend; la feature “Nuevo” queda rota o inconsistente.

Evidencia:

- `backend/models/Product.js:59` define `isNewProduct`.
- `src/components/ProductCard.tsx:46` y `src/pages/ProductDetail.tsx:151` esperan `product.isNew`.
- Playwright confirmó que `/api/products` devuelve `isNewProduct`.

Recomendación:

- Unificar contrato en backend y frontend.
- Corregir el mapper en `dataService` o renombrar el campo a nivel de schema/API.

## 6.4 Constantes de dominio y contacto duplicadas
Severidad: media

Impacto: deriva en SEO inconsistente y contacto fragmentado.

Evidencia:

- `src/utils/slugify.ts:37` fija `SITE_URL` a `geodasdeluruguay.vercel.app`.
- `index.html` y `Tips.tsx` también usan `vercel.app`.
- El deploy público real corre en `www.geodasdeluruguay.com`.
- WhatsApp está duplicado con números distintos.

Recomendación:

- Centralizar dominio canónico y contacto.
- Alimentar SEO, sitemap y links desde una única fuente.

## 6.5 Ruidos de repositorio
Severidad: baja
Estado: requiere validación

Impacto: dificulta lectura del repo y aumenta riesgo de mezclar material de diseño con app viva.

Evidencia:

- Existen carpetas de diseño y backups en raíz como `geodas frontend/` y `_admin_backup/`.
- `git status` muestra `geodas frontend/` como untracked.

Recomendación:

- Mover material exploratorio a `docs/`, `archive/` o fuera del repo principal.

# 7. Quick wins
- Recalcular precios y stock desde backend antes de crear órdenes o preferencias.
- Rotar credenciales locales y dejar solo ejemplos seguros.
- Eliminar Tailwind CDN de producción.
- Quitar productos de prueba y reemplazar links legales `#`.
- Corregir `isNewProduct` vs `isNew`.
- Agregar estado “producto no encontrado”.
- Unificar dominio canónico y número de WhatsApp.
- Reemplazar selectores de checkout por radios accesibles.

# 8. Roadmap sugerido
## Fase A: crítico
- Cerrar vulnerabilidad de pricing.
- Rotar secretos activos del workspace.
- Eliminar inyección potencial de `GEMINI_API_KEY` al cliente.

## Fase B: UX / frontend clave
- Limpiar catálogo de prueba en producción.
- Corregir `ProductDetail` no encontrado.
- Publicar páginas legales mínimas.
- Unificar contacto/dominio.

## Fase C: limpieza técnica
- Separar `dataService.ts`.
- Dividir `Checkout.tsx`.
- Extraer servicios de pago desde `paymentController.js`.
- Crear `tipController`.

## Fase D: mejoras opcionales
- Reducir motion no esencial.
- Rehacer hero para mostrar catálogo antes.
- Consolidar tipografías y assets remotos.

# 9. Mejoras visuales sugeridas
Skills: `ecommerce-ui-refactor`

- Reducir altura y protagonismo del hero para que la colección entre antes.
- Unificar card de Home y `ProductCard` en un solo sistema visual.
- Reemplazar CTAs icon-only por texto explícito cuando la acción es comercial.
- Fortalecer señales de confianza visibles: políticas, contacto, envío y medios de pago.
- Mantener paleta sobria, serif para identidad y sensación artesanal; no introducir glassmorphism, gradientes fuertes ni motion decorativo.

# 10. Cosas que NO cambiaría
- La dirección visual general sobria y cálida.
- El patrón de carrito lateral con resumen corto.
- El desglose de total, envío y descuento en checkout.
- El uso de `SEOHead` como abstracción reutilizable.
- El code splitting de rutas en `src/App.tsx`.

# 11. Checklist accionable
- [ ] Recalcular precios y stock desde DB en backend.
- [ ] Rotar secretos locales activos.
- [ ] Eliminar Tailwind CDN de producción.
- [ ] Corregir mismatch `isNewProduct` / `isNew`.
- [ ] Limpiar productos de prueba visibles.
- [ ] Crear páginas reales de privacidad y términos.
- [ ] Agregar `notFound` real en `ProductDetail`.
- [ ] Volver accesibles los selectores de entrega y pago.
- [ ] Separar `dataService.ts` por dominio.
- [ ] Separar servicios de pago/email del controller.
- [ ] Unificar número de WhatsApp y dominio canónico.
- [ ] Sanitizar HTML de tips.
