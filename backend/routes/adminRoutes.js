const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Rate limiting para prevenir brute force
const loginAttempts = new Map();

const rateLimiter = (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const attempts = loginAttempts.get(ip) || { count: 0, resetTime: now };
    
    // Reset después de 15 minutos
    if (now > attempts.resetTime) {
        attempts.count = 0;
        attempts.resetTime = now + 15 * 60 * 1000;
    }
    
    // Máximo 5 intentos en 15 minutos
    if (attempts.count >= 5) {
        return res.status(429).json({ 
            message: 'Demasiados intentos de inicio de sesión. Intenta de nuevo en 15 minutos.' 
        });
    }
    
    attempts.count++;
    loginAttempts.set(ip, attempts);
    next();
};

// @desc    Auth user & get token
// @route   POST /api/admin/login
// @access  Public
router.post('/login', rateLimiter, async (req, res) => {
    const { username, password } = req.body;

    // Validación de entrada
    if (!username || !password) {
        return res.status(400).json({ message: 'Username y password son requeridos' });
    }

    if (typeof username !== 'string' || typeof password !== 'string') {
        return res.status(400).json({ message: 'Datos inválidos' });
    }

    try {
        const user = await User.findOne({ username });

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = generateToken(user._id);
            
            // Enviar token en JSON (localStorage)
            // HttpOnly cookies no funcionan cross-origin (Vercel -> Render)
            res.json({
                success: true,
                _id: user.id,
                username: user.username,
                token: token
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// @desc    Verificar si el usuario está autenticado
// @route   GET /api/admin/verify
// @access  Private
router.get('/verify', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ authenticated: false });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        
        if (user) {
            res.json({ 
                authenticated: true,
                user: {
                    _id: user._id,
                    username: user.username
                }
            });
        } else {
            res.status(401).json({ authenticated: false });
        }
    } catch (error) {
        res.status(401).json({ authenticated: false });
    }
});

// @desc    Logout user y limpiar cookie
// @route   POST /api/admin/logout
// @access  Public
router.post('/logout', (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0),
        path: '/'
    });
    res.json({ success: true, message: 'Logged out successfully' });
});

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '7d', // Reducido de 30 a 7 días
    });
};

module.exports = router;