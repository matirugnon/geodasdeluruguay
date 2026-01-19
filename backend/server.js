require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// Routes
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const tipRoutes = require('./routes/tipRoutes');
const adminRoutes = require('./routes/adminRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Security: Headers de seguridad
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
});

// Middleware
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://geodasdeluruguay.vercel.app'
];

const corsOptions = {
    origin: function (origin, callback) {
        // Permitir peticiones sin origin (como Postman) en desarrollo
        if (!origin && process.env.NODE_ENV !== 'production') {
            return callback(null, true);
        }
        
        // Validar que el origin esté exactamente en la lista
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

const path = require('path');

// Root route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Geodas del Uruguay API',
        status: 'running',
        endpoints: {
            products: '/api/products',
            categories: '/api/categories',
            tips: '/api/tips',
            admin: '/api/admin',
            health: '/api/health'
        }
    });
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tips', tipRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Health Check (UptimeRobot)
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Access from network: http://<your-local-ip>:${PORT}`);
});