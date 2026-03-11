import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { productUrl } from '../utils/slugify';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <article
      className="group flex flex-col bg-white rounded-lg overflow-hidden h-full border border-stone-300/90 [@media(hover:hover)]:hover:border-stone-400 transition-all duration-200 [@media(hover:hover)]:hover:shadow-[0_6px_24px_rgba(0,0,0,0.07)] cursor-pointer [touch-action:manipulation] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8C7E60]/35"
      onClick={() => navigate(productUrl(product.slug))}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate(productUrl(product.slug));
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Ver detalle de ${product.title}`}
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#F5F3EF]">
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out [@media(hover:hover)]:group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-stone-400">
            <span className="material-symbols-outlined !text-[40px]">image</span>
          </div>
        )}

        {/* New badge */}
        {product.isNew && (
          <div className="absolute top-3 left-3 bg-[#8C7E60] text-white px-2.5 py-1 rounded text-[10px] font-semibold uppercase tracking-wider z-10">
            Nuevo
          </div>
        )}

        {/* Quick add button */}
        <button
          onClick={handleAdd}
          className={`absolute bottom-3 right-3 min-h-[44px] px-4 flex items-center gap-1.5 rounded-md text-sm font-semibold transition-all duration-200 z-10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8C7E60]/35 ${added
              ? 'bg-stone-800 text-white'
              : 'bg-white text-stone-700 hover:bg-[#8C7E60] hover:text-white opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-hover:translate-y-0 translate-y-1 [@media(hover:none)]:opacity-100 [@media(hover:none)]:translate-y-0 shadow-sm'
            }`}
          aria-label="Agregar al carrito"
        >
          <span className="material-symbols-outlined !text-[16px]" style={{ fontVariationSettings: added ? "'FILL' 1" : "'FILL' 0" }}>
            {added ? 'check' : 'shopping_bag'}
          </span>
          {added ? '¡Listo!' : 'Agregar'}
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-4 sm:p-5">
        {/* Category label */}
        <span className="text-xs sm:text-sm font-semibold text-[#6F6148] uppercase tracking-[0.08em] mb-2">
          {product.type || product.category || 'Pieza'}
        </span>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-semibold text-stone-900 leading-snug font-serif hover:text-[#8C7E60] transition-colors duration-200 line-clamp-2 mb-3">
          {product.title}
        </h3>

        {/* Price + Button */}
        <div className="mt-auto pt-3 border-t border-stone-100">
          <span className="block text-xl sm:text-2xl font-bold text-stone-900 tracking-tight mb-3">
            $ {product.price.toLocaleString('es-UY')}
          </span>
          <span
            className="w-full min-h-[44px] inline-flex items-center justify-center gap-1.5 py-2.5 bg-[#8C7E60] hover:bg-[#756A50] text-white text-sm sm:text-base font-medium rounded-md transition-colors duration-200 tracking-wide"
          >
            Ver Detalle
            <span className="material-symbols-outlined !text-[16px] transition-transform duration-200 group-hover:translate-x-0.5">
              arrow_forward
            </span>
          </span>
        </div>
      </div>
    </article>
  );
};
