import React from 'react';
import { Link } from 'react-router-dom';

const whatsappNumber = '59891458797';
const whatsappLink = `https://wa.me/${whatsappNumber}`;

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#F8F7F4] border-t border-stone-200 mt-auto">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-[#8C7E60] !text-[20px]">diamond</span>
              <span className="text-base font-serif font-semibold text-stone-800">Geodas del Uruguay</span>
            </div>
            <p className="text-stone-500 text-sm leading-relaxed">
              Piedras y cristales naturales seleccionados en Uruguay.
            </p>
          </div>

          {/* Tienda */}
          <div>
            <h4 className="text-[11px] font-semibold text-stone-400 uppercase tracking-[0.15em] mb-4">Tienda</h4>
            <ul className="space-y-2.5">
              <li><Link to="/tienda" className="text-stone-600 hover:text-[#8C7E60] text-sm transition-colors duration-150">Ver todo</Link></li>
              <li><Link to="/tienda/piedras" className="text-stone-600 hover:text-[#8C7E60] text-sm transition-colors duration-150">Piedras</Link></li>
              <li><Link to="/tienda/collares" className="text-stone-600 hover:text-[#8C7E60] text-sm transition-colors duration-150">Collares</Link></li>
            </ul>
          </div>

          {/* Ayuda */}
          <div>
            <h4 className="text-[11px] font-semibold text-stone-400 uppercase tracking-[0.15em] mb-4">Ayuda</h4>
            <ul className="space-y-2.5">
              <li><a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="text-stone-600 hover:text-[#8C7E60] text-sm transition-colors duration-150">Contacto</a></li>
              <li><Link to="/tips" className="text-stone-600 hover:text-[#8C7E60] text-sm transition-colors duration-150">Tips & Blog</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-[11px] font-semibold text-stone-400 uppercase tracking-[0.15em] mb-4">Seguinos</h4>
            <div className="flex gap-3">
              <a
                className="w-9 h-9 rounded border border-stone-200 flex items-center justify-center text-stone-500 hover:text-[#8C7E60] hover:border-[#8C7E60] transition-colors duration-150"
                href="https://www.instagram.com/geodasdeluruguay/?hl=es-la"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.668-.072-4.948-.2-4.354-2.618-6.782-6.98-6.979C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a
                className="w-9 h-9 rounded border border-stone-200 flex items-center justify-center text-stone-500 hover:text-[#25D366] hover:border-[#25D366] transition-colors duration-150"
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-stone-200 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-stone-400 text-xs">&copy; {new Date().getFullYear()} Geodas del Uruguay</p>
          <div className="flex gap-5">
            <a className="text-stone-400 hover:text-stone-600 text-xs transition-colors duration-150" href="#">Privacidad</a>
            <a className="text-stone-400 hover:text-stone-600 text-xs transition-colors duration-150" href="#">Términos</a>
          </div>
        </div>
      </div>
    </footer>
  );
};