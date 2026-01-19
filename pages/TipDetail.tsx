import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { Tip } from '../types';

export const TipDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [tip, setTip] = useState<Tip | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        setIsAdmin(dataService.isAdmin());
    }, []);

    useEffect(() => {
        const loadTip = async () => {
            if (!id) return;
            setLoading(true);
            console.log('🔍 Loading tip with ID/slug:', id);
            const data = await dataService.getTipById(id);
            console.log('📦 Tip data received:', data);
            setTip(data);
            setLoading(false);

            // Update document title for SEO
            if (data) {
                document.title = `${data.title} | Diario Místico - Geodas Uruguay`;
            }
        };

        loadTip();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
                <div className="text-center">
                    <span className="material-symbols-outlined text-6xl text-primary animate-spin">progress_activity</span>
                    <p className="mt-4 text-stone-500 dark:text-stone-400">Cargando ...</p>
                </div>
            </div>
        );
    }

    if (!tip) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
                <div className="text-center">
                    <span className="material-symbols-outlined text-6xl text-stone-300">search_off</span>
                    <p className="mt-4 text-stone-500 dark:text-stone-400">Entrada no encontrada</p>
                    <Link to="/tips" className="mt-6 inline-block text-primary hover:underline">
                        Volver al Diario
                    </Link>
                </div>
            </div>
        );
    }

    // Get category info for tag
    const getCategoryInfo = () => {
        if (tip.tags && tip.tags.length > 0) {
            const tag = tip.tags[0].toLowerCase();
            if (tag.includes('ritual') || tag.includes('limpieza')) {
                return { label: 'Rituales de Limpieza', icon: 'water_drop' };
            } else if (tag.includes('energía') || tag.includes('propiedad')) {
                return { label: 'Propiedades Energéticas', icon: 'auto_awesome' };
            } else if (tag.includes('meditación') || tag.includes('conexión')) {
                return { label: 'Conexión Natural', icon: 'spa' };
            }
        }
        return { label: 'Geología Espiritual', icon: 'auto_awesome' };
    };

    const categoryInfo = getCategoryInfo();

    return (
        <div className="bg-background-light dark:bg-background-dark text-stone-900 transition-colors duration-300 relative overflow-x-hidden">
            {/* Background Decorations */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30 mix-blend-multiply dark:opacity-5">
                <svg className="absolute -left-20 top-40 w-96 h-96 text-stone-200" fill="none" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path d="M45.5 32.5C65.5 12.5 130 5 155 25C180 45 190 100 175 140C160 180 100 195 60 185C20 175 5 120 15 80C25 40 25.5 52.5 45.5 32.5Z" stroke="currentColor" strokeWidth="1" />
                </svg>
                <svg className="absolute -right-20 bottom-20 w-[500px] h-[500px] text-stone-200" fill="none" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path d="M50 40C80 20 140 10 170 50C200 90 190 150 160 180C130 210 60 200 30 160C0 120 10 70 50 40Z" stroke="currentColor" strokeWidth="1" />
                </svg>
            </div>

            {/* Navigation */}
            <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-background-light/80 dark:bg-background-dark/80 border-b border-stone-200/50">
                <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/tips" className="flex items-center gap-3 group">
                        <div className="text-primary group-hover:rotate-12 transition-transform duration-500">
                            <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>diamond</span>
                        </div>
                        <h2 className="text-stone-900 dark:text-white text-xl font-bold tracking-tight">Diario Místico</h2>
                    </Link>
                    <div className="flex items-center gap-4">
                        {isAdmin && (
                            <button
                                onClick={() => navigate('/admin')}
                                className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 text-sm font-semibold transition-colors border border-stone-200 dark:border-stone-700"
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>edit</span>
                                <span>Editar entrada</span>
                            </button>
                        )}
                    </div>
                </div>
                {/* Reading Progress Bar - You can add scroll tracking here */}
                <div className="h-[2px] w-full bg-stone-200/50">
                    <div className="h-full bg-gradient-to-r from-primary/50 to-primary w-[35%] rounded-r-full"></div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="relative z-10 w-full flex flex-col items-center pb-24">
                {/* Hero Section */}
                <div className="w-full max-w-4xl px-6 mt-12 mb-8">
                    <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-[2.5rem] shadow-xl group">
                        {tip.image ? (
                            <>
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s] group-hover:scale-105"
                                    style={{ backgroundImage: `url('${tip.image}')` }}
                                ></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                            </>
                        ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-stone-200 flex items-center justify-center">
                                <span className="material-symbols-outlined text-9xl text-stone-300">auto_stories</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Article Container */}
                <article className="w-full max-w-[800px] px-6 md:px-8">
                    {/* Header */}
                    <header className="text-center mb-12">
                        <div className="flex items-center justify-center gap-2 text-primary font-bold text-sm tracking-widest uppercase mb-4 opacity-80">
                            <span className="material-symbols-outlined text-base">{categoryInfo.icon}</span>
                            <span>{categoryInfo.label}</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-stone-900 dark:text-white leading-[1.1] tracking-tight mb-6 font-display">
                            {tip.title}
                        </h1>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-stone-500 dark:text-stone-400 text-sm font-medium border-t border-b border-stone-200/60 dark:border-stone-800 py-4 max-w-lg mx-auto">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">schedule</span>
                                <span>5 min</span>
                            </div>
                            <span className="hidden md:inline text-stone-300">•</span>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-gold overflow-hidden flex items-center justify-center">
                                    <span className="material-symbols-outlined text-white text-sm">diamond</span>
                                </div>
                                <span></span>
                            </div>
                            <span className="hidden md:inline text-stone-300">•</span>
                            <time>{new Date(tip.date).toLocaleDateString('es-UY', { day: 'numeric', month: 'short', year: 'numeric' })}</time>
                        </div>
                    </header>

                    {/* Excerpt */}
                    {tip.excerpt && (
                        <div className="mb-8 p-6 bg-primary/5 border-l-4 border-primary rounded-r-xl">
                            <p className="text-lg text-stone-700 dark:text-stone-300 italic leading-relaxed">
                                {tip.excerpt}
                            </p>
                        </div>
                    )}

                    {/* Body Text with HTML Content */}
                    <div
                        className="prose prose-lg prose-stone dark:prose-invert max-w-none font-display leading-relaxed
                        prose-headings:font-display prose-headings:font-bold prose-headings:text-stone-900 dark:prose-headings:text-white
                        prose-p:text-stone-700 dark:prose-p:text-stone-300
                        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                        prose-strong:text-stone-900 dark:prose-strong:text-white prose-strong:font-bold
                        prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:not-italic
                        prose-img:rounded-xl prose-img:shadow-lg"
                        dangerouslySetInnerHTML={{ __html: tip.content }}
                    />

                    {/* Tags */}
                    {tip.tags && tip.tags.length > 0 && (
                        <div className="mt-12 flex flex-wrap gap-2 pb-8 border-b border-stone-200">
                            {tip.tags.map((tag, idx) => (
                                <span
                                    key={idx}
                                    className="bg-stone-100 text-stone-600 px-3 py-1 rounded-lg text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* 
                    
                    <div className="mt-8 flex items-start gap-4 p-6 bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800">
                        <div className="w-16 h-16 shrink-0 rounded-full bg-gradient-to-br from-primary to-gold overflow-hidden flex items-center justify-center">
                            <span className="material-symbols-outlined text-3xl text-white">diamond</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-stone-900 dark:text-white font-display text-lg">El Guardián de Geodas</h4>
                            <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                                Explorador de minas y narrador de historias pétreas. Dedicado a desenterrar los secretos que la tierra ha guardado por milenios.
                            </p>
                        </div>
                    </div>
                    */}
                </article>
                

                <footer className="mt-20 w-full flex justify-center">
                    <Link to="/tips" className="group flex items-center gap-2 text-stone-500 hover:text-primary transition-colors duration-300">
                        <span className="bg-white dark:bg-stone-800 p-2 rounded-full shadow-sm group-hover:-translate-x-1 transition-transform duration-300 border border-stone-100 dark:border-stone-700">
                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                        </span>
                        <span className="font-medium tracking-wide text-sm font-sans uppercase">Volver al Diario</span>
                    </Link>
                </footer>
            </main>

            {/* Floating Mobile Edit Button */}
            {isAdmin && (
                <button
                    onClick={() => navigate('/admin')}
                    className="md:hidden fixed bottom-6 right-6 z-50 bg-primary text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:bg-primary-dark transition-colors"
                >
                    <span className="material-symbols-outlined">edit</span>
                </button>
            )}
        </div>
    );
};
