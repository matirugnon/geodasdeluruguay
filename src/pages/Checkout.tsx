import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ShippingForm {
    nombre: string;
    email: string;
    telefono: string;
    direccion: string;
    ciudad: string;
    departamento: string;
    codigoPostal: string;
}

type CheckoutStep = 'shipping' | 'payment' | 'success' | 'failure' | 'pending' | 'transfer-success';
type PaymentMethod = 'mercadopago' | 'transfer';

type FormErrors<T> = Partial<Record<keyof T, string>>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateOrderId(): string {
    return 'GDU-' + Math.random().toString(36).toUpperCase().slice(2, 8);
}

const WHATSAPP_NUMBER = '59891458797';
const TRANSFER_ACCOUNT = {
    banco: 'Banco Itaú',
    tipo: 'Caja de Ahorro',
    cuenta: '9725032',
    moneda: 'UYU',
    titular: 'Matias Rugnon',
};



// ─── Validation ───────────────────────────────────────────────────────────────

function validateShipping(form: ShippingForm, deliveryMethod: 'pickup' | 'delivery'): FormErrors<ShippingForm> {
    const errors: FormErrors<ShippingForm> = {};
    if (!form.nombre.trim()) errors.nombre = 'El nombre es requerido.';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errors.email = 'Ingresá un email válido.';
    if (!form.telefono.trim() || form.telefono.replace(/\D/g, '').length < 8) errors.telefono = 'Ingresá un teléfono válido.';
    if (deliveryMethod === 'delivery') {
        if (!form.direccion.trim()) errors.direccion = 'La dirección es requerida.';
        if (!form.ciudad.trim()) errors.ciudad = 'La ciudad es requerida.';
        if (!form.departamento.trim()) errors.departamento = 'El departamento es requerido.';
    }
    return errors;
}



// ─── Field Component ──────────────────────────────────────────────────────────

interface FieldProps {
    label: string;
    value: string;
    onChange: (v: string) => void;
    error?: string;
    placeholder?: string;
    type?: string;
    maxLength?: number;
}

