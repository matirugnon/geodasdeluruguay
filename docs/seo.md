---

# 🚀 Estrategia de SEO: Geodas del Uruguay

Este documento detalla las acciones técnicas y de contenido necesarias para optimizar el posicionamiento orgánico del sitio, enfocándose en el mercado uruguayo y el nicho de piedras naturales.
---

## 1. Configuración Técnica (Código)

### 🔹 Metadatos Dinámicos

No todas las páginas deben llamarse igual. Cada producto y tip debe ser único para Google.

* **Implementación:** Usar `react-helmet-async`.
* **Estructura del Título:** `[Nombre del Producto] | Geodas del Uruguay`
* **Meta Descripción:** Extraer los primeros 155 caracteres de la descripción del producto o tip.

### 🔹 URLs Amigables (Slugs)

Evitar IDs de base de datos en la URL.

* **Mal:** `geodasdeluruguay.com.uy/producto/64f123abc`
* **Bien:** `geodasdeluruguay.com.uy/producto/amatista-catedral-artigas`

### 🔹 Optimización de Imágenes

Las geodas son visuales, pero Google no "ve" las fotos, las "lee".

* **Atributo Alt:** Todas las imágenes deben tener un `alt=""` descriptivo.
* *Ejemplo:* `alt="Geoda de Amatista de Artigas de 5kg con cristales violeta profundo"`.


* **Cloudinary:** Utilizar los parámetros `f_auto,q_auto` en las URLs para entregar el formato más liviano (WebP/AVIF) automáticamente.

---

## 2. Estructura de Contenido (Palabras Clave)

Debemos atacar palabras clave específicas del mercado uruguayo:

| Sección | Palabras Clave Objetivo |
| --- | --- |
| **Home** | Geodas del Uruguay, Amatistas de Artigas, Piedras energéticas Montevideo. |
| **Tienda** | Comprar amatistas, Decoración con piedras naturales, Cuarzos Uruguay. |
| **Diario Místico** | Cómo limpiar amatistas, Propiedades de las geodas, Piedras para el hogar. |

---

## 3. Indexación y Herramientas de Google

Para que el dominio recién comprado aparezca en los buscadores, debemos cumplir estos 3 pasos:

1. **Sitemap.xml:** Generar un archivo que liste todas las rutas del sitio y subirlo a Vercel.
2. **Google Search Console:** * Vincular el dominio de GoDaddy.
* Solicitar la indexación de la URL principal.


3. **Google My Business:** * Crear la ficha de negocio para aparecer en **Google Maps** cuando alguien busque "Geodas en Montevideo".

---

## 4. El Blog (Diario Místico) como Imán de Tráfico

El contenido educativo es la mejor forma de atraer clientes sin pagar publicidad.

* **Periodicidad:** Subir al menos 1 tip cada 15 días.
* **Formato:** Responder preguntas reales.
* *Título sugerido:* "¿Por qué las Amatistas de Artigas son las mejores del mundo?"


* **Internal Linking:** Dentro de un tip, poner un link hacia un producto relacionado de la tienda.

---

## 5. Checklist de Lanzamiento (SEO)

* [ ] Instalar `react-helmet-async` y configurar tags por página.
* [ ] Verificar que el archivo `robots.txt` esté en la carpeta `/public`.
* [ ] Comprimir el video del Hero a menos de 2MB.
* [ ] Registrar el dominio en Google Search Console.
* [ ] Asegurar que el certificado SSL (HTTPS) esté activo en Vercel.

---

### Próximo Paso Recomendado:

**¿Te gustaría que te genere el código del componente `SEO.jsx` para que solo tengas que importarlo en tus páginas y empiece a manejar los títulos automáticamente?**