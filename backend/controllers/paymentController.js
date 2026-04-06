const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');
const crypto = require('crypto');
const Order = require('../models/Order');
const { buildSecureOrderPricing, OrderPricingError } = require('../services/orderPricingService');
const { sendOrderConfirmationEmail, sendOwnerNotificationEmail } = require('../utils/mailer');

const accessToken = process.env.MP_ACCESS_TOKEN;

// Mapeo de categorías locales a category_id de MercadoPago Uruguay (MLU)
const getCategoryId = (category) => {
    const categoryMap = {
        'Accesorios': 'MLU1168',
        'Anillos': 'MLU1168',
        'Collares': 'MLU1168',
        'Pulseras': 'MLU1168',
        'Amatistas': 'MLU1168',
        'Agatas': 'MLU1168',
        'Cuarzos': 'MLU1168',
        'Geodas': 'MLU1168',
    };

    return categoryMap[category] || 'MLU1000';
};

const handleOrderPricingError = (res, error, logLabel, fallbackMessage) => {
    if (error instanceof OrderPricingError) {
        return res.status(error.statusCode).json({
            message: error.message,
            code: error.code,
            details: error.details,
        });
    }

    console.error(logLabel, error);
    return res.status(500).json({ message: fallbackMessage });
};

// Crear preferencia
const createPreference = async (req, res) => {
    try {
        const { items, shipping, deliveryMethod } = req.body;

        const secureOrder = await buildSecureOrderPricing({
            items,
            shipping,
            deliveryMethod,
            paymentMethod: 'mercadopago',
        });

        const mpItems = secureOrder.catalogItems.map((item) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            category_id: getCategoryId(item.category),
            unit_price: item.price,
            quantity: item.quantity,
            currency_id: 'UYU'
        }));

        if (secureOrder.shippingCost > 0) {
            mpItems.push({
                id: 'shipping',
                title: 'Costo de envío a domicilio',
                description: 'Servicio de envío a domicilio en Uruguay',
                category_id: 'MLU1000',
                unit_price: secureOrder.shippingCost,
                quantity: 1,
                currency_id: 'UYU'
            });
        }

        // 1. Guardar la orden inicial como pendiente en MongoDB para tracking seguro
        const order = new Order({
            items: secureOrder.orderItems,
            subtotal: secureOrder.subtotal,
            shippingCost: secureOrder.shippingCost,
            total: secureOrder.total,
            shipping: secureOrder.shipping,
            deliveryMethod: secureOrder.deliveryMethod,
            paymentMethod: 'mercadopago',
            status: 'pending'
        });
        await order.save();

        // 2. Generar UUID dinámica para evitar replicación en creaciones dobles
        const idempotencyKey = crypto.randomUUID();

        const client = new MercadoPagoConfig({
            accessToken: accessToken,
            options: { timeout: 5000, idempotencyKey: idempotencyKey }
        });

        // STOREFRONT_URL para redirects de pago (una sola URL limpia)
        // Si no existe, toma la primera URL de FRONTEND_URL (que puede tener varias separadas por coma)
        const frontendUrl = process.env.STOREFRONT_URL 
            || (process.env.FRONTEND_URL || 'http://localhost:3000').split(',')[0].trim();
        const isLocalhost = frontendUrl.includes('localhost') || frontendUrl.includes('127.0.0.1');

        const body = {
            items: mpItems,
            statement_descriptor: 'GEODAS URUGUAY',
            payer: {
                name: secureOrder.shipping.nombre,
                email: secureOrder.shipping.email,
                phone: {
                    area_code: "598",
                    number: secureOrder.shipping.telefono.replace(/\D/g, '').slice(-8)
                },
                address: {
                    street_name: secureOrder.shipping.direccion,
                    zip_code: secureOrder.shipping.codigoPostal || ''
                }
            },
            back_urls: {
                success: `${frontendUrl}/checkout?status=success`,
                failure: `${frontendUrl}/checkout?status=failure`,
                pending: `${frontendUrl}/checkout?status=pending`,
            },
            // auto_return solo funciona con URLs públicas (no localhost)
            ...(!isLocalhost && { auto_return: "approved" }),
            notification_url: `${process.env.BACKEND_URL || 'https://tuservidor.com'}/api/payments/webhook`,
            external_reference: order._id.toString(), // Referencia estricta mapeada a Mongo
            metadata: {
                order_id: order._id.toString(),
                delivery_method: secureOrder.deliveryMethod,
                customer_name: secureOrder.shipping.nombre,
                items_count: secureOrder.itemsCount,
            }
        };

        const preference = new Preference(client);
        const result = await preference.create({ body });

        // Usamos init_point para pagos reales, sandbox_init_point solo con credenciales TEST-
        const isSandbox = accessToken?.startsWith('TEST-');
        const checkoutUrl = isSandbox ? result.sandbox_init_point : result.init_point;

        res.json({
            id: result.id,
            order_id: order._id.toString(),
            checkout_url: checkoutUrl,
        });
    } catch (error) {
        return handleOrderPricingError(
            res,
            error,
            'Error al crear preferencia de Mercado Pago:',
            'Error al procesar el pago'
        );
    }
};