const Field: React.FC<FieldProps> = ({ label, value, onChange, error, placeholder, type = 'text', maxLength }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-stone-500">
            {label}
        </label>
        <input
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
            className={`w-full px-4 py-3 rounded border text-sm text-stone-800
        bg-white placeholder-stone-300
        focus:outline-none focus:ring-1 transition-colors duration-200
        ${error
                    ? 'border-red-300 focus:ring-red-200'
                    : 'border-stone-200 focus:ring-[#8C7E60]/40 focus:border-[#8C7E60]'
                }`}
        />
        {error && (
            <p className="text-xs text-red-500 mt-0.5 flex items-center gap-1">
                <span className="material-symbols-outlined !text-[14px]">error</span>
                {error}
            </p>
        )}
    </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export const Checkout: React.FC = () => {
    const navigate = useNavigate();
    const { items, subtotal, clearCart } = useCart();

    // Estado del método de entrega
    const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup');

    // Estado del método de pago
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mercadopago');

    // Cálculos
    const isFreeShippingEligible = subtotal >= 5000;
    const shippingCost = deliveryMethod === 'delivery' ? (isFreeShippingEligible ? 0 : 100) : 0;
    const subtotalWithShipping = subtotal + shippingCost;
    const transferDiscount = paymentMethod === 'transfer' ? Math.round(subtotalWithShipping * 0.05) : 0;
    const finalTotal = subtotalWithShipping - transferDiscount;

    const [step, setStep] = useState<CheckoutStep>('shipping');
    const [processing, setProcessing] = useState(false);
    const [orderId, setOrderId] = useState(generateOrderId);
    const [transferOrderId, setTransferOrderId] = useState('');
    const [verifying, setVerifying] = useState(false);
    const [verifiedOrderId, setVerifiedOrderId] = useState('');
    const [verifyError, setVerifyError] = useState(false);

    const [shipping, setShipping] = useState<ShippingForm>({
        nombre: '', email: '', telefono: '', direccion: '', ciudad: '', departamento: '', codigoPostal: '',
    });
    const [shippingErrors, setShippingErrors] = useState<FormErrors<ShippingForm>>({});

    // Parse once for early return check — MP agrega collection_status, payment_id, external_reference al redirect
    const params = new URLSearchParams(window.location.search);
    const mpStatus = params.get('status'); // Nuestro param: success | failure | pending
    const collectionStatus = params.get('collection_status'); // Param de MP: approved | rejected | pending | null
    const isMpCallback = mpStatus === 'success' || mpStatus === 'failure' || mpStatus === 'pending' || collectionStatus !== null;

    React.useEffect(() => {
        if (!isMpCallback) return;

        const paymentId = params.get('payment_id') || params.get('collection_id');
        const externalRef = params.get('external_reference');
        const resolvedStatus = collectionStatus || mpStatus; // approved/rejected/pending ó success/failure/pending

        window.history.replaceState({}, document.title, '/checkout');

        // Pago rechazado o error
        if (resolvedStatus === 'failure' || resolvedStatus === 'rejected') {
            setStep('failure');
            return;
        }

        // Pago pendiente (ej. efectivo, transferencia bancaria desde MP)
        if (resolvedStatus === 'pending' && mpStatus === 'pending') {
            setVerifiedOrderId(externalRef || '');
            setStep('pending');
            return;
        }

        // Pago exitoso — vaciar carrito y verificar
        clearCart();
        setStep('success');

        if (paymentId) {
            setVerifying(true);
            fetch(`/api/payments/verify-payment?payment_id=${paymentId}`)
                .then(r => r.json())
                .then(data => {
                    if (data.verified) {
                        setVerifiedOrderId(data.order_id || externalRef || '');
                    } else {
                        // MP dice approved pero nuestra API no pudo verificar — mostramos éxito con warning
                        setVerifiedOrderId(externalRef || '');
                        setVerifyError(true);
                    }
                })
                .catch(() => {
                    setVerifiedOrderId(externalRef || '');
                    setVerifyError(true);
                })
                .finally(() => setVerifying(false));
        } else if (externalRef) {
            setVerifiedOrderId(externalRef);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMpCallback]);

    // Redirect if cart is empty (and not on a result screen)
    if (items.length === 0 && !['success', 'transfer-success', 'failure', 'pending'].includes(step) && !isMpCallback) {
        return (
            <div className="min-h-screen bg-[#F8F7F4] flex flex-col items-center justify-center text-center px-6 gap-6">
                <span className="material-symbols-outlined text-6xl text-stone-200">shopping_bag</span>
                <h1 className="text-2xl font-medium font-serif text-stone-800">Tu carrito está vacío</h1>
                <p className="text-stone-500 text-sm">Agregá productos antes de continuar al checkout.</p>
                <Link
                    to="/tienda"
                    className="mt-2 px-6 py-3 bg-[#8C7E60] text-white rounded text-sm font-medium hover:bg-[#756A50] transition-colors duration-200"
                >
                    Explorar tienda
                </Link>
            </div>
        );
    }

    const handleShippingSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const errors = validateShipping(shipping, deliveryMethod);
        if (Object.keys(errors).length > 0) { setShippingErrors(errors); return; }
        setShippingErrors({});
        setStep('payment');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePaymentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        if (paymentMethod === 'transfer') {
            // Crear orden de transferencia en el backend
            try {
                const response = await fetch('/api/payments/create-transfer-order', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ items, shipping, deliveryMethod }),
                });

                if (!response.ok) throw new Error('Error al crear orden');

                const data = await response.json();
                setTransferOrderId(data.orderId);

                // Build WhatsApp message with product details
                const productList = items.map(i => `• ${i.title} x${i.quantity} — $${(i.price * i.quantity).toLocaleString('es-UY')}`).join('\n');
                const whatsappMsg = encodeURIComponent(
                    `¡Hola! Acabo de hacer un pedido en Geodas del Uruguay 💎\n\n` +
                    `📦 Pedido: ${data.orderId}\n` +
                    `📋 Productos:\n${productList}\n\n` +
                    `💰 Total transferido: $${finalTotal.toLocaleString('es-UY')}` +
                    (transferDiscount > 0 ? ` (dto. 5% incluido)` : '') + `\n` +
                    `🏦 Transferencia a ${TRANSFER_ACCOUNT.banco} — Cuenta ${TRANSFER_ACCOUNT.cuenta}\n\n` +
                    `Te envío el comprobante 👇`
                );

                clearCart();
                // Redirect to WhatsApp
                window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`, '_blank');
                setStep('transfer-success');
            } catch (error) {
                console.error(error);
                alert('Hubo un error al crear la orden. Intentá de nuevo.');
                setProcessing(false);
            }
            return;
        }

        // Mercado Pago flow
        try {
            const response = await fetch('/api/payments/create-preference', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items, shipping, deliveryMethod }),
            });

            if (!response.ok) throw new Error('Error al crear preferencia');

            const data = await response.json();
            window.location.href = data.checkout_url;
        } catch (error) {
            console.error(error);
            alert("Hubo un error al conectarse con Mercado Pago. Intentá de nuevo más tarde.");
            setProcessing(false);
        }
    };

    // ── Failure screen (pago rechazado) ───────────────────────────────────────

    if (step === 'failure') {
        return (
            <div className="min-h-screen bg-[#F8F7F4] flex flex-col items-center justify-center text-center px-6 py-20 gap-6">
                <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-2">
                    <span className="material-symbols-outlined text-4xl text-red-500" style={{ fontVariationSettings: "'FILL' 1" }}>cancel</span>
                </div>
                <h1 className="text-2xl font-medium font-serif text-stone-800">Pago no procesado</h1>
                <p className="text-stone-500 max-w-md leading-relaxed text-sm">
                    Tu pago no pudo ser procesado. Podés intentar de nuevo o elegir otro método de pago.
                </p>
                <div className="flex flex-wrap gap-3 justify-center mt-4">
                    <Link
                        to="/tienda"
                        className="px-6 py-3 bg-[#8C7E60] text-white rounded text-sm font-medium hover:bg-[#756A50] transition-colors duration-200"
                    >
                        Volver a la tienda
                    </Link>
                </div>
            </div>
        );
    }

    // ── Pending screen (pago en espera) ───────────────────────────────────────

    if (step === 'pending') {
        return (
            <div className="min-h-screen bg-[#F8F7F4] flex flex-col items-center justify-center text-center px-6 py-20 gap-6">
                <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mb-2">
                    <span className="material-symbols-outlined text-4xl text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
                </div>
                <h1 className="text-2xl font-medium font-serif text-stone-800">Pago pendiente</h1>
                <p className="text-stone-500 max-w-md leading-relaxed text-sm">
                    Tu pago está siendo procesado por Mercado Pago. Te notificaremos cuando se confirme.
                </p>
                {verifiedOrderId && (
                    <div className="bg-white border border-stone-200 rounded-md px-5 py-3 flex items-center gap-3">
                        <span className="material-symbols-outlined !text-[18px] text-amber-500">receipt_long</span>
                        <span className="text-xs text-stone-500">N° de orden:</span>
                        <span className="font-mono font-semibold text-stone-800 text-sm">{verifiedOrderId}</span>
                    </div>
                )}
                <div className="flex flex-wrap gap-3 justify-center mt-4">
                    <Link
                        to="/"
                        className="px-6 py-3 bg-[#8C7E60] text-white rounded text-sm font-medium hover:bg-[#756A50] transition-colors duration-200"
                    >
                        Volver al inicio
                    </Link>
                </div>
            </div>
        );
    }

    // ── Transfer Success screen ───────────────────────────────────────────────

    if (step === 'transfer-success') {
        const whatsappMessage = encodeURIComponent(
            `¡Hola! Acabo de hacer un pedido en Geodas del Uruguay 💎\n\nPedido: ${transferOrderId}\nTotal: $${finalTotal.toLocaleString('es-UY')}\n\nTe envío el comprobante de la transferencia 👇`
        );
        const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

        return (
            <div className="min-h-screen bg-[#F8F7F4] flex flex-col items-center justify-center text-center px-6 py-20 gap-6">
                <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-2">
                    <span className="material-symbols-outlined text-4xl text-green-500" style={{ fontVariationSettings: "'FILL' 1" }}>
                        check_circle
                    </span>
                </div>
                <h1 className="text-2xl font-medium font-serif text-stone-800">
                    ¡Orden registrada!
                </h1>
                <p className="text-stone-500 max-w-lg leading-relaxed text-sm">
                    Tu pedido <span className="font-semibold text-stone-700">{transferOrderId}</span> fue creado. 
                    Si aún no enviaste el comprobante, hacelo por WhatsApp para que confirmemos tu compra.
                </p>

                {/* Bank details reminder */}
                <div className="bg-white border border-stone-200 rounded-md p-5 max-w-sm w-full text-left space-y-2">
                    <h4 className="font-semibold text-stone-800 text-sm flex items-center gap-2">
                        <span className="material-symbols-outlined !text-[18px] text-[#8C7E60]">account_balance</span>
                        Datos de la cuenta
                    </h4>
                    <div className="text-sm space-y-1.5">
                        <p className="text-stone-600"><span className="text-stone-400">Banco:</span> <span className="font-semibold">{TRANSFER_ACCOUNT.banco}</span></p>
                        <p className="text-stone-600"><span className="text-stone-400">{TRANSFER_ACCOUNT.tipo} N°:</span> <span className="font-semibold">{TRANSFER_ACCOUNT.cuenta}</span></p>
                        <p className="text-stone-600"><span className="text-stone-400">Moneda:</span> <span className="font-semibold">{TRANSFER_ACCOUNT.moneda}</span></p>
                        <p className="text-stone-600"><span className="text-stone-400">Titular:</span> <span className="font-semibold">{TRANSFER_ACCOUNT.titular}</span></p>
                        <p className="pt-2 border-t border-stone-100 text-stone-600">
                            <span className="text-stone-400">Monto:</span> <span className="font-semibold text-[#8C7E60] text-base">$ {finalTotal.toLocaleString('es-UY')}</span>
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 justify-center mt-4">
                    <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded text-sm font-medium transition-colors duration-200 flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        Enviar comprobante por WhatsApp
                    </a>
                    <Link
                        to="/"
                        className="px-6 py-3 border border-stone-200 text-stone-700 rounded text-sm font-medium hover:bg-stone-50 transition-colors duration-200"
                    >
                        Volver al inicio
                    </Link>
                </div>
            </div>
        );
    }

    // ── Success screen (Mercado Pago) ─────────────────────────────────────────

    if (step === 'success') {
        // Verifying state
        if (verifying) {
            return (
                <div className="min-h-screen bg-[#F8F7F4] flex flex-col items-center justify-center text-center px-6 gap-5">
                    <div className="w-10 h-10 border-2 border-[#8C7E60]/20 border-t-[#8C7E60] rounded-full animate-spin" />
                    <p className="text-stone-500 text-sm">Confirmando tu pago con Mercado Pago...</p>
                </div>
            );
        }

        return (
            <div className="min-h-screen bg-[#F8F7F4] flex flex-col items-center justify-center text-center px-6 py-20 gap-6">
                <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-2">
                    <span className="material-symbols-outlined text-4xl text-green-500" style={{ fontVariationSettings: "'FILL' 1" }}>
                        check_circle
                    </span>
                </div>
                <h1 className="text-2xl font-medium font-serif text-stone-800">
                    {verifyError ? '¡Pago recibido!' : '¡Pedido confirmado!'}
                </h1>
                <p className="text-stone-500 max-w-md leading-relaxed text-sm">
                    {verifyError
                        ? 'Tu pago fue procesado pero no pudimos confirmar tu orden automáticamente. Guardá tu número de pedido y contactanos si hay algún problema.'
                        : 'Gracias por tu compra. Tu orden fue procesada correctamente y ya estamos preparando tu pedido.'}
                </p>

                {/* Order details card */}
                {verifiedOrderId && (
                    <div className="bg-white border border-stone-200 rounded-md p-6 max-w-sm w-full text-left space-y-4">
                        <h4 className="font-semibold text-stone-800 text-sm flex items-center gap-2">
                            <span className="material-symbols-outlined !text-[18px] text-green-500">receipt_long</span>
                            Detalles de tu orden
                        </h4>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-stone-500">N° de orden</span>
                                <span className="font-mono font-semibold text-stone-800 bg-stone-50 px-3 py-1 rounded text-xs">{verifiedOrderId}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-stone-500">Estado</span>
                                <span className="inline-flex items-center gap-1.5 text-green-600 font-semibold">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    Pago confirmado
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-stone-500">Método</span>
                                <span className="font-semibold text-stone-700">Mercado Pago</span>
                            </div>
                        </div>
                        <div className="pt-3 border-t border-stone-100">
                            <p className="text-xs text-stone-400 leading-relaxed">
                                Guardá este número de orden como comprobante. Nos pondremos en contacto contigo para coordinar la entrega.
                            </p>
                        </div>
                    </div>
                )}

                <div className="flex flex-wrap gap-3 justify-center mt-4">
                    <Link
                        to="/"
                        className="px-6 py-3 bg-[#8C7E60] text-white rounded text-sm font-medium hover:bg-[#756A50] transition-colors duration-200"
                    >
                        Volver al inicio
                    </Link>
                    <Link
                        to="/tienda"
                        className="px-6 py-3 border border-stone-200 text-stone-700 rounded text-sm font-medium hover:bg-stone-50 transition-colors duration-200"
                    >
                        Seguir comprando
                    </Link>
                </div>
            </div>
        );
    }

    // ── Layout ────────────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen bg-[#F8F7F4] font-sans">
            {/* Top bar */}
            <div className="w-full border-b border-stone-200 bg-white sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 text-stone-700">
                        <span className="font-serif font-medium">Geodas del Uruguay</span>
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-stone-400">
                        <span className="material-symbols-outlined !text-[16px]">lock</span>
                        Pago seguro
                    </div>
                </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-stone-100 h-0.5">
                <div
                    className="h-full bg-[#8C7E60] transition-all duration-500"
                    style={{ width: step === 'shipping' ? '50%' : '100%' }}
                />
            </div>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 lg:gap-14 items-start">

                    {/* ── Left: Form ──────────────────────────────────────────────── */}
                    <div>
                        {/* Step indicator */}
                        <div className="flex items-center gap-3 mb-8">
                            <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium ${step === 'shipping' ? 'bg-[#8C7E60] text-white' : 'bg-[#8C7E60]/15 text-[#8C7E60]'}`}>
                                {step === 'payment' ? <span className="material-symbols-outlined !text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span> : '1'}
                            </div>
                            <span className={`text-sm font-medium ${step === 'shipping' ? 'text-stone-800' : 'text-stone-400'}`}>Datos de envío</span>
                            <span className="text-stone-300 mx-1">/</span>
                            <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium ${step === 'payment' ? 'bg-[#8C7E60] text-white' : 'bg-stone-100 text-stone-400'}`}>2</div>
                            <span className={`text-sm font-medium ${step === 'payment' ? 'text-stone-800' : 'text-stone-400'}`}>Pago</span>
                        </div>

                        {/* ── STEP 1: Shipping ───────────────────────────────────────── */}
                        {step === 'shipping' && (
                            <form onSubmit={handleShippingSubmit} noValidate className="flex flex-col gap-6">
                                <h2 className="text-2xl font-medium font-serif text-stone-900">Datos personales & envío</h2>

                                {/* Delivery Method Selector - FIRST so fields adapt */}
                                <div className="flex flex-col gap-3">
                                    <label className="text-xs font-medium text-stone-500">
                                        Método de entrega
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div
                                            onClick={() => setDeliveryMethod('pickup')}
                                            className={`p-4 rounded-md border cursor-pointer transition-colors duration-200 ${deliveryMethod === 'pickup' ? 'border-[#8C7E60] bg-[#8C7E60]/5' : 'border-stone-200 hover:border-stone-300'}`}
                                        >
                                            <div className="flex items-center gap-3 mb-1">
                                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${deliveryMethod === 'pickup' ? 'border-[#8C7E60]' : 'border-stone-300'}`}>
                                                    {deliveryMethod === 'pickup' && <div className="w-2 h-2 rounded-full bg-[#8C7E60]" />}
                                                </div>
                                                <h4 className="font-medium text-sm text-stone-800">Retiro en Prado</h4>
                                            </div>
                                            <p className="text-xs text-stone-500 pl-7">A coordinar (Sin costo extra)</p>
                                        </div>

                                        <div
                                            onClick={() => setDeliveryMethod('delivery')}
                                            className={`p-4 rounded-md border cursor-pointer transition-colors duration-200 ${deliveryMethod === 'delivery' ? 'border-[#8C7E60] bg-[#8C7E60]/5' : 'border-stone-200 hover:border-stone-300'}`}
                                        >
                                            <div className="flex items-center gap-3 mb-1">
                                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${deliveryMethod === 'delivery' ? 'border-[#8C7E60]' : 'border-stone-300'}`}>
                                                    {deliveryMethod === 'delivery' && <div className="w-2 h-2 rounded-full bg-[#8C7E60]" />}
                                                </div>
                                                <h4 className="font-medium text-sm text-stone-800">Envío a domicilio</h4>
                                            </div>
                                            <p className="text-xs text-stone-500 pl-7">
                                                {isFreeShippingEligible ? 'Gratis' : '+ $ 100 extra'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Form fields */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="sm:col-span-2">
                                        <Field label="Nombre completo" value={shipping.nombre} onChange={v => setShipping(s => ({ ...s, nombre: v }))} error={shippingErrors.nombre} placeholder="María García" />
                                    </div>
                                    <Field label="Email" type="email" value={shipping.email} onChange={v => setShipping(s => ({ ...s, email: v }))} error={shippingErrors.email} placeholder="maria@email.com" />
                                    <Field label="Teléfono" type="tel" value={shipping.telefono} onChange={v => setShipping(s => ({ ...s, telefono: v }))} error={shippingErrors.telefono} placeholder="+598 99 000 000" />

                                    {/* Address fields only for delivery */}
                                    {deliveryMethod === 'delivery' && (
                                        <>
                                            <div className="sm:col-span-2">
                                                <Field label="Dirección" value={shipping.direccion} onChange={v => setShipping(s => ({ ...s, direccion: v }))} error={shippingErrors.direccion} placeholder="Av. 18 de Julio 1234, Apto 5" />
                                            </div>
                                            <Field label="Ciudad" value={shipping.ciudad} onChange={v => setShipping(s => ({ ...s, ciudad: v }))} error={shippingErrors.ciudad} placeholder="Montevideo" />
                                            <Field label="Departamento" value={shipping.departamento} onChange={v => setShipping(s => ({ ...s, departamento: v }))} error={shippingErrors.departamento} placeholder="Montevideo" />
                                            <Field label="Código postal (opcional)" value={shipping.codigoPostal} onChange={v => setShipping(s => ({ ...s, codigoPostal: v }))} placeholder="11300" />
                                        </>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3.5 mt-2 bg-[#8C7E60] hover:bg-[#756A50] text-white font-medium text-sm rounded transition-colors duration-200 flex items-center justify-center gap-2"
                                >
                                    Continuar al pago
                                    <span className="material-symbols-outlined !text-[18px]">arrow_forward</span>
                                </button>
                            </form>
                        )}

                        {/* ── STEP 2: Payment ────────────────────────────────────────── */}
                        {step === 'payment' && (
                            <form onSubmit={handlePaymentSubmit} noValidate className="flex flex-col gap-6">
                                <div>
                                    <h2 className="text-2xl font-medium font-serif text-stone-900 mb-1">Método de pago</h2>
                                    <p className="text-xs text-stone-400">
                                        Elegí cómo querés pagar tu pedido.
                                    </p>
                                </div>

                                {/* Payment Method Selector */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {/* Mercado Pago */}
                                    <div
                                        onClick={() => setPaymentMethod('mercadopago')}
                                        className={`p-5 rounded-md border cursor-pointer transition-colors duration-200 ${paymentMethod === 'mercadopago' ? 'border-[#8C7E60] bg-[#8C7E60]/5' : 'border-stone-200 hover:border-stone-300'}`}
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'mercadopago' ? 'border-[#8C7E60]' : 'border-stone-300'}`}>
                                                {paymentMethod === 'mercadopago' && <div className="w-2 h-2 rounded-full bg-[#8C7E60]" />}
                                            </div>
                                            <h4 className="font-medium text-sm text-stone-800">Mercado Pago</h4>
                                        </div>
                                        <p className="text-xs text-stone-500 pl-7">Tarjeta, débito, crédito y más</p>
                                        <div className="pl-7 mt-3 flex items-center gap-2">
                                            <span className="material-symbols-outlined !text-[20px] text-blue-500">credit_card</span>
                                            <span className="material-symbols-outlined !text-[20px] text-stone-400">lock</span>
                                        </div>
                                    </div>

                                    {/* Transferencia */}
                                    <div
                                        onClick={() => setPaymentMethod('transfer')}
                                        className={`p-5 rounded-md border cursor-pointer transition-colors duration-200 relative overflow-hidden ${paymentMethod === 'transfer' ? 'border-[#8C7E60] bg-[#8C7E60]/5' : 'border-stone-200 hover:border-stone-300'}`}
                                    >
                                        {/* Badge 5% off */}
                                        <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-semibold px-2.5 py-1 rounded-bl-md">
                                            5% OFF
                                        </div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'transfer' ? 'border-[#8C7E60]' : 'border-stone-300'}`}>
                                                {paymentMethod === 'transfer' && <div className="w-2 h-2 rounded-full bg-[#8C7E60]" />}
                                            </div>
                                            <h4 className="font-medium text-sm text-stone-800">Transferencia bancaria</h4>
                                        </div>
                                        <p className="text-xs text-stone-500 pl-7">Transferí y enviá el comprobante</p>
                                        <div className="pl-7 mt-3 flex items-center gap-2">
                                            <span className="material-symbols-outlined !text-[20px] text-green-500">account_balance</span>
                                            <span className="text-xs text-green-600 font-semibold">¡Ahorrá un 5%!</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment details area */}
                                {paymentMethod === 'mercadopago' && (
                                    <div className="p-8 border border-stone-200 bg-[#F5F3EF] rounded-md flex flex-col items-center justify-center text-center gap-4">
                                        <div className="flex gap-2 text-stone-300">
                                            <span className="material-symbols-outlined text-4xl">lock</span>
                                            <span className="material-symbols-outlined text-4xl">account_balance</span>
                                        </div>
                                        <p className="text-sm text-stone-500">Serás redirigido a la plataforma segura de Mercado Pago.</p>
                                    </div>
                                )}

                                {paymentMethod === 'transfer' && (
                                    <div className="p-5 border border-stone-200 bg-[#F5F3EF] rounded-md space-y-4">
                                        {/* Bank Account Card */}
                                        <div className="bg-white border border-stone-200 rounded-md p-5 space-y-3">
                                            <h4 className="font-semibold text-stone-800 text-sm flex items-center gap-2">
                                                <span className="material-symbols-outlined !text-[18px] text-[#8C7E60]">account_balance</span>
                                                Transferí a esta cuenta
                                            </h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-stone-500">Banco</span>
                                                    <span className="font-semibold text-stone-800">{TRANSFER_ACCOUNT.banco}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-stone-500">Tipo</span>
                                                    <span className="font-semibold text-stone-800">{TRANSFER_ACCOUNT.tipo}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-stone-500">N° de cuenta</span>
                                                    <span className="font-semibold text-stone-800 text-base">{TRANSFER_ACCOUNT.cuenta}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-stone-500">Moneda</span>
                                                    <span className="font-semibold text-stone-800">{TRANSFER_ACCOUNT.moneda}</span>
                                                </div>
                                                <div className="flex justify-between pt-2 border-t border-stone-100">
                                                    <span className="text-stone-500">Titular</span>
                                                    <span className="font-semibold text-stone-800">{TRANSFER_ACCOUNT.titular}</span>
                                                </div>
                                                <div className="flex justify-between pt-2 border-t border-stone-100">
                                                    <span className="text-stone-500 font-medium">Monto a transferir</span>
                                                    <span className="font-semibold text-[#8C7E60] text-lg">$ {finalTotal.toLocaleString('es-UY')}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Instructions */}
                                        <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-md p-3">
                                            <span className="material-symbols-outlined !text-[20px] text-blue-500 mt-0.5">info</span>
                                            <p className="text-xs text-blue-700 leading-relaxed">
                                                Realizá la transferencia por el monto indicado y luego tocá el botón de abajo para enviarnos el comprobante por WhatsApp.
                                            </p>
                                        </div>

                                        {transferDiscount > 0 && (
                                            <div className="bg-green-50 border border-green-200 rounded-md p-3 flex items-center gap-3">
                                                <span className="material-symbols-outlined text-green-500 !text-[20px]">savings</span>
                                                <p className="text-xs text-green-700 font-semibold">
                                                    Ahorrás $ {transferDiscount.toLocaleString('es-UY')} con transferencia bancaria
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Pay button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className={`w-full py-3.5 mt-2 text-white font-medium text-sm rounded disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2 ${
                                        paymentMethod === 'transfer' 
                                            ? 'bg-green-500 hover:bg-green-600 disabled:bg-green-500/60' 
                                            : 'bg-[#8C7E60] hover:bg-[#756A50] disabled:bg-[#8C7E60]/60'
                                    }`}
                                >
                                    {processing ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            {paymentMethod === 'transfer' ? 'Creando orden...' : 'Redirigiendo a pasarela segura...'}
                                        </>
                                    ) : paymentMethod === 'transfer' ? (
                                        <>
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                                            Ya transferí — Enviar comprobante por WhatsApp
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined !text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                                            Pagar con Mercado Pago — $ {finalTotal.toLocaleString('es-UY')}
                                        </>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setStep('shipping')}
                                    className="w-full text-center text-xs text-stone-400 hover:text-stone-600 underline underline-offset-2 transition-colors duration-200"
                                >
                                    ← Volver a datos de envío
                                </button>
                            </form>
                        )}
                    </div>

                    {/* ── Right: Order Summary ─────────────────────────────────────── */}
                    <aside className="bg-white rounded-md border border-stone-200 p-6 sticky top-24">
                        <h3 className="font-medium font-serif text-stone-900 mb-5 text-lg">Resumen del pedido</h3>

                        <ul className="flex flex-col gap-4 mb-5">
                            {items.map(item => (
                                <li key={item.id} className="flex gap-3 items-start">
                                    <div className="relative flex-shrink-0">
                                        <div className="w-14 h-14 rounded-md overflow-hidden bg-[#F5F3EF]">
                                            {item.images[0] && (
                                                <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                                            )}
                                        </div>
                                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-stone-600 text-white text-[10px] font-medium rounded-full flex items-center justify-center">
                                            {item.quantity}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-stone-800 font-serif truncate">{item.title}</p>
                                        <p className="text-xs text-stone-400">{item.type || item.category}</p>
                                    </div>
                                    <p className="text-sm font-semibold text-stone-700 whitespace-nowrap">
                                        $ {(item.price * item.quantity).toLocaleString('es-UY')}
                                    </p>
                                </li>
                            ))}
                        </ul>

                        <div className="border-t border-stone-100 pt-4 flex flex-col gap-2">
                            <div className="flex justify-between text-sm text-stone-500">
                                <span>Subtotal</span>
                                <span>$ {subtotal.toLocaleString('es-UY')}</span>
                            </div>
                            <div className="flex justify-between text-sm text-stone-500">
                                <span>Envío</span>
                                <span className={isFreeShippingEligible && deliveryMethod === 'delivery' ? 'text-[#8C7E60] font-semibold' : ''}>
                                    {deliveryMethod === 'pickup'
                                        ? 'Retiro en Prado (Gratis)'
                                        : (isFreeShippingEligible ? 'Gratis' : `$ ${shippingCost.toLocaleString('es-UY')}`)
                                    }
                                </span>
                            </div>
                            {transferDiscount > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-green-600 flex items-center gap-1">
                                        <span className="material-symbols-outlined !text-[14px]">savings</span>
                                        Dto. transferencia (5%)
                                    </span>
                                    <span className="text-green-600 font-semibold">- $ {transferDiscount.toLocaleString('es-UY')}</span>
                                </div>
                            )}
                            <div className="flex justify-between font-semibold text-stone-900 text-base pt-2 border-t border-stone-100 mt-1">
                                <span className="font-serif">Total</span>
                                <span>$ {finalTotal.toLocaleString('es-UY')}</span>
                            </div>
                            {!isFreeShippingEligible && deliveryMethod === 'delivery' && (
                                <p className="text-[11px] text-stone-400 text-center mt-1">
                                    Agregá $ {(5000 - subtotal).toLocaleString('es-UY')} más para envío gratis
                                </p>
                            )}
                            {paymentMethod !== 'transfer' && (
                                <p className="text-[11px] text-green-600 text-center mt-1 font-medium">
                                    Pagando por transferencia ahorrás $ {Math.round(subtotalWithShipping * 0.05).toLocaleString('es-UY')}
                                </p>
                            )}
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
};