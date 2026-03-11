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
        <div className="min-h-screen bg-white">
            <SEOHead
                title={shopTitle}
                description={shopDesc}
                canonical={`${SITE_URL}/tienda${categorySlug ? `/${categorySlug}` : ''}`}
            />

            {/* Page Header */}
            <header className="pt-16 pb-10 px-6 md:px-12 max-w-[1280px] mx-auto text-center">
                <h1 className="font-serif text-3xl md:text-4xl text-stone-900 mb-3 font-medium">
                    Nuestra Tienda
                </h1>
                <p className="text-stone-500 font-sans text-base font-light max-w-xl mx-auto">
                    Piezas únicas formadas por la naturaleza, curadas con elegancia para tu hogar.
                </p>
            </header>

            <div className="max-w-[1320px] mx-auto px-6 md:px-12 pb-24">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Desktop Sidebar Filters */}
                    <aside className="hidden lg:block w-56 flex-shrink-0">
                        <div className="sticky top-24">
                            <h3 className="text-[11px] font-semibold text-stone-400 uppercase tracking-[0.15em] mb-5">Categorías</h3>
                            <div className="space-y-3">
                                {PRODUCT_CATEGORIES.map(category => (
                                    <label key={category} className="flex items-center group cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="appearance-none w-4 h-4 border border-stone-300 rounded-sm checked:bg-[#8C7E60] checked:border-[#8C7E60] transition-all cursor-pointer flex-shrink-0"
                                            checked={selectedCategories.includes(category)}
                                            onChange={() => toggleCategory(category)}
                                        />
                                        {selectedCategories.includes(category) && (
                                            <span className="material-symbols-outlined text-white text-[14px] absolute ml-[1px] pointer-events-none">check</span>
                                        )}
                                        <span className={`ml-3 text-sm font-sans transition-colors duration-150 ${selectedCategories.includes(category) ? 'text-stone-800 font-medium' : 'text-stone-500 group-hover:text-stone-700'}`}>
                                            {category}
                                        </span>
                                    </label>
                                ))}
                            </div>

                            {selectedCategories.length > 0 && (
                                <button
                                    onClick={clearFilters}
                                    className="mt-5 text-xs font-medium text-[#8C7E60] hover:text-[#756A50] underline underline-offset-2 transition-colors duration-150"
                                >
                                    Limpiar filtros
                                </button>
                            )}

                            <div className="mt-6 pt-4 border-t border-stone-100">
                                <p className="text-xs text-stone-400">
                                    {totalProducts} productos
                                </p>
                            </div>
                        </div>
                    </aside>

                    {/* Mobile Filter Trigger */}
                    <div className="lg:hidden flex justify-between items-center mb-2">
                        <button
                            onClick={() => setIsMobileFilterOpen(true)}
                            className="flex items-center gap-2 border border-stone-300 text-stone-700 px-5 py-2.5 rounded text-sm font-medium"
                        >
                            <span className="material-symbols-outlined !text-[18px]">tune</span>
                            Filtrar
                        </button>
                        <p className="text-xs text-stone-400">
                            {totalProducts} productos
                        </p>
                    </div>

                    {/* Main Content: Product Grid */}
                    <main className="flex-grow" ref={gridRef}>
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-24 gap-4">
                                <div className="w-7 h-7 border-2 border-stone-200 border-t-[#8C7E60] rounded-full animate-spin" />
                                <p className="text-stone-400 text-sm">Cargando productos...</p>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-24">
                                <p className="text-stone-400 text-lg mb-4">No encontramos productos en esta categoría.</p>
                                <button onClick={clearFilters} className="text-[#8C7E60] font-medium underline underline-offset-2 text-sm">Ver todo el catálogo</button>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <nav aria-label="Paginación" className="mt-14 flex flex-col items-center gap-4">
                                        <p className="text-xs text-stone-400">
                                            Página {currentPage} de {totalPages} — {totalProducts} productos
                                        </p>

                                        <div className="flex items-center gap-1.5">
                                            <button
                                                onClick={() => goToPage(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className="flex items-center justify-center w-9 h-9 rounded border border-stone-200 text-stone-600 hover:bg-stone-50 hover:border-stone-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
                                                aria-label="Página anterior"
                                            >
                                                <span className="material-symbols-outlined !text-[18px]">chevron_left</span>
                                            </button>

                                            {getPageNumbers().map((page, idx) => (
                                                page === '...' ? (
                                                    <span key={`ellipsis-${idx}`} className="w-9 h-9 flex items-center justify-center text-stone-400 text-sm select-none">
                                                        ...
                                                    </span>
                                                ) : (
                                                    <button
                                                        key={page}
                                                        onClick={() => goToPage(page)}
                                                        className={`w-9 h-9 rounded text-sm font-medium transition-colors duration-150 ${
                                                            page === currentPage
                                                                ? 'bg-[#8C7E60] text-white'
                                                                : 'border border-stone-200 text-stone-600 hover:bg-stone-50'
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
                                                className="flex items-center justify-center w-9 h-9 rounded border border-stone-200 text-stone-600 hover:bg-stone-50 hover:border-stone-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
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
                            className="fixed right-0 top-0 h-full w-full max-w-[300px] bg-white z-[101] shadow-xl p-8 flex flex-col"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="font-serif text-xl text-stone-800">Filtros</h3>
                                <button onClick={() => setIsMobileFilterOpen(false)} className="text-stone-400 hover:text-stone-600 transition-colors">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <div className="flex-grow space-y-5">
                                <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-[0.15em] mb-3">Categoría</p>
                                <div className="space-y-4">
                                    {PRODUCT_CATEGORIES.map(category => (
                                        <label key={category} className="flex items-center group cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="appearance-none w-5 h-5 border border-stone-300 rounded-sm checked:bg-[#8C7E60] checked:border-[#8C7E60] transition-all cursor-pointer"
                                                checked={selectedCategories.includes(category)}
                                                onChange={() => toggleCategory(category)}
                                            />
                                            <span className={`ml-3 text-base font-sans transition-colors ${selectedCategories.includes(category) ? 'text-stone-800 font-medium' : 'text-stone-600'}`}>
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
                                    className="w-full py-3.5 text-stone-600 font-medium border border-stone-300 rounded text-sm"
                                >
                                    Limpiar todo
                                </button>
                                <button
                                    onClick={() => setIsMobileFilterOpen(false)}
                                    className="w-full py-3.5 bg-[#8C7E60] text-white rounded text-sm font-medium"
                                >
                                    Aplicar
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};
