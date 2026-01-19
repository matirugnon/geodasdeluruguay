import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { Product } from '../types';

export const Navbar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-stone-100/90 dark:bg-stone-900/90 border-b border-stone-200/50 dark:border-stone-800/50 shadow-sm transition-all duration-300">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-3xl">diamond</span>
            <span className="text-xl font-serif font-bold tracking-tight text-stone-900 dark:text-white">Geodas del Uruguay</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-10">
            <Link to="/" className="text-base font-serif font-medium text-stone-700 hover:text-primary transition-colors dark:text-stone-300 dark:hover:text-primary tracking-wide relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-primary after:transition-all after:duration-300 hover:after:w-full">Inicio</Link>
            <Link to="/tienda" className="text-base font-serif font-medium text-stone-700 hover:text-primary transition-colors dark:text-stone-300 dark:hover:text-primary tracking-wide relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-primary after:transition-all after:duration-300 hover:after:w-full">Tienda</Link>
            <Link to="/tips" className="text-base font-serif font-medium text-stone-700 hover:text-primary transition-colors dark:text-stone-300 dark:hover:text-primary tracking-wide relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-primary after:transition-all after:duration-300 hover:after:w-full">Tips</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
             {/* Search */}
             <div className="hidden md:flex items-center relative group" ref={searchRef}>
               <div className="flex items-center bg-transparent group-focus-within:bg-stone-200/50 dark:group-focus-within:bg-stone-800/50 rounded-full transition-all duration-300 border border-transparent group-focus-within:border-stone-200 dark:group-focus-within:border-stone-700 pr-1">
                 <input 
                   className="w-0 group-hover:w-48 focus:w-48 transition-all duration-500 ease-out bg-transparent border-none focus:ring-0 p-0 pl-4 py-2 text-stone-600 dark:text-stone-300 text-sm placeholder-stone-400 opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer focus:cursor-text" 
                   placeholder="Buscar cristales..." 
                   type="text"
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   onFocus={() => searchTerm.length > 2 && setShowResults(true)}
                 />
                 <button className="p-2 text-stone-600 hover:text-primary transition-colors rounded-full dark:text-stone-300">
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
             <button className="p-2 text-stone-600 hover:text-primary transition-colors rounded-full hover:bg-stone-200/50 dark:text-stone-300 dark:hover:bg-stone-800">
               <span className="material-symbols-outlined">shopping_bag</span>
             </button>
          </div>

        </div>
      </div>
    </header>
  );
};