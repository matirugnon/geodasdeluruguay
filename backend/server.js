require('dotenv').config();
const express = require('express');
const cors = require('cors');
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

// Middleware
const corsOptions = {
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
};
app.use(cors(corsOptions));
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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});