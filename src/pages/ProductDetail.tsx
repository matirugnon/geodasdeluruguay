import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { Product } from '../types';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const load = async () => {
      if (id) {
        const p = await dataService.getProductById(id);
        setProduct(p || null);
        
        const all = await dataService.getVisibleProducts();
        setRelatedProducts(all.filter(item => item.id !== id).slice(0, 4));
      }
    };
    load();
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#B999B9] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#2D292E] opacity-60 font-display">Cargando...</p>
        </div>
      </div>
    );
  }

  const whatsappNumber = '59894899544';
  const whatsappMessage = `Hola! Me interesa: *${product.title}*\n\n¿Está disponible?`;
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="bg-[#FDFDFD] text-[#2D292E] font-display min-h-screen">
      {/* Header fijo */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/40 backdrop-blur-md">
        <div className="flex items-center justify-between px-6 h-16 max-w-6xl mx-auto">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
          <h1 className="text-[11px] font-bold tracking-[0.4em] uppercase opacity-90 font-display">
            GEODAS DEL URUGUAY
          </h1>
          <button className="flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">shopping_bag</span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-0">
          {/* Imagen del producto - Left side on desktop */}
          <section className="w-full bg-[#FDFDFD] sticky top-16 h-[calc(100vh-4rem)] lg:h-auto lg:relative">
            <div className="aspect-square w-full h-full relative overflow-hidden">
              {product.images && product.images[activeImage] ? (
                <>
                  <img 
                    src={product.images[activeImage]}
                    alt={product.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>
                  
                  {/* Thumbnails en desktop */}
                  {product.images.length > 1 && (
                    <div className="hidden lg:flex absolute bottom-6 left-1/2 -translate-x-1/2 gap-3 bg-white/80 backdrop-blur-sm px-4 py-3 rounded-full">
                      {product.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImage(idx)}
                          className={`w-12 h-12 rounded-lg overflow-hidden transition-all ${
                            activeImage === idx 
                              ? 'ring-2 ring-[#B999B9] ring-offset-2' 
                              : 'opacity-50 hover:opacity-100'
                          }`}
                        >
                          <img src={img} alt={`Vista ${idx + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-stone-100">
                  <span className="text-stone-400">Sin imagen</span>
                </div>
              )}
            </div>
          </section>

          {/* Sección de información - Right side on desktop */}
          <section className="bg-[#FAF7F5] lg:bg-white rounded-t-[48px] lg:rounded-none -mt-12 lg:mt-0 relative z-10 pb-32 px-6 sm:px-10 pt-16 lg:pt-24 min-h-[65vh] shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.1)] lg:shadow-none lg:overflow-y-auto lg:max-h-screen">
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-xl mx-auto lg:mx-0 lg:pr-12">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#A682A6] font-semibold mb-5">
                {product.category}
              </span>
              <h2 className="text-3xl lg:text-4xl font-light mb-3 leading-tight tracking-tight">
                {product.title}
              </h2>
              <div className="text-lg font-light opacity-60 mb-10 tracking-widest">
                $ {product.price.toLocaleString('es-UY')}
              </div>
              <p className="text-[13px] leading-relaxed opacity-70 max-w-md mb-12 font-light italic">
                {product.description}
              </p>
              
              {/* Botón WhatsApp */}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#B999B9] text-white py-5 px-8 rounded-full flex items-center justify-center gap-3 shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-300"
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
                  Consultar por WhatsApp
                </span>
              </a>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-8 mt-20 border-t border-black/[0.03] pt-14 max-w-xl mx-auto lg:mx-0">
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <span className="material-symbols-outlined text-[#A682A6]/60 mb-3 text-xl">auto_awesome</span>
                <span className="text-[9px] font-bold uppercase tracking-widest mb-1.5">Piedra Natural</span>
                <span className="text-[9px] opacity-40 uppercase tracking-tighter">100% Auténtica</span>
              </div>
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <span className="material-symbols-outlined text-[#A682A6]/60 mb-3 text-xl">temp_preferences_custom</span>
                <span className="text-[9px] font-bold uppercase tracking-widest mb-1.5">Origen Local</span>
                <span className="text-[9px] opacity-40 uppercase tracking-tighter">Artigas, Uruguay</span>
              </div>
            </div>

            {/* Productos relacionados */}
            {relatedProducts.length > 0 && (
              <div className="mt-24 -mx-6 sm:-mx-10 lg:mx-0 overflow-hidden">
                <div className="px-6 sm:px-10 lg:px-0 flex justify-between items-baseline mb-8">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">
                    Otras piezas únicas
                  </h3>
                  <Link 
                    to="/tienda"
                    className="text-[9px] opacity-40 uppercase tracking-widest border-b border-black/10 pb-0.5 hover:opacity-60 transition-opacity"
                  >
                    Explorar
                  </Link>
                </div>
                <div className="flex overflow-x-auto no-scrollbar gap-5 px-6 sm:px-10 lg:px-0 pb-8">
                  {relatedProducts.map((related) => (
                    <Link
                      key={related.id}
                      to={`/producto/${related.id}`}
                      className="min-w-[140px] flex-shrink-0 group"
                    >
                      <div 
                        className="aspect-[4/5] rounded-2xl bg-stone-100 mb-4 bg-cover bg-center shadow-sm overflow-hidden"
                      >
                        {related.images && related.images[0] ? (
                          <img 
                            src={related.images[0]} 
                            alt={related.title}
                            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                            style={{filter: 'saturate(0.7)'}}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-stone-400 text-xs">Sin imagen</span>
                          </div>
                        )}
                      </div>
                      <div className="text-[9px] font-bold uppercase tracking-wider truncate mb-1">
                        {related.title}
                      </div>
                      <div className="text-[9px] opacity-40 tracking-widest">
                        $ {related.price.toLocaleString('es-UY')}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <footer className="mt-24 pt-16 pb-8 text-center lg:text-left border-t border-black/[0.03]">
              <div className="flex justify-center lg:justify-start gap-8 mb-10 opacity-20 grayscale">
                <span className="material-symbols-outlined text-xl">local_shipping</span>
                <span className="material-symbols-outlined text-xl">payments</span>
                <span className="material-symbols-outlined text-xl">verified</span>
              </div>
              <p className="text-[9px] tracking-[0.3em] opacity-30 uppercase font-display">
                © 2024 Geodas del Uruguay. Hecho a mano.
              </p>
            </footer>
          </section>
        </div>
      </main>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @media (min-width: 1024px) {
          section:last-child {
            max-height: 100vh;
            overflow-y: auto;
          }
        }
      `}</style>
    </div>
  );
};
