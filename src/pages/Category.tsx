import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';

export const Category: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<'price-asc' | 'price-desc' | 'default'>('default');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      if (id) {
        // Simple heuristic: if id is 'amatistas', fetch category 'Amatistas'
        const catName = id.charAt(0).toUpperCase() + id.slice(1); 
        const items = await dataService.getProductsByCategory(catName);
        setProducts(items);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const sortedProducts = [...products].sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    return 0;
  });

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex mb-8 text-sm">
         <span className="text-text-secondary">Inicio</span>
         <span className="mx-2 text-text-secondary">/</span>
         <span className="font-bold text-text-main capitalize">{id}</span>
      </nav>

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-display font-bold capitalize">{id}</h2>
        <div className="flex items-center gap-2">
           <span className="text-sm text-text-secondary">Ordenar por:</span>
           <select 
             className="bg-transparent border-none font-bold text-olive focus:ring-0 cursor-pointer"
             value={sort}
             onChange={(e) => setSort(e.target.value as any)}
           >
             <option value="default">Relevancia</option>
             <option value="price-asc">Precio: Menor a Mayor</option>
             <option value="price-desc">Precio: Mayor a Menor</option>
           </select>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">Cargando cristales...</div>
      ) : (
        <>
          {products.length === 0 ? (
            <div className="py-20 text-center text-text-secondary">No hay productos en esta categoría aún.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {sortedProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </>
      )}
    </div>
  );
};
