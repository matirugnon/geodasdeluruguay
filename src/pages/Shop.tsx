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
        <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#1A1917] transition-colors duration-300">
            <SEOHead
                title={shopTitle}
                description={shopDesc}
                canonical={`${SITE_URL}/tienda${categorySlug ? `/${categorySlug}` : ''}`}
            />
            {/* Page Header */}
            <header className="pt-24 pb-12 px-6 md:px-12 max-w-7xl mx-auto text-center">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#8C7E60] mb-4"
                >
                    Nuestra Tienda
                </motion.h1>
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.3 }}
                    className="w-24 h-[1px] bg-[#D4C4A8] mx-auto mb-6"
                />
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-[#8C8C8C] font-light max-w-2xl mx-auto italic"
                >
                    Piezas únicas formadas por la naturaleza, curadas con elegancia para tu hogar.
                </motion.p>
            </header>

            <div className="max-w-[1400px] mx-auto px-6 md:px-12 pb-24">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Desktop Sidebar Filters */}
                    <aside className="hidden lg:block w-64 space-y-8 flex-shrink-0">
                        <div>
                            <h3 className="font-serif text-xl text-[#8C7E60] mb-6 tracking-wide uppercase text-sm font-bold">Categorías</h3>
                            <div className="space-y-4">
                                {PRODUCT_CATEGORIES.map(category => (
                                    <label key={category} className="flex items-center group cursor-pointer">
                                        <div className="relative flex items-center justify-center">
                                            <input
                                                type="checkbox"
                                                className="peer appearance-none w-5 h-5 border border-[#D4C4A8] rounded-sm checked:bg-[#8C7E60] checked:border-[#8C7E60] transition-all cursor-pointer"
                                                checked={selectedCategories.includes(category)}
                                                onChange={() => toggleCategory(category)}
                                            />
                                            <span className="material-symbols-outlined text-white text-[16px] absolute opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none">
                                                check
                                            </span>
                                        </div>
                                        <span className={`ml-3 text-sm font-sans transition-colors ${selectedCategories.includes(category) ? 'text-[#8C7E60] font-medium' : 'text-[#8C8C8C] group-hover:text-[#8C7E60]'}`}>
                                            {category}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {selectedCategories.length > 0 && (
                            <button
                                onClick={clearFilters}
                                className="text-[#8C7E60] text-xs font-bold uppercase tracking-widest border-b border-[#8C7E60] pb-1 hover:text-[#5A5243] hover:border-[#5A5243] transition-colors"
                            >
                                Limpiar Filtros
                            </button>
                        )}
                    </aside>

                    {/* Mobile Filter Trigger */}
                    <div className="lg:hidden flex justify-between items-center mb-4">
                        <button
                            onClick={() => setIsMobileFilterOpen(true)}
                            className="flex items-center gap-2 bg-[#8C7E60] text-white px-6 py-2 rounded-full shadow-md text-sm tracking-widest"
                        >
                            <span className="material-symbols-outlined text-[18px]">tune</span>
                            FILTRAR
                        </button>
                        <p className="text-xs text-[#8C8C8C] font-light">
                            {totalProducts} productos
                        </p>
                    </div>

                    {/* Main Content: Product Grid */}
                    <main className="flex-grow" ref={gridRef}>
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-24 gap-4">
                                <div className="w-8 h-8 border-2 border-[#D4C4A8] border-t-[#8C7E60] rounded-full animate-spin" />
                                <p className="text-[#8C8C8C] font-light italic">Descubriendo tesoros...</p>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-24">
                                <p className="text-[#8C8C8C] font-light italic text-lg mb-4">No encontramos productos en esta categoría.</p>
                                <button onClick={clearFilters} className="text-[#8C7E60] underline underline-offset-4">Ver todo el catálogo</button>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-7">
                                    <AnimatePresence mode="popLayout">
                                        {products.map((product) => (
                                            <motion.div
                                                key={product.id}
                                                layout
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <ProductCard product={product} />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <nav aria-label="Paginación" className="mt-12 mb-4 flex flex-col items-center gap-4">
                                        {/* Page info */}
                                        <p className="text-xs text-[#8C8C8C] font-light tracking-wide">
                                            Página {currentPage} de {totalPages} — {totalProducts} productos
                                        </p>

                                        <div className="flex items-center gap-1 sm:gap-1.5">
                                            {/* Previous */}
                                            <button
                                                onClick={() => goToPage(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg border border-[#D4C4A8]/60 text-[#8C7E60] hover:bg-[#8C7E60] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#8C7E60] transition-all duration-200"
                                                aria-label="Página anterior"
                                            >
                                                <span className="material-symbols-outlined !text-[18px]">chevron_left</span>
                                            </button>

                                            {/* Page numbers */}
                                            {getPageNumbers().map((page, idx) => (
                                                page === '...' ? (
                                                    <span key={`ellipsis-${idx}`} className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-[#8C8C8C] text-sm select-none">
                                                        ···
                                                    </span>
                                                ) : (
                                                    <button
                                                        key={page}
                                                        onClick={() => goToPage(page)}
                                                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-sm font-semibold transition-all duration-200 ${
                                                            page === currentPage
                                                                ? 'bg-[#8C7E60] text-white shadow-md'
                                                                : 'border border-[#D4C4A8]/40 text-[#8C7E60] hover:bg-[#8C7E60]/10'
                                                        }`}
                                                        aria-label={`Página ${page}`}
                                                        aria-current={page === currentPage ? 'page' : undefined}
                                                    >
                                                        {page}
                                                    </button>
                                                )
                                            ))}

                                            {/* Next */}
                                            <button
                                                onClick={() => goToPage(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg border border-[#D4C4A8]/60 text-[#8C7E60] hover:bg-[#8C7E60] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#8C7E60] transition-all duration-200"
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
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 h-full w-full max-w-[300px] bg-white dark:bg-[#1A1917] z-[101] shadow-2xl p-8 flex flex-col"
                        >
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="font-serif text-2xl text-[#8C7E60]">Filtros</h3>
                                <button onClick={() => setIsMobileFilterOpen(false)} className="text-[#8C8C8C]">
                                    <span className="material-symbols-outlined text-[32px]">close</span>
                                </button>
                            </div>

                            <div className="flex-grow space-y-6">
                                <p className="text-[#8C8C8C] text-xs font-bold uppercase tracking-[0.2em] mb-4">Por Categoría</p>
                                <div className="space-y-4">
                                    {PRODUCT_CATEGORIES.map(category => (
                                        <label key={category} className="flex items-center group cursor-pointer">
                                            <div className="relative flex items-center justify-center">
                                                <input
                                                    type="checkbox"
                                                    className="peer appearance-none w-6 h-6 border border-[#D4C4A8] rounded-sm checked:bg-[#8C7E60] checked:border-[#8C7E60] transition-all cursor-pointer"
                                                    checked={selectedCategories.includes(category)}
                                                    onChange={() => toggleCategory(category)}
                                                />
                                                <span className="material-symbols-outlined text-white text-[18px] absolute opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none">
                                                    check
                                                </span>
                                            </div>
                                            <span className={`ml-4 text-base font-sans transition-colors ${selectedCategories.includes(category) ? 'text-[#8C7E60] font-medium' : 'text-stone-600 dark:text-stone-300'}`}>
                                                {category}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-8 border-t border-[#D4C4A8]/20 space-y-4">
                                <button
                                    onClick={() => {
                                        clearFilters();
                                        setIsMobileFilterOpen(false);
                                    }}
                                    className="w-full py-4 text-[#8C7E60] font-medium border border-[#8C7E60] rounded-full text-sm tracking-widest uppercase font-sans"
                                >
                                    Limpiar Todo
                                </button>
                                <button
                                    onClick={() => setIsMobileFilterOpen(false)}
                                    className="w-full py-4 bg-[#8C7E60] text-white rounded-full text-sm tracking-widest uppercase font-bold font-sans shadow-lg"
                                >
                                    Aplicar Filtros
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};
