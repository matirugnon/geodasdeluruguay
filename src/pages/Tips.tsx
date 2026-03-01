import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { Tip } from '../types';
import { tipUrl } from '../utils/slugify';
import { SEOHead } from '../components/SEOHead';

export const Tips: React.FC = () => {
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTips = async () => {
      try {
        const data = await dataService.getTips();
        setTips(data);
      } catch (error) {
        console.error('Error loading tips:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTips();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Tips & Guías — Cristales y Geodas"
        description="Aprendé a cuidar, limpiar y potenciar tus geodas y cristales. Guías, rituales y sabiduría natural."
        canonical="https://geodasdeluruguay.vercel.app/tips"
        type="website"
      />

      {/* Hero */}
      <header className="pt-16 pb-12 px-6 md:px-12 max-w-[1280px] mx-auto text-center">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#8C7E60] font-medium mb-4">Blog</p>
        <h1 className="font-serif text-3xl md:text-4xl text-stone-900 font-medium mb-4">
          Tips & Guías
        </h1>
        <p className="text-stone-500 font-sans font-light text-base max-w-lg mx-auto">
          Aprendé a cuidar, limpiar y potenciar tus geodas y cristales con guías prácticas y sabiduría natural.
        </p>
      </header>

      {/* Articles */}
      <main className="max-w-[900px] mx-auto px-6 md:px-12 pb-24">
        {loading ? (
          <div className="flex flex-col gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse border-b border-stone-100 pb-8">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="w-full sm:w-48 h-36 bg-stone-100 rounded-md flex-shrink-0"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-3 bg-stone-100 rounded w-1/4"></div>
                    <div className="h-6 bg-stone-100 rounded w-3/4"></div>
                    <div className="h-3 bg-stone-100 rounded w-full"></div>
                    <div className="h-3 bg-stone-100 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : tips.length === 0 ? (
          <div className="text-center py-24">
            <span className="material-symbols-outlined !text-[48px] text-stone-200 mb-4">auto_stories</span>
            <p className="text-stone-400 text-base">Aún no hay entradas publicadas.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-0">
            {tips.map((tip) => (
              <article key={tip.id} className="group border-b border-stone-100 last:border-b-0">
                <Link to={tipUrl(tip.slug)} className="flex flex-col sm:flex-row gap-6 py-8">
                  {/* Image */}
                  {tip.image && (
                    <div className="w-full sm:w-52 h-36 flex-shrink-0 rounded-md overflow-hidden bg-[#F5F3EF]">
                      <img
                        src={tip.image}
                        alt={tip.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex flex-col justify-center gap-2.5 flex-1 min-w-0">
                    {tip.tags && tip.tags.length > 0 && (
                      <span className="text-[10px] uppercase tracking-wider text-[#8C7E60] font-medium">
                        {tip.tags[0]}
                      </span>
                    )}
                    <h2 className="font-serif text-xl text-stone-800 font-medium leading-snug group-hover:text-[#8C7E60] transition-colors duration-150">
                      {tip.title}
                    </h2>
                    <div
                      className="text-sm text-stone-500 font-light leading-relaxed line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: tip.excerpt || tip.content.substring(0, 200) + '...' }}
                    />
                    <span className="text-xs text-[#8C7E60] font-medium mt-1 flex items-center gap-1 group-hover:gap-2 transition-all duration-150">
                      Leer más
                      <span className="material-symbols-outlined !text-[14px]">arrow_forward</span>
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};