import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { Tip } from '../types';
import { SEOHead } from '../components/SEOHead';
import { tipUrl, SITE_URL } from '../utils/slugify';

export const TipDetail: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [tip, setTip] = useState<Tip | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTip = async () => {
            if (!slug) return;
            setLoading(true);
            const data = await dataService.getTipBySlug(slug);

            if (data) {
                if (slug !== data.slug) {
                    navigate(tipUrl(data.slug), { replace: true });
                    return;
                }
            }

            setTip(data);
            setLoading(false);
        };

        loadTip();
    }, [slug, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-7 h-7 border-2 border-stone-200 border-t-[#8C7E60] rounded-full animate-spin" />
            </div>
        );
    }

    if (!tip) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
                <span className="material-symbols-outlined !text-[48px] text-stone-200">search_off</span>
                <p className="text-stone-500">Entrada no encontrada</p>
                <Link to="/tips" className="text-[#8C7E60] text-sm font-medium underline underline-offset-2">
                    Volver al blog
                </Link>
            </div>
        );
    }

    const getCategoryInfo = () => {
        if (tip.tags && tip.tags.length > 0) {
            return { label: tip.tags[0] };
        }
        return { label: 'Guía' };
    };

    const categoryInfo = getCategoryInfo();

    return (
        <div className="min-h-screen bg-white">
            {/* Main Content */}
            <main className="w-full flex flex-col items-center pb-24">
                {/* Hero Image */}
                {tip.image && (
                    <div className="w-full max-w-4xl px-6 md:px-12 mt-10 mb-8">
                        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-md">
                            <img
                                src={tip.image}
                                alt={tip.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                )}

                {/* Article */}
                <article className="w-full max-w-[720px] px-6 md:px-8">
                    {/* Header */}
                    <header className="text-center mb-10">
                        <span className="text-[11px] uppercase tracking-[0.2em] text-[#8C7E60] font-medium mb-4 block">
                            {categoryInfo.label}
                        </span>
                        <h1 className="font-serif text-3xl md:text-4xl text-stone-900 font-medium leading-snug mb-5">
                            {tip.title}
                        </h1>
                        <div className="flex items-center justify-center gap-4 text-stone-400 text-xs border-t border-b border-stone-100 py-3 max-w-sm mx-auto">
                            <time>{new Date(tip.date).toLocaleDateString('es-UY', { day: 'numeric', month: 'short', year: 'numeric' })}</time>
                            <span>·</span>
                            <span>5 min lectura</span>
                        </div>
                    </header>

                    {/* Excerpt */}
                    {tip.excerpt && (
                        <div className="mb-8 pl-5 border-l-2 border-[#8C7E60]">
                            <p className="text-base text-stone-600 italic leading-relaxed font-light">
                                {tip.excerpt}
                            </p>
                        </div>
                    )}

                    {/* Body */}
                    <div
                        className="prose prose-stone max-w-none font-sans leading-relaxed
                        prose-headings:font-serif prose-headings:font-medium prose-headings:text-stone-900
                        prose-p:text-stone-600 prose-p:font-light
                        prose-a:text-[#8C7E60] prose-a:no-underline hover:prose-a:underline
                        prose-strong:text-stone-800 prose-strong:font-medium
                        prose-blockquote:border-l-[#8C7E60] prose-blockquote:not-italic prose-blockquote:bg-[#F8F7F4] prose-blockquote:py-1
                        prose-img:rounded-md"
                        dangerouslySetInnerHTML={{ __html: tip.content }}
                    />

                    {/* Tags */}
                    {tip.tags && tip.tags.length > 0 && (
                        <div className="mt-10 flex flex-wrap gap-2 pb-8 border-b border-stone-100">
                            {tip.tags.map((tag, idx) => (
                                <span
                                    key={idx}
                                    className="text-[10px] uppercase tracking-wider text-stone-400 border border-stone-200 px-3 py-1 rounded"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </article>

                {/* Back */}
                <div className="mt-12">
                    <Link to="/tips" className="flex items-center gap-2 text-stone-400 hover:text-[#8C7E60] transition-colors duration-150 text-sm font-sans">
                        <span className="material-symbols-outlined !text-[16px]">arrow_back</span>
                        Volver al blog
                    </Link>
                </div>
            </main>
        </div>
    );
};
