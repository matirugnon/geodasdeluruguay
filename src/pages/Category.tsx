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
    <div className="min-h-screen bg-[#F8F7F4]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center mb-6 text-sm text-stone-500 font-sans">
          <span>Inicio</span>
          <span className="mx-2">/</span>
          <span className="font-medium text-stone-700 capitalize">{id}</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 rounded-md border border-stone-200 bg-white p-5">
          <h1 className="font-serif text-3xl text-stone-900 font-medium capitalize">{id}</h1>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-sm text-stone-500 whitespace-nowrap">Ordenar:</span>
            <select
              className="bg-white border border-stone-300 rounded-md px-3 py-2.5 text-sm font-medium text-stone-700 focus:ring-1 focus:ring-[#8C7E60] focus:border-[#8C7E60] cursor-pointer w-full sm:w-auto"
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
          <div className="py-24 flex flex-col items-center gap-4 rounded-md border border-stone-200 bg-white">
            <div className="w-7 h-7 border-2 border-stone-200 border-t-[#8C7E60] rounded-full animate-spin" />
            <p className="text-stone-500 text-sm">Cargando productos...</p>
          </div>
        ) : (
          <>
            {products.length === 0 ? (
              <div className="py-24 text-center text-stone-500 rounded-md border border-stone-200 bg-white">No hay productos en esta categoría aún.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
                {sortedProducts.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
