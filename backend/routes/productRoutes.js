const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
    getProducts,
    getAdminProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

// @desc    Fetch all visible products (Public)
// @route   GET /api/products
router.get('/', getProducts);

// @desc    Fetch all products (Admin - includes hidden)
// @route   GET /api/products/admin
router.get('/admin', protect, admin, getAdminProducts);

// @desc    Fetch single product
// @route   GET /api/products/:id
router.get('/:id', getProductById);

// @desc    Create a product
// @route   POST /api/products
router.post('/', protect, admin, createProduct);

// @desc    Update a product
// @route   PUT /api/products/:id
router.put('/:id', protect, admin, updateProduct);

// @desc    Delete a product
// @route   DELETE /api/products/:id
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;