import React, { useEffect } from 'react';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export const CartDrawer: React.FC = () => {
    const navigate = useNavigate();
    const { items, isOpen, subtotal, removeItem, updateQty, closeCart } = useCart();

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const handleCheckout = () => {
        closeCart();
        navigate('/checkout');
    };

    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 z-[60] bg-[rgba(30,23,18,0.34)] backdrop-blur-sm transition-opacity"
                onClick={closeCart}
                aria-hidden="true"
            />

            <aside className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col border-l border-[rgba(198,184,162,0.82)] bg-[rgba(255,252,246,0.96)] shadow-[0_24px_48px_rgba(31,24,18,0.18)]">
                <div className="border-b border-[rgba(198,184,162,0.55)] px-6 py-5">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-400">Tu selección</p>
                            <h2 className="mt-2 font-serif text-2xl text-stone-900">Carrito</h2>
                        </div>
                        <button
                            onClick={closeCart}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(198,184,162,0.7)] bg-white/75 text-stone-500 transition-colors duration-150 hover:text-stone-800"
                            aria-label="Cerrar carrito"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                    <p className="text-sm leading-6 text-stone-500">
                        Revisá tu compra antes de pasar al checkout.
                    </p>
                </div>

                <div className="no-scrollbar flex-1 overflow-y-auto px-6 py-5">
                    {items.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center text-center">
                            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[rgba(127,98,66,0.08)] text-[var(--brand)]">
                                <ShoppingBag className="h-9 w-9" />
                            </div>
                            <h3 className="font-serif text-2xl text-stone-900">Todavía no agregaste piezas</h3>
                            <p className="mt-3 max-w-xs text-sm leading-7 text-stone-500">
                                Explorá el catálogo y sumá las piezas que quieras reservar o comprar.
                            </p>
                            <button onClick={closeCart} className="btn-primary mt-6">
                                Seguir explorando
                            </button>
                        </div>
                    ) : (
                        <ul className="space-y-4">
                            {items.map(item => (
                                <li key={item.id} className="surface-panel-soft rounded-[1.4rem] p-4">
                                    <div className="flex gap-4">
                                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-[1.1rem] bg-[rgba(235,225,212,0.45)]">
                                            {item.images[0] ? (
                                                <img src={item.images[0]} alt={item.title} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-stone-300">
                                                    <ShoppingBag className="h-6 w-6" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="mb-1 flex items-start justify-between gap-3">
                                                <div>
                                                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--brand)]">
                                                        {item.type || item.category}
                                                    </p>
                                                    <h3 className="mt-2 font-serif text-lg leading-tight text-stone-900">{item.title}</h3>
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-stone-300 transition-colors duration-150 hover:text-[var(--danger)]"
                                                    aria-label="Eliminar producto"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>

                                            <div className="mt-3 flex items-center justify-between gap-4">
                                                <p className="text-base font-semibold text-stone-900">
                                                    $ {item.price.toLocaleString('es-UY')}
                                                </p>

                                                <div className="inline-flex items-center rounded-full border border-[rgba(198,184,162,0.85)] bg-white/90 px-1">
                                                    <button
                                                        onClick={() => updateQty(item.id, item.quantity - 1)}
                                                        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-stone-500 transition-colors duration-150 hover:text-stone-900"
                                                        aria-label="Disminuir cantidad"
                                                    >
                                                        <Minus className="h-3.5 w-3.5" />
                                                    </button>
                                                    <span className="min-w-8 px-2 text-center text-sm font-semibold text-stone-800">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQty(item.id, item.quantity + 1)}
                                                        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-stone-500 transition-colors duration-150 hover:text-stone-900"
                                                        aria-label="Aumentar cantidad"
                                                    >
                                                        <Plus className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {items.length > 0 && (
                    <div className="border-t border-[rgba(198,184,162,0.55)] bg-[rgba(250,246,239,0.95)] px-6 py-5">
                        <div className="mb-2 flex items-center justify-between text-sm text-stone-500">
                            <span>Subtotal</span>
                            <span>$ {subtotal.toLocaleString('es-UY')}</span>
                        </div>
                        <div className="mb-5 flex items-center justify-between">
                            <span className="text-base font-semibold text-stone-900">Total</span>
                            <span className="text-xl font-semibold tracking-tight text-stone-900">
                                $ {subtotal.toLocaleString('es-UY')}
                            </span>
                        </div>
                        <button onClick={handleCheckout} className="btn-primary w-full">
                            Finalizar compra
                        </button>
                        <button onClick={closeCart} className="btn-ghost mt-3 w-full justify-center text-sm font-medium">
                            Seguir comprando
                        </button>
                    </div>
                )}
            </aside>
        </>
    );
};
