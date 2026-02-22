import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { productUrl } from '../utils/slugify';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <article className="group flex flex-col bg-white dark:bg-[#1A1917] rounded-xl overflow-hidden h-full shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-stone-200/60 dark:border-stone-700/40 transition-all duration-300 hover:-translate-y-1">
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-stone-100 dark:bg-stone-800">
        <Link to={productUrl(product.slug)} className="block absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            style={{ backgroundImage: `url('${product.images[0]}')` }}
          />
          {/* Subtle gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/8 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>

        {/* New badge */}
        {product.isNew && (
          <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-[#8C7E60]/90 backdrop-blur-sm text-white px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-[9px] sm:text-[10px] font-bold uppercase tracking-wider z-10">
            Nuevo
          </div>
        )}

        {/* Quick add button */}
        <button
          onClick={handleAdd}
          className={`absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold transition-all duration-300 shadow-lg backdrop-blur-sm z-10 ${added
              ? 'bg-stone-800 text-white scale-105'
              : 'bg-white/90 text-stone-700 hover:bg-[#8C7E60] hover:text-white opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0'
            }`}
          aria-label="Agregar al carrito"
        >
          <span className="material-symbols-outlined !text-[14px] sm:!text-[16px]" style={{ fontVariationSettings: added ? "'FILL' 1" : "'FILL' 0" }}>
            {added ? 'check' : 'shopping_bag'}
          </span>
          {added ? '¡Listo!' : 'Agregar'}
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-3 sm:p-4 md:p-5 lg:p-6">
        {/* Category label */}
        <span className="text-[9px] sm:text-[10px] lg:text-[11px] font-semibold text-[#8C7E60] dark:text-[#C5A059] uppercase tracking-[0.15em] mb-1 sm:mb-1.5 lg:mb-2">
          {product.type || product.category || 'Pieza'}
        </span>

        {/* Title */}
          <Link to={productUrl(product.slug)}>
          <h3 className="text-[13px] sm:text-sm md:text-base lg:text-lg font-bold text-stone-800 dark:text-stone-100 leading-snug font-serif hover:text-[#8C7E60] dark:hover:text-[#C5A059] transition-colors duration-200 line-clamp-2 mb-2 sm:mb-3">
            {product.title}
          </h3>
        </Link>

        {/* Price + Button */}
        <div className="mt-auto pt-2.5 sm:pt-3 lg:pt-4 border-t border-stone-100 dark:border-stone-700/50">
          <span className="block text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-stone-800 dark:text-stone-100 tracking-tight mb-2 sm:mb-3">
            $ {product.price.toLocaleString('es-UY')}
          </span>
          <Link
            to={productUrl(product.slug)}
            className="w-full inline-flex items-center justify-center gap-1.5 py-2 sm:py-2.5 lg:py-3 bg-[#8C7E60] hover:bg-[#756A50] text-white text-[11px] sm:text-xs md:text-sm font-semibold rounded-lg transition-all duration-250 tracking-wide"
          >
            Ver Detalle
            <span className="material-symbols-outlined !text-[14px] sm:!text-[16px] transition-transform duration-200 group-hover:translate-x-0.5">
              arrow_forward
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
};
