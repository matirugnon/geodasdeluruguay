const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    items: [{
        id: { type: String, required: true },
        title: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
    }],
    subtotal: {
        type: Number,
        required: true
    },
    shippingCost: {
        type: Number,
        required: true,
        default: 0
    },
    total: {
        type: Number,
        required: true
    },
    shipping: {
        nombre: { type: String, required: true },
        email: { type: String, required: true },
        telefono: { type: String, required: true },
        direccion: { type: String },
        ciudad: { type: String },
        departamento: { type: String },
        codigoPostal: { type: String }
    },
    deliveryMethod: {
        type: String,
        enum: ['pickup', 'delivery'],
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['mercadopago', 'transfer'],
        default: 'mercadopago'
    },
    discount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'awaiting_transfer', 'cancelled'],
        default: 'pending'
    },
    paymentId: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', orderSchema);
