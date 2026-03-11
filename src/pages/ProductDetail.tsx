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
      if (!p) {
        setProduct(null);
        return;
      }

      if (slug !== p.slug) {
        navigate(productUrl(p.slug), { replace: true });
        return;
      }

      setProduct(p);
      const all = await dataService.getVisibleProducts();
      setRelatedProducts(all.filter((item) => item.id !== p.id).slice(0, 6));
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
    : `${product.title} - ${product.category}. Cristal natural de Uruguay. $${product.price} UYU.`;

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
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: 'Geodas del Uruguay' },
    },
    ...(product.specs?.weight && {
      weight: { '@type': 'QuantitativeValue', value: product.specs.weight, unitCode: 'GRM' },
    }),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Tienda', item: `${SITE_URL}/tienda` },
      ...(product.category
        ? [
            {
              '@type': 'ListItem',
              position: 3,
              name: product.category,
              item: `${SITE_URL}/tienda/${product.category.toLowerCase()}`,
            },
          ]
        : []),
      { '@type': 'ListItem', position: product.category ? 4 : 3, name: product.title, item: canonicalUrl },
    ],
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      <SEOHead
        title={product.title}
        description={seoDescription}
        canonical={canonicalUrl}
        image={product.images?.[0]}
        type="product"
        jsonLd={[productJsonLd, breadcrumbJsonLd]}
      />

      <div className="max-w-[1280px] mx-auto px-6 md:px-12 pt-8 pb-14">
        <nav className="flex items-center gap-2 text-sm text-stone-500 mb-6">
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
          <span className="text-stone-700 truncate max-w-[260px]">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,56%)_minmax(0,44%)] gap-6 lg:gap-8 items-start">
          <section className="rounded-md border border-stone-200 bg-white p-4 md:p-5">
            <div className="relative w-full aspect-[4/5] rounded-md overflow-hidden bg-[#F5F3EF] flex items-center justify-center">
              {product.images?.[activeImage] ? (
                <img
                  src={product.images[activeImage]}
                  alt={product.title}
                  className="w-full h-full object-contain p-6 md:p-8"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-300">
                  <span className="material-symbols-outlined !text-[56px]">image</span>
                </div>
              )}

              {product.isNew && (
                <span className="absolute top-3 left-3 bg-[#8C7E60] text-white text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-md">
                  Nuevo
                </span>
              )}
            </div>

            {product.images?.length > 1 && (
              <div className="mt-4 grid grid-cols-5 sm:grid-cols-6 gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`aspect-square rounded-md overflow-hidden border transition-colors duration-150 ${
                      activeImage === idx ? 'border-[#8C7E60]' : 'border-stone-200 hover:border-stone-300'
                    }`}
                    aria-label={`Ver imagen ${idx + 1}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </section>

          <aside className="rounded-md border border-stone-200 bg-white p-5 md:p-6 lg:sticky lg:top-24">
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span className="text-[11px] uppercase tracking-[0.16em] text-[#8C7E60] font-semibold">{product.category}</span>
              {product.type && (
                <span className="text-[11px] uppercase tracking-[0.16em] text-stone-500 border border-stone-200 px-2 py-0.5 rounded-md">
                  {product.type}
                </span>
              )}
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-medium leading-snug text-stone-900 mb-3">{product.title}</h1>

            <p className="text-2xl font-semibold text-stone-900 mb-5">$ {product.price.toLocaleString('es-UY')}</p>

            <p className="text-base text-stone-600 leading-relaxed mb-5">{product.description}</p>

            {(product.specs?.origin || product.specs?.weight || product.specs?.dimensions) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                {product.specs.origin && (
                  <div className="rounded-md border border-stone-200 bg-[#F8F7F4] px-3 py-2.5">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-stone-500 mb-1">Origen</p>
                    <p className="text-sm text-stone-800">{product.specs.origin}</p>
                  </div>
                )}
                {product.specs.weight && (
                  <div className="rounded-md border border-stone-200 bg-[#F8F7F4] px-3 py-2.5">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-stone-500 mb-1">Peso</p>
                    <p className="text-sm text-stone-800">{product.specs.weight} g</p>
                  </div>
                )}
                {product.specs.dimensions && (
                  <div className="rounded-md border border-stone-200 bg-[#F8F7F4] px-3 py-2.5 sm:col-span-2">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-stone-500 mb-1">Medidas</p>
                    <p className="text-sm text-stone-800">{product.specs.dimensions}</p>
                  </div>
                )}
              </div>
            )}

            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] uppercase tracking-[0.1em] text-stone-600 border border-stone-200 px-2.5 py-1 rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                className={`w-full min-h-12 rounded-md flex items-center justify-center gap-2 text-sm font-medium transition-colors duration-150 ${
                  addedFeedback ? 'bg-stone-800 text-white' : 'bg-[#8C7E60] hover:bg-[#756A50] text-white'
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
                className="w-full min-h-12 rounded-md flex items-center justify-center gap-2 border border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white text-sm font-medium transition-colors duration-150"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Consultar por WhatsApp
              </a>

              <button
                onClick={() => navigate(-1)}
                className="w-full min-h-11 rounded-md border border-stone-300 text-stone-600 text-sm hover:bg-stone-50 transition-colors duration-150"
              >
                Volver
              </button>
            </div>

            <div className="mt-5 pt-4 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-2 text-stone-600">
                <span className="material-symbols-outlined !text-[17px]">verified</span>
                <span className="text-xs">Pieza auténtica</span>
              </div>
              <div className="flex items-center gap-2 text-stone-600">
                <span className="material-symbols-outlined !text-[17px]">local_shipping</span>
                <span className="text-xs">Envío disponible</span>
              </div>
              <div className="flex items-center gap-2 text-stone-600">
                <span className="material-symbols-outlined !text-[17px]">shopping_bag</span>
                <span className="text-xs">Compra segura</span>
              </div>
            </div>
          </aside>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-12 rounded-md border border-stone-200 bg-white p-5 md:p-6">
            <div className="flex items-center justify-between gap-3 mb-5">
              <h2 className="font-serif text-xl text-stone-800 font-medium">También te puede interesar</h2>
              <Link
                to="/tienda"
                className="text-sm text-[#8C7E60] hover:text-[#756A50] font-medium underline underline-offset-2"
              >
                Ver toda la tienda
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {relatedProducts.map((r) => (
                <Link key={r.id} to={productUrl(r.slug)} className="group rounded-md border border-stone-200 overflow-hidden bg-white">
                  <div className="aspect-square bg-[#F5F3EF]">
                    {r.images?.[0] && (
                      <img
                        src={r.images[0]}
                        alt={r.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-stone-800 line-clamp-2 min-h-[2.5rem] group-hover:text-[#8C7E60] transition-colors duration-150">
                      {r.title}
                    </p>
                    <p className="text-sm font-semibold text-stone-900 mt-1">$ {r.price.toLocaleString('es-UY')}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
