import React, { useState } from 'react';
import { ArrowRight, Check, ShoppingBag } from 'lucide-react';
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
      className="group info-card flex h-full cursor-pointer flex-col overflow-hidden rounded-[1.6rem] [touch-action:manipulation]"
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
      <div className="relative aspect-[4/5] overflow-hidden bg-[rgba(245,240,232,0.88)]">
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[rgba(235,225,212,0.45)] text-stone-400">
            <ShoppingBag className="h-10 w-10" />
          </div>
        )}

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {product.isNew && (
            <span className="rounded-full bg-[var(--brand)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
              Nuevo
            </span>
          )}
          {product.stock > 0 && (
            <span className="rounded-full bg-white/85 px-3 py-1 text-[11px] font-medium text-stone-700 backdrop-blur">
              Disponible
            </span>
          )}
        </div>

        <button
          onClick={handleAdd}
          className={`absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 ${
            added
              ? 'bg-stone-900 text-white'
              : 'bg-white/92 text-stone-800 shadow-[0_8px_18px_rgba(31,24,18,0.14)] hover:bg-[var(--brand)] hover:text-white'
          }`}
          aria-label="Agregar al carrito"
        >
          {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
          {added ? 'Agregado' : 'Sumar'}
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--brand)]">
              {product.type || product.category || 'Pieza'}
            </span>
            <span className="text-xs text-stone-400">{product.category}</span>
          </div>

          <h3 className="font-serif text-lg leading-snug text-stone-900 transition-colors duration-200 group-hover:text-[var(--brand)]">
            {product.title}
          </h3>

          {product.description && (
            <p className="line-clamp-2 text-sm leading-6 text-stone-500">
              {product.description}
            </p>
          )}
        </div>

        <div className="mt-auto flex items-end justify-between gap-4 border-t border-[rgba(198,184,162,0.45)] pt-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-stone-400">Precio</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-stone-900">
              $ {product.price.toLocaleString('es-UY')}
            </p>
          </div>

          <span className="inline-flex items-center gap-2 text-sm font-medium text-[var(--brand)]">
            Ver detalle
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </article>
  );
};
