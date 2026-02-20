# Geodas del Uruguay - E-Commerce de Cristales y Minerales

## 📌 Descripción

Plataforma e-commerce full-stack especializada en la venta de geodas, cristales y joyería artesanal uruguaya. Sistema completo con catálogo de productos, gestión de inventario, blog de tips sobre cristales, panel administrativo y autenticación segura.

## 🎯 Características Principales

### Frontend
- **Catálogo Dinámico**: Navegación por categorías (Collares, Anillos, Brazaletes, Piedras, Accesorios)
- **Búsqueda en Tiempo Real**: Motor de búsqueda con autocompletado y resultados instantáneos
- **Páginas de Producto**: Vistas detalladas con galería de imágenes, especificaciones y metadatos
- **Blog de Tips**: Sistema de artículos sobre cristales, propiedades y cuidados
- **Diseño Responsive**: Optimizado para móviles, tablets y desktop
- **UX Avanzada**: 
  - Navbar transparente en home con scroll detection
  - Animaciones suaves con Tailwind transitions
  - Skeleton loading states
  - Dark mode preparado
- **Panel Administrativo**: 
  - CRUD completo de productos
  - Gestión de tips/artículos
  - Toggle de visibilidad de productos
  - Upload múltiple de imágenes a Cloudinary
  - Validación de formularios en tiempo real

### Backend
- **API RESTful**: 8 endpoints principales organizados por recursos
- **Autenticación JWT**: Sistema seguro con tokens de 7 días de expiración
- **Rate Limiting**: Protección contra brute force (5 intentos/15min)
- **Upload de Imágenes**: Integración con Cloudinary para almacenamiento en la nube
- **Seguridad Robusta**:
  - CORS estricto con whitelist de orígenes
  - Security headers (X-Frame-Options, X-Content-Type-Options, HSTS)
  - Validación de inputs en backend y frontend
  - Sanitización de datos
  - Passwords hasheados con bcrypt
- **Base de Datos**: MongoDB con Mongoose ODM
  - Schema de productos con specs técnicas
  - Sistema de categorías
  - Tags para filtrado
  - Control de stock e inventario

## 🛠️ Stack Tecnológico

### Frontend
| Tecnología | Versión | Uso |
|------------|---------|-----|
| **React** | 19.2.3 | Framework UI principal |
| **TypeScript** | 5.8.2 | Tipado estático |
| **React Router** | 7.12.0 | Navegación SPA |
| **Vite** | 6.2.0 | Build tool y dev server |
| **Tailwind CSS** | - | Styling + Typography plugin |

### Backend
| Tecnología | Versión | Uso |
|------------|---------|-----|
| **Node.js** | - | Runtime JavaScript |
| **Express** | 4.18.2 | Framework web |
| **MongoDB** | 7.0.0 | Base de datos NoSQL |
| **Mongoose** | 7.6.3 | ODM para MongoDB |
| **JWT** | 9.0.2 | Autenticación |
| **bcryptjs** | 2.4.3 | Hashing de passwords |
| **Cloudinary** | 2.9.0 | Storage de imágenes |
| **Multer** | 2.0.2 | Upload de archivos |
| **CORS** | 2.8.5 | Cross-Origin Resource Sharing |

### DevOps & Deployment
| Herramienta | Uso |
|-------------|-----|
| **Vercel** | Hosting frontend |
| **Render** | Hosting backend (Node.js) |
| **MongoDB Atlas** | Database cloud |
| **Cloudinary** | CDN de imágenes |
| **Git** | Control de versiones |
| **Nodemon** | Hot reload en desarrollo |
| **Concurrently** | Ejecución paralela dev servers |

## 📁 Arquitectura del Proyecto

