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
    <div className="content-shell section-shell-lg">
      <SEOHead
        title={product.title}
        description={seoDescription}
        canonical={canonicalUrl}
        image={product.images?.[0]}
        type="product"
        jsonLd={[productJsonLd, breadcrumbJsonLd]}
      />

      <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-stone-400">
        <Link to="/" className="transition-colors duration-150 hover:text-[var(--brand)]">Inicio</Link>
        <span>/</span>
        <Link to="/tienda" className="transition-colors duration-150 hover:text-[var(--brand)]">Tienda</Link>
        {product.category && (
          <>
            <span>/</span>
            <Link to={`/tienda/${product.category.toLowerCase()}`} className="transition-colors duration-150 hover:text-[var(--brand)]">
              {product.category}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="font-medium text-stone-700">{product.title}</span>
      </nav>

      <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_420px]">
        <section className="surface-panel rounded-[2.2rem] p-5 sm:p-6 lg:p-7">
          <div className="flex min-h-[420px] items-center justify-center overflow-hidden rounded-[2rem] bg-[rgba(244,238,229,0.62)] p-4 sm:min-h-[560px] sm:p-6">
            {product.images?.[activeImage] ? (
              <img
                src={product.images[activeImage]}
                alt={product.title}
                className="max-h-[72vh] w-full object-contain object-center"
              />
            ) : (
              <div className="flex min-h-[420px] w-full items-center justify-center text-stone-300 sm:min-h-[560px]">
                <span className="material-symbols-outlined !text-[56px]">image</span>
              </div>
            )}
          </div>

          {product.images?.length > 1 && (
            <div className="no-scrollbar mt-5 flex gap-3 overflow-x-auto">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`flex h-24 w-24 items-center justify-center overflow-hidden rounded-[1.1rem] border bg-[rgba(244,238,229,0.62)] p-2 transition-all duration-150 ${
                    activeImage === idx
                      ? 'border-[var(--brand)] shadow-[0_10px_24px_rgba(101,76,49,0.12)]'
                      : 'border-[rgba(198,184,162,0.6)] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-contain object-center" />
                </button>
              ))}
            </div>
          )}
        </section>

        <aside className="space-y-5 xl:sticky xl:top-28 xl:self-start">
          <section className="surface-panel rounded-[2rem] px-6 py-7 sm:px-7">
            <div className="flex flex-wrap items-center gap-2">
              <span className="eyebrow-chip">{product.category}</span>
              {product.type && <span className="eyebrow-chip">{product.type}</span>}
              {product.isNew && <span className="eyebrow-chip">Nuevo</span>}
            </div>

            <h1 className="mt-5 font-serif text-4xl leading-tight text-stone-900">{product.title}</h1>
            <p className="mt-4 text-3xl font-semibold tracking-tight text-stone-900">
              $ {product.price.toLocaleString('es-UY')}
            </p>
            <p className="mt-5 text-sm leading-7 text-stone-600">{product.description}</p>

            {(product.specs?.origin || product.specs?.weight || product.specs?.dimensions) && (
              <div className="mt-6 grid gap-3 border-y border-[rgba(198,184,162,0.48)] py-6 sm:grid-cols-3">
                {product.specs.origin && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">Origen</p>
                    <p className="mt-2 text-sm text-stone-700">{product.specs.origin}</p>
                  </div>
                )}
                {product.specs.weight && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">Peso</p>
                    <p className="mt-2 text-sm text-stone-700">{product.specs.weight} g</p>
                  </div>
                )}
                {product.specs.dimensions && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">Medidas</p>
                    <p className="mt-2 text-sm text-stone-700">{product.specs.dimensions}</p>
                  </div>
                )}
              </div>
            )}

            {product.tags?.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-[rgba(198,184,162,0.7)] px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-stone-500">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-7 space-y-3">
              <button
                onClick={handleAddToCart}
                className={`btn-primary w-full justify-center ${addedFeedback ? 'bg-stone-900 border-stone-900' : ''}`}
              >
                {addedFeedback ? 'Agregado al carrito' : 'Agregar al carrito'}
              </button>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary w-full justify-center"
              >
                Consultar por WhatsApp
              </a>

              <button onClick={() => navigate(-1)} className="btn-ghost w-full justify-center text-sm font-medium">
                Volver
              </button>
            </div>
          </section>

          <section className="info-card rounded-[1.8rem] px-6 py-6">
            <h2 className="font-serif text-2xl text-stone-900">Compra con confianza</h2>
            <div className="mt-5 space-y-4">
              <div className="rounded-[1.2rem] border border-[rgba(198,184,162,0.6)] bg-white/76 p-4">
                <p className="text-sm font-semibold text-stone-900">Pieza natural</p>
                <p className="mt-2 text-sm leading-7 text-stone-500">Cada producto mantiene su apariencia y carácter mineral auténtico.</p>
              </div>
              <div className="rounded-[1.2rem] border border-[rgba(198,184,162,0.6)] bg-white/76 p-4">
                <p className="text-sm font-semibold text-stone-900">Despacho seguro</p>
                <p className="mt-2 text-sm leading-7 text-stone-500">Empaque cuidado y coordinación directa para entrega o retiro.</p>
              </div>
              <div className="rounded-[1.2rem] border border-[rgba(198,184,162,0.6)] bg-white/76 p-4">
                <p className="text-sm font-semibold text-stone-900">Pago claro</p>
                <p className="mt-2 text-sm leading-7 text-stone-500">Mercado Pago o transferencia, con seguimiento simple del pedido.</p>
              </div>
            </div>
          </section>
        </aside>
      </div>

      {relatedProducts.length > 0 && (
        <section className="section-shell">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="section-kicker">Más piezas</span>
              <h2 className="section-subtitle">Otras opciones para seguir explorando.</h2>
            </div>
            <Link to="/tienda" className="btn-secondary">
              Ver catálogo completo
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {relatedProducts.slice(0, 4).map((item) => (
              <Link key={item.id} to={productUrl(item.slug)} className="group info-card overflow-hidden rounded-[1.7rem]">
                <div className="overflow-hidden bg-[rgba(235,225,212,0.45)]">
                  {item.images?.[0] && (
                    <img src={item.images[0]} alt={item.title} className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                  )}
                </div>
                <div className="p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">{item.category}</p>
                  <h3 className="mt-3 font-serif text-xl text-stone-900">{item.title}</h3>
                  <p className="mt-3 text-lg font-semibold text-stone-900">$ {item.price.toLocaleString('es-UY')}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
