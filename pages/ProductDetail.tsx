import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { Product } from '../types';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const load = async () => {
      if (id) {
        const p = await dataService.getProductById(id);
        setProduct(p || null);
        
        // Fetch related products (mock logic: just get all and filter out current)
        const all = await dataService.getVisibleProducts();
        setRelatedProducts(all.filter(item => item.id !== id).slice(0, 3));
      }
    };
    load();
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) return <div className="p-20 text-center font-newsreader text-xl">Cargando energía...</div>;

  const whatsappNumber = '59891458797'; // Cambiar por tu número real
  const whatsappMessage = `¡Hola! Me interesa esta pieza:\n\n*${product.title}*\n\nPrecio: $${product.price.toLocaleString('es-UY')} UYU\nCategoría: ${product.category}\n\n¿Está disponible?`;
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="bg-product-bg-light dark:bg-product-bg-dark font-newsreader text-[#161811] dark:text-gray-100 min-h-screen flex flex-col">
        {/* Main Content Area */}
        <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 sm:px-10 py-8 sm:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-24">
                
                {/* Image Section */}
                <div className="flex flex-col gap-4">
                    <div className="relative w-full aspect-[4/5] bg-gray-200 rounded-xl overflow-hidden group">
                        <img 
                            src={product.images[activeImage] || product.images[0]} 
                            alt={product.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        />
                        <div className="absolute top-4 left-4">
                            <span className="bg-white/80 dark:bg-black/60 backdrop-blur-sm text-[#161811] dark:text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-white/20">Pieza Única</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        {product.images.map((img, idx) => (
                            <button 
                                key={idx}
                                onClick={() => setActiveImage(idx)}
                                className={`relative aspect-square rounded-lg overflow-hidden ${activeImage === idx ? 'ring-2 ring-primary-green ring-offset-2 dark:ring-offset-[#1c2210]' : 'opacity-70 hover:opacity-100 transition-opacity'}`}
                            >
                                <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                        {/* Placeholder for video or extra thumbnail if not enough images */}
                        {product.images.length < 4 && (
                             <button className="relative aspect-square rounded-lg overflow-hidden opacity-70 hover:opacity-100 transition-opacity bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                                <span className="material-symbols-outlined text-3xl text-olive-light">play_circle</span>
                             </button>
                        )}
                    </div>
                </div>

                {/* Info Section */}
                <div className="flex flex-col justify-center">
                    <nav className="flex flex-wrap items-center gap-2 mb-6">
                        <Link to="/" className="text-olive-light hover:text-primary-green transition-colors text-sm font-medium leading-normal">Inicio</Link>
                        <span className="material-symbols-outlined text-olive-light text-[16px]">chevron_right</span>
                        <Link to={`/categoria/${product.category.toLowerCase()}`} className="text-olive-light hover:text-primary-green transition-colors text-sm font-medium leading-normal">{product.category}</Link>
                        <span className="material-symbols-outlined text-olive-light text-[16px]">chevron_right</span>
                        <span className="text-[#161811] dark:text-white text-sm font-medium leading-normal border-b border-primary-green/50">{product.title}</span>
                    </nav>
                    
                    <h1 className="text-[#161811] dark:text-white text-4xl lg:text-5xl font-bold leading-tight tracking-tight mb-4">
                        {product.title}
                    </h1>
                    
                    <div className="flex items-center gap-4 mb-8">
                        <p className="text-[#161811] dark:text-gray-100 text-2xl font-bold">$ {product.price.toLocaleString('es-UY')} UYU</p>
                        {product.stock > 0 ? (
                            <span className="bg-primary-green/20 text-olive-dark dark:text-primary-green px-2 py-0.5 text-xs font-bold rounded uppercase tracking-wide">Disponible</span>
                        ) : (
                            <span className="bg-red-100 text-red-800 px-2 py-0.5 text-xs font-bold rounded uppercase tracking-wide">Agotado</span>
                        )}
                    </div>
                    
                    <div className="h-px w-full bg-[#f3f4f0] dark:bg-[#2a3020] mb-8"></div>
                    
                    <div className="prose prose-stone dark:prose-invert mb-8">
                        <p className="text-[#161811] dark:text-gray-300 text-lg leading-relaxed font-normal">
                            {product.description}
                        </p>
                        <p className="text-[#161811] dark:text-gray-300 text-lg leading-relaxed font-normal mt-4">
                            Cada pieza es seleccionada a mano por nuestros artesanos, respetando la forma natural de la piedra y su energía única.
                        </p>
                    </div>

                    <div className="mb-10 bg-[#fcfbf9] dark:bg-[#232915] p-6 rounded-lg border border-[#ebe9e4] dark:border-[#2a3020]">
                        <h3 className="text-lg font-display font-semibold text-[#161811] dark:text-white mb-4 border-b border-[#ebe9e4] dark:border-[#2a3020] pb-2">Especificaciones Técnicas</h3>
                        <div className="grid grid-cols-3 gap-6">
                            <div className="flex flex-col">
                                <span className="text-xs uppercase tracking-widest text-[#7c8961] mb-1">Peso</span>
                                <span className="font-display font-medium text-lg text-[#161811] dark:text-white">{product.specs.weight}g</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs uppercase tracking-widest text-[#7c8961] mb-1">Medidas</span>
                                <span className="font-display font-medium text-lg text-[#161811] dark:text-white">{product.specs.dimensions || 'N/A'}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs uppercase tracking-widest text-[#7c8961] mb-1">Origen</span>
                                <span className="font-display font-medium text-lg text-[#161811] dark:text-white">{product.specs.origin || 'Uruguay'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mb-10">
                        <h3 className="text-xl font-display font-semibold text-[#161811] dark:text-white mb-4">Propiedades Energéticas</h3>
                        <div className="flex flex-wrap gap-3">
                            {product.tags.length > 0 ? product.tags.map(tag => (
                                <span key={tag} className="inline-flex items-center px-4 py-1.5 rounded-full border border-amethyst-border dark:border-[#4a3b55] text-amethyst-text dark:text-[#d3c2e0] text-sm font-medium bg-amethyst-light dark:bg-[#2d2433]">
                                    {tag}
                                </span>
                            )) : (
                                <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-amethyst-border dark:border-[#4a3b55] text-amethyst-text dark:text-[#d3c2e0] text-sm font-medium bg-amethyst-light dark:bg-[#2d2433]">
                                    Energía Pura
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 mb-10">
                        <a 
                            href={whatsappLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="group relative w-full bg-[#a69460] hover:bg-[#8c7b4d] dark:bg-[#a69460] dark:hover:bg-[#8c7b4d] text-white h-14 rounded-lg font-bold text-lg tracking-wide transition-all shadow-lg shadow-[#a69460]/30 flex items-center justify-center gap-3 overflow-hidden active:scale-[0.99]"
                        >
                            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path>
                            </svg>
                            Consultar disponibilidad
                        </a>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 bg-white dark:bg-[#232915] p-6 rounded-xl border border-[#f3f4f0] dark:border-[#2a3020]">
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-full bg-[#f3f4f0] dark:bg-[#2a3020] text-olive-dark dark:text-primary-green">
                                <span className="material-symbols-outlined">spa</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-[#161811] dark:text-white text-base">Hecho a mano</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Artesanía local experta</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-full bg-[#f3f4f0] dark:bg-[#2a3020] text-olive-dark dark:text-primary-green">
                                <span className="material-symbols-outlined">location_on</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-[#161811] dark:text-white text-base">Origen Uruguay</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Canteras de Artigas</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-24 border-t border-[#f3f4f0] dark:border-[#2a3020] pt-12">
                <h3 className="text-2xl font-bold text-[#161811] dark:text-white mb-8">También te podría gustar</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    {relatedProducts.map(related => (
                        <Link key={related.id} to={`/producto/${related.id}`} className="group cursor-pointer">
                            <div className="aspect-[4/5] rounded-lg overflow-hidden mb-4 bg-gray-100">
                                <img 
                                    src={related.images[0]} 
                                    alt={related.title} 
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                                />
                            </div>
                            <h4 className="font-bold text-lg text-[#161811] dark:text-white group-hover:text-olive-dark dark:group-hover:text-primary-green transition-colors">{related.title}</h4>
                            <p className="text-olive-light">$ {related.price.toLocaleString('es-UY')} UYU</p>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    </div>
  );
};
