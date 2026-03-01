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
                className="fixed inset-0 z-[60] bg-black/30 transition-opacity"
                onClick={closeCart}
                aria-hidden="true"
            />

            {/* Drawer Panel */}
            <aside
                className="fixed top-0 right-0 z-[70] h-full w-full max-w-md bg-white shadow-xl flex flex-col"
                style={{ animation: 'slideInRight 0.25s ease-out' }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
                    <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-[#8C7E60] !text-[22px]">shopping_bag</span>
                        <h2 className="text-base font-serif font-semibold text-stone-800">
                            Tu Carrito
                        </h2>
                    </div>
                    <button
                        onClick={closeCart}
                        className="p-1.5 rounded text-stone-400 hover:text-stone-600 hover:bg-stone-50 transition-colors duration-150"
                        aria-label="Cerrar carrito"
                    >
                        <span className="material-symbols-outlined !text-[22px]">close</span>
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto py-4 px-6">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-16 gap-3">
                            <span className="material-symbols-outlined !text-[48px] text-stone-200">
                                shopping_bag
                            </span>
                            <p className="text-stone-400 text-sm">
                                Tu carrito está vacío.
                            </p>
                            <button
                                onClick={closeCart}
                                className="mt-1 text-[#8C7E60] text-sm font-medium underline underline-offset-2 hover:text-[#756A50] transition-colors duration-150"
                            >
                                Seguir explorando
                            </button>
                        </div>
                    ) : (
                        <ul className="flex flex-col gap-4">
                            {items.map(item => (
                                <li
                                    key={item.id}
                                    className="flex gap-4 py-4 border-b border-stone-100 last:border-b-0"
                                >
                                    {/* Thumbnail */}
                                    <div className="w-[72px] h-[72px] rounded-md overflow-hidden flex-shrink-0 bg-[#F5F3EF]">
                                        {item.images[0] ? (
                                            <img
                                                src={item.images[0]}
                                                alt={item.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="material-symbols-outlined text-stone-300 !text-[24px]">diamond</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex flex-col flex-1 min-w-0">
                                        <p className="text-[10px] font-medium text-stone-400 uppercase tracking-wider truncate mb-0.5">
                                            {item.type || item.category}
                                        </p>
                                        <h3 className="font-serif font-medium text-stone-800 leading-snug truncate text-sm">
                                            {item.title}
                                        </h3>
                                        <p className="text-[#8C7E60] font-semibold text-sm mt-1">
                                            $ {item.price.toLocaleString('es-UY')}
                                        </p>

                                        {/* Qty stepper + remove */}
                                        <div className="flex items-center justify-between mt-2.5">
                                            <div className="flex items-center border border-stone-200 rounded">
                                                <button
                                                    onClick={() => updateQty(item.id, item.quantity - 1)}
                                                    className="w-8 h-8 flex items-center justify-center text-stone-500 hover:text-stone-800 hover:bg-stone-50 transition-colors duration-150 text-base"
                                                    aria-label="Disminuir cantidad"
                                                >
                                                    −
                                                </button>
                                                <span className="w-8 text-center text-sm font-medium text-stone-800 select-none border-x border-stone-200">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQty(item.id, item.quantity + 1)}
                                                    className="w-8 h-8 flex items-center justify-center text-stone-500 hover:text-stone-800 hover:bg-stone-50 transition-colors duration-150 text-base"
                                                    aria-label="Aumentar cantidad"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-stone-300 hover:text-red-400 transition-colors duration-150"
                                                aria-label="Eliminar producto"
                                            >
                                                <span className="material-symbols-outlined !text-[18px]">delete</span>
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
                    <div className="px-6 py-5 border-t border-stone-100 bg-[#FAFAF8]">
                        <div className="flex items-center justify-between mb-1 text-sm text-stone-500">
                            <span>Subtotal</span>
                            <span>$ {subtotal.toLocaleString('es-UY')}</span>
                        </div>
                        <div className="flex items-center justify-between mb-5">
                            <span className="font-semibold text-stone-800 text-base">Total</span>
                            <span className="font-semibold text-stone-800 text-base">
                                $ {subtotal.toLocaleString('es-UY')}
                            </span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="w-full py-3.5 bg-[#8C7E60] hover:bg-[#756A50] text-white font-medium text-sm rounded transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined !text-[16px]">lock</span>
                            Ir al Checkout
                        </button>
                        <button
                            onClick={closeCart}
                            className="w-full mt-2.5 text-center text-xs text-stone-400 hover:text-stone-600 underline underline-offset-2 transition-colors duration-150"
                        >
                            Seguir comprando
                        </button>
                    </div>
                )}
            </aside>

            <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
        </>
    );
};
