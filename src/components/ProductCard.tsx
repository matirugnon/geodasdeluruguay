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

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <article
      className="group flex flex-col bg-white rounded-md overflow-hidden h-full border border-stone-200/80 transition-all duration-200 [@media(hover:hover)]:hover:border-stone-300 [@media(hover:hover)]:hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] focus-within:border-stone-300 focus-within:shadow-[0_4px_20px_rgba(0,0,0,0.06)] [touch-action:manipulation]"
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#F5F3EF]">
        <Link
          to={productUrl(product.slug)}
          aria-label={`Ver detalle de ${product.title}`}
          className="absolute inset-0 z-10 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C7E60] focus-visible:ring-inset"
        >
          <span className="sr-only">Ver detalle de {product.title}</span>
        </Link>
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out [@media(hover:hover)]:group-hover:scale-[1.03] pointer-events-none"
          style={{ backgroundImage: `url('${product.images[0]}')` }}
        />

        {/* New badge */}
        {product.isNew && (
          <div className="absolute top-3 left-3 bg-[#8C7E60] text-white px-2.5 py-1 rounded text-[10px] font-semibold uppercase tracking-wider z-20">
            Nuevo
          </div>
        )}

        {/* Quick add button */}
        <button
          onClick={handleAdd}
          className={`absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-2 rounded text-xs font-semibold transition-all duration-200 z-10 ${added
              ? 'bg-stone-800 text-white'
              : 'bg-white text-stone-700 hover:bg-[#8C7E60] hover:text-white opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-hover:translate-y-0 translate-y-1 [@media(hover:none)]:opacity-100 [@media(hover:none)]:translate-y-0 shadow-sm'
            }`}
          aria-label={`Agregar ${product.title} al carrito`}
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
        <span className="text-[10px] sm:text-[11px] font-medium text-[#8C7E60] uppercase tracking-[0.12em] mb-1.5">
          {product.type || product.category || 'Pieza'}
        </span>

        {/* Title */}
        <Link
          to={productUrl(product.slug)}
          className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C7E60] focus-visible:ring-offset-2"
        >
          <h3 className="text-sm sm:text-[15px] md:text-base font-semibold text-stone-800 leading-snug font-serif hover:text-[#8C7E60] transition-colors duration-200 line-clamp-2 mb-3">
            {product.title}
          </h3>
        </Link>

        {/* Price + Button */}
        <div className="mt-auto pt-3 border-t border-stone-100">
          <span className="block text-lg sm:text-xl md:text-2xl font-bold text-stone-900 tracking-tight mb-3">
            $ {product.price.toLocaleString('es-UY')}
          </span>
          <Link
            to={productUrl(product.slug)}
            className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 bg-[#8C7E60] hover:bg-[#756A50] text-white text-xs sm:text-sm font-medium rounded transition-colors duration-200 tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C7E60] focus-visible:ring-offset-2"
          >
            Ver Detalle
            <span className="material-symbols-outlined !text-[16px] transition-transform duration-200 group-hover:translate-x-0.5">
              arrow_forward
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
};
