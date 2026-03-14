import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HeroGallery, HeroGallerySlide } from '../components/HeroGallery';
import { ProductCard } from '../components/ProductCard';
import { SEOHead } from '../components/SEOHead';
import { dataService } from '../services/dataService';
import { Product, Tip } from '../types';
import { tipUrl } from '../utils/slugify';

const categoryTiles = [
  {
    title: 'Collares',
    copy: 'Piezas delicadas para uso diario o regalo.',
    to: '/tienda/collares',
    image: '/WhatsApp Image 2026-02-21 at 10.34.37 AM.jpeg',
    position: 'center',
    imageClassName: 'scale-[1.02]',
  },
  {
    title: 'Anillos',
    copy: 'Diseños pequeños con foco en textura y brillo.',
    to: '/tienda/anillos',
    image: '/categories.jpg',
    position: '50% 44%',
    imageClassName: 'scale-[1.55]',
  },
  {
    title: 'Brazaletes',
    copy: 'Accesorios minerales con perfil contemporáneo.',
    to: '/tienda/brazaletes',
    image: '/categories.jpg',
    position: '84% 44%',
    imageClassName: 'scale-[1.55]',
  },
  {
    title: 'Piedras naturales',
    copy: 'Geodas y cristales para colección o espacios personales.',
    to: '/tienda/piedras',
    image: '/screenhero.png',
    position: 'center',
    imageClassName: 'scale-[1.08]',
  },
];

const heroSlides: HeroGallerySlide[] = [
  {
    src: '/WhatsApp Image 2026-02-21 at 10.34.01 AM (1).jpeg',
    alt: 'Collar mineral gris sobre piedra clara',
  },
  {
    src: '/screenhero.png',
    alt: 'Geoda de amatista sobre fondo neutro',
  },
  {
    src: '/WhatsApp Image 2026-02-21 at 10.34.37 AM.jpeg',
    alt: 'Collar mineral redondo sobre busto textil',
  },
  {
    src: '/collar_ia_2.jpeg',
    alt: 'Collar nacarado sobre camisa de lino',
  },
];

