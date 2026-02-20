import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export const CartDrawer: React.FC = () => {
    const navigate = useNavigate();
    const { items, isOpen, subtotal, removeItem, updateQty, closeCart } = useCart();

    // Lock body scroll when drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const handleCheckout = () => {
        closeCart();
        navigate('/checkout');
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={closeCart}
                aria-hidden="true"
            />

            {/* Drawer Panel */}
            <aside
                className="fixed top-0 right-0 z-[70] h-full w-full max-w-md bg-white dark:bg-stone-900 shadow-2xl flex flex-col"
                style={{ animation: 'slideInRight 0.3s ease-out' }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100 dark:border-stone-800">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">shopping_bag</span>
                        <h2 className="text-lg font-bold font-serif text-stone-900 dark:text-white tracking-tight">
                            Tu Carrito
                        </h2>
                    </div>
                    <button
                        onClick={closeCart}
                        className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                        aria-label="Cerrar carrito"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto py-4 px-6">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-16 gap-4">
                            <span className="material-symbols-outlined text-5xl text-stone-200 dark:text-stone-700">
                                shopping_bag
                            </span>
                            <p className="text-stone-400 dark:text-stone-500 font-display text-sm">
                                Tu carrito está vacío.
                            </p>
                            <button
                                onClick={closeCart}
                                className="mt-2 text-primary text-sm font-semibold underline underline-offset-2 hover:text-primary-dark transition-colors"
                            >
                                Seguir explorando →
                            </button>
                        </div>
                    ) : (
                        <ul className="flex flex-col gap-5">
                            {items.map(item => (
                                <li
                                    key={item.id}
                                    className="flex gap-4 py-4 border-b border-stone-50 dark:border-stone-800 last:border-b-0"
                                >
                                    {/* Thumbnail */}
                                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-stone-100">
                                        {item.images[0] ? (
                                            <img
                                                src={item.images[0]}
                                                alt={item.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="material-symbols-outlined text-stone-300 text-2xl">diamond</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex flex-col flex-1 min-w-0">
                                        <p className="text-xs font-medium text-stone-400 uppercase tracking-widest truncate mb-0.5">
                                            {item.type || item.category}
                                        </p>
                                        <h3 className="font-bold font-serif text-stone-800 dark:text-stone-100 leading-snug truncate text-sm">
                                            {item.title}
                                        </h3>
                                        <p className="text-primary font-bold text-sm mt-1">
                                            $ {item.price.toLocaleString('es-UY')}
                                        </p>

                                        {/* Qty stepper + remove */}
                                        <div className="flex items-center justify-between mt-3">
                                            <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 rounded-full px-1 py-0.5">
                                                <button
                                                    onClick={() => updateQty(item.id, item.quantity - 1)}
                                                    className="w-7 h-7 flex items-center justify-center rounded-full text-stone-500 hover:text-stone-900 hover:bg-white dark:hover:bg-stone-700 transition-colors text-lg font-bold"
                                                    aria-label="Disminuir cantidad"
                                                >
                                                    −
                                                </button>
                                                <span className="w-6 text-center text-sm font-bold text-stone-800 dark:text-stone-100 select-none">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQty(item.id, item.quantity + 1)}
                                                    className="w-7 h-7 flex items-center justify-center rounded-full text-stone-500 hover:text-stone-900 hover:bg-white dark:hover:bg-stone-700 transition-colors text-lg font-bold"
                                                    aria-label="Aumentar cantidad"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-stone-300 hover:text-red-400 transition-colors"
                                                aria-label="Eliminar producto"
                                            >
                                                <span className="material-symbols-outlined !text-[20px]">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="px-6 py-5 border-t border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900">
                        <div className="flex items-center justify-between mb-1 text-sm text-stone-500 dark:text-stone-400">
                            <span>Subtotal</span>
                            <span>$ {subtotal.toLocaleString('es-UY')}</span>
                        </div>
                        <div className="flex items-center justify-between mb-5">
                            <span className="font-bold text-stone-900 dark:text-white font-serif text-base">Total</span>
                            <span className="font-bold text-stone-900 dark:text-white text-base">
                                $ {subtotal.toLocaleString('es-UY')}
                            </span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-bold tracking-widest uppercase text-xs rounded-full shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined !text-[18px]">lock</span>
                            Ir al Checkout
                        </button>
                        <button
                            onClick={closeCart}
                            className="w-full mt-3 text-center text-xs text-stone-400 hover:text-stone-600 underline underline-offset-2 transition-colors"
                        >
                            Seguir comprando
                        </button>
                    </div>
                )}
            </aside>

            <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
        </>
    );
};