```
geodas-del-uruguay/
├── src/                          # Frontend React + TypeScript
│   ├── components/               # Componentes reutilizables
│   │   ├── Navbar.tsx           # Navegación con búsqueda
│   │   ├── Footer.tsx
│   │   ├── ProductCard.tsx
│   │   └── LoginModal.tsx       # Modal de autenticación
│   ├── pages/                    # Páginas principales
│   │   ├── Home.tsx             # Landing page
│   │   ├── Shop.tsx             # Catálogo principal
│   │   ├── ShopCategory.tsx     # Productos por categoría
│   │   ├── ProductDetail.tsx    # Detalle de producto
│   │   ├── Tips.tsx             # Blog de artículos
│   │   ├── TipDetail.tsx        # Artículo individual
│   │   └── Admin.tsx            # Panel administrativo
│   ├── services/
│   │   └── dataService.ts       # API client service
│   ├── types.ts                 # TypeScript interfaces
│   └── App.tsx                  # Router principal
│
├── backend/                      # API Node.js + Express
│   ├── config/
│   │   └── db.js                # Conexión MongoDB
│   ├── models/                   # Schemas Mongoose
│   │   ├── Product.js           # Modelo de productos
│   │   ├── User.js              # Modelo de usuarios
│   │   ├── Tip.js               # Modelo de artículos
│   │   └── Category.js
│   ├── controllers/              # Lógica de negocio
│   │   └── productController.js
│   ├── routes/                   # Endpoints API
│   │   ├── productRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── tipRoutes.js
│   │   └── uploadRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js    # Verificación JWT
│   └── server.js                # Entry point
│
├── docs/                         # Documentación
│   ├── SECURITY_AUDIT.md        # Auditoría de seguridad
│   └── seo.md                   # Estrategia SEO
│
├── vite.config.ts               # Configuración Vite
├── tsconfig.json                # TypeScript config
├── vercel.json                  # Deploy config
└── package.json                 # Dependencies
```

## 🔐 Seguridad Implementada

### Puntuación: 8.4/10 según auditoría OWASP

**Medidas Implementadas:**
1. ✅ Rate limiting anti brute-force (5 intentos/15min)
2. ✅ CORS estricto con whitelist cerrada
3. ✅ Security headers (HSTS, X-Frame-Options, CSP, etc.)
4. ✅ JWT con expiración de 7 días
5. ✅ Validación de inputs (frontend + backend)
6. ✅ Sanitización de datos de usuario
7. ✅ Passwords hasheados con bcrypt (10 rounds)
8. ✅ .gitignore completo (protección de secrets)
9. ✅ Validación de tokens en cliente y servidor
10. ✅ Prevention de NoSQL injection vía Mongoose

**Compliance:**
- OWASP Top 10 2021
- Broken Access Control ✅
- Cryptographic Failures ✅
- Injection ✅
- Security Misconfiguration ✅
- Authentication Failures ✅

## 🌐 Deployment

### URLs
- **Frontend**: `https://geodasdeluruguay.vercel.app`
- **Backend**: `https://geodas-backend.onrender.com`
- **Database**: MongoDB Atlas (cluster privado)

### Pipeline de Deployment
1. **Desarrollo Local**: 
   - Frontend: `npm run dev` (Vite dev server en puerto 3000)
   - Backend: `npm run dev` (Nodemon en puerto 5000)
   - Comando único: `npm run dev:all` (ambos servidores concurrentes)

2. **Build**:
   - Frontend: `vite build` → genera carpeta `dist/`
   - Backend: No build necesario (Node.js runtime)

3. **Deploy Automático**:
   - Vercel: Git push → auto-deploy frontend
   - Render: Git push → auto-deploy backend
   - Zero downtime deployment

### Variables de Entorno
```env
# Backend
MONGO_URI=mongodb+srv://...
JWT_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
NODE_ENV=production
FRONTEND_URL=https://geodasdeluruguay.vercel.app

# Frontend
VITE_API_URL=/api
```

## 📊 Base de Datos - Estructura

### Colecciones MongoDB

**Products**
```javascript
{
  title: String,
  description: String,
  price: Number,
  category: String,           // Collares, Anillos, Brazaletes, Piedras, Otros Accesorios
  images: [String],           // Cloudinary URLs
  specs: {
    weight: Number,
    dimensions: String,
    origin: String            // Default: "Uruguay"
  },
  tags: [String],             // Para búsqueda
  stock: Number,
  visible: Boolean,           // Control de publicación
  isNewProduct: Boolean,
  type: String,
  timestamps: true            // createdAt, updatedAt
}
```

