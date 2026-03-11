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
      className="group flex flex-col bg-white rounded-md overflow-hidden h-full border border-stone-200 transition-colors duration-150 [@media(hover:hover)]:hover:border-stone-300 cursor-pointer [touch-action:manipulation]"
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
      <div className="relative aspect-[5/6] overflow-hidden bg-[#F5F3EF] border-b border-stone-100">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-300 ease-out [@media(hover:hover)]:group-hover:scale-[1.02]"
          style={{ backgroundImage: `url('${product.images[0]}')` }}
        />

        {/* New badge */}
        {product.isNew && (
          <div className="absolute top-3 left-3 bg-[#8C7E60] text-white px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider z-10">
            Nuevo
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-4 sm:p-5 gap-2.5">
        {/* Category label */}
        <span className="text-[11px] font-medium text-[#8C7E60] uppercase tracking-[0.12em]">
          {product.type || product.category || 'Pieza'}
        </span>

        {/* Title */}
        <h3 className="text-[15px] md:text-base font-semibold text-stone-800 leading-snug font-serif transition-colors duration-150 line-clamp-2 min-h-[2.8rem]">
          {product.title}
        </h3>

        {/* Price + actions */}
        <div className="mt-auto pt-3 border-t border-stone-100 space-y-3">
          <span className="block text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            $ {product.price.toLocaleString('es-UY')}
          </span>

          <div className="grid grid-cols-[1fr_auto] gap-2">
            <span className="min-h-11 inline-flex items-center justify-center gap-1.5 px-3 bg-[#8C7E60] hover:bg-[#756A50] text-white text-sm font-medium rounded-md transition-colors duration-150 tracking-wide">
              Ver detalle
              <span className="material-symbols-outlined !text-[16px]">arrow_forward</span>
            </span>

            <button
              onClick={handleAdd}
              className={`min-h-11 min-w-11 inline-flex items-center justify-center gap-1 rounded-md border text-sm font-medium transition-colors duration-150 ${
                added
                  ? 'bg-stone-800 border-stone-800 text-white'
                  : 'bg-white border-stone-300 text-stone-700 hover:border-[#8C7E60] hover:text-[#8C7E60]'
              }`}
              aria-label="Agregar al carrito"
            >
              <span className="material-symbols-outlined !text-[18px]" style={{ fontVariationSettings: added ? "'FILL' 1" : "'FILL' 0" }}>
                {added ? 'check' : 'shopping_bag'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
