import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
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

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name-asc';

export const Shop: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Pagination state
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

  // Fetch products with pagination from backend
  const fetchProducts = useCallback(async (page: number, categories: string[]) => {
    setIsLoading(true);
    const categoryFilter = categories.length === 1 ? categories[0] : undefined;

    if (categories.length <= 1) {
      // Server-side pagination
      const data = await dataService.getVisibleProductsPaginated(page, PRODUCTS_PER_PAGE, categoryFilter);
      setProducts(data.products);
      setTotalPages(data.totalPages);
      setTotalProducts(data.totalProducts);
    } else {
      // Multiple categories: fetch all and paginate client-side
      const allProducts = await dataService.getVisibleProducts();
      const filtered = allProducts.filter(p =>
        categories.some(cat => p.category.toLowerCase() === cat.toLowerCase())
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

  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    switch (sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        return sorted;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        return sorted;
      case 'name-asc':
        sorted.sort((a, b) => a.title.localeCompare(b.title, 'es'));
        return sorted;
      case 'newest':
      default:
        return sorted;
    }
  }, [products, sortBy]);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);

    if (gridRef.current) {
      const offset = gridRef.current.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
    setCurrentPage(1);
  };

  const removeCategory = (category: string) => {
    setSelectedCategories(prev => prev.filter(c => c !== category));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setCurrentPage(1);
  };

  // Generate page numbers with ellipsis
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
  const shopTitle = categoryName ? `${categoryName} — Tienda` : 'Tienda';
  const shopDesc = categoryName
    ? `Comprá ${categoryName.toLowerCase()} naturales de Uruguay. Piedras, cristales y accesorios energéticos.`
    : 'Explorá nuestra colección de cristales, geodas y accesorios naturales de Uruguay. Envío a todo el país.';

  const showingFrom = totalProducts === 0 ? 0 : (currentPage - 1) * PRODUCTS_PER_PAGE + 1;
  const showingTo = Math.min(currentPage * PRODUCTS_PER_PAGE, totalProducts);

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title={shopTitle}
        description={shopDesc}
        canonical={`${SITE_URL}/tienda${categorySlug ? `/${categorySlug}` : ''}`}
      />

      {/* Header */}
      <header className="pt-16 pb-8 px-6 md:px-12 max-w-[1280px] mx-auto">
        <nav className="mb-4 text-sm text-stone-500">
          <Link to="/" className="hover:text-stone-800 transition-colors">Inicio</Link>
          <span className="mx-2">/</span>
          <span className="text-stone-800">Tienda</span>
        </nav>

        <div className="text-center">
          <h1 className="font-serif text-4xl md:text-5xl text-stone-900 mb-4 font-medium leading-tight">
            Nuestra Tienda
          </h1>
          <p className="text-stone-700 font-sans text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            Diseño claro, navegación simple y productos organizados para comprar con tranquilidad.
          </p>
        </div>
      </header>

      <div className="max-w-[1320px] mx-auto px-6 md:px-12 pb-24">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 rounded-lg border border-stone-200 p-5">
              <h3 className="text-xs font-semibold text-stone-600 uppercase tracking-[0.15em] mb-5">Categorías</h3>

              <div className="space-y-3">
                {PRODUCT_CATEGORIES.map(category => (
                  <label key={category} className="relative flex items-center min-h-[44px] group cursor-pointer">
                    <input
                      type="checkbox"
                      className="appearance-none w-5 h-5 border-2 border-stone-400 rounded-sm checked:bg-[#8C7E60] checked:border-[#8C7E60] transition-all cursor-pointer flex-shrink-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8C7E60]/35"
                      checked={selectedCategories.includes(category)}
                      onChange={() => toggleCategory(category)}
                    />
                    {selectedCategories.includes(category) && (
                      <span className="material-symbols-outlined text-white text-[16px] absolute ml-[1px] pointer-events-none">check</span>
                    )}
                    <span
                      className={`ml-3 text-base font-sans transition-colors duration-150 ${
                        selectedCategories.includes(category)
                          ? 'text-stone-900 font-semibold'
                          : 'text-stone-700 group-hover:text-stone-900'
                      }`}
                    >
                      {category}
                    </span>
                  </label>
                ))}
              </div>

              {selectedCategories.length > 0 && (
                <button
                  onClick={clearFilters}
                  className="mt-5 text-sm font-medium text-[#8C7E60] hover:text-[#756A50] underline underline-offset-2 transition-colors duration-150 min-h-[44px]"
                >
                  Limpiar filtros
                </button>
              )}

              <div className="mt-6 pt-4 border-t border-stone-100">
                <p className="text-sm text-stone-600">{totalProducts} productos</p>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-grow" ref={gridRef}>
            {/* Toolbar */}
            <section className="mb-6 rounded-lg border border-stone-200 bg-stone-50/50 p-4 md:p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <p className="text-base text-stone-700" aria-live="polite">
                  Mostrando <strong>{showingFrom}</strong> a <strong>{showingTo}</strong> de{' '}
                  <strong>{totalProducts}</strong> productos
                </p>

                <div className="flex items-center gap-3">
                  <label htmlFor="sort-products" className="text-sm font-medium text-stone-700 whitespace-nowrap">
                    Ordenar por
                  </label>
                  <select
                    id="sort-products"
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as SortOption)}
                    className="min-h-[44px] rounded-md border-2 border-stone-300 bg-white px-3 text-base text-stone-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8C7E60]/35"
                  >
                    <option value="newest">Más recientes</option>
                    <option value="price-asc">Precio: menor a mayor</option>
                    <option value="price-desc">Precio: mayor a menor</option>
                    <option value="name-asc">Nombre (A-Z)</option>
                  </select>
                </div>
              </div>

              {selectedCategories.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {selectedCategories.map(category => (
                    <button
                      key={category}
                      onClick={() => removeCategory(category)}
                      className="min-h-[40px] inline-flex items-center gap-1.5 rounded-full border border-stone-300 bg-white px-3 text-sm text-stone-700 hover:border-stone-400 hover:text-stone-900 transition-colors"
                      aria-label={`Quitar filtro ${category}`}
                    >
                      {category}
                      <span className="material-symbols-outlined !text-[16px]">close</span>
                    </button>
                  ))}
                </div>
              )}
            </section>

            {/* Mobile Filter Trigger */}
            <div className="lg:hidden flex justify-between items-center mb-4">
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="min-h-[44px] inline-flex items-center gap-2 border-2 border-stone-400 text-stone-800 px-5 py-2.5 rounded-md text-base font-medium focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8C7E60]/35"
              >
                <span className="material-symbols-outlined !text-[18px]">tune</span>
                Filtrar categorías
              </button>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="w-7 h-7 border-2 border-stone-200 border-t-[#8C7E60] rounded-full animate-spin" />
                <p className="text-stone-600 text-base">Cargando productos...</p>
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-stone-600 text-xl mb-4">No encontramos productos en esta categoría.</p>
                <button
                  onClick={clearFilters}
                  className="text-[#8C7E60] font-medium underline underline-offset-2 text-base min-h-[44px]"
                >
                  Ver todo el catálogo
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  <AnimatePresence mode="popLayout">
                    {sortedProducts.map(product => (
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

                {/* Pagination */}
                {totalPages > 1 && (
                  <nav aria-label="Paginación" className="mt-14 flex flex-col items-center gap-4">
                    <p className="text-sm text-stone-600">
                      Página {currentPage} de {totalPages} - {totalProducts} productos
                    </p>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex items-center justify-center w-11 h-11 rounded border-2 border-stone-300 text-stone-700 hover:bg-stone-50 hover:border-stone-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8C7E60]/35"
                        aria-label="Página anterior"
                      >
                        <span className="material-symbols-outlined !text-[18px]">chevron_left</span>
                      </button>

                      {getPageNumbers().map((page, idx) =>
                        page === '...' ? (
                          <span key={`ellipsis-${idx}`} className="w-11 h-11 flex items-center justify-center text-stone-500 text-base select-none">
                            ...
                          </span>
                        ) : (
                          <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`w-11 h-11 rounded text-base font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8C7E60]/35 ${
                              page === currentPage
                                ? 'bg-[#8C7E60] text-white'
                                : 'border-2 border-stone-300 text-stone-700 hover:bg-stone-50 hover:border-stone-400'
                            }`}
                            aria-label={`Página ${page}`}
                            aria-current={page === currentPage ? 'page' : undefined}
                          >
                            {page}
                          </button>
                        )
                      )}

                      <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="flex items-center justify-center w-11 h-11 rounded border-2 border-stone-300 text-stone-700 hover:bg-stone-50 hover:border-stone-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8C7E60]/35"
                        aria-label="Página siguiente"
                      >
                        <span className="material-symbols-outlined !text-[18px]">chevron_right</span>
                      </button>
                    </div>
                  </nav>
                )}
              </>
            )}

            {/* Trust strip */}
            <section className="mt-16 pt-8 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-lg border border-stone-200 p-4 bg-white">
                <p className="text-sm text-stone-500 mb-1">Envío a todo el país</p>
                <p className="text-base text-stone-900 font-medium">Empaque seguro y cuidadoso</p>
              </div>
              <div className="rounded-lg border border-stone-200 p-4 bg-white">
                <p className="text-sm text-stone-500 mb-1">Pago simple y seguro</p>
                <p className="text-base text-stone-900 font-medium">Mercado Pago o transferencia</p>
              </div>
              <div className="rounded-lg border border-stone-200 p-4 bg-white">
                <p className="text-sm text-stone-500 mb-1">Piezas auténticas</p>
                <p className="text-base text-stone-900 font-medium">Selección natural de Uruguay</p>
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
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
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-[320px] bg-white z-[101] shadow-xl p-8 flex flex-col"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-serif text-2xl text-stone-800">Filtros</h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-stone-500 hover:text-stone-700 transition-colors"
                  aria-label="Cerrar filtros"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="flex-grow space-y-5">
                <p className="text-xs font-semibold text-stone-600 uppercase tracking-[0.15em] mb-3">Categorías</p>
                <div className="space-y-4">
                  {PRODUCT_CATEGORIES.map(category => (
                    <label key={category} className="relative flex items-center min-h-[44px] group cursor-pointer">
                      <input
                        type="checkbox"
                        className="appearance-none w-6 h-6 border-2 border-stone-400 rounded-sm checked:bg-[#8C7E60] checked:border-[#8C7E60] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8C7E60]/35"
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                      />
                      {selectedCategories.includes(category) && (
                        <span className="material-symbols-outlined text-white text-[18px] absolute ml-[2px] pointer-events-none">check</span>
                      )}
                      <span
                        className={`ml-3 text-lg font-sans transition-colors ${
                          selectedCategories.includes(category) ? 'text-stone-900 font-semibold' : 'text-stone-700'
                        }`}
                      >
                        {category}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-stone-100 space-y-3">
                <button
                  onClick={() => {
                    clearFilters();
                    setIsMobileFilterOpen(false);
                  }}
                  className="w-full min-h-[44px] py-3.5 text-stone-700 font-medium border-2 border-stone-400 rounded-md text-base"
                >
                  Limpiar todo
                </button>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full min-h-[44px] py-3.5 bg-[#8C7E60] text-white rounded-md text-base font-medium"
                >
                  Aplicar filtros
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

