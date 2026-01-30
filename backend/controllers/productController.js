const Product = require('../models/Product');

// @desc    Fetch all visible products (Public)
// @route   GET /api/products
// @route   GET /api/products?category=collares
const getProducts = async (req, res) => {
    try {
        // Construir filtros dinámicos
        const filters = { visible: true };
        
        // Si hay categoría en query params, agregarla al filtro
        if (req.query.category) {
            filters.category = req.query.category;
        }
        
        const products = await Product.find(filters);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Fetch all products (Admin - includes hidden)
// @route   GET /api/products/admin
const getAdminProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        console.error('Error fetching admin products:', error);
        res.status(500).json({ 
            message: 'Error al obtener productos',
            error: error.message 
        });
    }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(400).json({ 
            message: 'Error al obtener el producto',
            error: error.message 
        });
    }
};

// @desc    Create a product
// @route   POST /api/products
const createProduct = async (req, res) => {
    console.log('--- Create Product Request START ---');
    console.log('Request Body:', JSON.stringify(req.body, null, 2));

    try {
        const product = new Product(req.body);
        console.log('Product Instance created, attempting save...');

        const createdProduct = await product.save();
        console.log('Product saved successfully:', createdProduct._id);
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error('CRITICAL ERROR during product save:');
        console.error('Error Name:', error.name);
        console.error('Error Message:', error.message);
        if (error.errors) {
            console.error('Validation Errors:', JSON.stringify(error.errors, null, 2));
        }
        console.error('Stack Trace:', error.stack);

        res.status(400).json({
            message: 'Error al crear el producto',
            error: error.message,
            details: error.errors ? Object.keys(error.errors) : undefined
        });
    }
    console.log('--- Create Product Request END ---');
};

// @desc    Update a product
// @route   PUT /api/products/:id
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            Object.assign(product, req.body);
            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(400).json({ 
            message: 'Error al actualizar el producto',
            error: error.message 
        });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            // TODO: Logic to delete images from Cloudinary using public_id extracted from URLs
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(400).json({ 
            message: 'Error al eliminar el producto',
            error: error.message 
        });
    }
};

module.exports = {
    getProducts,
    getAdminProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
