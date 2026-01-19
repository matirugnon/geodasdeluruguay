import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { Product } from '../types';

interface CategoryInfo {
    title: string;
    description: string;
}

const CATEGORY_MAP: Record<string, CategoryInfo> = {
    'collares': { title: 'Collares ', description: '"Fragmentos de energía violeta para proteger tu espíritu y elevar tu vibración."' },
    'anillos': { title: 'Anillos ', description: '"Símbolos de compromiso contigo misma y con el universo."' },
    'brazaletes': { title: 'Brazaletes', description: '"Lleva la energía de las piedras siempre contigo."' },
    'piedras': { title: 'Piedras Naturales', description: '"La naturaleza en su estado más puro, sin filtros ni alteraciones."' },
    'otros-accesorios': { title: 'Otros Accesorios', description: '"Complementos y decoración para tu santuario personal."' }
};

export const ShopCategory: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const allProducts = await dataService.getProducts();
      
      const filtered = allProducts.filter(p => {
         if (!p.visible) return false; // Ensure hidden products from admin are not shown

         const slug = category?.toLowerCase() || '';
         const pCat = p.category.toLowerCase();
         
         // Mapping slug to admin categories
         // Admin Categories: 'Collares', 'Anillos', 'Brazaletes', 'Piedras', 'Otros Accesorios'
         
         if (slug === 'collares' && pCat === 'collares') return true;
         if (slug === 'anillos' && pCat === 'anillos') return true;
         if (slug === 'brazaletes' && pCat === 'brazaletes') return true;
         if (slug === 'piedras' && pCat === 'piedras') return true;
         if (slug === 'otros-accesorios' && pCat === 'otros accesorios') return true;
         
         return false;
      });

      setProducts(filtered);
      setLoading(false);
    };
    loadData();
    window.scrollTo(0,0);
  }, [category]);

  const info = category && CATEGORY_MAP[category] ? CATEGORY_MAP[category] : { title: category || 'Categoría', description: 'Explora nuestra selección.' };

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main-light dark:text-text-main-dark transition-colors duration-300 min-h-screen font-newsreader">
        <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
            {/* Breadcrumb */}
            <div className="flex mb-8">
                <button 
                    onClick={() => navigate('/tienda')}
                    className="group flex items-center gap-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors"
                >
                    <span className="material-symbols-outlined !text-[16px] transition-transform group-hover:-translate-x-1">arrow_back</span>
                    <span className="text-sm font-medium font-sans">Volver a categorías</span>
                </button>
            </div>

            {/* Header */}
            <div className="flex flex-col items-center text-center mb-12 animate-fade-in-up">
                <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight mb-4 text-text-main-light dark:text-text-main-dark capitalize">
                    {info.title}
                </h1>
                <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark max-w-2xl font-display italic">
                    {info.description}
                </p>
            </div>

            {/* Grid or Empty State */}
            {loading ? (
                <div className="py-20 text-center font-sans text-text-secondary-light">Cargando cristales...</div>
            ) : products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-20">
                    {products.map(p => (
                        <Link 
                            key={p.id}
                            to={`/producto/${p.id}`}
                            className="group flex flex-col gap-4 rounded-xl p-2 -m-2 hover:bg-white hover:shadow-lg dark:hover:bg-surface-dark transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <div className="relative w-full aspect-[4/5] overflow-hidden rounded-xl bg-surface-light dark:bg-surface-dark">
                                <div 
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
                                    style={{backgroundImage: `url('${p.images[0]}')`}}
                                ></div>
                                <button className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-white z-10" onClick={(e) => e.preventDefault()}>
                                    <span className="material-symbols-outlined !text-[20px]">favorite</span>
                                </button>
                            </div>
                            <div className="flex flex-col gap-1 px-1 pb-2">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-lg font-bold font-display text-text-main-light dark:text-text-main-dark group-hover:text-primary transition-colors leading-tight">{p.title}</h3>
                                    <span className="text-sm font-sans font-medium text-text-secondary-light dark:text-text-secondary-dark whitespace-nowrap ml-2">${p.price.toLocaleString('es-UY')}</span>
                                </div>
                                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark font-sans truncate">{p.type || p.category} • {p.specs.origin || 'Uruguay'}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="border-t border-surface-light dark:border-surface-dark pt-16">
                    <div className="flex items-center gap-2 mb-8 opacity-50">
                        <span className="material-symbols-outlined">info</span>
                        <span className="text-sm font-sans">Categoría sin stock disponible:</span>
                    </div>
                    <div className="flex flex-col items-center justify-center py-16 px-4 bg-surface-light/30 dark:bg-surface-dark/30 rounded-2xl border border-dashed border-surface-dark/10 dark:border-surface-light/10">
                        <div className="flex flex-col items-center gap-6 max-w-lg text-center">
                            <div className="size-20 bg-surface-light dark:bg-surface-dark rounded-full flex items-center justify-center text-primary mb-2">
                                <span className="material-symbols-outlined !text-[40px]">auto_awesome</span>
                            </div>
                            <div className="flex flex-col items-center gap-3">
                                <h3 className="text-2xl font-black font-display text-text-main-light dark:text-text-main-dark">
                                    Colección en proceso
                                </h3>
                                <p className="text-text-secondary-light dark:text-text-secondary-dark text-base font-sans">
                                    Estamos seleccionando las mejores piezas de esta categoría para ti. Vuelve pronto para descubrir nuestros nuevos tesoros.
                                </p>
                            </div>
                            <button 
                                onClick={() => navigate('/tienda')}
                                className="mt-2 flex items-center justify-center h-12 px-6 rounded-lg bg-text-main-light dark:bg-white text-white dark:text-background-dark font-bold text-sm tracking-wide hover:opacity-90 transition-opacity"
                            >
                                Ver otras categorías
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    </div>
  );
};