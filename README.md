# 🪨 Geodas del Uruguay - E-commerce Platform

<div align="center">

![Geodas del Uruguay](https://img.shields.io/badge/Status-Production-success)
![React](https://img.shields.io/badge/React-19.2-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![License](https://img.shields.io/badge/License-MIT-yellow)

**Plataforma de comercio electrónico para un emprendimiento local uruguayo dedicado a la venta de geodas, minerales y cristales.**

🔗 [Instagram: @geodasdeluruguay](https://www.instagram.com/geodasdeluruguay/?hl=es-la)

</div>

---

## 📋 Descripción del Proyecto

GeodasdelUruguay es una aplicación web full-stack desarrollada como solución digital para un emprendimiento local uruguayo especializado en la comercialización de geodas, minerales y cristales naturales. La plataforma permite a los clientes explorar el catálogo de productos, conocer tips sobre cuidado de minerales, y gestionar el inventario de forma eficiente.

### 🎯 Motivación

Este proyecto nace de un trabajo de consultoría personalizada con la emprendedora detrás de Geodas del Uruguay. El objetivo principal fue digitalizar su negocio, proporcionándole una presencia web profesional que le permita:

- 📱 Mostrar su catálogo de productos de forma atractiva y organizada
- 🔍 Facilitar la búsqueda y exploración de productos por categorías
- 📚 Compartir conocimiento sobre geodas y minerales a través de tips educativos
- 🛠️ Administrar su inventario de manera simple y eficiente
- 🌐 Expandir su alcance más allá de las redes sociales

### 💼 Trabajo de Consultoría

El desarrollo incluyó:
- Sesiones de análisis de requisitos con la emprendedora
- Diseño de la arquitectura de información basada en sus necesidades
- Capacitación para el uso del panel administrativo
- Implementación de funcionalidades específicas para su modelo de negocio
- Optimización SEO para mejorar la visibilidad online

---

## 🚀 Stack Tecnológico

### Frontend
- **React 19.2** - Biblioteca UI con hooks modernos
- **TypeScript** - Tipado estático para mayor robustez
- **React Router DOM** - Navegación SPA
- **Tailwind CSS** - Estilos utilitarios y diseño responsive
- **Vite** - Build tool y dev server ultrarrápido

### Backend
- **Node.js** - Runtime de JavaScript
- **Express 4.18** - Framework web minimalista
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación y autorización
- **Bcrypt.js** - Hashing de contraseñas
- **Cloudinary** - Gestión y hosting de imágenes
- **Multer** - Manejo de uploads de archivos

### DevOps & Deployment
- **Vercel** - Hosting y deployment automático
- **MongoDB Atlas** - Base de datos en la nube
- **Git** - Control de versiones

---

## 📁 Estructura del Proyecto

```
geodas-del-uruguay/
├── backend/                # 🔧 API Server (Express + MongoDB)
│   ├── config/             # Configuración de DB
│   ├── controllers/        # Lógica de negocio
│   ├── middleware/         # Auth middleware
│   ├── models/             # Modelos de Mongoose (User, Product, Category, Tip)
│   ├── routes/             # Rutas API REST
│   └── server.js           # Entry point del servidor
│
├── src/                    # 💻 Frontend (React + TypeScript)
│   ├── components/         # Componentes reutilizables
│   │   ├── Navbar.tsx      # Barra de navegación
│   │   ├── Footer.tsx      # Pie de página
│   │   ├── ProductCard.tsx # Card de producto
│   │   └── ...
│   ├── pages/              # Páginas de la aplicación
│   │   ├── Home.tsx        # Página principal
│   │   ├── Shop.tsx        # Catálogo de productos
│   │   ├── ProductDetail.tsx
│   │   ├── Tips.tsx        # Blog de consejos
│   │   ├── Admin.tsx       # Panel administrativo
│   │   └── ...
│   ├── services/           # Servicios y API calls
│   │   └── dataService.ts  # Integración con backend
│   ├── App.tsx             # Componente raíz
│   ├── index.tsx           # Entry point
│   └── types.ts            # Tipos TypeScript
│
├── docs/                   # 📚 Documentación
│   ├── seo.md              # Estrategia SEO
│   ├── SECURITY_AUDIT.md   # Auditoría de seguridad
│   └── metadata.json       # Metadata del proyecto
│
├── index.html              # HTML template
├── vite.config.ts          # Configuración de Vite
├── tsconfig.json           # Configuración TypeScript
├── vercel.json             # Configuración de deployment
├── package.json            # Dependencias del proyecto
├── .gitignore              # Archivos ignorados por Git
├── README.md               # Este archivo
├── CONTRIBUTING.md         # Guía de contribución
├── LICENSE                 # Licencia MIT
└── SECURITY.md             # Guía de seguridad
```

> 💡 **Nota**: El proyecto sigue una **arquitectura modular y organizada**. Todo el código frontend está en `src/`, la documentación técnica en `docs/`, y el backend en su propia carpeta separada. Ver [CONTRIBUTING.md](CONTRIBUTING.md) para más detalles sobre la estructura.

---

## 🔧 Instalación y Configuración

### Prerrequisitos
- Node.js (v16 o superior)
- MongoDB (local o Atlas)
- Cuenta de Cloudinary (para imágenes)

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/geodas-del-uruguay.git
cd geodas-del-uruguay
```

### 2. Instalar dependencias

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd backend
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la carpeta `backend/` con las siguientes variables:

```env
# MongoDB
MONGO_URI=tu_mongodb_connection_string

# JWT Secret
JWT_SECRET=tu_secret_key_super_segura

# Cloudinary (para imágenes)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Server
NODE_ENV=development
PORT=5000
```

### 4. Ejecutar el proyecto

**Modo desarrollo (Frontend + Backend):**
```bash
npm run dev
```

**Solo Backend:**
```bash
cd backend
npm run dev
```

**Solo Frontend:**
```bash
npm run dev
```

### 5. Sembrar la base de datos (opcional)
```bash
cd backend
npm run seed
```

---

## 🌟 Características Principales

### Para Clientes
- 🏠 **Página de inicio** con productos destacados
- 🛍️ **Catálogo completo** de productos con búsqueda y filtros
- 📂 **Categorías** organizadas (Geodas, Cuarzos, Amatistas, etc.)
- 🔎 **Vista detallada** de cada producto con múltiples imágenes
- 💡 **Sección de Tips** con información educativa sobre minerales
- 📱 **Diseño responsive** optimizado para móviles

### Para Administradores
- 🔐 **Panel de administración** con autenticación segura
- ➕ **Crear, editar y eliminar** productos
- 🏷️ **Gestión de categorías** y tips
- 🖼️ **Upload de imágenes** a Cloudinary
- 📊 **Dashboard** para visualizar el inventario

---

## 🚀 Deployment

El proyecto está configurado para desplegarse en **Vercel**:

1. Conecta tu repositorio de GitHub con Vercel
2. Configura las variables de entorno en el dashboard de Vercel
3. El deploy se hará automáticamente en cada push a `main`

El archivo `vercel.json` ya incluye la configuración necesaria para el routing SPA.

---

## 📝 Scripts Disponibles

### Frontend
- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Preview de la build de producción

### Backend
- `npm run dev` - Servidor con hot-reload (nodemon)
- `npm start` - Servidor en modo producción
- `npm run seed` - Poblar la base de datos con datos de ejemplo

---

## 🔐 Seguridad

- ✅ Autenticación JWT con cookies HTTP-only
- ✅ Passwords hasheados con bcrypt
- ✅ Variables de entorno para datos sensibles
- ✅ CORS configurado apropiadamente
- ✅ Validación de datos en backend
- ✅ Protección de rutas de administración

---

## 🤝 Contribuciones

Este es un proyecto privado desarrollado para un cliente específico. Si encuentras algún bug o tienes sugerencias, no dudes en abrir un issue.

---

## 📄 Licencia

MIT License - Ver archivo [LICENSE](LICENSE) para más detalles.

---

## 👤 Autor

Desarrollado con ❤️ para **Geodas del Uruguay**

📷 Instagram: [@geodasdeluruguay](https://www.instagram.com/geodasdeluruguay/?hl=es-la)

---

## 🙏 Agradecimientos

Gracias a la emprendedora de Geodas del Uruguay por confiar en este proyecto y por su dedicación a compartir la belleza de los minerales naturales.

---

<div align="center">

**¿Te gustó el proyecto? Dale una ⭐ al repositorio!**

</div>
