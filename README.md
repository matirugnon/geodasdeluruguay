# Geodas del Uruguay

E-commerce full-stack para la venta de geodas, minerales y accesorios en Uruguay.

- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express + MongoDB (Mongoose)
- Media: Cloudinary
- Pagos: Mercado Pago + transferencia bancaria

## Estado actual

Este repositorio contiene:

- Tienda pública (`/`, `/tienda`, `/producto/:slug`, `/tips`, `/checkout`)
- API REST para catálogo, tips, auth admin, uploads, pagos y SEO
- Checkout productivo con Mercado Pago (redirect + webhook + verificación)
- Flujo alternativo por transferencia (con 5% de descuento)

Nota: en este repo no existe una ruta UI `/admin`; la administración se hace por endpoints protegidos y/o cliente admin externo.

## Stack

### Frontend

- React 19
- TypeScript
- React Router DOM 7
- Tailwind CSS
- Vite 6
- Framer Motion

### Backend

- Node.js + Express 4
- MongoDB + Mongoose
- JWT + bcryptjs
- Multer + Cloudinary
- Mercado Pago SDK
- Nodemailer

## Estructura

```txt
geodasdeluruguay/
├─ backend/
│  ├─ config/
│  ├─ controllers/
│  ├─ middleware/
│  ├─ models/
│  ├─ routes/
│  ├─ utils/
│  ├─ .env.example
│  ├─ createAdmin.js
│  ├─ seeder.js
│  └─ server.js
├─ src/
│  ├─ components/
│  ├─ context/
│  ├─ pages/
│  ├─ services/
│  └─ utils/
├─ docs/
├─ docker-compose.yml
├─ vercel.json
└─ README.md
```

## Requisitos

- Node.js 18+ (recomendado)
- MongoDB local o Atlas
- Cuenta de Cloudinary
- Cuenta de Mercado Pago (credenciales de integración)

## Variables de entorno

### Backend (`backend/.env`)

Basado en `backend/.env.example` y en el código actual:

```env
# Database
MONGO_URI=

# Auth
JWT_SECRET=

# Backend
NODE_ENV=development
PORT=5000

# CORS / URLs
FRONTEND_URL=http://localhost:5173
STOREFRONT_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Mercado Pago
MP_ACCESS_TOKEN=
MP_PUBLIC_KEY=

# Email (opcional pero recomendado)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
STORE_NAME=Geodas del Uruguay
STORE_EMAIL=
OWNER_EMAIL=
```

### Frontend (opcional)

Solo si necesitás sobreescribir el proxy/default:

```env
VITE_API_URL=
```

## Instalación

1. Instalar dependencias del frontend:

```bash
npm install
```

2. Instalar dependencias del backend:

```bash
cd backend
npm install
cd ..
```

3. Configurar `backend/.env`.

## Desarrollo

### Opción A: dos terminales

Terminal 1 (frontend):

```bash
npm run dev
```

Terminal 2 (backend):

```bash
npm run dev:backend
```

### Opción B: todo junto

```bash
npm run dev:all
```

## Scripts

### Raíz

- `npm run dev`: frontend Vite
- `npm run dev:backend`: backend con nodemon
- `npm run dev:all`: frontend + backend concurrente
- `npm run build`: build frontend
- `npm run preview`: preview build frontend

### `backend/`

- `npm run dev`: backend con nodemon
- `npm start`: backend en modo producción
- `npm run seed`: limpia y carga datos iniciales

## Seed y usuario admin

Para poblar datos de ejemplo:

```bash
cd backend
npm run seed
```

Credenciales admin creadas por seed:

- `username`: `admin`
- `password`: `admin123`

## Pasarela de pagos (implementada)

### Mercado Pago

Flujo actual:

1. Frontend crea preferencia: `POST /api/payments/create-preference`
2. Backend guarda orden en estado `pending`
3. Cliente paga en Mercado Pago (redirect `checkout_url`)
4. Mercado Pago notifica webhook: `POST /api/payments/webhook`
5. Backend valida estado/monto y marca orden `paid`
6. Frontend puede verificar retorno: `GET /api/payments/verify-payment?payment_id=...`

Detalles relevantes:

- Moneda: `UYU`
- `external_reference` se vincula con `_id` de `Order`
- Se usa idempotency key al crear preferencia
- Emails de confirmación al cliente/dueño cuando se confirma pago

### Transferencia bancaria

Flujo alternativo:

1. Frontend crea orden: `POST /api/payments/create-transfer-order`
2. Orden queda en `awaiting_transfer`
3. Cliente envía comprobante por WhatsApp
4. Confirmación manual posterior

Reglas implementadas:

- 5% de descuento por transferencia
- Costo de envío por transferencia:
  - `delivery`: $100 UYU (gratis desde $5000)
  - `pickup`: $0

## API (resumen)

- `GET /api/health`
- `GET /api/products`
- `GET /api/products/:idOrSlug`
- `GET /api/products/admin` (protegida)
- `POST /api/products` (protegida)
- `PUT /api/products/:id` (protegida)
- `DELETE /api/products/:id` (protegida)
- `GET /api/categories`
- `GET /api/tips`
- `GET /api/tips/:slugOrId`
- `POST /api/tips` (protegida)
- `PUT /api/tips/:id` (protegida)
- `DELETE /api/tips/:id` (protegida)
- `POST /api/admin/login`
- `GET /api/admin/verify`
- `POST /api/admin/logout`
- `POST /api/upload` (protegida)
- `POST /api/payments/create-preference`
- `POST /api/payments/create-transfer-order`
- `POST /api/payments/webhook`
- `GET /api/payments/verify-payment`
- `GET /api/seo/sitemap.xml`
- `GET /api/seo/robots.txt`

## Deploy

Configuración actual:

- Frontend: Vercel
- Backend: Render (`https://geodas-backend.onrender.com`)
- Rewrites en `vercel.json`:
  - `/api/*` -> backend Render
  - `/sitemap.xml` y `/robots.txt` -> backend SEO endpoints

Importante para Mercado Pago:

- `BACKEND_URL` debe ser una URL pública accesible para webhook.
- `STOREFRONT_URL` debe apuntar al dominio real del frontend para redirects de pago.

## Docker (opcional)

Levantar servicios con Docker Compose:

```bash
docker compose up --build
```

Servicios:

- Frontend en `5173`
- Backend en `5000`

## Seguridad

- JWT para endpoints protegidos
- Rate limit básico en login admin (5 intentos / 15 min por IP)
- CORS con allowlist explícita en `backend/server.js`
- Headers de seguridad en Express
- Variables sensibles por entorno

## Documentación adicional

- `docs/seo.md`
- `docs/SECURITY_AUDIT.md`
- `docs/metadata.json`

## Licencia

MIT (`LICENSE`).
