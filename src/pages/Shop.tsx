import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { dataService, PRODUCT_CATEGORIES } from '../services/dataService';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { SEOHead } from '../components/SEOHead';
import { SITE_URL } from '../utils/slugify';

const CATEGORY_SLUG_MAP: Record<string, string> = {
    'collares': 'Collares',
    'anillos': 'Anillos',
    'brazaletes': 'Brazaletes',
    'piedras': 'Piedras',
    'otros-accesorios': 'Otros Accesorios'
};

const PRODUCTS_PER_PAGE = 12;

export const Shop: React.FC = () => {
    const { categorySlug } = useParams<{ categorySlug?: string }>();
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

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
        // If a single category is selected, use backend filter
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

    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages || page === currentPage) return;
        setCurrentPage(page);
        // Scroll to top of grid
        if (gridRef.current) {
            const offset = gridRef.current.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: offset, behavior: 'smooth' });
        }
    };

    const toggleCategory = (category: string) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
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

    return (
        <div className="content-shell section-shell-lg">
            <SEOHead
                title={shopTitle}
                description={shopDesc}
                canonical={`${SITE_URL}/tienda${categorySlug ? `/${categorySlug}` : ''}`}
            />

            <section className="surface-panel rounded-[2.3rem] px-6 py-8 sm:px-8 lg:px-10">
                <div className="max-w-4xl">
                    <div className="max-w-3xl">
                        <span className="section-kicker">Tienda</span>
                        <h1 className="section-title">
                            {categoryName ? `${categoryName} con presencia natural y lectura sobria.` : 'Catálogo curado de geodas, cristales y accesorios.'}
                        </h1>
                        <p className="section-copy mt-5">
                            Un catálogo ordenado para elegir con claridad: piezas naturales, compra simple y una presentación más cercana a una tienda confiable que a una vitrina improvisada.
                        </p>
                    </div>
                </div>
            </section>

            <div className="section-shell">
                <div className="mb-6 flex flex-col gap-4 lg:hidden">
                    <button
                        onClick={() => setIsMobileFilterOpen(true)}
                        className="btn-secondary w-full justify-center"
                    >
                        Filtrar categorías
                    </button>
                    <div className="flex flex-wrap gap-2">
                        {selectedCategories.length > 0 ? selectedCategories.map((category) => (
                            <span key={category} className="eyebrow-chip">{category}</span>
                        )) : (
                            <span className="eyebrow-chip">Todas las categorías</span>
                        )}
                    </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
                    <aside className="hidden lg:block">
                        <div className="surface-panel sticky top-28 rounded-[1.8rem] p-6">
                            <div className="mb-5">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">Filtrar</p>
                                <h2 className="mt-2 font-serif text-2xl text-stone-900">Categorías</h2>
                            </div>

                            <div className="space-y-3">
                                {PRODUCT_CATEGORIES.map((category) => {
                                    const selected = selectedCategories.includes(category);
                                    return (
                                        <label
                                            key={category}
                                            className={`flex cursor-pointer items-center justify-between rounded-[1rem] border px-4 py-3 transition-colors duration-150 ${
                                                selected
                                                    ? 'border-[var(--brand)] bg-[rgba(127,98,66,0.08)]'
                                                    : 'border-[rgba(198,184,162,0.75)] bg-white/78 hover:border-[var(--brand)]'
                                            }`}
                                        >
                                            <span className={`text-sm ${selected ? 'font-semibold text-stone-900' : 'text-stone-600'}`}>{category}</span>
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 accent-[var(--brand)]"
                                                checked={selected}
                                                onChange={() => toggleCategory(category)}
                                            />
                                        </label>
                                    );
                                })}
                            </div>

                            {selectedCategories.length > 0 && (
                                <button onClick={clearFilters} className="btn-ghost mt-5 text-sm font-medium">
                                    Limpiar filtros
                                </button>
                            )}
                        </div>
                    </aside>

                    <main className="space-y-6" ref={gridRef}>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex flex-wrap gap-2">
                                {selectedCategories.length > 0 ? selectedCategories.map((category) => (
                                    <span key={category} className="eyebrow-chip">{category}</span>
                                )) : (
                                    <span className="eyebrow-chip">Todas las categorías</span>
                                )}
                            </div>
                            <p className="text-sm text-stone-500">{totalProducts} productos visibles</p>
                        </div>

                        {isLoading ? (
                            <div className="surface-panel-soft rounded-[1.8rem] py-20 text-center">
                                <div className="mx-auto h-8 w-8 rounded-full border-2 border-[var(--brand)]/20 border-t-[var(--brand)] animate-spin" />
                                <p className="mt-4 text-sm text-stone-500">Cargando catálogo...</p>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="surface-panel-soft rounded-[1.8rem] px-6 py-20 text-center">
                                <h2 className="font-serif text-3xl text-stone-900">No encontramos productos en esta selección</h2>
                                <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-stone-500">
                                    La estructura del catálogo sigue activa. Podés limpiar filtros o volver a ver todas las piezas visibles.
                                </p>
                                <button onClick={clearFilters} className="btn-primary mt-6">
                                    Ver todo el catálogo
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                                    <AnimatePresence mode="popLayout">
                                        {products.map((product) => (
                                            <motion.div
                                                key={product.id}
                                                layout
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -8 }}
                                                transition={{ duration: 0.18 }}
                                            >
                                                <ProductCard product={product} />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>

                                {totalPages > 1 && (
                                    <nav aria-label="Paginación" className="surface-panel-soft flex flex-col items-center gap-4 rounded-[1.7rem] px-6 py-6">
                                        <p className="text-sm text-stone-500">
                                            Página {currentPage} de {totalPages}
                                        </p>

                                        <div className="flex flex-wrap items-center justify-center gap-2">
                                            <button
                                                onClick={() => goToPage(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className="btn-secondary disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                Anterior
                                            </button>

                                            {getPageNumbers().map((page, idx) => (
                                                page === '...' ? (
                                                    <span key={`ellipsis-${idx}`} className="px-2 text-sm text-stone-400">
                                                        ...
                                                    </span>
                                                ) : (
                                                    <button
                                                        key={page}
                                                        onClick={() => goToPage(page)}
                                                        className={`inline-flex h-11 min-w-11 items-center justify-center rounded-full px-4 text-sm font-medium transition-colors duration-150 ${
                                                            page === currentPage
                                                                ? 'bg-[var(--brand)] text-white'
                                                                : 'border border-[rgba(198,184,162,0.75)] bg-white/78 text-stone-700 hover:border-[var(--brand)] hover:text-[var(--brand)]'
                                                        }`}
                                                        aria-label={`Página ${page}`}
                                                        aria-current={page === currentPage ? 'page' : undefined}
                                                    >
                                                        {page}
                                                    </button>
                                                )
                                            ))}

                                            <button
                                                onClick={() => goToPage(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className="btn-secondary disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                Siguiente
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
                            className="fixed inset-0 z-[100] bg-[rgba(30,23,18,0.36)] backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                            className="fixed right-0 top-0 z-[101] flex h-full w-full max-w-[320px] flex-col border-l border-[rgba(198,184,162,0.82)] bg-[rgba(255,252,246,0.97)] p-6 shadow-[0_24px_48px_rgba(31,24,18,0.18)]"
                        >
                            <div className="mb-8 flex items-center justify-between">
                                <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">Filtrar</p>
                                    <h3 className="mt-2 font-serif text-2xl text-stone-900">Categorías</h3>
                                </div>
                                <button onClick={() => setIsMobileFilterOpen(false)} className="text-sm text-stone-500">
                                    Cerrar
                                </button>
                            </div>

                            <div className="flex-grow space-y-3">
                                {PRODUCT_CATEGORIES.map((category) => {
                                    const selected = selectedCategories.includes(category);
                                    return (
                                        <label
                                            key={category}
                                            className={`flex cursor-pointer items-center justify-between rounded-[1rem] border px-4 py-3 transition-colors duration-150 ${
                                                selected
                                                    ? 'border-[var(--brand)] bg-[rgba(127,98,66,0.08)]'
                                                    : 'border-[rgba(198,184,162,0.75)] bg-white/78'
                                            }`}
                                        >
                                            <span className={`text-sm ${selected ? 'font-semibold text-stone-900' : 'text-stone-600'}`}>{category}</span>
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 accent-[var(--brand)]"
                                                checked={selected}
                                                onChange={() => toggleCategory(category)}
                                            />
                                        </label>
                                    );
                                })}
                            </div>

                            <div className="mt-6 space-y-3 border-t border-[rgba(198,184,162,0.55)] pt-5">
                                <button
                                    onClick={() => {
                                        clearFilters();
                                        setIsMobileFilterOpen(false);
                                    }}
                                    className="btn-secondary w-full justify-center"
                                >
                                    Limpiar todo
                                </button>
                                <button onClick={() => setIsMobileFilterOpen(false)} className="btn-primary w-full justify-center">
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
