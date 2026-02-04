import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
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
