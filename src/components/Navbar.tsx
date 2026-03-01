import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { productUrl } from '../utils/slugify';

export const Navbar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { itemCount, openCart } = useCart();

  // Navbar siempre sólida
  const shouldBeTransparent = false;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    const debounce = setTimeout(doSearch, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  const handleResultClick = (product: Product) => {
    setSearchTerm('');
    setShowResults(false);
    navigate(productUrl(product.slug));
  };

  const navLinkClass = "text-[15px] font-sans font-medium tracking-wide text-stone-600 hover:text-[#8C7E60] transition-colors duration-200 relative after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[1.5px] after:bg-[#8C7E60] after:transition-all after:duration-200 hover:after:w-full";

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300 bg-white/95 backdrop-blur-sm border-b border-stone-200/70">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between h-[72px]">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <span className="text-[22px] font-serif font-semibold tracking-tight text-stone-800">
              Geodas del Uruguay
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            <Link to="/" className={navLinkClass}>Inicio</Link>
            <Link to="/tienda" className={navLinkClass}>Tienda</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="hidden md:flex items-center relative" ref={searchRef}>
              <div className="flex items-center rounded-md transition-all duration-200 border border-transparent focus-within:border-stone-200 focus-within:bg-stone-50">
                <input
                  ref={searchInputRef}
                  className="w-0 focus:w-44 transition-all duration-300 ease-out bg-transparent border-none focus:ring-0 p-0 pl-3 py-2 text-sm text-stone-700 placeholder-stone-400 opacity-0 focus:opacity-100 cursor-pointer focus:cursor-text outline-none"
                  placeholder="Buscar..."
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => searchTerm.length > 2 && setShowResults(true)}
                />
                <button
                  onClick={() => searchInputRef.current?.focus()}
                  className="p-2 text-stone-500 hover:text-[#8C7E60] transition-colors duration-200"
                  type="button"
                >
                  <span className="material-symbols-outlined !text-[22px]">search</span>
                </button>
              </div>

              {/* Results Dropdown */}
              {showResults && (
                <div className="absolute top-full right-0 mt-3 w-80 bg-white border border-stone-200 rounded-lg shadow-lg overflow-hidden z-50">
                  <div className="p-2">
                    <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest px-3 py-2">Resultados</p>
                    {results.length > 0 ? (
                      results.map(product => (
                        <button
                          key={product.id}
                          onClick={() => handleResultClick(product)}
                          className="flex w-full items-center gap-3 px-3 py-2.5 hover:bg-stone-50 rounded-md transition-colors duration-150 text-left"
                        >
                          <div className="w-11 h-11 rounded-md overflow-hidden flex-shrink-0 bg-stone-100">
                            <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-stone-800 leading-tight truncate">{product.title}</p>
                            <p className="text-xs text-stone-500 mt-0.5">$ {product.price.toLocaleString('es-UY')}</p>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="text-sm text-stone-400 px-3 py-4 text-center">Sin resultados.</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* WhatsApp - discreet */}
            <a
              href="https://wa.me/59891458797"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex p-2 text-stone-500 hover:text-[#25D366] transition-colors duration-200"
              aria-label="Contactar por WhatsApp"
            >
              <svg className="w-[22px] h-[22px]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative p-2 text-stone-600 hover:text-[#8C7E60] transition-colors duration-200"
              aria-label="Abrir carrito"
            >
              <span className="material-symbols-outlined !text-[22px]">shopping_bag</span>
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] bg-[#8C7E60] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-600 hover:text-[#8C7E60] transition-colors duration-200"
            >
              <span className="material-symbols-outlined !text-[24px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>

        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-5 border-t border-stone-100">
            <nav className="flex flex-col gap-1">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[15px] font-sans font-medium text-stone-700 hover:text-[#8C7E60] hover:bg-stone-50 px-4 py-3 rounded-md transition-colors duration-150"
              >
                Inicio
              </Link>
              <Link
                to="/tienda"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[15px] font-sans font-medium text-stone-700 hover:text-[#8C7E60] hover:bg-stone-50 px-4 py-3 rounded-md transition-colors duration-150"
              >
                Tienda
              </Link>
              <Link
                to="/tips"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[15px] font-sans font-medium text-stone-700 hover:text-[#8C7E60] hover:bg-stone-50 px-4 py-3 rounded-md transition-colors duration-150"
              >
                Tips
              </Link>
              <a
                href="https://wa.me/59891458797"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[15px] font-sans font-medium text-stone-700 hover:text-[#25D366] hover:bg-stone-50 px-4 py-3 rounded-md transition-colors duration-150 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};