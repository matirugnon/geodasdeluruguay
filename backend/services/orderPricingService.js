const mongoose = require('mongoose');
const Product = require('../models/Product');

const DELIVERY_METHODS = new Set(['pickup', 'delivery']);
const PAYMENT_METHODS = new Set(['mercadopago', 'transfer']);
const DELIVERY_SHIPPING_COST = 100;
const TRANSFER_DISCOUNT_RATE = 0.05;

class OrderPricingError extends Error {
    constructor(message, code, details = {}) {
        super(message);
        this.name = 'OrderPricingError';
        this.code = code;
        this.statusCode = 400;
        this.details = details;
    }
}

const emailRegex = /\S+@\S+\.\S+/;

function asTrimmedString(value) {
    return typeof value === 'string' ? value.trim() : '';
}

function isValidProductId(value) {
    if (typeof mongoose.isObjectIdOrHexString === 'function') {
        return mongoose.isObjectIdOrHexString(value);
    }

    return /^[a-f\d]{24}$/i.test(value);
}

function normalizeDeliveryMethod(deliveryMethod) {
    if (!DELIVERY_METHODS.has(deliveryMethod)) {
        throw new OrderPricingError('El método de entrega no es válido.', 'INVALID_DELIVERY_METHOD');
    }

    return deliveryMethod;
}

function normalizePaymentMethod(paymentMethod) {
    if (!PAYMENT_METHODS.has(paymentMethod)) {
        throw new OrderPricingError('El método de pago no es válido.', 'INVALID_PAYMENT_METHOD');
    }

    return paymentMethod;
}

function normalizeShipping(shipping, deliveryMethod) {
    if (!shipping || typeof shipping !== 'object' || Array.isArray(shipping)) {
        throw new OrderPricingError('Los datos de envío no son válidos.', 'INVALID_SHIPPING_PAYLOAD');
    }

    const normalizedShipping = {
        nombre: asTrimmedString(shipping.nombre),
        email: asTrimmedString(shipping.email).toLowerCase(),
        telefono: asTrimmedString(shipping.telefono),
        direccion: asTrimmedString(shipping.direccion),
        ciudad: asTrimmedString(shipping.ciudad),
        departamento: asTrimmedString(shipping.departamento),
        codigoPostal: asTrimmedString(shipping.codigoPostal),
    };

    if (!normalizedShipping.nombre) {
        throw new OrderPricingError('El nombre es obligatorio.', 'INVALID_SHIPPING_NAME');
    }

    if (!normalizedShipping.email || !emailRegex.test(normalizedShipping.email)) {
        throw new OrderPricingError('El email ingresado no es válido.', 'INVALID_SHIPPING_EMAIL');
    }

    if (!normalizedShipping.telefono || normalizedShipping.telefono.replace(/\D/g, '').length < 8) {
        throw new OrderPricingError('El teléfono ingresado no es válido.', 'INVALID_SHIPPING_PHONE');
    }

    if (deliveryMethod === 'delivery') {
        if (!normalizedShipping.direccion) {
            throw new OrderPricingError('La dirección es obligatoria para envío a domicilio.', 'INVALID_SHIPPING_ADDRESS');
        }

        if (!normalizedShipping.ciudad) {
            throw new OrderPricingError('La ciudad es obligatoria para envío a domicilio.', 'INVALID_SHIPPING_CITY');
        }

        if (!normalizedShipping.departamento) {
            throw new OrderPricingError('El departamento es obligatorio para envío a domicilio.', 'INVALID_SHIPPING_STATE');
        }
    }

    return normalizedShipping;
}

