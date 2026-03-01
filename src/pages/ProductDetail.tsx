import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { SEOHead } from '../components/SEOHead';
import { productUrl, SITE_URL } from '../utils/slugify';

export const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    const load = async () => {
      if (!slug) return;
      setActiveImage(0);

      const p = await dataService.getProductBySlug(slug);
      if (!p) { setProduct(null); return; }

      if (slug !== p.slug) {
        navigate(productUrl(p.slug), { replace: true });
        return;
      }

      setProduct(p);
      const all = await dataService.getVisibleProducts();
      setRelatedProducts(all.filter(item => item.id !== p.id).slice(0, 6));
    };
    load();
  }, [slug, navigate]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-7 h-7 border-2 border-stone-200 border-t-[#8C7E60] rounded-full animate-spin" />
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

  const canonicalPath = productUrl(product.slug);
  const canonicalUrl = `${SITE_URL}${canonicalPath}`;
  const seoDescription = product.description
    ? product.description.slice(0, 160)
    : `${product.title} — ${product.category}. Cristal natural de Uruguay. $${product.price} UYU.`;

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.images?.[0] || '',
    sku: product.id,
    brand: { '@type': 'Brand', name: 'Geodas del Uruguay' },
    category: product.category,
    offers: {
      '@type': 'Offer',
      url: canonicalUrl,
      priceCurrency: 'UYU',
      price: product.price,
      availability: product.stock > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: 'Geodas del Uruguay' },
    },
    ...(product.specs?.weight && { weight: { '@type': 'QuantitativeValue', value: product.specs.weight, unitCode: 'GRM' } }),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Tienda', item: `${SITE_URL}/tienda` },
      ...(product.category ? [{
        '@type': 'ListItem', position: 3,
        name: product.category,
        item: `${SITE_URL}/tienda/${product.category.toLowerCase()}`
      }] : []),
      { '@type': 'ListItem', position: product.category ? 4 : 3, name: product.title, item: canonicalUrl },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title={product.title}
        description={seoDescription}
        canonical={canonicalUrl}
        image={product.images?.[0]}
        type="product"
        jsonLd={[productJsonLd, breadcrumbJsonLd]}
      />

      {/* Breadcrumb */}
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 pt-8 pb-2">
        <nav className="flex items-center gap-2 text-xs text-stone-400 font-sans">
          <Link to="/" className="hover:text-[#8C7E60] transition-colors duration-150">Inicio</Link>
          <span>/</span>
          <Link to="/tienda" className="hover:text-[#8C7E60] transition-colors duration-150">Tienda</Link>
          {product.category && (
            <>
              <span>/</span>
              <Link
                to={`/tienda/${product.category.toLowerCase()}`}
                className="hover:text-[#8C7E60] transition-colors duration-150"
              >
                {product.category}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-stone-600 truncate max-w-[200px]">{product.title}</span>
        </nav>
      </div>

      {/* Main two-column layout */}
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_1fr] gap-10 lg:gap-16 items-start">

          {/* LEFT — Image panel */}
          <div className="flex flex-col gap-3">
            <div className="relative w-full aspect-square lg:aspect-[4/5] rounded-md overflow-hidden bg-[#F5F3EF] flex items-center justify-center">
              {product.images?.[activeImage] ? (
                <img
                  src={product.images[activeImage]}
                  alt={product.title}
                  className="w-full h-full object-contain p-6 transition-opacity duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-300">
                  <span className="material-symbols-outlined !text-[56px]">image</span>
                </div>
              )}

              {product.isNew && (
                <span className="absolute top-4 left-4 bg-[#8C7E60] text-white text-[10px] font-medium uppercase tracking-wider px-3 py-1 rounded">
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
                    className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden transition-all duration-200 ${activeImage === idx
                        ? 'ring-2 ring-[#8C7E60] ring-offset-1'
                        : 'opacity-50 hover:opacity-80'
                      }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — Info panel */}
          <div className="flex flex-col gap-5 lg:sticky lg:top-24">
            {/* Category + type */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#8C7E60] font-medium">
                {product.category}
              </span>
              {product.type && (
                <>
                  <span className="text-stone-300 text-xs">/</span>
                  <span className="text-[11px] uppercase tracking-wider text-stone-400">{product.type}</span>
                </>
              )}
            </div>

            {/* Title */}
            <h1 className="font-serif text-2xl sm:text-3xl font-medium leading-snug text-stone-900">
              {product.title}
            </h1>

            {/* Price */}
            <p className="text-xl font-sans font-semibold text-stone-800">
              $ {product.price.toLocaleString('es-UY')}
            </p>

            {/* Divider */}
            <div className="w-full h-px bg-stone-100" />

            {/* Description */}
            <p className="text-sm text-stone-500 leading-relaxed font-light max-w-md">
              {product.description}
            </p>

            {/* Specs */}
            {(product.specs?.origin || product.specs?.weight || product.specs?.dimensions) && (
              <div className="flex flex-wrap gap-6 py-4 border-y border-stone-100">
                {product.specs.origin && (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Origen</span>
                    <span className="text-sm text-stone-700">{product.specs.origin}</span>
                  </div>
                )}
                {product.specs.weight && (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Peso</span>
                    <span className="text-sm text-stone-700">{product.specs.weight}g</span>
                  </div>
                )}
                {product.specs.dimensions && (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Medidas</span>
                    <span className="text-sm text-stone-700">{product.specs.dimensions}</span>
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
                    className="text-[10px] uppercase tracking-wider text-stone-400 border border-stone-200 px-2.5 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-col gap-3 pt-3">
              <button
                onClick={handleAddToCart}
                className={`w-full py-3.5 rounded flex items-center justify-center gap-2 text-sm font-medium transition-colors duration-200 ${addedFeedback
                    ? 'bg-stone-800 text-white'
                    : 'bg-[#8C7E60] hover:bg-[#756A50] text-white'
                  }`}
              >
                <span
                  className="material-symbols-outlined !text-[18px]"
                  style={{ fontVariationSettings: addedFeedback ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {addedFeedback ? 'check_circle' : 'shopping_bag'}
                </span>
                {addedFeedback ? 'Agregado al carrito' : 'Agregar al carrito'}
              </button>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded flex items-center justify-center gap-2 border border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white text-sm font-medium transition-colors duration-200"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Consultar por WhatsApp
              </a>

              <button
                onClick={() => navigate(-1)}
                className="text-center text-xs text-stone-400 hover:text-stone-600 transition-colors duration-150 pt-1"
              >
                ← Volver
              </button>
            </div>

            {/* Trust strip */}
            <div className="flex flex-wrap items-center gap-5 pt-4 border-t border-stone-100">
              <div className="flex items-center gap-1.5 text-stone-400">
                <span className="material-symbols-outlined !text-[15px]">verified</span>
                <span className="text-[10px] uppercase tracking-wider">Auténtica</span>
              </div>
              <div className="flex items-center gap-1.5 text-stone-400">
                <span className="material-symbols-outlined !text-[15px]">local_shipping</span>
                <span className="text-[10px] uppercase tracking-wider">Envío disponible</span>
              </div>
              <div className="flex items-center gap-1.5 text-stone-400">
                <span className="material-symbols-outlined !text-[15px]">auto_awesome</span>
                <span className="text-[10px] uppercase tracking-wider">Origen natural</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 pt-12 border-t border-stone-100">
            <div className="flex items-baseline justify-between mb-8">
              <h2 className="font-serif text-lg text-stone-800 font-medium">Otras piezas</h2>
              <Link
                to="/tienda"
                className="text-xs text-stone-400 hover:text-[#8C7E60] transition-colors duration-150 underline underline-offset-2"
              >
                Ver todas
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {relatedProducts.map(r => (
                <Link
                  key={r.id}
                  to={productUrl(r.slug)}
                  className="group flex flex-col gap-2"
                >
                  <div className="aspect-square rounded-md overflow-hidden bg-[#F5F3EF]">
                    {r.images?.[0] && (
                      <img
                        src={r.images[0]}
                        alt={r.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <p className="text-xs font-medium text-stone-700 truncate group-hover:text-[#8C7E60] transition-colors duration-150">
                    {r.title}
                  </p>
                  <p className="text-xs text-stone-400">$ {r.price.toLocaleString('es-UY')}</p>
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
