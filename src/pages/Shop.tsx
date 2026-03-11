import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { dataService, PRODUCT_CATEGORIES } from '../services/dataService';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { SEOHead } from '../components/SEOHead';
import { SITE_URL } from '../utils/slugify';

const CATEGORY_SLUG_MAP: Record<string, string> = {
  collares: 'Collares',
  anillos: 'Anillos',
  brazaletes: 'Brazaletes',
  piedras: 'Piedras',
  'otros-accesorios': 'Otros Accesorios',
};

const PRODUCTS_PER_PAGE = 12;

export const Shop: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (categorySlug && CATEGORY_SLUG_MAP[categorySlug]) {
      setSelectedCategories([CATEGORY_SLUG_MAP[categorySlug]]);
    } else {
      setSelectedCategories([]);
    }
    setCurrentPage(1);
  }, [categorySlug]);

  const fetchProducts = useCallback(async (page: number, categories: string[]) => {
    setIsLoading(true);

    const categoryFilter = categories.length === 1 ? categories[0] : undefined;

    if (categories.length <= 1) {
      const data = await dataService.getVisibleProductsPaginated(page, PRODUCTS_PER_PAGE, categoryFilter);
      setProducts(data.products);
      setTotalPages(data.totalPages);
      setTotalProducts(data.totalProducts);
    } else {
      const allProducts = await dataService.getVisibleProducts();
      const filtered = allProducts.filter((p) =>
        categories.some((cat) => p.category.toLowerCase() === cat.toLowerCase()),
      );
      setTotalProducts(filtered.length);
      setTotalPages(Math.ceil(filtered.length / PRODUCTS_PER_PAGE));
      const start = (page - 1) * PRODUCTS_PER_PAGE;
      setProducts(filtered.slice(start, start + PRODUCTS_PER_PAGE));
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts(currentPage, selectedCategories);
  }, [currentPage, selectedCategories, fetchProducts]);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);

    if (gridRef.current) {
      const offset = gridRef.current.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    );
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setCurrentPage(1);
  };

  const getPageNumbers = (): (number | '...')[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

    const pages: (number | '...')[] = [];
    if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, '...', totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }
    return pages;
  };

  const categoryName = categorySlug ? CATEGORY_SLUG_MAP[categorySlug] || categorySlug : '';
  const shopTitle = categoryName ? `${categoryName} - Tienda` : 'Tienda';
  const shopDesc = categoryName
    ? `Compra ${categoryName.toLowerCase()} naturales de Uruguay. Piedras, cristales y accesorios energéticos.`
    : 'Explora nuestra colección de cristales, geodas y accesorios naturales de Uruguay. Envío a todo el país.';

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      <SEOHead
        title={shopTitle}
        description={shopDesc}
        canonical={`${SITE_URL}/tienda${categorySlug ? `/${categorySlug}` : ''}`}
      />

      <header className="max-w-[1280px] mx-auto px-6 md:px-12 pt-12 pb-8">
        <p className="text-[11px] font-semibold text-[#8C7E60] uppercase tracking-[0.16em] mb-3">Tienda</p>
        <h1 className="font-serif text-3xl md:text-4xl text-stone-900 font-medium mb-3">Colección de piezas naturales</h1>
        <p className="text-stone-600 font-sans text-base leading-relaxed max-w-2xl">
          Encontrá geodas, cristales y accesorios seleccionados. Navegación simple, información clara y compra segura.
        </p>
      </header>

      <div className="max-w-[1320px] mx-auto px-6 md:px-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[270px_1fr] gap-6 lg:gap-8">
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-md border border-stone-200 bg-white p-5">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-semibold text-stone-800">Categorías</h2>
                {selectedCategories.length > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-xs font-medium text-[#8C7E60] hover:text-[#756A50] underline underline-offset-2"
                  >
                    Limpiar
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {PRODUCT_CATEGORIES.map((category) => (
                  <label key={category} className="flex items-center gap-3 cursor-pointer min-h-11">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-stone-300 text-[#8C7E60] focus:ring-[#8C7E60]/30"
                      checked={selectedCategories.includes(category)}
                      onChange={() => toggleCategory(category)}
                    />
                    <span
                      className={`text-[15px] ${
                        selectedCategories.includes(category)
                          ? 'text-stone-900 font-medium'
                          : 'text-stone-600'
                      }`}
                    >
                      {category}
                    </span>
                  </label>
                ))}
              </div>

              <div className="mt-6 pt-5 border-t border-stone-100">
                <p className="text-sm text-stone-500">
                  {totalProducts} {totalProducts === 1 ? 'producto' : 'productos'}
                </p>
              </div>
            </div>
          </aside>

          <main ref={gridRef} className="min-w-0">
            <div className="lg:hidden flex items-center justify-between gap-4 rounded-md border border-stone-200 bg-white p-4 mb-5">
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="min-h-11 inline-flex items-center gap-2 px-4 rounded-md border border-stone-300 text-stone-700 text-sm font-medium"
              >
                <span className="material-symbols-outlined !text-[18px]">tune</span>
                Filtros
              </button>
              <p className="text-sm text-stone-500 text-right">
                {totalProducts} {totalProducts === 1 ? 'producto' : 'productos'}
              </p>
            </div>

            {selectedCategories.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-5">
                {selectedCategories.map((category) => (
                  <span
                    key={category}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-stone-200 bg-white text-sm text-stone-700"
                  >
                    {category}
                    <button
                      onClick={() => toggleCategory(category)}
                      className="text-stone-400 hover:text-stone-700"
                      aria-label={`Quitar filtro ${category}`}
                    >
                      <span className="material-symbols-outlined !text-[16px]">close</span>
                    </button>
                  </span>
                ))}
              </div>
            )}

            {isLoading ? (
              <div className="flex flex-col items-center justify-center rounded-md border border-stone-200 bg-white py-20 gap-4">
                <div className="w-7 h-7 border-2 border-stone-200 border-t-[#8C7E60] rounded-full animate-spin" />
                <p className="text-stone-500 text-sm">Cargando productos...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center rounded-md border border-stone-200 bg-white py-20 px-6">
                <p className="text-stone-600 text-lg mb-4">No encontramos productos en esta categoría.</p>
                <button
                  onClick={clearFilters}
                  className="text-[#8C7E60] font-medium underline underline-offset-2 text-sm"
                >
                  Ver todo el catálogo
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
                  <AnimatePresence mode="popLayout">
                    {products.map((product) => (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {totalPages > 1 && (
                  <nav aria-label="Paginación" className="mt-10 flex flex-col items-center gap-4">
                    <p className="text-sm text-stone-500">
                      Página {currentPage} de {totalPages}
                    </p>

                    <div className="flex items-center gap-2 flex-wrap justify-center">
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="min-h-11 min-w-11 flex items-center justify-center rounded-md border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        aria-label="Página anterior"
                      >
                        <span className="material-symbols-outlined !text-[18px]">chevron_left</span>
                      </button>

                      {getPageNumbers().map((page, idx) =>
                        page === '...' ? (
                          <span
                            key={`ellipsis-${idx}`}
                            className="min-h-11 min-w-11 flex items-center justify-center text-stone-400 text-sm select-none"
                          >
                            ...
                          </span>
                        ) : (
                          <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`min-h-11 min-w-11 rounded-md text-sm font-medium border transition-colors duration-150 ${
                              page === currentPage
                                ? 'bg-[#8C7E60] border-[#8C7E60] text-white'
                                : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                            }`}
                            aria-label={`Página ${page}`}
                            aria-current={page === currentPage ? 'page' : undefined}
                          >
                            {page}
                          </button>
                        ),
                      )}

                      <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="min-h-11 min-w-11 flex items-center justify-center rounded-md border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        aria-label="Página siguiente"
                      >
                        <span className="material-symbols-outlined !text-[18px]">chevron_right</span>
                      </button>
                    </div>
                  </nav>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/30 z-[100]"
            />

            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              className="fixed right-0 top-0 h-full w-full max-w-[320px] bg-white z-[101] border-l border-stone-200 flex flex-col"
            >
              <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
                <h3 className="font-serif text-xl text-stone-800">Filtros</h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-10 h-10 rounded-md text-stone-500 hover:bg-stone-50"
                  aria-label="Cerrar filtros"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-5">
                <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-[0.14em] mb-4">Categorías</p>
                <div className="space-y-2">
                  {PRODUCT_CATEGORIES.map((category) => (
                    <label key={category} className="flex items-center gap-3 min-h-11 cursor-pointer rounded-md px-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-stone-300 text-[#8C7E60] focus:ring-[#8C7E60]/30"
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                      />
                      <span className="text-[15px] text-stone-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="p-5 border-t border-stone-100 space-y-3">
                <button
                  onClick={() => {
                    clearFilters();
                    setIsMobileFilterOpen(false);
                  }}
                  className="w-full min-h-11 rounded-md border border-stone-300 text-stone-700 text-sm font-medium"
                >
                  Limpiar todo
                </button>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full min-h-11 rounded-md bg-[#8C7E60] text-white text-sm font-medium hover:bg-[#756A50] transition-colors duration-150"
                >
                  Ver resultados
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
