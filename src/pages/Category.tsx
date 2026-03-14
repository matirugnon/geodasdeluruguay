import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
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
    <div className="content-shell section-shell-lg">
      <nav className="mb-8 flex items-center gap-2 text-sm text-stone-400">
        <Link className="transition-colors duration-150 hover:text-[var(--brand)]" to="/">Inicio</Link>
        <span>/</span>
        <span className="font-medium capitalize text-stone-700">{id}</span>
      </nav>

      <section className="surface-panel rounded-[2rem] px-6 py-8 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="section-kicker">Colección</span>
            <h1 className="section-subtitle capitalize">{id}</h1>
            <p className="section-copy mt-4 max-w-2xl">
              Explorá una selección cuidada de piezas con presencia decorativa y carácter mineral auténtico.
            </p>
          </div>

          <div className="rounded-[1.25rem] border border-[rgba(198,184,162,0.72)] bg-white/75 p-4">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
              Orden
            </label>
            <select
              className="form-select min-w-[220px] text-sm"
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
            >
              <option value="default">Relevancia</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
            </select>
          </div>
        </div>
      </section>

      <section className="section-shell">
        {loading ? (
          <div className="surface-panel-soft flex flex-col items-center gap-4 rounded-[1.75rem] py-20">
            <div className="h-8 w-8 rounded-full border-2 border-[var(--brand)]/20 border-t-[var(--brand)] animate-spin" />
            <p className="text-sm text-stone-500">Cargando piezas...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="surface-panel-soft rounded-[1.75rem] px-6 py-20 text-center">
            <h2 className="font-serif text-3xl text-stone-900">No hay piezas disponibles por ahora</h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-stone-500">
              Esta categoría no tiene productos visibles en este momento. Podés seguir explorando el resto del catálogo.
            </p>
            <Link className="btn-primary mt-6" to="/tienda">Ir a la tienda</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
