import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createWhatsAppLink } from '../config/site';

export const CartDrawer: React.FC = () => {
    const navigate = useNavigate();
    const { items, isOpen, itemCount, subtotal, removeItem, updateQty, closeCart } = useCart();
    const checkoutSupportLink = createWhatsAppLink('Hola! Tengo una consulta antes de finalizar mi compra en Geodas del Uruguay.');

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
                        <div>
                            <h2 className="text-base font-serif font-semibold text-stone-800">
                                Tu Carrito
                            </h2>
                            {items.length > 0 && (
                                <p className="text-[11px] uppercase tracking-[0.16em] text-stone-400 mt-1">
                                    {itemCount} {itemCount === 1 ? 'pieza seleccionada' : 'piezas seleccionadas'}
                                </p>
                            )}
                        </div>
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
                        <div className="rounded-md border border-stone-200 bg-white p-4 mb-4">
                            <div className="flex items-center justify-between gap-3 text-sm text-stone-500">
                                <span>Subtotal actual</span>
                                <span className="font-medium text-stone-700">$ {subtotal.toLocaleString('es-UY')}</span>
                            </div>
                            <p className="mt-3 text-xs text-stone-500 leading-relaxed">
                                En el checkout elegís entrega y medio de pago. Si preferís transferencia, el descuento se aplica en ese paso.
                            </p>
                            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-stone-500">
                                <Link
                                    to="/envios"
                                    onClick={closeCart}
                                    className="hover:text-[#8C7E60] underline underline-offset-4 transition-colors duration-150"
                                >
                                    Ver envíos
                                </Link>
                                <Link
                                    to="/devoluciones"
                                    onClick={closeCart}
                                    className="hover:text-[#8C7E60] underline underline-offset-4 transition-colors duration-150"
                                >
                                    Devoluciones
                                </Link>
                                <a
                                    href={checkoutSupportLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-[#8C7E60] underline underline-offset-4 transition-colors duration-150"
                                >
                                    Consultar antes de pagar
                                </a>
                            </div>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="w-full py-3.5 bg-[#8C7E60] hover:bg-[#756A50] text-white font-medium text-sm rounded transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined !text-[16px]">lock</span>
                            Continuar al checkout
                        </button>
                        <p className="mt-3 text-center text-[11px] text-stone-500 leading-relaxed">
                            Revisás envío, forma de pago y confirmás el pedido antes de finalizar.
                        </p>
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
