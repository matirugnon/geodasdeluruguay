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

  // Alternar estilos de layout para cada entrada
  const getLayoutClasses = (index: number) => {
    const isEven = index % 2 === 0;
    return {
      containerClass: isEven ? 'flex-col md:flex-row' : 'flex-col md:flex-row-reverse',
      imageClass: isEven ? 'md:w-3/5' : 'md:w-3/5',
      contentClass: isEven ? 'md:w-2/5 md:-ml-24' : 'md:w-2/5 md:-mr-24',
      textAlign: isEven ? 'text-center md:text-left' : 'text-center md:text-right',
      flexAlign: isEven ? 'justify-center md:justify-start' : 'justify-center md:justify-end',
      blobShape: index % 3 === 0 ? 'blob-shape-1' : index % 3 === 1 ? 'blob-shape-2' : 'blob-shape-3'
    };
  };

  // Extraer primer tag o usar default
  const getTagInfo = (tags: string[]) => {
    const tagColors = [
      { icon: 'water_drop', color: 'olive', label: tags[0] || 'Rituales de Limpieza' },
      { icon: 'wb_sunny', color: 'gold', label: tags[0] || 'Propiedades Energéticas' },
      { icon: 'spa', color: 'olive', label: tags[0] || 'Conexión Natural' }
    ];
    return tagColors;
  };

  return (
    <div className="bg-stone-50 text-stone-800 antialiased selection:bg-gold/30 selection:text-stone-900 relative">
      <SEOHead
        title="Diario Místico — Tips y Guías de Cristales"
        description="Aprendé a cuidar, limpiar y potenciar tus geodas y cristales. Guías, rituales y sabiduría natural."
        canonical="https://geodasdeluruguay.vercel.app/tips"
        type="website"
      />
      <div className="absolute inset-0 pointer-events-none z-0 texture-overlay opacity-40 mix-blend-multiply fixed"></div>
      
      <main className="relative flex-1 flex flex-col items-center w-full z-10">
        
        {/* Hero Section */}
        <section className="w-full px-6 md:px-10 lg:px-40 py-20 md:py-32 flex justify-center relative overflow-hidden">
            <div className="absolute top-10 left-10 text-stone-200 opacity-60 transform -rotate-12 pointer-events-none hidden lg:block">
                <span className="material-symbols-outlined text-[120px] font-thin">diamond</span>
            </div>
            <div className="absolute bottom-10 right-10 text-olive/10 opacity-60 transform rotate-12 pointer-events-none hidden lg:block">
                <span className="material-symbols-outlined text-[150px] font-thin">spa</span>
            </div>
            <div className="max-w-[800px] w-full flex flex-col items-center text-center gap-8 z-10">
                <div className="flex flex-col items-center gap-4">
                    <span className="text-gold font-serif italic text-lg tracking-wider">Sabiduría Natural</span>
                    <h1 className="text-stone-900 text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight font-serif">
                        Diario Místico
                    </h1>
                </div>
                <div className="h-px w-24 bg-olive/30 my-2"></div>
                <p className="text-stone-500 text-lg md:text-xl font-light leading-relaxed max-w-2xl font-sans">
                    Una guía para reconectar con la energía de la tierra. Aprende a cuidar, limpiar y potenciar tus geodas en armonía con los ciclos naturales.
                </p>
            </div>
        </section>

        {/* Articles List */}
        <div className="w-full max-w-[1300px] px-6 md:px-10 lg:px-20 py-10 flex flex-col gap-32 md:gap-40 pb-32">
            
            {loading ? (
              // Loading skeleton
              <div className="flex flex-col gap-32">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <div className="w-full md:w-3/5 aspect-[16/11] bg-stone-200 rounded-3xl"></div>
                      <div className="w-full md:w-2/5 space-y-4">
                        <div className="h-4 bg-stone-200 rounded w-1/3"></div>
                        <div className="h-8 bg-stone-200 rounded w-3/4"></div>
                        <div className="h-4 bg-stone-200 rounded"></div>
                        <div className="h-4 bg-stone-200 rounded w-5/6"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : tips.length === 0 ? (
              // Empty state
              <div className="text-center py-20">
                <span className="material-symbols-outlined text-6xl text-stone-300 mb-4">auto_stories</span>
                <p className="text-stone-400 text-xl">Aún no hay entradas en el diario místico</p>
              </div>
            ) : (
              // Dynamic tips from MongoDB
              tips.map((tip, index) => {
                const layout = getLayoutClasses(index);
                const tagInfo = getTagInfo(tip.tags || []);
                const currentTag = tagInfo[index % 3];
                
                return (
                  <article key={tip.id} className="group relative">
                    <Link to={tipUrl(tip.slug)} className="block">
                      <div className={`flex ${layout.containerClass} items-center`}>
                        <div className={`w-full ${layout.imageClass} relative z-0`}>
                          <div className={`aspect-[4/3] md:aspect-[16/11] relative overflow-hidden ${layout.blobShape} shadow-2xl shadow-stone-900/10 transition-transform duration-700 ease-out group-hover:scale-[1.02]`}>
                            <div 
                              className="absolute inset-0 bg-cover bg-center" 
                              style={{backgroundImage: `url("${tip.image}")`}}
                            ></div>
                            <div className="absolute inset-0 bg-stone-900/10 mix-blend-overlay"></div>
                          </div>
                        </div>
                        <div className={`w-full ${layout.contentClass} mt-8 md:mt-0 relative z-10`}>
                          <div className={`bg-paper/95 backdrop-blur-sm p-8 md:p-12 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-stone-100 flex flex-col gap-5 ${layout.textAlign} transition-transform duration-500 group-hover:-translate-y-2`}>
                            <div className={`flex items-center ${layout.flexAlign} gap-2 text-${currentTag.color} text-xs font-bold tracking-widest uppercase mb-1`}>
                              {index % 2 === 0 && <span className="material-symbols-outlined text-[16px]">{currentTag.icon}</span>}
                              <span>{currentTag.label}</span>
                              {index % 2 !== 0 && <span className="material-symbols-outlined text-[16px]">{currentTag.icon}</span>}
                            </div>
                            <h2 className="text-stone-900 text-3xl md:text-4xl font-bold leading-tight font-serif">
                              {tip.title}
                            </h2>
                            <div 
                              className="text-stone-500 text-base leading-relaxed font-light font-sans prose prose-stone max-w-none line-clamp-3"
                              dangerouslySetInnerHTML={{ __html: tip.excerpt || tip.content.substring(0, 200) + '...' }}
                            />
                            <div className={`pt-4 flex ${layout.flexAlign}`}>
                              <span className="group/btn flex items-center gap-2 text-stone-800 hover:text-olive font-serif italic text-lg transition-colors border-b border-stone-300 hover:border-olive pb-1">
                                <span>Leer entrada</span>
                                <span className="material-symbols-outlined text-[18px] transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </article>
                );
              })
            )}

        </div>

        {/* Newsletter Section */}
        <section className="w-full px-6 md:px-10 lg:px-40 pb-24">
            <div className="layout-content-container flex flex-col max-w-[1000px] w-full mx-auto">
                <div className="relative overflow-hidden rounded-[2rem] bg-stone-800 p-10 md:p-20 text-center">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-gold/20 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-olive/20 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="relative z-10 flex flex-col items-center gap-8">
                        <div className="flex flex-col gap-4 max-w-2xl">
                            <span className="text-gold font-serif italic tracking-wide">Comunidad Exclusiva</span>
                            <h2 className="text-stone-50 text-3xl md:text-5xl font-bold leading-tight font-serif">
                                Únete al Círculo
                            </h2>
                            <p className="text-stone-300 text-lg font-light leading-relaxed font-sans">
                                Recibe consejos mensuales alineados con las fases lunares y acceso anticipado a nuestras piezas más especiales.
                            </p>
                        </div>
                        <div className="w-full max-w-md mt-4">
                            <form className="flex flex-col sm:flex-row gap-3">
                                <input className="flex-1 bg-stone-700/50 border border-stone-600 text-stone-100 placeholder:text-stone-400 rounded-lg px-5 py-4 focus:ring-1 focus:ring-gold focus:border-gold outline-none transition-all font-light" placeholder="Tu correo electrónico" type="email"/>
                                <button className="bg-gold hover:bg-gold-dim text-stone-900 font-bold py-4 px-8 rounded-lg transition-colors shadow-lg shadow-gold/20 whitespace-nowrap" type="button">
                                    Suscribirse
                                </button>
                            </form>
                            <p className="text-stone-500 text-xs mt-4 font-sans">
                                Respetamos tu privacidad y tu energía.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

      </main>
    </div>
  );
};