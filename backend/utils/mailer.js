const nodemailer = require('nodemailer');

/**
 * Transporter de Nodemailer.
 * Configurar las siguientes variables de entorno:
 *   SMTP_HOST     – ej. smtp.gmail.com
 *   SMTP_PORT     – ej. 587
 *   SMTP_USER     – tu email (ej. geodasdeluruguay@gmail.com)
 *   SMTP_PASS     – contraseña de aplicación (no la contraseña normal)
 *   STORE_EMAIL   – email que aparece como remitente
 *   STORE_NAME    – nombre que aparece como remitente
 */
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, // true para 465, false para otros puertos
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const STORE_NAME = process.env.STORE_NAME || 'Geodas del Uruguay';
const STORE_EMAIL = process.env.STORE_EMAIL || process.env.SMTP_USER;

/**
 * Envía el correo de confirmación de compra al cliente.
 */
async function sendOrderConfirmationEmail(order) {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn('⚠️  SMTP no configurado — no se envió email de confirmación.');
        return;
    }

    const { shipping, items, total, shippingCost, deliveryMethod, discount } = order;
    const customerEmail = shipping?.email;
    const customerName = shipping?.nombre || 'Cliente';

    if (!customerEmail) {
        console.warn('⚠️  Orden sin email de cliente — no se envió email.');
        return;
    }

    const itemRows = items.map(item =>
        `<tr>
            <td style="padding:10px 12px;border-bottom:1px solid #f0ebe3;font-size:14px;color:#44403c;">${item.title}</td>
            <td style="padding:10px 12px;border-bottom:1px solid #f0ebe3;font-size:14px;color:#44403c;text-align:center;">${item.quantity}</td>
            <td style="padding:10px 12px;border-bottom:1px solid #f0ebe3;font-size:14px;color:#44403c;text-align:right;">$ ${(item.price * item.quantity).toLocaleString('es-UY')}</td>
        </tr>`
    ).join('');

    const deliveryLabel = deliveryMethod === 'delivery' ? 'Envío a domicilio' : 'Retiro en local';

    const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head><meta charset="UTF-8"></head>
    <body style="margin:0;padding:0;background-color:#faf9f6;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
        <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e7e5e4;">
            <!-- Header -->
            <div style="background:linear-gradient(135deg,#8C7E60 0%,#a69576 100%);padding:32px 24px;text-align:center;">
                <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:0.5px;">
                    ${STORE_NAME}
                </h1>
                <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">
                    Confirmación de compra
                </p>
            </div>

            <!-- Body -->
            <div style="padding:32px 24px;">
                <p style="font-size:16px;color:#44403c;margin:0 0 20px;">
                    ¡Hola <strong>${customerName}</strong>! 👋
                </p>
                <p style="font-size:14px;color:#78716c;line-height:1.6;margin:0 0 24px;">
                    Tu pago fue confirmado exitosamente. Ya estamos preparando tu pedido. A continuación el detalle de tu compra:
                </p>

                <!-- Order ID -->
                <div style="background:#faf9f6;border:1px solid #e7e5e4;border-radius:8px;padding:14px 16px;margin-bottom:24px;text-align:center;">
                    <span style="font-size:12px;color:#a8a29e;text-transform:uppercase;letter-spacing:1px;">N° de orden</span><br>
                    <span style="font-size:18px;font-weight:700;color:#44403c;font-family:monospace;">${order._id}</span>
                </div>

                <!-- Items Table -->
                <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
                    <thead>
                        <tr style="background:#faf9f6;">
                            <th style="padding:10px 12px;text-align:left;font-size:12px;color:#a8a29e;text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid #e7e5e4;">Producto</th>
                            <th style="padding:10px 12px;text-align:center;font-size:12px;color:#a8a29e;text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid #e7e5e4;">Cant.</th>
                            <th style="padding:10px 12px;text-align:right;font-size:12px;color:#a8a29e;text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid #e7e5e4;">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemRows}
                    </tbody>
                </table>

                <!-- Totals -->
                <div style="border-top:2px solid #e7e5e4;padding-top:16px;margin-top:8px;">
                    ${shippingCost > 0 ? `
                    <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                        <span style="font-size:14px;color:#78716c;">Envío</span>
                        <span style="font-size:14px;color:#44403c;">$ ${shippingCost.toLocaleString('es-UY')}</span>
                    </div>` : ''}
                    ${discount > 0 ? `
                    <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                        <span style="font-size:14px;color:#78716c;">Descuento</span>
                        <span style="font-size:14px;color:#16a34a;">-$ ${discount.toLocaleString('es-UY')}</span>
                    </div>` : ''}
                    <div style="display:flex;justify-content:space-between;margin-top:8px;">
                        <span style="font-size:16px;font-weight:700;color:#44403c;">Total</span>
                        <span style="font-size:18px;font-weight:700;color:#8C7E60;">$ ${total.toLocaleString('es-UY')}</span>
                    </div>
                </div>

                <!-- Delivery method -->
                <div style="margin-top:24px;background:#faf9f6;border-radius:8px;padding:14px 16px;">
                    <p style="margin:0;font-size:13px;color:#78716c;">
                        <strong style="color:#44403c;">📦 Entrega:</strong> ${deliveryLabel}
                    </p>
                    ${deliveryMethod === 'delivery' && shipping.direccion ? `
                    <p style="margin:6px 0 0;font-size:13px;color:#78716c;">
                        📍 ${shipping.direccion}${shipping.ciudad ? `, ${shipping.ciudad}` : ''}${shipping.departamento ? `, ${shipping.departamento}` : ''}
                    </p>` : ''}
                </div>
            </div>

            <!-- Footer -->
            <div style="background:#faf9f6;padding:20px 24px;text-align:center;border-top:1px solid #e7e5e4;">
                <p style="margin:0;font-size:12px;color:#a8a29e;line-height:1.5;">
                    Si tenés alguna consulta, respondé a este correo o escribinos por WhatsApp.<br>
                    ¡Gracias por tu compra! 💎
                </p>
            </div>
        </div>
    </body>
    </html>
    `;

    try {
        await transporter.sendMail({
            from: `"${STORE_NAME}" <${STORE_EMAIL}>`,
            to: customerEmail,
            subject: `✅ Confirmación de compra — Pedido ${order._id}`,
            html,
        });
        console.log(`📧 Email de confirmación enviado a ${customerEmail}`);
    } catch (err) {
        console.error('❌ Error al enviar email de confirmación:', err.message);
    }
}

/**
 * Envía una notificación al dueño de la tienda sobre la nueva venta.
 */
async function sendOwnerNotificationEmail(order) {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return;

    const ownerEmail = process.env.OWNER_EMAIL || process.env.SMTP_USER;
    const { shipping, items, total, deliveryMethod } = order;

    const itemList = items.map(i => `• ${i.title} x${i.quantity} — $${(i.price * i.quantity).toLocaleString('es-UY')}`).join('\n');

    const text = `
🛒 ¡Nueva venta confirmada!

📦 Orden: ${order._id}
👤 Cliente: ${shipping.nombre}
📧 Email: ${shipping.email}
📞 Teléfono: ${shipping.telefono}
🚚 Entrega: ${deliveryMethod === 'delivery' ? `Envío a ${shipping.direccion}, ${shipping.ciudad || ''} ${shipping.departamento || ''}` : 'Retiro en local'}

📋 Productos:
${itemList}

💰 Total: $${total.toLocaleString('es-UY')}
    `.trim();

    try {
        await transporter.sendMail({
            from: `"${STORE_NAME}" <${STORE_EMAIL}>`,
            to: ownerEmail,
            subject: `🛒 Nueva venta — $${total.toLocaleString('es-UY')} — ${shipping.nombre}`,
            text,
        });
        console.log(`📧 Notificación de venta enviada al dueño (${ownerEmail})`);
    } catch (err) {
        console.error('❌ Error al enviar notificación al dueño:', err.message);
    }
}

module.exports = { sendOrderConfirmationEmail, sendOwnerNotificationEmail };
