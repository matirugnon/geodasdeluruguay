const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');
const crypto = require('crypto');
const Order = require('../models/Order');

const accessToken = process.env.MP_ACCESS_TOKEN;

// Crear preferencia
const createPreference = async (req, res) => {
    try {
        const { items, shipping, deliveryMethod } = req.body;

        const mpItems = items.map(item => ({
            id: item.id || item._id,
            title: item.title,
            unit_price: Number(item.price),
            quantity: Number(item.quantity),
            currency_id: 'UYU'
        }));

        // Recálculo estricto de subtotales en el servidor como única fuente de verdad
        const subtotal = items.reduce((acc, item) => acc + (Number(item.price) * Number(item.quantity)), 0);

        let shippingCost = 0;
        // Si hay envío a domicilio seleccionado, se calcula un costo extra fijo
        if (deliveryMethod === 'delivery') {
            shippingCost = 100;
            mpItems.push({
                id: 'shipping',
                title: 'Costo de envío a domicilio',
                unit_price: shippingCost,
                quantity: 1,
                currency_id: 'UYU'
            });
        }

        const finalTotal = subtotal + shippingCost;

        // 1. Guardar la orden inicial como pendiente en MongoDB para tracking seguro
        const order = new Order({
            items,
            subtotal,
            shippingCost,
            total: finalTotal,
            shipping,
            deliveryMethod,
            status: 'pending'
        });
        await order.save();

        // 2. Generar UUID dinámica para evitar replicación en creaciones dobles
        const idempotencyKey = crypto.randomUUID();

        const client = new MercadoPagoConfig({
            accessToken: accessToken,
            options: { timeout: 5000, idempotencyKey: idempotencyKey }
        });

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const isProduction = process.env.NODE_ENV === 'production';

        const body = {
            items: mpItems,
            payer: {
                name: shipping.nombre,
                email: shipping.email,
                phone: {
                    area_code: "598",
                    number: shipping.telefono.replace(/\D/g, '').slice(-8)
                },
                address: {
                    street_name: shipping.direccion,
                    zip_code: shipping.codigoPostal || ''
                }
            },
            back_urls: {
                success: `${frontendUrl}/checkout?status=success`,
                failure: `${frontendUrl}/checkout?status=failure`,
                pending: `${frontendUrl}/checkout?status=pending`,
            },
            // auto_return solo funciona con URLs públicas (no localhost), se activa solo en producción
            ...(isProduction && { auto_return: "approved" }),
            notification_url: `${process.env.BACKEND_URL || 'https://tuservidor.com'}/api/payments/webhook`,
            external_reference: order._id.toString() // Referencia estricta mapeada a Mongo
        };

        const preference = new Preference(client);
        const result = await preference.create({ body });

        // En desarrollo usamos sandbox para poder testear con cuentas de prueba
        const checkoutUrl = process.env.NODE_ENV === 'production'
            ? result.init_point
            : result.sandbox_init_point;

        res.json({
            id: result.id,
            order_id: order._id.toString(),
            checkout_url: checkoutUrl,
        });
    } catch (error) {
        console.error('Error al crear preferencia de Mercado Pago:', error);
        res.status(500).json({ message: 'Error al procesar el pago' });
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
                    await order.save();
                    console.log('✅ Orden pagada y actualizada exitosamente:', orderId);

                    // Aquí en el futuro se enviará el correo, restará stock, etc.
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

        const subtotal = items.reduce((acc, item) => acc + (Number(item.price) * Number(item.quantity)), 0);

        let shippingCost = 0;
        if (deliveryMethod === 'delivery') {
            shippingCost = subtotal >= 5000 ? 0 : 100;
        }

        const subtotalWithShipping = subtotal + shippingCost;
        // 5% descuento por transferencia
        const discount = Math.round(subtotalWithShipping * 0.05);
        const finalTotal = subtotalWithShipping - discount;

        const order = new Order({
            items,
            subtotal,
            shippingCost,
            discount,
            total: finalTotal,
            shipping,
            deliveryMethod,
            paymentMethod: 'transfer',
            status: 'awaiting_transfer'
        });
        await order.save();

        res.json({
            orderId: order._id.toString(),
            total: finalTotal,
            discount,
            message: 'Orden creada. Esperando transferencia.'
        });
    } catch (error) {
        console.error('Error al crear orden por transferencia:', error);
        res.status(500).json({ message: 'Error al crear la orden' });
    }
};

// Verificar pago desde el frontend al volver del redirect de MP
// Esto es necesario en desarrollo porque el webhook no puede llegar a localhost
const verifyPayment = async (req, res) => {
    try {
        const { payment_id } = req.query;

        if (!payment_id) {
            return res.status(400).json({ message: 'payment_id requerido' });
        }

        // Modo simulación: solo disponible en desarrollo
        if (payment_id.startsWith('SIM_') && process.env.NODE_ENV !== 'production') {
            const orderId = payment_id.replace('SIM_', '');
            const order = await Order.findById(orderId);
            if (order && order.status !== 'paid') {
                order.status = 'paid';
                order.paymentId = payment_id;
                await order.save();
                console.log('✅ Orden simulada marcada como pagada:', orderId);
            }
            return res.json({
                verified: true,
                status: 'approved',
                order_id: orderId,
                simulated: true,
            });
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

            if (orderId) {
                const order = await Order.findById(orderId);
                if (order && order.status !== 'paid') {
                    order.status = 'paid';
                    order.paymentId = payment_id;
                    await order.save();
                    console.log('✅ Orden confirmada por verify-payment:', orderId);
                }
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
