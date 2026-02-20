import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

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
    <article className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-black/5 h-full">
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
        <Link to={`/producto/${product.id}`}>
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url('${product.images[0]}')` }}
          />
        </Link>
        {product.isNew && (
          <div className="absolute top-3 left-3 bg-primary text-olive px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">
            Nuevo
          </div>
        )}
        {/* Quick add button */}
        <button
          onClick={handleAdd}
          className={`absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold transition-all duration-300 shadow-md ${added
              ? 'bg-stone-800 text-white scale-105'
              : 'bg-white/90 text-stone-700 hover:bg-primary hover:text-white opacity-0 group-hover:opacity-100'
            }`}
          aria-label="Agregar al carrito"
        >
          <span className="material-symbols-outlined !text-[16px]" style={{ fontVariationSettings: added ? "'FILL' 1" : "'FILL' 0" }}>
            {added ? 'check' : 'shopping_bag'}
          </span>
          {added ? '¡Listo!' : 'Agregar'}
        </button>
      </div>
      <div className="flex flex-col flex-grow p-5">
        <div className="mb-1 text-xs font-medium text-text-secondary uppercase tracking-widest">{product.type || 'Pieza'}</div>
        <Link to={`/producto/${product.id}`}>
          <h3 className="text-lg font-bold text-text-main mb-2 font-display hover:text-primary transition-colors">{product.title}</h3>
        </Link>
        <div className="mt-auto pt-4 flex items-end justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-olive">$ {product.price.toLocaleString('es-UY')}</span>
          </div>
          <Link to={`/producto/${product.id}`} className="px-4 py-2 bg-olive hover:bg-primary hover:text-olive text-white text-sm font-bold rounded-lg transition-colors duration-300 shadow-sm flex items-center gap-1">
            Ver Detalle
          </Link>
        </div>
      </div>
    </article>
  );
};
