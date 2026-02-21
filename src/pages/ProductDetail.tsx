import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setActiveImage(0);
      const p = await dataService.getProductById(id);
      setProduct(p || null);
      const all = await dataService.getVisibleProducts();
      setRelatedProducts(all.filter(item => item.id !== id).slice(0, 6));
    };
    load();
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#c5a059] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const whatsappNumber = '59894899544';
  const whatsappMessage = `Hola! Me interesa el producto: *${product.title}*\n¿Está disponible?`;
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  const handleAddToCart = () => {
    addItem(product);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1800);
  };

  return (
    <div className="bg-[#FDFDFD] text-[#1c1917] font-display">
      {/* ── Breadcrumb ──────────────────────────────────────────────── */}
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10 pt-6 pb-2">
        <nav className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-stone-400">
          <Link to="/" className="hover:text-primary transition-colors">Inicio</Link>
          <span>·</span>
          <Link to="/tienda" className="hover:text-primary transition-colors">Tienda</Link>
          <span>·</span>
          {product.category && (
            <>
              <Link
                to={`/tienda/${product.category.toLowerCase()}`}
                className="hover:text-primary transition-colors"
              >
                {product.category}
              </Link>
              <span>·</span>
            </>
          )}
          <span className="text-stone-600 truncate max-w-[180px]">{product.title}</span>
        </nav>
      </div>

      {/* ── Main two-column grid ─────────────────────────────────────── */}
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_1fr] gap-10 lg:gap-14 items-start">

          {/* LEFT — Image panel ──────────────────────────────────────── */}
          <div className="flex flex-col gap-3">
            {/* Main image */}
            <div className="relative w-full aspect-[4/3] sm:aspect-[3/2] lg:aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100">
              {product.images?.[activeImage] ? (
                <img
                  src={product.images[activeImage]}
                  alt={product.title}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-300">
                  <span className="material-symbols-outlined text-6xl">image</span>
                </div>
              )}

              {product.isNew && (
                <span className="absolute top-4 left-4 bg-primary text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                  Nuevo
                </span>
              )}
            </div>

            {/* Thumbnail strip */}
            {product.images?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden transition-all duration-200 ${activeImage === idx
                        ? 'ring-2 ring-primary ring-offset-1'
                        : 'opacity-50 hover:opacity-80'
                      }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — Info panel ──────────────────────────────────────── */}
          <div className="flex flex-col gap-5 lg:sticky lg:top-24">
            {/* Category + type */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.35em] text-primary font-semibold">
                {product.category}
              </span>
              {product.type && (
                <>
                  <span className="text-stone-300 text-xs">·</span>
                  <span className="text-[10px] uppercase tracking-widest text-stone-400">{product.type}</span>
                </>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-light font-serif leading-snug tracking-tight text-stone-900">
              {product.title}
            </h1>

            {/* Price */}
            <p className="text-2xl font-light tracking-widest text-stone-500">
              $ {product.price.toLocaleString('es-UY')}
            </p>

            {/* Divider */}
            <div className="w-10 h-px bg-stone-200" />

            {/* Description */}
            <p className="text-sm text-stone-500 leading-relaxed font-light max-w-sm">
              {product.description}
            </p>

            {/* Specs */}
            {(product.specs?.origin || product.specs?.weight || product.specs?.dimensions) && (
              <div className="flex flex-wrap gap-5 py-3 border-y border-stone-100">
                {product.specs.origin && (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] uppercase tracking-widest text-stone-300 font-semibold">Origen</span>
                    <span className="text-xs text-stone-600">{product.specs.origin}</span>
                  </div>
                )}
                {product.specs.weight && (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] uppercase tracking-widest text-stone-300 font-semibold">Peso</span>
                    <span className="text-xs text-stone-600">{product.specs.weight}g</span>
                  </div>
                )}
                {product.specs.dimensions && (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] uppercase tracking-widest text-stone-300 font-semibold">Medidas</span>
                    <span className="text-xs text-stone-600">{product.specs.dimensions}</span>
                  </div>
                )}
              </div>
            )}

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-[9px] uppercase tracking-widest text-stone-400 border border-stone-200 px-2.5 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* ── CTAs ──────────────────────────────────────────────── */}
            <div className="flex flex-col gap-3 pt-2">
              {/* Primary — Add to Cart */}
              <button
                onClick={handleAddToCart}
                className={`w-full h-13 py-4 rounded-full flex items-center justify-center gap-2.5 font-bold text-[11px] uppercase tracking-[0.2em] shadow-sm active:scale-[0.98] transition-all duration-300 ${addedFeedback
                    ? 'bg-stone-800 text-white'
                    : 'bg-primary hover:bg-primary-dark text-white hover:shadow-md'
                  }`}
              >
                <span
                  className="material-symbols-outlined !text-[18px]"
                  style={{ fontVariationSettings: addedFeedback ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {addedFeedback ? 'check_circle' : 'shopping_bag'}
                </span>
                {addedFeedback ? '¡Agregado al carrito!' : 'Agregar al carrito'}
              </button>

              {/* Secondary — WhatsApp */}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 rounded-full flex items-center justify-center gap-2.5 border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white font-bold text-[11px] uppercase tracking-[0.2em] transition-all duration-300 active:scale-[0.98]"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Consultar por WhatsApp
              </a>

              {/* Back link */}
              <button
                onClick={() => navigate(-1)}
                className="text-center text-[10px] uppercase tracking-widest text-stone-300 hover:text-stone-500 transition-colors pt-1"
              >
                ← Volver
              </button>
            </div>

            {/* Trust strip */}
            <div className="flex items-center gap-6 pt-4 border-t border-stone-100">
              <div className="flex items-center gap-1.5 text-stone-300">
                <span className="material-symbols-outlined !text-[14px]">verified</span>
                <span className="text-[9px] uppercase tracking-widest">Auténtica</span>
              </div>
              <div className="flex items-center gap-1.5 text-stone-300">
                <span className="material-symbols-outlined !text-[14px]">local_shipping</span>
                <span className="text-[9px] uppercase tracking-widest">Envío disponible</span>
              </div>
              <div className="flex items-center gap-1.5 text-stone-300">
                <span className="material-symbols-outlined !text-[14px]">auto_awesome</span>
                <span className="text-[9px] uppercase tracking-widest">Origen natural</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Related products ──────────────────────────────────────────── */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 pt-12 border-t border-stone-100">
            <div className="flex items-baseline justify-between mb-7">
              <h2 className="text-xs uppercase tracking-[0.3em] text-stone-400 font-semibold">Otras piezas</h2>
              <Link
                to="/tienda"
                className="text-[10px] uppercase tracking-widest text-stone-300 hover:text-primary transition-colors underline underline-offset-2"
              >
                Ver todas
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {relatedProducts.map(r => (
                <Link
                  key={r.id}
                  to={`/producto/${r.id}`}
                  className="group flex flex-col gap-2"
                >
                  <div className="aspect-square rounded-xl overflow-hidden bg-stone-100">
                    {r.images?.[0] && (
                      <img
                        src={r.images[0]}
                        alt={r.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-600 truncate group-hover:text-primary transition-colors">
                    {r.title}
                  </p>
                  <p className="text-[10px] text-stone-400">$ {r.price.toLocaleString('es-UY')}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};
