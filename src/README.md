# 💻 Frontend - Código Fuente

Esta carpeta contiene todo el código frontend de la aplicación.

## 📂 Estructura

### `/components`
Componentes React reutilizables:
- **Navbar.tsx** - Barra de navegación principal con links y modo oscuro
- **Footer.tsx** - Pie de página con información de contacto y redes sociales
- **ProductCard.tsx** - Card para mostrar productos en grids
- **LoginModal.tsx** - Modal de autenticación para administradores
- **ReferencesSection.tsx** - Sección de referencias y testimonios

### `/pages`
Páginas completas de la aplicación:
- **Home.tsx** - Landing page con productos destacados
- **Shop.tsx** - Catálogo completo con búsqueda y filtros
- **ShopCategory.tsx** - Vista de productos por categoría
- **ProductDetail.tsx** - Página de detalle de producto individual
- **Tips.tsx** - Blog con consejos sobre minerales
- **TipDetail.tsx** - Vista detallada de un tip específico
- **Category.tsx** - Vista general de categorías
- **Admin.tsx** - Panel de administración (protegido)

### `/services`
Servicios y utilidades:
- **dataService.ts** - Funciones para comunicación con la API backend

### Archivos raíz
- **App.tsx** - Componente principal con routing
- **index.tsx** - Entry point de la aplicación
- **types.ts** - Definiciones TypeScript (Product, Tip, etc.)

## 🎨 Estilo
- **Tailwind CSS** - Framework de utilidades
- **Dark Mode** - Soporte para tema oscuro
- **Responsive** - Diseño mobile-first

## 🔗 Importaciones
Usa alias `@/` para importaciones absolutas:
```tsx
import { Product } from '@/types';
import { Navbar } from '@/components/Navbar';
```
