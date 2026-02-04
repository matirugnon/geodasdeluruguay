const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { protect, admin } = require('../middleware/authMiddleware');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer configurado para guardar en memoria
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Límite 5MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|webp/;
        const mimetype = allowedTypes.test(file.mimetype);
        const extname = allowedTypes.test(file.originalname.toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Solo se permiten imágenes (jpg, png, webp)'));
    }
});

router.post('/', protect, admin, upload.single('image'), async (req, res) => {
    console.log('--- Upload Request ---');
    console.log('req.file:', req.file);
    console.log('Cloudinary config:', {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY ? '***configured***' : 'MISSING',
        api_secret: process.env.CLOUDINARY_API_SECRET ? '***configured***' : 'MISSING'
    });
    
    try {
        if (!req.file) {
            console.log('ERROR: No file provided');
            return res.status(400).json({ message: 'No se proporcionó ninguna imagen' });
        }

        console.log('Starting Cloudinary upload...');
        
        // Subir a Cloudinary usando v2 API
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'geodas-uruguay',
                    resource_type: 'image'
                },
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary upload error:', error);
                        reject(error);
                    } else {
                        console.log('Cloudinary upload success:', result.secure_url);
                        resolve(result);
                    }
                }
            );

            uploadStream.end(req.file.buffer);
        });

        console.log('Sending response with URL:', result.secure_url);
        res.json({ url: result.secure_url });
    } catch (error) {
        console.error('Error al subir imagen a Cloudinary:', error);
        res.status(500).json({
            message: 'Error al subir la imagen',
            error: error.message
        });
    }
});

module.exports = router;