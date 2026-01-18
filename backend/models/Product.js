const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    category: {
        type: String,
        required: true
    },
    images: [{
        type: String // Cloudinary URLs
    }],
    specs: {
        weight: { type: Number, default: 0 },
        dimensions: { type: String, default: '' },
        origin: { type: String, default: 'Uruguay' }
    },
    tags: [{
        type: String
    }],
    stock: {
        type: Number,
        required: true,
        default: 1
    },
    visible: {
        type: Boolean,
        default: true
    },
    isNewProduct: {
        type: Boolean,
        default: false
    },
    type: {
        type: String, // 'Catedral', 'Drusa', etc.
        default: 'Pieza'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);