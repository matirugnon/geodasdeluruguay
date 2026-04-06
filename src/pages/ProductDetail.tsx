import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { SEOHead } from '../components/SEOHead';
import { productUrl, SITE_URL } from '../utils/slugify';
import { createWhatsAppLink } from '../config/site';

type ProductDetailStatus = 'loading' | 'success' | 'notFound' | 'error';

export const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [status, setStatus] = useState<ProductDetailStatus>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [retryNonce, setRetryNonce] = useState(0);
  const { addItem } = useCart();

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setStatus('loading');
      setErrorMessage('');
      setProduct(null);
      setRelatedProducts([]);
      setActiveImage(0);

      if (!slug) {
        if (!cancelled) {
          setStatus('notFound');
        }
        return;
      }

      try {
        const loadedProduct = await dataService.getProductBySlug(slug);
        if (cancelled) return;

        if (!loadedProduct) {
          setStatus('notFound');
          return;
        }

        if (slug !== loadedProduct.slug) {
          navigate(productUrl(loadedProduct.slug), { replace: true });
          return;
        }

        setProduct(loadedProduct);
        setStatus('success');

        try {
          const allProducts = await dataService.getVisibleProducts();
          if (cancelled) return;
          setRelatedProducts(allProducts.filter((item) => item.id !== loadedProduct.id).slice(0, 6));
        } catch (relatedError) {
          console.error('Error loading related products:', relatedError);
          if (!cancelled) {
            setRelatedProducts([]);
          }
        }
      } catch (error) {
        console.error('Error loading product detail:', error);
        if (!cancelled) {
          setErrorMessage('No pudimos cargar este producto en este momento. Probá de nuevo o volvé a la tienda.');
          setStatus('error');
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [slug, navigate, retryNonce]);

  const requestedCanonicalUrl = slug ? `${SITE_URL}/producto/${slug}` : `${SITE_URL}/tienda`;

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-white">
        <SEOHead
          title="Cargando producto"
          description="Estamos cargando la ficha del producto."
          canonical={requestedCanonicalUrl}
          noindex
        />
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
          <div className="w-7 h-7 border-2 border-stone-200 border-t-[#8C7E60] rounded-full animate-spin" />
          <p className="text-sm text-stone-500">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (status === 'notFound') {
    return (
      <div className="min-h-screen bg-white">
        <SEOHead
          title="Producto no encontrado"
          description="La pieza que buscás no está disponible o la URL es incorrecta."
          canonical={requestedCanonicalUrl}
          noindex
        />
        <div className="min-h-screen flex items-center justify-center px-6 py-20">
          <div className="w-full max-w-lg border border-stone-200 rounded-md bg-white p-8 sm:p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-300 flex items-center justify-center mx-auto mb-5">
              <span className="material-symbols-outlined !text-[30px]">search_off</span>
            </div>
            <h1 className="font-serif text-2xl text-stone-900 mb-3">Producto no encontrado</h1>
            <p className="text-sm text-stone-500 leading-relaxed mb-8">
              La pieza que intentaste abrir ya no está disponible o el enlace no es correcto.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/tienda"
                className="px-6 py-3 bg-[#8C7E60] text-white rounded text-sm font-medium hover:bg-[#756A50] transition-colors duration-200"
              >
                Volver a la tienda
              </Link>
              <Link
                to="/"
                className="px-6 py-3 border border-stone-300 text-stone-700 rounded text-sm font-medium hover:bg-stone-50 transition-colors duration-200"
              >
                Ir al inicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-white">
        <SEOHead
          title="Error al cargar producto"
          description="No pudimos cargar esta ficha en este momento."
          canonical={requestedCanonicalUrl}
          noindex
        />
        <div className="min-h-screen flex items-center justify-center px-6 py-20">
          <div className="w-full max-w-lg border border-stone-200 rounded-md bg-white p-8 sm:p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-300 flex items-center justify-center mx-auto mb-5">
              <span className="material-symbols-outlined !text-[30px]">error</span>
            </div>
            <h1 className="font-serif text-2xl text-stone-900 mb-3">No pudimos cargar este producto</h1>
            <p className="text-sm text-stone-500 leading-relaxed mb-8">
              {errorMessage || 'Hubo un problema al cargar la ficha. Probá de nuevo o volvé a la tienda.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setRetryNonce((value) => value + 1)}
                className="px-6 py-3 bg-[#8C7E60] text-white rounded text-sm font-medium hover:bg-[#756A50] transition-colors duration-200"
              >
                Reintentar
              </button>
              <Link
                to="/tienda"
                className="px-6 py-3 border border-stone-300 text-stone-700 rounded text-sm font-medium hover:bg-stone-50 transition-colors duration-200"
              >
                Volver a la tienda
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const whatsappMessage = `Hola! Me interesa el producto: *${product.title}*\n¿Está disponible?`;
  const whatsappLink = createWhatsAppLink(whatsappMessage);
  const availabilityLabel = product.stock > 0 ? 'Disponible para compra' : 'Consultar disponibilidad';
  const availabilityMessage = product.stock > 0
    ? 'Sumás esta pieza al carrito y definís entrega y forma de pago en el siguiente paso.'
    : 'Si querés esta pieza, escribinos y confirmamos disponibilidad antes de avanzar.';

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
    ...(product.specs?.weight && {
      weight: { '@type': 'QuantitativeValue', value: product.specs.weight, unitCode: 'GRM' }
    }),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Tienda', item: `${SITE_URL}/tienda` },
      ...(product.category ? [{
        '@type': 'ListItem',
        position: 3,
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
          <div className="flex flex-col gap-6 lg:sticky lg:top-24">
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

            {/* Purchase panel */}
            <div className="rounded-md border border-stone-200 bg-[#FAFAF8] p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-stone-200 pb-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-stone-400 font-medium mb-2">
                    Precio
                  </p>
                  <p className="text-2xl sm:text-[28px] font-semibold text-stone-900 leading-none">
                    $ {product.price.toLocaleString('es-UY')}
                  </p>
                </div>
                <span className="inline-flex items-center rounded-full border border-stone-300 bg-white px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-stone-500">
                  {availabilityLabel}
                </span>
              </div>

              <p className="mt-4 text-sm text-stone-500 leading-relaxed max-w-md">
                {availabilityMessage}
              </p>

              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[11px] uppercase tracking-[0.16em] text-stone-500 font-medium">
                <span>Envío coordinado</span>
                <span>Pago online o transferencia</span>
                <span>Atención directa</span>
              </div>

              <div className="mt-5 flex flex-col gap-3">
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

                <p className="text-[11px] text-stone-500 leading-relaxed text-center">
                  Si tenés dudas sobre envío, pago o esta pieza en particular, podés consultarnos antes de comprar.
                </p>

                <button
                  onClick={() => navigate(-1)}
                  className="text-center text-xs text-stone-400 hover:text-stone-600 transition-colors duration-150 pt-1"
                >
                  ← Volver
                </button>
              </div>
            </div>

            {/* Product details */}
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-[11px] uppercase tracking-[0.18em] text-stone-400 font-medium mb-2">
                  Sobre esta pieza
                </h2>
                <p className="text-sm text-stone-500 leading-relaxed font-light max-w-xl">
                  {product.description}
                </p>
              </div>

              {(product.specs?.origin || product.specs?.weight || product.specs?.dimensions) && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4 border-y border-stone-100">
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

              {product.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] uppercase tracking-wider text-stone-400 border border-stone-200 px-2.5 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Purchase support */}
            <div className="rounded-md border border-stone-200 bg-white p-4 sm:p-5">
              <h2 className="text-[11px] uppercase tracking-[0.18em] text-stone-400 font-medium mb-4">
                Compra con tranquilidad
              </h2>
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-stone-800">Envío o retiro a coordinar</span>
                  <p className="text-sm text-stone-500 leading-relaxed">
                    Confirmamos contigo la modalidad de entrega y los tiempos estimados antes de cerrar el envío.
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-stone-800">Pago online o por transferencia</span>
                  <p className="text-sm text-stone-500 leading-relaxed">
                    Podés comprar con Mercado Pago o coordinar transferencia bancaria según te quede mejor.
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-stone-800">Pieza natural y única</span>
                  <p className="text-sm text-stone-500 leading-relaxed">
                    Los tonos, vetas y detalles pueden variar naturalmente entre piezas del mismo tipo.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-stone-500">
                <Link
                  to="/envios"
                  className="hover:text-[#8C7E60] underline underline-offset-4 transition-colors duration-150"
                >
                  Ver envíos
                </Link>
                <Link
                  to="/devoluciones"
                  className="hover:text-[#8C7E60] underline underline-offset-4 transition-colors duration-150"
                >
                  Devoluciones
                </Link>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#8C7E60] underline underline-offset-4 transition-colors duration-150"
                >
                  Consultar esta pieza
                </a>
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
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  to={productUrl(relatedProduct.slug)}
                  className="group flex flex-col gap-2"
                >
                  <div className="aspect-square rounded-md overflow-hidden bg-[#F5F3EF]">
                    {relatedProduct.images?.[0] && (
                      <img
                        src={relatedProduct.images[0]}
                        alt={relatedProduct.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <p className="text-xs font-medium text-stone-700 truncate group-hover:text-[#8C7E60] transition-colors duration-150">
                    {relatedProduct.title}
                  </p>
                  <p className="text-xs text-stone-400">$ {relatedProduct.price.toLocaleString('es-UY')}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
