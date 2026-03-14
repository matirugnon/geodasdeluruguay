import React, { useEffect, useRef, useState } from 'react';
import { Gem, Menu, MessageCircle, Search, ShoppingBag, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { productUrl } from '../utils/slugify';

const NAV_ITEMS = [
  { label: 'Inicio', to: '/' },
  { label: 'Tienda', to: '/tienda' },
  { label: 'Tips', to: '/tips' },
];

const whatsappLink = 'https://wa.me/59891458797';

export const Navbar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { itemCount, openCart } = useCart();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const doSearch = async () => {
      if (searchTerm.length > 2) {
        const res = await dataService.search(searchTerm);
        setResults(res.slice(0, 5));
        setShowResults(true);
      } else {
        setResults([]);
        setShowResults(false);
      }
    };

    const debounce = setTimeout(doSearch, 250);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  const handleResultClick = (product: Product) => {
    setSearchTerm('');
    setShowResults(false);
    navigate(productUrl(product.slug));
  };

  const getNavLinkClass = (to: string) => {
    const active = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

    return `relative text-sm font-medium tracking-[0.12em] uppercase transition-colors duration-150 ${
      active ? 'text-[var(--brand)]' : 'text-stone-600 hover:text-[var(--brand)]'
    }`;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(198,184,162,0.74)] bg-[rgba(255,252,246,0.88)] backdrop-blur-xl">
      <div className="hidden border-b border-[rgba(198,184,162,0.38)] md:block">
        <div className="content-shell flex items-center justify-between py-2 text-xs text-stone-500">
          <div className="flex items-center gap-6">
            <span>Selección natural curada en Uruguay</span>
            <span>Envíos a todo el país</span>
          </div>
          <a className="inline-flex items-center gap-2 font-medium text-[var(--brand)]" href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-3.5 w-3.5" />
            Atención por WhatsApp
          </a>
        </div>
      </div>

      <div className="content-shell">
        <div className="flex min-h-[84px] items-center justify-between gap-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-soft)] text-[var(--brand)]">
              <Gem className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-400">Storefront</span>
              <span className="mt-1 block font-serif text-[1.65rem] leading-none text-stone-900">Geodas del Uruguay</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {NAV_ITEMS.map((item) => (
              <Link key={item.to} to={item.to} className={getNavLinkClass(item.to)}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <div className="relative" ref={searchRef}>
              <div className="flex items-center rounded-full border border-[rgba(198,184,162,0.8)] bg-white/88 px-4 py-2.5 shadow-[0_6px_16px_rgba(30,23,18,0.05)]">
                <Search className="mr-3 h-4 w-4 text-stone-400" />
                <input
                  className="w-56 border-none bg-transparent text-sm text-stone-700 outline-none placeholder:text-stone-400"
                  placeholder="Buscar piezas o categorías"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => searchTerm.length > 2 && setShowResults(true)}
                />
              </div>

              {showResults && (
                <div className="surface-panel absolute right-0 top-full z-50 mt-3 w-[22rem] overflow-hidden rounded-[1.4rem] p-2">
                  <p className="px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">Resultados</p>
                  {results.length > 0 ? (
                    results.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleResultClick(product)}
                        className="flex w-full items-center gap-3 rounded-[1rem] px-3 py-3 text-left transition-colors duration-150 hover:bg-[rgba(245,240,232,0.75)]"
                      >
                        <div className="h-14 w-14 overflow-hidden rounded-[0.9rem] bg-[rgba(235,225,212,0.45)]">
                          {product.images[0] && <img src={product.images[0]} alt={product.title} className="h-full w-full object-cover" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-serif text-base leading-tight text-stone-900">{product.title}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-stone-400">{product.category}</p>
                        </div>
                        <span className="text-sm font-semibold text-stone-700">$ {product.price.toLocaleString('es-UY')}</span>
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-5 text-center text-sm text-stone-400">No encontramos coincidencias.</div>
                  )}
                </div>
              )}
            </div>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(198,184,162,0.8)] bg-white/82 text-stone-600 transition-colors duration-150 hover:border-[#25D366] hover:text-[#25D366]"
              aria-label="Contactar por WhatsApp"
            >
              <MessageCircle className="h-4 w-4" />
            </a>

            <button
              onClick={openCart}
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(198,184,162,0.8)] bg-white/82 text-stone-700 transition-colors duration-150 hover:border-[var(--brand)] hover:text-[var(--brand)]"
              aria-label="Abrir carrito"
            >
              <ShoppingBag className="h-4 w-4" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--brand)] px-1 text-[10px] font-semibold text-white">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={openCart}
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(198,184,162,0.8)] bg-white/82 text-stone-700"
              aria-label="Abrir carrito"
            >
              <ShoppingBag className="h-4 w-4" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--brand)] px-1 text-[10px] font-semibold text-white">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(198,184,162,0.8)] bg-white/82 text-stone-700"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-[rgba(198,184,162,0.45)] pb-5 pt-4 md:hidden">
            <div className="mb-4 rounded-[1.25rem] border border-[rgba(198,184,162,0.78)] bg-white/82 px-4 py-3">
              <div className="flex items-center gap-3">
                <Search className="h-4 w-4 text-stone-400" />
                <input
                  className="w-full border-none bg-transparent text-sm text-stone-700 outline-none placeholder:text-stone-400"
                  placeholder="Buscar piezas o categorías"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <nav className="space-y-2">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-[1.15rem] px-4 py-3 text-base font-medium text-stone-700 transition-colors duration-150 hover:bg-[rgba(245,240,232,0.76)] hover:text-[var(--brand)]"
                >
                  {item.label}
                </Link>
              ))}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-[1.15rem] px-4 py-3 text-base font-medium text-stone-700 transition-colors duration-150 hover:bg-[rgba(245,240,232,0.76)] hover:text-[var(--brand)]"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