**Users** (Admin)
```javascript
{
  username: String,
  password: String,           // bcrypt hashed
  isAdmin: Boolean,
  timestamps: true
}
```

**Tips** (Blog)
```javascript
{
  title: String,
  content: String,
  slug: String,
  images: [String],
  timestamps: true
}
```

## 🚀 Funcionalidades Destacadas

### 1. Sistema de Búsqueda Inteligente
- Búsqueda en tiempo real con debounce (300ms)
- Resultados destacados con preview
- Navegación directa desde resultados
- Mobile-friendly

### 2. Gestión de Imágenes con Cloudinary
- Upload múltiple
- Optimización automática
- Transformaciones on-the-fly
- CDN global

### 3. Panel Admin Completo
- Login seguro con JWT
- CRUD de productos
- Gestión de tips
- Toggle visibilidad
- Preview en tiempo real

### 4. UX Profesional
- Navbar transparente en home
- Animaciones fluidas
- Loading states
- Error handling
- Mobile-first design

## 📈 Performance

### Optimizaciones
- Lazy loading de imágenes
- Code splitting con React Router
- Vite para build ultra-rápido
- Cloudinary CDN para assets
- MongoDB indexing en campos críticos

### Métricas
- First Contentful Paint: <2s
- Time to Interactive: <3s
- Bundle size optimizado con tree-shaking

## 🧪 Testing & Calidad

- TypeScript para type safety
- ESLint configurado
- Validación de inputs en ambos lados
- Error boundaries en React
- Logging estructurado

## 📝 Aprendizajes Clave

### Técnicos
- Implementación de autenticación JWT full-stack
- Manejo de uploads a Cloudinary
- Rate limiting y seguridad web
- Deployment en servicios cloud
- Integración MongoDB con Mongoose

### Arquitectura
- Separación frontend/backend
- RESTful API design
- Component composition en React
- State management sin Redux
- TypeScript en proyectos React

### DevOps
- CI/CD con Git + Vercel + Render
- Variables de entorno por ambiente
- Seguridad en deployment
- Monitoring básico

## 🔮 Roadmap Futuro

- [ ] Carrito de compras completo
- [ ] Pasarela de pago (MercadoPago/Stripe)
- [ ] Sistema de usuarios registrados
- [ ] Wishlist
- [ ] Sistema de reviews
- [ ] Paginación en productos
- [ ] Filtros avanzados
- [ ] Newsletter
- [ ] Analytics dashboard
- [ ] PWA capabilities

## 👨‍💻 Desarrollador

**Matías Rugnone**  
Full-Stack Developer

## 🔗 Enlaces

- **Live Demo**: [geodasdeluruguay.vercel.app](https://geodasdeluruguay.vercel.app)
- **Repositorio**: [GitHub](tu-repo-url)
- **API Docs**: Disponible en `/api`

---

## 📸 Screenshots & Features Showcase

### Home Page
- Hero fullscreen con imagen de fondo
- Sección de productos destacados
- Call-to-action al catálogo
- Grid de categorías

### Shop
- Catálogo completo de productos
- Cards con hover effects
- Links a páginas de categoría
- Diseño en grid responsivo

### Panel Admin
- Dashboard de gestión
- Formularios validados
- Preview de productos
- Upload de imágenes drag & drop

### Mobile Experience
- Menú hamburguesa
- Navegación optimizada
- Touch-friendly
- Performance mantenida

---

**Etiquetas**: `E-commerce` `Full-Stack` `React` `TypeScript` `Node.js` `Express` `MongoDB` `Cloudinary` `JWT` `Tailwind CSS` `Vercel` `Render` `REST API` `MERN Stack`

**Dificultad**: Avanzado  
**Duración del Proyecto**: ~3-4 semanas  
**Tipo**: Proyecto Personal / Freelance  
**Estado**: ✅ Producción
