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

type CheckoutStep = 'shipping' | 'payment' | 'success';

type FormErrors<T> = Partial<Record<keyof T, string>>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SHIPPING_COST = 200;

function generateOrderId(): string {
    return 'GDU-' + Math.random().toString(36).toUpperCase().slice(2, 8);
}



// ─── Validation ───────────────────────────────────────────────────────────────

function validateShipping(form: ShippingForm): FormErrors<ShippingForm> {
    const errors: FormErrors<ShippingForm> = {};
    if (!form.nombre.trim()) errors.nombre = 'El nombre es requerido.';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errors.email = 'Ingresá un email válido.';
    if (!form.telefono.trim() || form.telefono.replace(/\D/g, '').length < 8) errors.telefono = 'Ingresá un teléfono válido.';
    if (!form.direccion.trim()) errors.direccion = 'La dirección es requerida.';
    if (!form.ciudad.trim()) errors.ciudad = 'La ciudad es requerida.';
    if (!form.departamento.trim()) errors.departamento = 'El departamento es requerido.';
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
    <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
            {label}
        </label>
        <input
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
            className={`w-full px-4 py-3 rounded-xl border text-sm font-display text-stone-800 dark:text-stone-100
        bg-white dark:bg-stone-800 placeholder-stone-300 dark:placeholder-stone-600
        focus:outline-none focus:ring-2 transition-all
        ${error
                    ? 'border-red-300 focus:ring-red-200 dark:border-red-700 dark:focus:ring-red-800'
                    : 'border-stone-200 dark:border-stone-700 focus:ring-primary/30 focus:border-primary'
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
    const total = subtotal + SHIPPING_COST;
    const freeShipping = subtotal >= 5000;
    const finalTotal = freeShipping ? subtotal : total;

    const [step, setStep] = useState<CheckoutStep>('shipping');
    const [processing, setProcessing] = useState(false);
    const [orderId] = useState(generateOrderId);

    const [shipping, setShipping] = useState<ShippingForm>({
        nombre: '', email: '', telefono: '', direccion: '', ciudad: '', departamento: '', codigoPostal: '',
    });
    const [shippingErrors, setShippingErrors] = useState<FormErrors<ShippingForm>>({});

    // Parse once for early return check
    const isSuccessCallback = new URLSearchParams(window.location.search).get('status') === 'success';

    React.useEffect(() => {
        if (isSuccessCallback) {
            clearCart();
            setStep('success');
            window.history.replaceState({}, document.title, '/checkout');
        }
    }, [isSuccessCallback, clearCart]);

    // Redirect if cart is empty (and not on success screen)
    if (items.length === 0 && step !== 'success' && !isSuccessCallback) {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center justify-center text-center px-6 gap-6">
                <span className="material-symbols-outlined text-6xl text-stone-200 dark:text-stone-700">shopping_bag</span>
                <h1 className="text-2xl font-bold font-serif text-stone-800 dark:text-white">Tu carrito está vacío</h1>
                <p className="text-stone-500 dark:text-stone-400 text-sm">Agregá productos antes de continuar al checkout.</p>
                <Link
                    to="/tienda"
                    className="mt-2 px-6 py-3 bg-primary text-white rounded-full text-sm font-bold tracking-wide hover:bg-primary-dark transition-colors"
                >
                    Explorar tienda
                </Link>
            </div>
        );
    }

    const handleShippingSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const errors = validateShipping(shipping);
        if (Object.keys(errors).length > 0) { setShippingErrors(errors); return; }
        setShippingErrors({});
        setStep('payment');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePaymentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        try {
            const response = await fetch('/api/payments/create-preference', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items,
                    shipping,
                    total: finalTotal
                }),
            });

            if (!response.ok) {
                throw new Error('Error al crear preferencia');
            }

            const data = await response.json();

            // Redirect to Mercado Pago
            window.location.href = data.init_point;
        } catch (error) {
            console.error(error);
            alert("Hubo un error al intentar conectarse de forma segura con Mercado Pago. Intentá de nuevo más tarde.");
            setProcessing(false);
        }
    };

    // ── Success screen ────────────────────────────────────────────────────────

    if (step === 'success') {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center justify-center text-center px-6 py-20 gap-6">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <span className="material-symbols-outlined text-5xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                        check_circle
                    </span>
                </div>
                <h1 className="text-3xl font-bold font-serif text-stone-800 dark:text-white">
                    ¡Pedido confirmado! 🎉
                </h1>
                <p className="text-stone-500 dark:text-stone-400 max-w-md leading-relaxed">
                    Gracias por tu compra. Tu pedido <span className="font-bold text-stone-700 dark:text-stone-200">{orderId}</span> fue recibido con éxito. Te enviaremos un email a <span className="font-bold text-stone-700 dark:text-stone-200">{shipping.email}</span> con los detalles.
                </p>
                <div className="flex flex-wrap gap-4 justify-center mt-4">
                    <Link
                        to="/"
                        className="px-6 py-3 bg-primary text-white rounded-full text-sm font-bold tracking-wide hover:bg-primary-dark transition-colors"
                    >
                        Volver al inicio
                    </Link>
                    <Link
                        to="/tienda"
                        className="px-6 py-3 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 rounded-full text-sm font-bold tracking-wide hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                    >
                        Seguir comprando
                    </Link>
                </div>
            </div>
        );
    }

    // ── Layout ────────────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display">
            {/* Top bar */}
            <div className="w-full border-b border-stone-100 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
                        <span className="material-symbols-outlined text-primary">diamond</span>
                        <span className="font-serif font-bold">Geodas del Uruguay</span>
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-stone-400 dark:text-stone-500">
                        <span className="material-symbols-outlined !text-[16px]">lock</span>
                        Pago seguro
                    </div>
                </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-stone-100 dark:bg-stone-800 h-1">
                <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: step === 'shipping' ? '50%' : '100%' }}
                />
            </div>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 lg:gap-14 items-start">

                    {/* ── Left: Form ──────────────────────────────────────────────── */}
                    <div>
                        {/* Step indicator */}
                        <div className="flex items-center gap-3 mb-8">
                            <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${step === 'shipping' ? 'bg-primary text-white' : 'bg-primary/20 text-primary'}`}>
                                {step === 'payment' ? <span className="material-symbols-outlined !text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span> : '1'}
                            </div>
                            <span className={`text-sm font-semibold ${step === 'shipping' ? 'text-stone-800 dark:text-white' : 'text-stone-400'}`}>Datos de envío</span>
                            <span className="text-stone-300 dark:text-stone-600 mx-1">→</span>
                            <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${step === 'payment' ? 'bg-primary text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-400'}`}>2</div>
                            <span className={`text-sm font-semibold ${step === 'payment' ? 'text-stone-800 dark:text-white' : 'text-stone-400'}`}>Pago</span>
                        </div>

                        {/* ── STEP 1: Shipping ───────────────────────────────────────── */}
                        {step === 'shipping' && (
                            <form onSubmit={handleShippingSubmit} noValidate className="flex flex-col gap-6">
                                <h2 className="text-2xl font-bold font-serif text-stone-900 dark:text-white">Datos personales & envío</h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="sm:col-span-2">
                                        <Field label="Nombre completo" value={shipping.nombre} onChange={v => setShipping(s => ({ ...s, nombre: v }))} error={shippingErrors.nombre} placeholder="María García" />
                                    </div>
                                    <Field label="Email" type="email" value={shipping.email} onChange={v => setShipping(s => ({ ...s, email: v }))} error={shippingErrors.email} placeholder="maria@email.com" />
                                    <Field label="Teléfono" type="tel" value={shipping.telefono} onChange={v => setShipping(s => ({ ...s, telefono: v }))} error={shippingErrors.telefono} placeholder="+598 99 000 000" />
                                    <div className="sm:col-span-2">
                                        <Field label="Dirección" value={shipping.direccion} onChange={v => setShipping(s => ({ ...s, direccion: v }))} error={shippingErrors.direccion} placeholder="Av. 18 de Julio 1234, Apto 5" />
                                    </div>
                                    <Field label="Ciudad" value={shipping.ciudad} onChange={v => setShipping(s => ({ ...s, ciudad: v }))} error={shippingErrors.ciudad} placeholder="Montevideo" />
                                    <Field label="Departamento" value={shipping.departamento} onChange={v => setShipping(s => ({ ...s, departamento: v }))} error={shippingErrors.departamento} placeholder="Montevideo" />
                                    <Field label="Código postal (opcional)" value={shipping.codigoPostal} onChange={v => setShipping(s => ({ ...s, codigoPostal: v }))} placeholder="11300" />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 mt-2 bg-primary hover:bg-primary-dark text-white font-bold uppercase tracking-widest text-xs rounded-full shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    Continuar al pago
                                    <span className="material-symbols-outlined !text-[18px]">arrow_forward</span>
                                </button>
                            </form>
                        )}

                        {/* ── STEP 2: Payment (Mercado Pago redirect) ─────────────────── */}
                        {step === 'payment' && (
                            <form onSubmit={handlePaymentSubmit} noValidate className="flex flex-col gap-6">
                                <div>
                                    <h2 className="text-2xl font-bold font-serif text-stone-900 dark:text-white mb-1">Pago seguro</h2>
                                    <p className="text-xs text-stone-400 dark:text-stone-500 flex items-center gap-1">
                                        Serás redirigido a la plataforma segura de Mercado Pago.
                                    </p>
                                </div>

                                <div className="p-8 border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 rounded-2xl flex flex-col items-center justify-center text-center gap-4">
                                    <div className="flex gap-2 text-stone-300 dark:text-stone-600">
                                        <span className="material-symbols-outlined text-4xl">lock</span>
                                        <span className="material-symbols-outlined text-4xl">account_balance</span>
                                    </div>
                                    <p className="text-sm text-stone-500 dark:text-stone-400">Paga de forma rápida y segura a través de Mercado Pago sin dejarnos los datos de tus tarjetas.</p>
                                </div>

                                {/* Pay button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-4 mt-2 bg-primary hover:bg-primary-dark disabled:bg-primary/60 text-white font-bold uppercase tracking-widest text-xs rounded-full shadow-md hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    {processing ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Redirigiendo a pasarela segura...
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined !text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                                            Pagar con Mercado Pago
                                        </>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setStep('shipping')}
                                    className="w-full text-center text-xs text-stone-400 hover:text-stone-600 underline underline-offset-2 transition-colors"
                                >
                                    ← Volver a datos de envío
                                </button>
                            </form>
                        )}
                    </div>

                    {/* ── Right: Order Summary ─────────────────────────────────────── */}
                    <aside className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 p-6 sticky top-24">
                        <h3 className="font-bold font-serif text-stone-900 dark:text-white mb-5 text-lg">Resumen del pedido</h3>

                        <ul className="flex flex-col gap-4 mb-5">
                            {items.map(item => (
                                <li key={item.id} className="flex gap-3 items-start">
                                    <div className="relative flex-shrink-0">
                                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-100">
                                            {item.images[0] && (
                                                <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                                            )}
                                        </div>
                                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-stone-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                            {item.quantity}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-stone-800 dark:text-stone-100 font-serif truncate">{item.title}</p>
                                        <p className="text-xs text-stone-400">{item.type || item.category}</p>
                                    </div>
                                    <p className="text-sm font-bold text-stone-700 dark:text-stone-300 whitespace-nowrap">
                                        $ {(item.price * item.quantity).toLocaleString('es-UY')}
                                    </p>
                                </li>
                            ))}
                        </ul>

                        <div className="border-t border-stone-100 dark:border-stone-800 pt-4 flex flex-col gap-2">
                            <div className="flex justify-between text-sm text-stone-500 dark:text-stone-400">
                                <span>Subtotal</span>
                                <span>$ {subtotal.toLocaleString('es-UY')}</span>
                            </div>
                            <div className="flex justify-between text-sm text-stone-500 dark:text-stone-400">
                                <span>Envío</span>
                                <span className={freeShipping ? 'text-primary font-semibold' : ''}>
                                    {freeShipping ? 'Gratis 🎉' : `$ ${SHIPPING_COST.toLocaleString('es-UY')}`}
                                </span>
                            </div>
                            <div className="flex justify-between font-bold text-stone-900 dark:text-white text-base pt-2 border-t border-stone-100 dark:border-stone-800 mt-1">
                                <span className="font-serif">Total</span>
                                <span>$ {finalTotal.toLocaleString('es-UY')}</span>
                            </div>
                            {!freeShipping && (
                                <p className="text-[11px] text-stone-400 dark:text-stone-500 text-center mt-1">
                                    Agregá $ {(5000 - subtotal).toLocaleString('es-UY')} más para envío gratis
                                </p>
                            )}
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
};
