# 📋 Estructura y Organización del Proyecto

## 🎯 Filosofía de Organización

El proyecto sigue una arquitectura **separada y modular**:

```
Frontend (src/)  ←→  Backend (backend/)  ←→  MongoDB Atlas
      ↓                    ↓
   Vercel            Vercel/Railway
```

## 📦 Convenciones de Carpetas

### ✅ DO (Hacer)
- ✓ Coloca componentes React en `src/components/`
- ✓ Crea nuevas páginas en `src/pages/`
- ✓ Define tipos TypeScript en `src/types.ts`
- ✓ Agrega utilidades en `src/services/`
- ✓ Documentación técnica en `docs/`
- ✓ Archivos de configuración en la raíz

### ❌ DON'T (Evitar)
- ✗ No mezcles archivos de backend y frontend
- ✗ No crees carpetas en la raíz innecesariamente
- ✗ No dupliques lógica entre servicios
- ✗ No pongas código en `index.html`

## 🔄 Flujo de Datos

```
Usuario → Página (src/pages/) 
          ↓
       Componente (src/components/)
          ↓
       Servicio (src/services/dataService.ts)
          ↓
       API Backend (/api/...)
          ↓
       Controlador (backend/controllers/)
          ↓
       Modelo (backend/models/)
          ↓
       MongoDB
```

## 📝 Naming Conventions

### Archivos
- **Componentes React**: `PascalCase.tsx` → `ProductCard.tsx`
- **Páginas**: `PascalCase.tsx` → `ProductDetail.tsx`
- **Servicios**: `camelCase.ts` → `dataService.ts`
- **Tipos**: `types.ts`
- **Config**: `kebab-case` → `vite.config.ts`

### Carpetas
- **Minúsculas**: `components/`, `pages/`, `services/`
- **Descriptivas**: Nombres claros y concisos

## 🚀 Ampliación del Proyecto

### Agregar un nuevo componente
```bash
# 1. Crear archivo
src/components/NuevoComponente.tsx

# 2. Importar en página
import { NuevoComponente } from '@/components/NuevoComponente';
```

### Agregar una nueva página
```bash
# 1. Crear archivo
src/pages/NuevaPagina.tsx

# 2. Agregar ruta en App.tsx
<Route path="/nueva" element={<NuevaPagina />} />
```

### Agregar un nuevo modelo (backend)
```bash
# 1. Crear modelo
backend/models/NuevoModelo.js

# 2. Crear controlador
backend/controllers/nuevoController.js

# 3. Crear rutas
backend/routes/nuevoRoutes.js

# 4. Registrar en server.js
```

## 📖 Recursos Adicionales

- [src/README.md](src/README.md) - Documentación del frontend
- [docs/README.md](docs/README.md) - Documentación técnica y estratégica
- [SECURITY.md](SECURITY.md) - Guía de seguridad
- [docs/seo.md](docs/seo.md) - Estrategia SEO

## 🤝 Contribuir

1. Sigue las convenciones establecidas
2. Documenta nuevas funcionalidades
3. Mantén la estructura organizada
4. Prueba antes de hacer commit