export const Home: React.FC = () => {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [tips, setTips] = useState<Tip[]>([]);

  useEffect(() => {
    const load = async () => {
      const allProducts = await dataService.getVisibleProducts();
      setFeatured(allProducts.slice(0, 4));

      const allTips = await dataService.getTips();
      setTips(allTips.slice(0, 2));
    };

    load();
  }, []);

  return (
    <main className="flex-grow">
      <SEOHead
        title="Cristales y Piedras Naturales de Uruguay"
        description="Geodas, amatistas, cuarzos y accesorios energéticos naturales de Uruguay. Envío a todo el país. Conectá con la energía de la tierra."
      />

      <section className="content-shell-wide section-shell-lg">
        <div className="grid items-center gap-10 xl:grid-cols-[0.82fr_1.18fr] xl:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="max-w-[31rem] px-1 sm:px-3 xl:px-6"
          >
            <div className="max-w-[29rem]">
              <span className="section-kicker">Selección mineral de Uruguay</span>
              <h1 className="mt-5 font-serif text-[clamp(2.7rem,5.3vw,5rem)] leading-[0.92] tracking-[-0.045em] text-stone-900">
                Piezas naturales con presencia serena.
              </h1>
              <p className="section-copy mt-5 max-w-[27rem] text-[1rem]">
                Geodas, cristales y accesorios elegidos para un catálogo claro, confiable y visualmente cuidado, pensado para comprar con calma.
              </p>

              <div className="mt-8">
                <Link className="btn-primary" to="/tienda">
                  Explorar la tienda
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <p className="mt-7 max-w-[24rem] text-sm leading-7 text-stone-500">
                Atención directa, pagos claros y envíos nacionales dentro de una experiencia más simple y sobria.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="xl:pl-2"
          >
            <HeroGallery slides={heroSlides} />
          </motion.div>
        </div>
      </section>

      <section id="shop" className="content-shell section-shell">
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="section-kicker">Selección destacada</span>
            <h2 className="section-subtitle">Piezas listas para regalar, habitar o coleccionar.</h2>
          </div>
          <Link className="btn-secondary" to="/tienda">
            Ver todo el catálogo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {featured.length === 0 ? (
          <div className="surface-panel-soft rounded-[1.9rem] px-6 py-16 text-center">
            <h3 className="font-serif text-3xl text-stone-900">Estamos actualizando la colección</h3>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-stone-500">
              La estructura del catálogo sigue intacta. Cuando el backend devuelva productos visibles, esta sección mostrará las piezas destacadas sin cambios adicionales.
            </p>
            <Link className="btn-primary mt-6" to="/tienda">Ir a la tienda</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="content-shell section-shell">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="section-kicker">Explorar por categoría</span>
            <h2 className="section-subtitle">Elegí una colección y entrá directo.</h2>
            <p className="section-copy mt-4">
              Una navegación visual simple para ubicarte rápido entre piezas, accesorios y cristales sin recorrer bloques de más.
            </p>
          </div>
          <Link className="btn-secondary" to="/tienda">
            Ver todo el catálogo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid max-w-5xl gap-4 sm:grid-cols-2">
          {categoryTiles.map((category) => (
            <Link
              key={category.title}
              to={category.to}
              className="group overflow-hidden rounded-[1.7rem] border border-[rgba(221,211,197,0.92)] bg-[rgba(255,255,255,0.78)] transition-transform duration-300 hover:-translate-y-0.5 hover:border-[rgba(198,184,162,0.96)]"
            >
              <div className="overflow-hidden bg-[rgba(244,238,229,0.54)]">
                <img
                  src={category.image}
                  alt={category.title}
                  className={`h-56 w-full object-cover transition-transform duration-500 group-hover:brightness-[1.03] sm:h-60 ${category.imageClassName}`}
                  style={{ objectPosition: category.position as React.CSSProperties['objectPosition'] }}
                />
              </div>
              <div className="flex items-center justify-between gap-4 px-5 py-4">
                <div className="min-w-0">
                  <h3 className="font-serif text-[1.7rem] leading-none text-stone-900">{category.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-500">{category.copy}</p>
                </div>
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-[rgba(198,184,162,0.9)] text-[var(--brand)] transition-colors duration-200 group-hover:border-[var(--brand)] group-hover:bg-[var(--brand-soft)]/60">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="content-shell section-shell">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="section-kicker">Guía y contexto</span>
            <h2 className="section-subtitle">Contenido breve para comprar con más criterio.</h2>
          </div>
          <Link className="btn-ghost text-sm font-medium" to="/tips">
            Ver todas las guías
          </Link>
        </div>

        {tips.length === 0 ? (
          <div className="surface-panel-soft rounded-[1.7rem] px-6 py-14 text-center">
            <p className="text-sm leading-7 text-stone-500">
              Cuando el backend devuelva artículos visibles, este bloque mostrará guías y consejos relacionados con las piezas.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {tips.map((tip) => (
              <Link key={tip.id} to={tipUrl(tip.slug)} className="group info-card overflow-hidden rounded-[1.7rem] p-4 sm:flex sm:gap-5">
                <div className="mb-4 h-52 overflow-hidden rounded-[1.25rem] bg-[rgba(235,225,212,0.42)] sm:mb-0 sm:h-auto sm:w-56 sm:flex-shrink-0">
                  {tip.image && <img src={tip.image} alt={tip.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />}
                </div>
                <div className="flex flex-1 flex-col">
                  {tip.tags?.[0] && (
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">{tip.tags[0]}</p>
                  )}
                  <h3 className="mt-3 font-serif text-2xl leading-tight text-stone-900">{tip.title}</h3>
                  <div
                    className="mt-4 text-sm leading-7 text-stone-500"
                    dangerouslySetInnerHTML={{ __html: tip.excerpt || `${tip.content.substring(0, 160)}...` }}
                  />
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[var(--brand)]">
                    Leer guía
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};