function normalizeRequestedItems(items) {
    if (!Array.isArray(items) || items.length === 0) {
        throw new OrderPricingError('El pedido debe incluir al menos un producto.', 'INVALID_ITEMS_PAYLOAD');
    }

    const requestedItems = new Map();

    items.forEach((item, index) => {
        if (!item || typeof item !== 'object' || Array.isArray(item)) {
            throw new OrderPricingError('El formato de los productos enviados no es válido.', 'INVALID_ITEM_SHAPE', { itemIndex: index });
        }

        const productId = asTrimmedString(item.productId || item.id || item._id);
        if (!productId || !isValidProductId(productId)) {
            throw new OrderPricingError('Uno de los productos enviados no es válido.', 'INVALID_PRODUCT_ID', { itemIndex: index });
        }

        const quantity = Number(item.quantity);
        if (!Number.isInteger(quantity) || quantity <= 0) {
            throw new OrderPricingError('La cantidad solicitada no es válida.', 'INVALID_QUANTITY', { itemIndex: index, productId });
        }

        const existing = requestedItems.get(productId);
        requestedItems.set(productId, {
            productId,
            quantity: (existing?.quantity || 0) + quantity,
        });
    });

    return Array.from(requestedItems.values());
}

function calculateShippingCost({ subtotal, deliveryMethod, paymentMethod }) {
    if (deliveryMethod !== 'delivery') {
        return 0;
    }

    if (paymentMethod === 'transfer') {
        return subtotal >= 5000 ? 0 : DELIVERY_SHIPPING_COST;
    }

    return DELIVERY_SHIPPING_COST;
}

async function buildSecureOrderPricing({ items, shipping, deliveryMethod, paymentMethod }) {
    const normalizedDeliveryMethod = normalizeDeliveryMethod(deliveryMethod);
    const normalizedPaymentMethod = normalizePaymentMethod(paymentMethod);
    const normalizedShipping = normalizeShipping(shipping, normalizedDeliveryMethod);
    const requestedItems = normalizeRequestedItems(items);

    const productIds = requestedItems.map((item) => item.productId);
    const products = await Product.find(
        { _id: { $in: productIds } },
        'title description price category stock visible'
    ).lean();

    const productsById = new Map(products.map((product) => [product._id.toString(), product]));

    const catalogItems = requestedItems.map(({ productId, quantity }) => {
        const product = productsById.get(productId);
        if (!product) {
            throw new OrderPricingError('Uno de los productos seleccionados ya no existe.', 'PRODUCT_NOT_FOUND', { productId });
        }

        if (product.visible === false) {
            throw new OrderPricingError('Uno de los productos seleccionados ya no está disponible para la venta.', 'PRODUCT_NOT_AVAILABLE', { productId });
        }

        const availableStock = Number(product.stock);
        if (!Number.isFinite(availableStock) || availableStock < quantity) {
            throw new OrderPricingError('No hay stock suficiente para uno de los productos seleccionados.', 'INSUFFICIENT_STOCK', {
                productId,
                availableStock: Number.isFinite(availableStock) ? availableStock : 0,
                requestedQuantity: quantity,
            });
        }

        const unitPrice = Number(product.price);
        if (!Number.isFinite(unitPrice) || unitPrice < 0) {
            throw new Error(`Invalid product price for ${productId}`);
        }

        return {
            id: product._id.toString(),
            title: product.title,
            description: product.description || product.title,
            category: product.category,
            price: unitPrice,
            quantity,
        };
    });

    const orderItems = catalogItems.map(({ id, title, price, quantity }) => ({
        id,
        title,
        price,
        quantity,
    }));

    const subtotal = orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shippingCost = calculateShippingCost({
        subtotal,
        deliveryMethod: normalizedDeliveryMethod,
        paymentMethod: normalizedPaymentMethod,
    });
    const subtotalWithShipping = subtotal + shippingCost;
    const discount = normalizedPaymentMethod === 'transfer'
        ? Math.round(subtotalWithShipping * TRANSFER_DISCOUNT_RATE)
        : 0;
    const total = subtotalWithShipping - discount;

    return {
        orderItems,
        catalogItems,
        shipping: normalizedShipping,
        deliveryMethod: normalizedDeliveryMethod,
        paymentMethod: normalizedPaymentMethod,
        subtotal,
        shippingCost,
        discount,
        total,
        itemsCount: orderItems.reduce((acc, item) => acc + item.quantity, 0),
    };
}

module.exports = {
    buildSecureOrderPricing,
    OrderPricingError,
};
