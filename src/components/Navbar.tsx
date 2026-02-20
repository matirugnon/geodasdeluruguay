import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

export const Navbar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { itemCount, openCart } = useCart();

  // Solo hacer transparente la navbar en la página de inicio
  const isHomePage = location.pathname === '/' || location.pathname === '/#/';
  const shouldBeTransparent = isHomePage && !isScrolled;

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

  const handleResultClick = (id: string) => {
    setSearchTerm('');
    setShowResults(false);
    navigate(`/producto/${id}`);
  };

  return (
    <header className={`${shouldBeTransparent ? 'fixed' : 'sticky'} top-0 z-50 w-full transition-all duration-500 ${shouldBeTransparent
        ? 'bg-transparent border-b border-transparent'
        : 'backdrop-blur-md bg-stone-100/90 dark:bg-stone-900/90 border-b border-stone-200/50 dark:border-stone-800/50 shadow-sm'
      }`}>
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className={`material-symbols-outlined text-3xl transition-colors duration-300 ${shouldBeTransparent ? 'text-white drop-shadow-lg' : 'text-primary'
              }`}>diamond</span>
            <span className={`text-xl font-serif font-bold tracking-tight transition-colors duration-300 ${shouldBeTransparent ? 'text-white drop-shadow-lg' : 'text-stone-900 dark:text-white'
              }`}>Geodas del Uruguay</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-10">
            <Link to="/" className={`text-base font-serif font-medium transition-colors tracking-wide relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-primary after:transition-all after:duration-300 hover:after:w-full ${shouldBeTransparent
                ? 'text-white hover:text-primary drop-shadow-lg'
                : 'text-stone-700 hover:text-primary dark:text-stone-300 dark:hover:text-primary'
              }`}>Inicio</Link>
            <Link to="/tienda" className={`text-base font-serif font-medium transition-colors tracking-wide relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-primary after:transition-all after:duration-300 hover:after:w-full ${shouldBeTransparent
                ? 'text-white hover:text-primary drop-shadow-lg'
                : 'text-stone-700 hover:text-primary dark:text-stone-300 dark:hover:text-primary'
              }`}>Tienda</Link>
            <Link to="/tips" className={`text-base font-serif font-medium transition-colors tracking-wide relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-primary after:transition-all after:duration-300 hover:after:w-full ${shouldBeTransparent
                ? 'text-white hover:text-primary drop-shadow-lg'
                : 'text-stone-700 hover:text-primary dark:text-stone-300 dark:hover:text-primary'
              }`}>Tips</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="hidden md:flex items-center relative group" ref={searchRef}>
              <div className={`flex items-center group-focus-within:bg-stone-200/50 dark:group-focus-within:bg-stone-800/50 rounded-full transition-all duration-300 border group-focus-within:border-stone-200 dark:group-focus-within:border-stone-700 pr-1 ${shouldBeTransparent ? 'bg-white/10 border-white/20' : 'bg-transparent border-transparent'
                }`}>
                <input
                  className={`w-0 group-hover:w-48 focus:w-48 transition-all duration-500 ease-out bg-transparent border-none focus:ring-0 p-0 pl-4 py-2 text-sm opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer focus:cursor-text ${shouldBeTransparent
                      ? 'text-white placeholder-white/70'
                      : 'text-stone-600 dark:text-stone-300 placeholder-stone-400'
                    }`}
                  placeholder="Buscar cristales..."
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => searchTerm.length > 2 && setShowResults(true)}
                />
                <button className={`p-2 transition-colors rounded-full ${shouldBeTransparent
                    ? 'text-white hover:text-primary drop-shadow-lg'
                    : 'text-stone-600 hover:text-primary dark:text-stone-300'
                  }`}>
                  <span className="material-symbols-outlined">search</span>
                </button>
              </div>

              {/* Results Dropdown */}
              {showResults && (
                <div className="absolute top-full right-0 mt-4 w-80 bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-stone-100 dark:border-stone-800 overflow-hidden z-50">
                  <div className="p-3">
                    <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 px-2">Resultados</h3>
                    {results.length > 0 ? (
                      results.map(product => (
                        <button
                          key={product.id}
                          onClick={() => handleResultClick(product.id)}
                          className="flex w-full items-center gap-3 p-2 hover:bg-stone-50 dark:hover:bg-stone-800/50 rounded-xl transition-colors group/item text-left"
                        >
                          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 relative">
                            <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-stone-800 dark:text-stone-200 font-serif leading-tight">{product.title}</p>
                            <p className="text-xs text-stone-500 dark:text-stone-400">${product.price}</p>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="text-sm text-stone-500 p-2">No se encontraron cristales.</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/*
             <Link to="/admin" className="p-2 text-stone-600 hover:text-primary transition-colors rounded-full hover:bg-stone-200/50 dark:text-stone-300 dark:hover:bg-stone-800">
               <span className="material-symbols-outlined">settings</span>
             </Link>
              */}
            <button
              onClick={openCart}
              className={`hidden md:block relative p-2 transition-colors rounded-full ${shouldBeTransparent
                  ? 'text-white hover:text-primary hover:bg-white/10 drop-shadow-lg'
                  : 'text-stone-600 hover:text-primary hover:bg-stone-200/50 dark:text-stone-300 dark:hover:bg-stone-800'
                }`}
              aria-label="Abrir carrito"
            >
              <span className="material-symbols-outlined">shopping_bag</span>
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm animate-bounce-once">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 transition-colors rounded-full ${shouldBeTransparent
                  ? 'text-white hover:text-primary hover:bg-white/10 drop-shadow-lg'
                  : 'text-stone-600 hover:text-primary hover:bg-stone-200/50 dark:text-stone-300 dark:hover:bg-stone-800'
                }`}
            >
              <span className="material-symbols-outlined">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>

        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-stone-200/50 dark:border-stone-800/50">
            <nav className="flex flex-col gap-4">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base font-serif font-medium transition-colors px-4 py-2 rounded-lg ${shouldBeTransparent
                    ? 'text-white hover:text-primary hover:bg-white/10 drop-shadow-lg'
                    : 'text-stone-700 hover:text-primary hover:bg-stone-100 dark:text-stone-300 dark:hover:text-primary dark:hover:bg-stone-800'
                  }`}
              >
                Inicio
              </Link>
              <Link
                to="/tienda"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base font-serif font-medium transition-colors px-4 py-2 rounded-lg ${shouldBeTransparent
                    ? 'text-white hover:text-primary hover:bg-white/10 drop-shadow-lg'
                    : 'text-stone-700 hover:text-primary hover:bg-stone-100 dark:text-stone-300 dark:hover:text-primary dark:hover:bg-stone-800'
                  }`}
              >
                Tienda
              </Link>
              <Link
                to="/tips"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base font-serif font-medium transition-colors px-4 py-2 rounded-lg ${shouldBeTransparent
                    ? 'text-white hover:text-primary hover:bg-white/10 drop-shadow-lg'
                    : 'text-stone-700 hover:text-primary hover:bg-stone-100 dark:text-stone-300 dark:hover:text-primary dark:hover:bg-stone-800'
                  }`}
              >
                Tips
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};