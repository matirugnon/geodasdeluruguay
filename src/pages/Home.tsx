import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { Product, Tip } from '../types';
import { productUrl, tipUrl } from '../utils/slugify';
import { SEOHead } from '../components/SEOHead';
import { ProductCard } from '../components/ProductCard';

const CATEGORY_HIGHLIGHTS = [
  { name: 'Collares', slug: 'collares', description: 'Diseños delicados para uso diario' },
  { name: 'Anillos', slug: 'anillos', description: 'Piezas elegantes con minerales naturales' },
  { name: 'Brazaletes', slug: 'brazaletes', description: 'Combinaciones para regalar o combinar' },
  { name: 'Piedras', slug: 'piedras', description: 'Geodas y cristales para hogar y energía' },
];

const TRUST_ITEMS = [
  { title: 'Pago seguro', detail: 'Mercado Pago y transferencia bancaria' },
  { title: 'Envío a todo Uruguay', detail: 'Con opción de retiro en Montevideo' },
  { title: 'Piezas auténticas', detail: 'Minerales naturales seleccionados' },
];

export const Home: React.FC = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [tips, setTips] = useState<Tip[]>([]);

  useEffect(() => {
    const load = async () => {
      const products = await dataService.getVisibleProducts();
      setAllProducts(products);

      const allTips = await dataService.getTips();
      setTips(allTips.slice(0, 3));
    };
    load();
  }, []);

  const featuredProducts = useMemo(() => allProducts.slice(0, 6), [allProducts]);
  const heroImage = useMemo(() => featuredProducts[0], [featuredProducts]);

  return (
    <main className="flex-grow bg-white">
      <SEOHead
        title="Cristales y Piedras Naturales de Uruguay"
        description="Geodas, amatistas, cuarzos y accesorios naturales de Uruguay. Compra online simple, segura y con envío a todo el país."
      />

      {/* Hero */}
      <section className="px-6 md:px-12 pt-10 md:pt-12 pb-8 max-w-[1280px] mx-auto">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-6 lg:gap-10 items-center">
          <div>
            <p className="text-xs tracking-[0.14em] uppercase text-[#8C7E60] font-semibold mb-3">
              Tienda online oficial
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-stone-900 leading-tight mb-4">
              Cristales y geodas de Uruguay.
            </h1>
            <p className="text-stone-700 text-base md:text-lg leading-relaxed max-w-xl mb-6">
              Piezas auténticas, compra simple y envío a todo el país.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                to="/tienda"
                className="min-h-[46px] px-6 inline-flex items-center justify-center rounded-md bg-[#8C7E60] text-white font-medium text-base hover:bg-[#756A50] transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8C7E60]/35"
              >
                Explorar tienda
              </Link>
              <a
                href="https://wa.me/59891458797"
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[46px] px-6 inline-flex items-center justify-center rounded-md border-2 border-stone-300 text-stone-800 font-medium text-base hover:border-stone-400 hover:bg-stone-50 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-stone-300"
              >
                Consultar por WhatsApp
              </a>
            </div>
          </div>

          <div>
            {heroImage?.images?.[0] ? (
              <img
                src={heroImage.images[0]}
                alt={heroImage.title}
                className="w-full aspect-[16/10] rounded-lg object-cover border border-stone-200"
              />
            ) : (
              <div className="w-full aspect-[16/10] rounded-lg bg-stone-100 border border-stone-200" />
            )}
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-stone-200 bg-stone-50">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 py-5 grid sm:grid-cols-3 gap-4">
          {TRUST_ITEMS.map(item => (
            <div key={item.title} className="text-center sm:text-left">
              <p className="text-stone-900 font-semibold text-base">{item.title}</p>
              <p className="text-stone-600 text-sm">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-[1280px] mx-auto px-6 md:px-12 py-12 md:py-14">
        <div className="flex items-end justify-between mb-7">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-2">Comprá por categoría</h2>
            <p className="text-stone-700 text-base md:text-lg">Una forma rápida de encontrar lo que buscás.</p>
          </div>
          <Link to="/tienda" className="hidden md:inline text-sm text-[#8C7E60] font-medium hover:text-[#756A50]">
            Ver todo
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORY_HIGHLIGHTS.map(category => (
            <Link
              key={category.slug}
              to={`/tienda/${category.slug}`}
              className="min-h-[132px] rounded-lg border border-stone-200 bg-white p-5 hover:border-stone-300 hover:shadow-sm transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8C7E60]/30"
            >
              <p className="text-stone-900 font-semibold text-lg mb-1">{category.name}</p>
              <p className="text-stone-600 text-sm leading-relaxed">{category.description}</p>
              <span className="inline-flex items-center gap-1 mt-4 text-sm text-[#8C7E60] font-medium">
                Ver productos
                <span className="material-symbols-outlined !text-[16px]">arrow_forward</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-[1280px] mx-auto px-6 md:px-12 pb-12 md:pb-14">
        <div className="flex items-end justify-between mb-7">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-2">Productos destacados</h2>
            <p className="text-stone-700 text-base md:text-lg">Selección curada para compra rápida y segura.</p>
          </div>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="py-16 text-center text-stone-600 text-lg">Cargando productos...</div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Tips */}
      {tips.length > 0 && (
        <section className="max-w-[1280px] mx-auto px-6 md:px-12 pb-12 md:pb-14">
          <div className="flex items-end justify-between mb-7">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-2">Tips y cuidados</h2>
              <p className="text-stone-700 text-base md:text-lg">Consejos simples para mantener tus minerales.</p>
            </div>
            <Link to="/tips" className="hidden md:inline text-sm text-[#8C7E60] font-medium hover:text-[#756A50]">
              Ver todos
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {tips.map(tip => (
              <Link
                key={tip.id}
                to={tipUrl(tip.slug)}
                className="rounded-lg border border-stone-200 overflow-hidden bg-white hover:border-stone-300 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8C7E60]/30"
              >
                <div className="aspect-[16/10] bg-stone-100">
                  {tip.image && <img src={tip.image} alt={tip.title} className="w-full h-full object-cover" loading="lazy" />}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-stone-900 text-lg mb-2 line-clamp-2">{tip.title}</h3>
                  <p className="text-stone-600 text-sm line-clamp-3">{tip.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="border-t border-stone-200">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 py-10 md:py-12 text-center">
          <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-3">Encontrá tu próxima pieza</h2>
          <p className="text-stone-700 text-base md:text-lg mb-6">Catálogo actualizado y compra simple.</p>
          <Link
            to="/tienda"
            className="min-h-[46px] px-7 inline-flex items-center justify-center rounded-md bg-[#8C7E60] text-white font-medium text-base hover:bg-[#756A50] transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8C7E60]/35"
          >
            Ir a la tienda
          </Link>
        </div>
      </section>
    </main>
  );
};
