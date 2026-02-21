import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';

interface CategoryInfo {
    title: string;
    description: string;
    backendCategory: string;
}

const CATEGORY_MAP: Record<string, CategoryInfo> = {
    'collares': { title: 'Collares', backendCategory: 'Collares', description: '"Fragmentos de energía violeta para proteger tu espíritu y elevar tu vibración."' },
    'anillos': { title: 'Anillos', backendCategory: 'Anillos', description: '"Símbolos de compromiso contigo misma y con el universo."' },
    'brazaletes': { title: 'Brazaletes', backendCategory: 'Brazaletes', description: '"Lleva la energía de las piedras siempre contigo."' },
    'piedras': { title: 'Piedras Naturales', backendCategory: 'Piedras', description: '"La naturaleza en su estado más puro, sin filtros ni alteraciones."' },
    'otros-accesorios': { title: 'Otros Accesorios', backendCategory: 'Otros Accesorios', description: '"Complementos y decoración para tu santuario personal."' }
};

const PRODUCTS_PER_PAGE = 12;

export const ShopCategory: React.FC = () => {
    const { category } = useParams<{ category: string }>();
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const gridRef = useRef<HTMLDivElement>(null);

    const fetchProducts = useCallback(async (page: number, catSlug: string | undefined) => {
        setLoading(true);
        const info = catSlug && CATEGORY_MAP[catSlug] ? CATEGORY_MAP[catSlug] : null;
        if (info) {
            const data = await dataService.getVisibleProductsPaginated(page, PRODUCTS_PER_PAGE, info.backendCategory);
            setProducts(data.products);
            setTotalPages(data.totalPages);
            setTotalProducts(data.totalProducts);
        } else {
            setProducts([]);
            setTotalPages(1);
            setTotalProducts(0);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        setCurrentPage(1);
        window.scrollTo(0, 0);
    }, [category]);

    useEffect(() => {
        fetchProducts(currentPage, category);
    }, [currentPage, category, fetchProducts]);

    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages || page === currentPage) return;
        setCurrentPage(page);
        if (gridRef.current) {
            const offset = gridRef.current.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: offset, behavior: 'smooth' });
        }
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

    const info = category && CATEGORY_MAP[category] ? CATEGORY_MAP[category] : { title: category || 'Categoría', description: 'Explora nuestra selección.', backendCategory: '' };

    return (
        <div className="bg-background-light dark:bg-background-dark text-text-main-light dark:text-text-main-dark transition-colors duration-300 min-h-screen font-newsreader">
            <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
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
                    {totalProducts > 0 && (
                        <p className="mt-3 text-xs text-[#8C8C8C] font-light tracking-wide">
                            {totalProducts} productos
                        </p>
                    )}
                </div>

                {/* Grid or Empty State */}
                <div ref={gridRef}>
                    {loading ? (
                        <div className="py-20 flex flex-col items-center justify-center gap-4">
                            <div className="w-8 h-8 border-2 border-[#D4C4A8] border-t-[#8C7E60] rounded-full animate-spin" />
                            <p className="text-[#8C8C8C] font-light italic font-sans">Cargando cristales...</p>
                        </div>
                    ) : products.length > 0 ? (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-7 mb-8">
                                {products.map(p => (
                                    <ProductCard key={p.id} product={p} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <nav aria-label="Paginación" className="mt-8 mb-16 flex flex-col items-center gap-4">
                                    <p className="text-xs text-[#8C8C8C] font-light tracking-wide">
                                        Página {currentPage} de {totalPages} — {totalProducts} productos
                                    </p>

                                    <div className="flex items-center gap-1 sm:gap-1.5">
                                        <button
                                            onClick={() => goToPage(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg border border-[#D4C4A8]/60 text-[#8C7E60] hover:bg-[#8C7E60] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#8C7E60] transition-all duration-200"
                                            aria-label="Página anterior"
                                        >
                                            <span className="material-symbols-outlined !text-[18px]">chevron_left</span>
                                        </button>

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
                </div>
            </main>
        </div>
    );
};