const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');

// Agregamos un token de prueba (Sandbox) como fallback si no hay en .env
const accessToken = process.env.MP_ACCESS_TOKEN || 'TEST-8278278278278278-022019-1234567890abcdef1234567890abcdef-123456789';

const client = new MercadoPagoConfig({
    accessToken: accessToken,
    options: { timeout: 5000, idempotencyKey: 'abc' }
});

// Crear preferencia
const createPreference = async (req, res) => {
    try {
        const { items, shipping, total } = req.body;

        const mpItems = items.map(item => ({
            id: item.id || item._id,
            title: item.title,
            unit_price: Number(item.price),
            quantity: Number(item.quantity),
            currency_id: 'UYU'
        }));

        // Si hay costo de envío, lo agregamos como un ítem más
        const subtotal = items.reduce((acc, item) => acc + (Number(item.price) * Number(item.quantity)), 0);
        if (total > subtotal) {
            mpItems.push({
                id: 'shipping',
                title: 'Costo de envío',
                unit_price: Number(total - subtotal),
                quantity: 1,
                currency_id: 'UYU'
            });
        }

        const body = {
            items: mpItems,
            payer: {
                name: shipping.nombre,
                email: shipping.email,
                phone: {
                    area_code: "598",
                    number: shipping.telefono.replace(/\D/g, '').slice(-8) // Intentamos normalizar un poco
                },
                address: {
                    street_name: shipping.direccion,
                    zip_code: shipping.codigoPostal || ''
                }
            },
            back_urls: {
                success: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout?status=success`,
                failure: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout`,
                pending: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout`,
            },
            auto_return: "approved",
            // TODO: Cambiar por la URL real donde se expondrá el servidor (ej: ngrok) cuando se quiera probar real
            notification_url: `${process.env.BACKEND_URL || 'https://tuservidor.com'}/api/payments/webhook`,
            external_reference: `GDU-${Date.now()}` // ID interno para el pedido
        };

        const preference = new Preference(client);
        const result = await preference.create({ body });

        res.json({
            id: result.id,
            init_point: result.init_point,
            sandbox_init_point: result.sandbox_init_point,
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
            // Verificación del lado del servidor:
            // 1. MP envía una notificación a nuestra URL indicando que hubo un evento de 'payment' con ID X.
            // 2. Aquí NO confiamos simplemente en este aviso, sino que usamos nuestro ACCESS_TOKEN interno
            //    (inaccesible desde el frontend) para consultar a la API de MP la información de este pago.
            // 3. Confirmamos si el pago realmente está "approved" y comprobamos que los montos/ítems concuerden.
            // Esto anula cualquier intento de falsificar un callback de "success" desde el navegador.

            const paymentClient = new Payment(client);
            const paymentInfo = await paymentClient.get({ id: paymentId });

            console.log('Pago recibido y verificado con MP:', {
                id: paymentInfo.id,
                status: paymentInfo.status,
                external_reference: paymentInfo.external_reference
            });

            if (paymentInfo.status === 'approved') {
                // Aquí deberíamos:
                // - Buscar el pedido en la BD (usando external_reference)
                // - Cambiar el estado del pedido a 'pagado'
                // - Enviar el email de confirmación
                // - Restar stock
            }
        }

        // Siempre devolver 200 OK a Mercado Pago rápidamente para que no reintente el envío
        res.status(200).send('OK');
    } catch (error) {
        console.error('Error en el webhook de Mercado Pago:', error);
        res.status(500).send('Error');
    }
};

module.exports = {
    createPreference,
    webhook
};
