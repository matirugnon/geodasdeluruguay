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
    'collares': { title: 'Collares', backendCategory: 'Collares', description: 'Fragmentos de energía para proteger tu espíritu.' },
    'anillos': { title: 'Anillos', backendCategory: 'Anillos', description: 'Símbolos de compromiso contigo misma y con el universo.' },
    'brazaletes': { title: 'Brazaletes', backendCategory: 'Brazaletes', description: 'Lleva la energía de las piedras siempre contigo.' },
    'piedras': { title: 'Piedras Naturales', backendCategory: 'Piedras', description: 'La naturaleza en su estado más puro.' },
    'otros-accesorios': { title: 'Otros Accesorios', backendCategory: 'Otros Accesorios', description: 'Complementos y decoración para tu espacio personal.' }
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
        <div className="min-h-screen bg-white">
            <main className="w-full max-w-[1280px] mx-auto px-6 md:px-12 py-10">
                {/* Breadcrumb */}
                <div className="flex mb-10">
                    <button
                        onClick={() => navigate('/tienda')}
                        className="group flex items-center gap-2 text-stone-400 hover:text-stone-600 transition-colors duration-150"
                    >
                        <span className="material-symbols-outlined !text-[16px] transition-transform group-hover:-translate-x-0.5">arrow_back</span>
                        <span className="text-sm font-sans">Volver a la tienda</span>
                    </button>
                </div>

                {/* Header */}
                <div className="flex flex-col items-center text-center mb-14">
                    <h1 className="font-serif text-3xl md:text-4xl text-stone-900 font-medium mb-3 capitalize">
                        {info.title}
                    </h1>
                    <p className="text-stone-500 font-sans font-light text-base max-w-xl">
                        {info.description}
                    </p>
                    {totalProducts > 0 && (
                        <p className="mt-3 text-xs text-stone-400">
                            {totalProducts} productos
                        </p>
                    )}
                </div>

                {/* Grid or Empty State */}
                <div ref={gridRef}>
                    {loading ? (
                        <div className="py-24 flex flex-col items-center justify-center gap-4">
                            <div className="w-7 h-7 border-2 border-stone-200 border-t-[#8C7E60] rounded-full animate-spin" />
                            <p className="text-stone-400 text-sm">Cargando productos...</p>
                        </div>
                    ) : products.length > 0 ? (
                        <>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
                                {products.map(p => (
                                    <ProductCard key={p.id} product={p} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <nav aria-label="Paginación" className="mt-10 mb-16 flex flex-col items-center gap-4">
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
                    ) : (
                        <div className="py-20 flex flex-col items-center text-center max-w-md mx-auto">
                            <span className="material-symbols-outlined text-stone-200 !text-[48px] mb-5">auto_awesome</span>
                            <h3 className="font-serif text-xl text-stone-700 mb-2">Colección en proceso</h3>
                            <p className="text-stone-400 text-sm font-sans mb-6">
                                Estamos seleccionando las mejores piezas de esta categoría. Vuelve pronto.
                            </p>
                            <button
                                onClick={() => navigate('/tienda')}
                                className="px-6 py-3 bg-[#8C7E60] text-white rounded text-sm font-medium hover:bg-[#756A50] transition-colors duration-200"
                            >
                                Ver otras categorías
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};