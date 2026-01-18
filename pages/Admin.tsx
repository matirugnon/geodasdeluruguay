import React, { useEffect, useState } from 'react';
import { dataService, PRODUCT_CATEGORIES } from '../services/dataService';
import { Product, Tip } from '../types';

export const Admin: React.FC = () => {
    const [isAuth, setIsAuth] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [tips, setTips] = useState<Tip[]>([]);
    const [view, setView] = useState<'list' | 'add' | 'tips-list' | 'tips-edit'>('list');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Product Form State
    const [formData, setFormData] = useState<Partial<Product>>({
        title: '', price: 0, category: PRODUCT_CATEGORIES[0], description: '', tags: [], images: [], specs: { weight: 0, origin: 'Artigas, Uruguay', dimensions: '' }
    });

    // Tip Form State
    const [tipData, setTipData] = useState<Partial<Tip> & { category?: string }>({
        title: '', excerpt: '', content: '', image: '', tags: [], category: 'Propiedades Energéticas'
    });

    // Toast helper
    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        if (dataService.isAdmin()) {
            setIsAuth(true);
            loadProducts();
            loadTips();
        }
    }, []);

    const loadProducts = async () => {
        const p = await dataService.getProducts();
        setProducts(p);
    };

    const loadTips = async () => {
        const t = await dataService.getTips();
        setTips(t);
    };

    const toggleVisibility = async (id: string) => {
        await dataService.toggleProductVisibility(id);
        const updatedProducts = products.map(p => {
            if (p.id === id) return { ...p, visible: !p.visible };
            return p;
        });
        setProducts(updatedProducts);
    };

    const handleDeleteTip = async (id: string) => {
        if (window.confirm('¿Estás seguro de eliminar esta entrada?')) {
            await dataService.deleteTip(id);
            loadTips();
        }
    };

    const handleEditTip = (tip: Tip) => {
        setTipData({ ...tip, category: 'Propiedades Energéticas' }); // Mock category integration
        setView('tips-edit');
    };

    const handleCreateTip = () => {
        setTipData({ title: '', excerpt: '', content: '', image: '', tags: [], category: 'Propiedades Energéticas' });
        setView('tips-edit');
    };

    // Helper for image management
    const [uploadingImage, setUploadingImage] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploadingImage(true);
        try {
            const uploadedUrls: string[] = [];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const formData = new FormData();
                formData.append('image', file);

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('geodas_auth')}`
                    },
                    body: formData
                });

                if (response.ok) {
                    const data = await response.json();
                    uploadedUrls.push(data.url);
                } else {
                    console.error('Error al subir imagen:', await response.text());
                }
            }

            if (uploadedUrls.length > 0) {
                setFormData({
                    ...formData,
                    images: [...(formData.images || []), ...uploadedUrls]
                });
            }
        } catch (error) {
            console.error('Error en upload:', error);
            alert('Error al subir las imágenes');
        } finally {
            setUploadingImage(false);
        }
    };

    const addImage = () => {
        const url = window.prompt("Ingrese URL de la imagen (Ej: https://picsum.photos/400/400)");
        if (url) {
            setFormData({ ...formData, images: [...(formData.images || []), url] });
        }
    };

    const removeImage = (index: number) => {
        const newImages = [...(formData.images || [])];
        newImages.splice(index, 1);
        setFormData({ ...formData, images: newImages });
    };

    // Helper for tags management
    const toggleTag = (tag: string) => {
        const currentTags = formData.tags || [];
        if (currentTags.includes(tag)) {
            setFormData({ ...formData, tags: currentTags.filter(t => t !== tag) });
        } else {
            setFormData({ ...formData, tags: [...currentTags, tag] });
        }
    };

    const handleSubmitProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const newProduct: Product = {
                id: formData.id || `temp-${Date.now()}`,
                title: formData.title || 'Sin Título',
                description: formData.description || '',
                price: Number(formData.price) || 0,
                category: formData.category || PRODUCT_CATEGORIES[0],
                images: formData.images?.length ? formData.images : ['https://picsum.photos/400/500'],
                specs: formData.specs || {},
                tags: typeof formData.tags === 'string' ? (formData.tags as string).split(',').map((t: string) => t.trim()) : formData.tags || [],
                stock: 1,
                visible: true,
                ...formData
            } as Product;

            await dataService.saveProduct(newProduct);
            showToast(formData.id ? '✨ Pieza actualizada con éxito' : '✨ Nueva pieza añadida al inventario', 'success');
            setView('list');
            loadProducts();
            setFormData({ category: PRODUCT_CATEGORIES[0], specs: { weight: 0, origin: 'Artigas, Uruguay', dimensions: '' }, images: [], tags: [] });
        } catch (error) {
            showToast('❌ Error al guardar el producto', 'error');
            console.error('Error:', error);
        }
    };

    const handleEditProduct = async (product: Product) => {
        setFormData({ ...product });
        setView('add');
    };

    const handleDeleteProduct = async (id: string) => {
        const confirmed = window.confirm('¿Estás seguro de que esta pieza debe volver a la tierra? Esta acción es irreversible.');
        if (!confirmed) return;

        try {
            await dataService.deleteProduct(id);
            showToast('🌍 Pieza devuelta a la tierra', 'success');
            loadProducts();
        } catch (error) {
            showToast('❌ Error al eliminar el producto', 'error');
            console.error('Error:', error);
        }
    };

    const handleSubmitTip = async () => {
        if (!tipData.title) {
            alert('Título requerido');
            return;
        }

        const newTip: Tip = {
            id: tipData.id || Date.now().toString(),
            title: tipData.title,
            excerpt: tipData.excerpt || 'Nuevo consejo místico...',
            content: tipData.content || '<p>Contenido...</p>',
            image: tipData.image || 'https://picsum.photos/800/600',
            date: tipData.date || new Date().toLocaleDateString('es-UY', { day: 'numeric', month: 'short', year: 'numeric' }),
            tags: typeof tipData.tags === 'string' ? (tipData.tags as string).split(',').map((t: string) => t.trim()) : (tipData.tags || [])
        };
        await dataService.saveTip(newTip);
        alert('Tip publicado con éxito');
        loadTips();
        setView('tips-list');
    };

    if (!isAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light">
                <div className="text-center">
                    <span className="material-symbols-outlined text-6xl text-gray-300">lock</span>
                    <p className="mt-4 text-gray-500">Acceso restringido. Inicia sesión desde el pie de página.</p>
                </div>
            </div>
        );
    }

    // --- COMMON SIDEBAR (Adapted Visuals) ---
    const Sidebar = () => (
        <aside className="hidden w-64 flex-col border-r border-stone-200 dark:border-white/10 bg-white dark:bg-[#1c1917] lg:flex shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20 h-screen sticky top-0">
            <div className="flex h-20 items-center gap-3 border-b border-stone-100 dark:border-white/10 px-6">
                <div className="flex flex-col">
                    <h1 className="text-lg font-bold text-[#181611] dark:text-stone-100 font-display">Geodas Uy</h1>
                    <p className="text-xs font-medium text-stone-500 dark:text-stone-400 font-noto-sans">Panel de Administración</p>
                </div>
            </div>
            <nav className="flex-1 overflow-y-auto px-4 py-6 font-noto-sans">
                <ul className="flex flex-col gap-2">
                    <li>
                        <button
                            onClick={() => setView('tips-list')}
                            className={`w-full group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-200 text-left ${view.includes('tips') ? 'bg-primary/10 text-primary-dark dark:text-primary border-l-4 border-primary shadow-sm font-bold' : 'text-stone-500 hover:bg-stone-50 hover:text-[#181611] dark:text-stone-400 dark:hover:bg-white/5 dark:hover:text-stone-100'}`}
                        >
                            <span className={`material-symbols-outlined text-[22px] ${view.includes('tips') ? 'filled' : ''}`}>menu_book</span>
                            Diario Místico
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setView('list')}
                            className={`w-full group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-200 text-left ${view === 'list' || view === 'add' ? 'bg-primary/10 text-primary-dark dark:text-primary border-l-4 border-primary shadow-sm font-bold' : 'text-stone-500 hover:bg-stone-50 hover:text-[#181611] dark:text-stone-400 dark:hover:bg-white/5 dark:hover:text-stone-100'}`}
                        >
                            <span className="material-symbols-outlined text-[22px]">inventory_2</span>
                            Inventario
                        </button>
                    </li>
                    <li>
                        <a href="/" className="group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-stone-500 hover:bg-stone-50 hover:text-[#181611] dark:text-stone-400 dark:hover:bg-white/5 dark:hover:text-stone-100 transition-colors duration-200">
                            <span className="material-symbols-outlined text-[22px]">public</span>
                            Ver Sitio Web
                        </a>
                    </li>
                </ul>
            </nav>
            <div className="border-t border-stone-100 dark:border-white/10 p-4 font-noto-sans">
                <button onClick={() => { localStorage.removeItem('geodas_auth'); window.location.reload(); }} className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium text-red-600/80 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/10 transition-colors">
                    <span className="material-symbols-outlined text-[20px]">logout</span>
                    Cerrar Sesión
                </button>
            </div>
        </aside>
    );

    // --- VIEW: TIPS LIST (Based on provided HTML) ---
    if (view === 'tips-list') {
        return (
            <div className="flex h-screen w-full bg-background-light dark:bg-[#221e10] text-[#181611] font-display antialiased overflow-hidden">
                <Sidebar />
                <main className="flex h-full flex-1 flex-col overflow-hidden relative">
                    {/* Top decorative gradient */}
                    <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>

                    {/* Header */}
                    <header className="flex h-20 items-center justify-between border-b border-stone-200 dark:border-white/10 bg-white/80 dark:bg-[#2d2920]/80 px-8 backdrop-blur-sm sticky top-0 z-10">
                        <div className="flex items-center gap-4">
                            <h2 className="text-2xl font-black tracking-tight text-[#181611] dark:text-stone-100 italic">Gestión del Diario Místico</h2>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-stone-200 dark:ring-stone-700 bg-stone-100 flex items-center justify-center">
                                <span className="material-symbols-outlined text-stone-400">person</span>
                            </div>
                        </div>
                    </header>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-8">
                        <div className="mx-auto max-w-6xl space-y-8">
                            {/* Actions Toolbar */}
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                {/* Search */}
                                <div className="relative w-full max-w-md group">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400 group-focus-within:text-primary transition-colors">
                                        <span className="material-symbols-outlined text-[20px]">search</span>
                                    </div>
                                    <input className="block w-full rounded-lg border-stone-300 bg-white py-2.5 pl-10 pr-4 text-sm text-[#181611] shadow-sm placeholder:text-stone-400 focus:border-primary focus:ring-1 focus:ring-primary dark:border-stone-700 dark:bg-[#2d2920] dark:text-stone-100 dark:placeholder:text-stone-500 font-sans transition-all" placeholder="Buscar en el diario..." type="text" />
                                </div>
                                {/* Main Action */}
                                <button
                                    onClick={handleCreateTip}
                                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-[#2d2920] shadow-md hover:bg-primary-dark hover:shadow-lg active:translate-y-0.5 transition-all duration-200 whitespace-nowrap"
                                >
                                    <span className="material-symbols-outlined text-[20px]">add</span>
                                    Nueva Entrada
                                </button>
                            </div>

                            {/* Blog Posts Table */}
                            <div className="rounded-xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-[#2d2920] overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="border-b border-stone-100 bg-stone-50/50 dark:border-stone-800 dark:bg-stone-900/30">
                                            <tr>
                                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 font-sans w-20" scope="col">Portada</th>
                                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 font-sans" scope="col">Título y Extracto</th>
                                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 font-sans w-48" scope="col">Fecha</th>
                                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 font-sans w-32 text-right" scope="col">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                                            {tips.map(tip => (
                                                <tr key={tip.id} className="group hover:bg-stone-50/80 dark:hover:bg-stone-800/30 transition-colors duration-150">
                                                    <td className="px-6 py-4 align-middle">
                                                        <div className="h-12 w-12 overflow-hidden rounded-md shadow-sm border border-stone-200 dark:border-stone-700">
                                                            <div className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url('${tip.image}')` }}></div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 align-middle">
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-base font-bold text-[#181611] dark:text-stone-100 font-display">{tip.title}</span>
                                                            <span className="text-xs text-stone-500 dark:text-stone-400 font-sans line-clamp-1">{tip.excerpt}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 align-middle">
                                                        <div className="flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400 font-sans">
                                                            <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                                                            {tip.date}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 align-middle text-right">
                                                        <div className="flex items-center justify-end gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                                                            <button onClick={() => handleEditTip(tip)} className="rounded p-1.5 text-primary hover:bg-primary/10 hover:text-primary-dark dark:hover:bg-primary/20 transition-colors" title="Editar">
                                                                <span className="material-symbols-outlined text-[20px]">edit</span>
                                                            </button>
                                                            <button onClick={() => handleDeleteTip(tip.id)} className="rounded p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-600 dark:text-stone-500 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors" title="Eliminar">
                                                                <span className="material-symbols-outlined text-[20px]">delete</span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {tips.length === 0 && (
                                                <tr>
                                                    <td colSpan={4} className="px-6 py-12 text-center text-stone-500 font-sans">
                                                        No hay entradas aún. ¡Crea la primera!
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // --- VIEW: TIPS EDITOR (Renamed from 'tips' to 'tips-edit' and cleaned up navigation) ---
    if (view === 'tips-edit') {
        return (
            <div className="bg-background-light dark:bg-background-dark text-text-main font-noto-serif antialiased min-h-screen flex flex-col">
                <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-[#1c1917]/90 backdrop-blur-md border-b border-[#e5e7eb] dark:border-[#2f3522]">
                    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <div className="flex items-center gap-3">
                                <h1 className="text-lg font-bold tracking-tight text-[#181611] dark:text-white leading-none font-display">Geodas Uy Admin</h1>
                            </div>
                            <nav className="hidden md:flex items-center gap-8 font-noto-sans">
                                <button onClick={() => setView('list')} className="text-sm font-medium hover:text-primary transition-colors dark:text-gray-200">Inventario</button>
                                <button onClick={() => setView('tips-list')} className="text-sm font-medium hover:text-primary transition-colors border-b-2 border-primary">Diario Místico</button>
                            </nav>
                        </div>
                    </div>
                </header>

                <main className="flex-grow w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <nav aria-label="Breadcrumb" className="flex mb-8 font-noto-sans">
                        <ol className="inline-flex items-center space-x-2 md:space-x-3">
                            <li className="inline-flex items-center">
                                <button onClick={() => setView('tips-list')} className="inline-flex items-center text-sm font-medium text-stone-500 hover:text-primary dark:text-gray-400 dark:hover:text-white">
                                    <span className="material-symbols-outlined text-sm mr-2">arrow_back</span> Volver a Lista
                                </button>
                            </li>
                            <li aria-current="page">
                                <div className="flex items-center">
                                    <span className="material-symbols-outlined text-stone-300 text-sm mx-1">chevron_right</span>
                                    <span className="text-sm font-medium text-[#181611] dark:text-white">{tipData.id ? 'Editar Entrada' : 'Nueva Entrada'}</span>
                                </div>
                            </li>
                        </ol>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
                            <input value={tipData.title} onChange={e => setTipData({ ...tipData, title: e.target.value })} className="w-full bg-transparent border-0 border-b-2 border-transparent focus:border-primary hover:border-gray-200 dark:hover:border-white/10 px-0 py-4 text-4xl md:text-5xl font-noto-serif font-black italic placeholder-gray-300 dark:placeholder-white/20 text-[#181611] dark:text-white focus:ring-0 transition-colors bg-white/50 dark:bg-black/20 rounded-t-lg px-4" placeholder="Escribe un título místico..." type="text" />

                            {/* Excerpt Input */}
                            <textarea
                                value={tipData.excerpt}
                                onChange={e => setTipData({ ...tipData, excerpt: e.target.value })}
                                className="w-full bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl p-4 text-stone-600 dark:text-stone-300 font-sans focus:ring-primary focus:border-primary"
                                placeholder="Escribe un extracto breve para la portada..."
                                rows={2}
                            />

                            <div className="bg-white dark:bg-white/5 rounded-2xl shadow-sm border border-black/5 dark:border-white/5 min-h-[500px] flex flex-col overflow-hidden">
                                {/* Simple Toolbar */}
                                <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1 p-3 border-b border-gray-100 dark:border-white/5 bg-gray-50/80 dark:bg-[#252a1a] backdrop-blur">
                                    <span className="text-xs text-stone-400 uppercase tracking-widest font-bold ml-2">Editor de Contenido</span>
                                </div>
                                <textarea
                                    className="flex-grow p-8 outline-none border-none resize-none font-serif text-lg leading-relaxed text-[#181611] dark:text-stone-200 bg-transparent"
                                    value={tipData.content}
                                    onChange={(e) => setTipData({ ...tipData, content: e.target.value })}
                                    placeholder="Escribe el contenido completo aquí (acepta HTML básico)..."
                                />
                            </div>
                        </div>
                        <div className="lg:col-span-4 xl:col-span-3 space-y-6">
                            <div className="bg-white dark:bg-white/5 rounded-2xl shadow-sm border border-black/5 dark:border-white/5 p-5 sticky top-24">
                                <h3 className="font-bold text-[#181611] dark:text-white mb-4">Publicar</h3>
                                <button onClick={handleSubmitTip} className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-primary-dark text-[#2d2920] rounded-lg font-bold shadow-sm transition-all transform active:scale-[0.98]">
                                    <span className="material-symbols-outlined">send</span> {tipData.id ? 'Actualizar' : 'Publicar'}
                                </button>
                            </div>

                            <div className="bg-white dark:bg-white/5 rounded-2xl shadow-sm border border-black/5 dark:border-white/5 p-5">
                                <h3 className="font-bold text-[#181611] dark:text-white mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">image</span> Imagen Destacada
                                </h3>
                                <div
                                    className="relative w-full aspect-video rounded-lg border-2 border-dashed border-gray-300 dark:border-white/20 flex flex-col items-center justify-center bg-gray-50 dark:bg-black/20 hover:bg-gray-100 dark:hover:bg-black/30 transition-colors cursor-pointer group overflow-hidden"
                                    onClick={() => {
                                        const url = prompt("Introduce URL de imagen:");
                                        if (url) setTipData({ ...tipData, image: url });
                                    }}
                                >
                                    {tipData.image ? (
                                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${tipData.image}')` }}></div>
                                    ) : (
                                        <div className="text-center p-4 group-hover:scale-105 transition-transform duration-300">
                                            <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">add_photo_alternate</span>
                                            <p className="text-xs text-stone-500 dark:text-gray-400">Clic para subir imagen</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // --- VIEW: LIST (Inventory) & VIEW: ADD (New Product) ---
    // Re-using the same sidebar logic but rendering existing content
    return (
        <div className="flex h-screen w-full bg-stone-50 dark:bg-[#1c1917] font-sans antialiased overflow-hidden">
            <Sidebar />
            <main className="flex-1 flex flex-col overflow-y-auto">
                {/* Original Product List/Add Logic Rendered Here */}
                {view === 'list' && (
                    <div className="p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold font-display text-[#181611] dark:text-white">Inventario de Productos</h2>
                            <button onClick={() => { setView('add'); setFormData({ category: PRODUCT_CATEGORIES[0], images: [], tags: [] }); }} className="bg-primary text-[#181611] px-4 py-2 rounded-lg font-bold shadow-sm hover:bg-primary-dark transition-colors flex items-center gap-2">
                                <span className="material-symbols-outlined">add</span> Nuevo Producto
                            </button>
                        </div>
                        <div className="bg-white dark:bg-white/5 rounded-xl shadow-sm border border-gray-200 dark:border-white/10 overflow-hidden">
                            <table className="w-full text-left font-noto-sans">
                                <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10 text-xs uppercase text-gray-500 dark:text-gray-400">
                                    <tr>
                                        <th className="px-6 py-4">Producto</th>
                                        <th className="px-6 py-4">Categoría</th>
                                        <th className="px-6 py-4">Precio</th>
                                        <th className="px-6 py-4 text-center">Visible</th>
                                        <th className="px-6 py-4 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                    {products.map(p => (
                                        <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                                            <td className="px-6 py-4 font-medium text-[#181611] dark:text-gray-200">{p.title}</td>
                                            <td className="px-6 py-4"><span className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 px-2 py-1 rounded text-xs font-bold">{p.category}</span></td>
                                            <td className="px-6 py-4 text-[#181611] dark:text-gray-200">${p.price}</td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => toggleVisibility(p.id)}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${p.visible ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}
                                                >
                                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${p.visible ? 'translate-x-6' : 'translate-x-1'}`} />
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button 
                                                    onClick={() => handleEditProduct(p)}
                                                    className="text-gray-400 hover:text-primary mr-3 transition-colors"
                                                    title="Editar producto"
                                                >
                                                    <span className="material-symbols-outlined">edit</span>
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteProduct(p.id)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                                    title="Eliminar producto"
                                                >
                                                    <span className="material-symbols-outlined">delete</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {view === 'add' && (
                    <div className="p-8 max-w-4xl mx-auto w-full">
                        <div className="flex items-center gap-4 mb-8">
                            <button onClick={() => setView('list')} className="p-2 rounded-full hover:bg-stone-200 dark:hover:bg-white/10 transition-colors">
                                <span className="material-symbols-outlined">arrow_back</span>
                            </button>
                            <h2 className="text-3xl font-bold font-display text-[#181611] dark:text-white">
                                {formData.id && formData.id !== `temp-${Date.now()}` ? 'Editar Pieza' : 'Alta de Nueva Pieza'}
                            </h2>
                        </div>

                        <div className="bg-white dark:bg-white/5 rounded-2xl shadow-sm border border-stone-200 dark:border-white/10 overflow-hidden">
                            <form onSubmit={handleSubmitProduct} className="p-6 md:p-8 space-y-8 font-noto-sans">
                                {/* Rest of the Product Form (Condensed for brevity, kept structure from previous) */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="col-span-1 md:col-span-2">
                                        <label className="block text-sm font-medium text-stone-500 dark:text-gray-300 mb-1.5">Título</label>
                                        <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full rounded-lg border-stone-300 bg-stone-50 dark:bg-white/5 dark:border-white/10 focus:border-primary focus:ring-primary dark:text-white" type="text" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-stone-500 dark:text-gray-300 mb-1.5">Categoría</label>
                                        <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full rounded-lg border-stone-300 bg-stone-50 dark:bg-white/5 dark:border-white/10 focus:border-primary focus:ring-primary dark:text-white">
                                            {PRODUCT_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-stone-500 dark:text-gray-300 mb-1.5">Precio</label>
                                        <input required value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} className="w-full rounded-lg border-stone-300 bg-stone-50 dark:bg-white/5 dark:border-white/10 focus:border-primary focus:ring-primary dark:text-white" type="number" />
                                    </div>
                                    <div className="col-span-1 md:col-span-2">
                                        <label className="block text-sm font-medium text-stone-500 dark:text-gray-300 mb-1.5">Descripción</label>
                                        <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full rounded-lg border-stone-300 bg-stone-50 dark:bg-white/5 dark:border-white/10 focus:border-primary focus:ring-primary dark:text-white" rows={4}></textarea>
                                    </div>
                                </div>

                                {/* Image Upload */}
                                <div>
                                    <h3 className="text-lg font-bold text-[#181611] dark:text-white mb-4">Imágenes</h3>
                                    <div className="space-y-4">
                                        <div className="flex gap-4 items-start">
                                            {/* File Upload Button */}
                                            <label className="h-32 w-32 border-2 border-dashed border-primary/50 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5 transition-colors relative group">
                                                <input
                                                    type="file"
                                                    accept="image/jpeg,image/jpg,image/png,image/webp"
                                                    multiple
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                    disabled={uploadingImage}
                                                />
                                                {uploadingImage ? (
                                                    <>
                                                        <span className="material-symbols-outlined text-primary animate-spin">progress_activity</span>
                                                        <span className="text-xs text-primary mt-1">Subiendo...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="material-symbols-outlined text-primary">cloud_upload</span>
                                                        <span className="text-xs text-stone-600 dark:text-stone-400 mt-1 text-center px-2">Subir del dispositivo</span>
                                                    </>
                                                )}
                                            </label>

                                            {/* URL Manual Button */}
                                            <div onClick={addImage} className="h-32 w-32 border-2 border-dashed border-stone-300 dark:border-stone-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-stone-50 dark:hover:bg-white/5 transition-colors">
                                                <span className="material-symbols-outlined text-stone-400">add_photo_alternate</span>
                                                <span className="text-xs text-stone-500 mt-1 text-center px-2">Añadir URL</span>
                                            </div>
                                        </div>

                                        {/* Preview Grid */}
                                        {formData.images && formData.images.length > 0 && (
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                                {formData.images.map((img, idx) => (
                                                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border-2 border-stone-200 dark:border-stone-700 group">
                                                        <img src={img} className="h-full w-full object-cover" alt={`Preview ${idx + 1}`} />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(idx)}
                                                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <span className="material-symbols-outlined text-sm">close</span>
                                                        </button>
                                                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            Imagen {idx + 1}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4 pt-4 border-t border-stone-100 dark:border-white/10">
                                    <button type="button" onClick={() => setView('list')} className="px-6 py-2 rounded-lg border border-stone-300 text-stone-600 font-bold hover:bg-stone-50 transition-colors">Cancelar</button>
                                    <button type="submit" className="px-6 py-2 rounded-lg bg-primary text-[#181611] font-bold hover:bg-primary-dark transition-colors shadow-sm">
                                        {formData.id ? 'Actualizar Producto' : 'Guardar Producto'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>

            {/* Toast Notification */}
            {toast && (
                <div className={`fixed bottom-8 right-8 z-50 px-6 py-4 rounded-xl shadow-2xl border-2 flex items-center gap-3 transition-all transform ${
                    toast.type === 'success' 
                        ? 'bg-green-50 border-green-500 text-green-900 dark:bg-green-900/20 dark:border-green-500 dark:text-green-100' 
                        : 'bg-red-50 border-red-500 text-red-900 dark:bg-red-900/20 dark:border-red-500 dark:text-red-100'
                }`}>
                    <span className="material-symbols-outlined text-xl">
                        {toast.type === 'success' ? 'check_circle' : 'error'}
                    </span>
                    <span className="font-medium font-noto-sans">{toast.message}</span>
                </div>
            )}
        </div>
    );
};