// Webhook / IPN
const webhook = async (req, res) => {
    try {
        const paymentId = req.query.id || req.body.data?.id;
        const topic = req.query.topic || req.body.type;

        if ((topic === 'payment' || topic === 'merchant_order') && paymentId) {
            const client = new MercadoPagoConfig({ accessToken });
            const paymentClient = new Payment(client);
            const paymentInfo = await paymentClient.get({ id: paymentId });

            console.log('Pago recibido y verificado con MP:', {
                id: paymentInfo.id,
                status: paymentInfo.status,
                external_reference: paymentInfo.external_reference
            });

            // Si Mercado Pago aprueba el paso
            if (paymentInfo.status === 'approved' && paymentInfo.currency_id === 'UYU') {
                const orderId = paymentInfo.external_reference;
                const order = await Order.findById(orderId);

                if (!order) {
                    console.error('Orden no encontrada en BD con ID:', orderId);
                    return res.status(200).send('OK');
                }

                // Asegurar idempotencia: no reprocesar si ya es paid
                if (order.status === 'paid') {
                    console.log('Orden ya estaba pagada previamente:', orderId);
                    return res.status(200).send('OK');
                }

                // Doble chequeo crítico: El total de MP DEBE ser igual al tracking
                if (paymentInfo.transaction_amount === order.total) {
                    order.status = 'paid';
                    order.paymentId = paymentId;
                    await order.save();
                    console.log('✅ Orden pagada y actualizada exitosamente:', orderId);

                    // Enviar emails de confirmación (no bloquear la respuesta a MP)
                    sendOrderConfirmationEmail(order).catch(e => console.error('Email error:', e));
                    sendOwnerNotificationEmail(order).catch(e => console.error('Owner email error:', e));
                } else {
                    console.error('Cuidado: Monto recibido en MP difiere de la Orden BD', {
                        mpAmount: paymentInfo.transaction_amount,
                        dbAmount: order.total
                    });
                }
            }
        }

        // Siempre devolver 200 OK a Mercado Pago rápidamente para que no reintente el envío
        res.status(200).send('OK');
    } catch (error) {
        console.error('Error en el webhook de Mercado Pago:', error);
        res.status(500).send('Error');
    }
};

// Crear orden por transferencia (sin Mercado Pago)
const createTransferOrder = async (req, res) => {
    try {
        const { items, shipping, deliveryMethod } = req.body;
        const secureOrder = await buildSecureOrderPricing({
            items,
            shipping,
            deliveryMethod,
            paymentMethod: 'transfer',
        });

        const order = new Order({
            items: secureOrder.orderItems,
            subtotal: secureOrder.subtotal,
            shippingCost: secureOrder.shippingCost,
            discount: secureOrder.discount,
            total: secureOrder.total,
            shipping: secureOrder.shipping,
            deliveryMethod: secureOrder.deliveryMethod,
            paymentMethod: 'transfer',
            status: 'awaiting_transfer'
        });
        await order.save();

        res.json({
            orderId: order._id.toString(),
            total: secureOrder.total,
            subtotal: secureOrder.subtotal,
            shippingCost: secureOrder.shippingCost,
            discount: secureOrder.discount,
            items: secureOrder.orderItems,
            message: 'Orden creada. Esperando transferencia.'
        });
    } catch (error) {
        return handleOrderPricingError(
            res,
            error,
            'Error al crear orden por transferencia:',
            'Error al crear la orden'
        );
    }
};

// Verificar pago desde el frontend al volver del redirect de MP
const verifyPayment = async (req, res) => {
    try {
        const { payment_id } = req.query;

        if (!payment_id) {
            return res.status(400).json({ message: 'payment_id requerido' });
        }

        const client = new MercadoPagoConfig({ accessToken });
        const paymentClient = new Payment(client);
        const paymentInfo = await paymentClient.get({ id: payment_id });

        console.log('Verificación manual de pago:', {
            id: paymentInfo.id,
            status: paymentInfo.status,
            external_reference: paymentInfo.external_reference,
            amount: paymentInfo.transaction_amount,
        });

        if (paymentInfo.status === 'approved') {
            const orderId = paymentInfo.external_reference;
            if (!orderId) {
                return res.json({
                    verified: false,
                    status: paymentInfo.status,
                    message: 'No se pudo validar la referencia de la orden.',
                });
            }

            const order = await Order.findById(orderId);
            if (!order) {
                console.error('Orden no encontrada al verificar pago:', orderId);
                return res.json({
                    verified: false,
                    status: paymentInfo.status,
                    order_id: orderId,
                    message: 'No se encontró la orden asociada al pago.',
                });
            }

            if (paymentInfo.transaction_amount !== order.total) {
                console.error('Monto inconsistente detectado en verify-payment:', {
                    mpAmount: paymentInfo.transaction_amount,
                    dbAmount: order.total,
                    orderId,
                });
                return res.json({
                    verified: false,
                    status: paymentInfo.status,
                    order_id: orderId,
                    amount: paymentInfo.transaction_amount,
                    message: 'El monto pagado no coincide con la orden registrada.',
                });
            }

            if (order.status !== 'paid') {
                order.status = 'paid';
                order.paymentId = payment_id;
                await order.save();
                console.log('✅ Orden confirmada por verify-payment:', orderId);

                // Enviar emails de confirmación
                sendOrderConfirmationEmail(order).catch(e => console.error('Email error:', e));
                sendOwnerNotificationEmail(order).catch(e => console.error('Owner email error:', e));
            }

            return res.json({
                verified: true,
                status: paymentInfo.status,
                order_id: paymentInfo.external_reference,
                amount: paymentInfo.transaction_amount,
            });
        }

        res.json({
            verified: false,
            status: paymentInfo.status,
        });

    } catch (error) {
        console.error('Error al verificar pago:', error);
        res.status(500).json({ message: 'Error al verificar el pago' });
    }
};

module.exports = {
    createPreference,
    createTransferOrder,
    webhook,
    verifyPayment,
};
