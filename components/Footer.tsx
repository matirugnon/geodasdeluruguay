import React, { useState } from 'react';
import { LoginModal } from './LoginModal';

  const whatsappNumber = '59891458797'; // Cambiar por tu número real
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

export const Footer: React.FC = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <>
      <footer className="bg-stone-100 dark:bg-stone-950 pt-16 pb-8 border-t border-stone-200 dark:border-stone-900 mt-auto">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              <div className="col-span-1 md:col-span-1">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-stone-600 dark:text-stone-400">diamond</span>
                  <span className="text-lg font-serif font-bold text-stone-900 dark:text-white">Geodas del Uruguay</span>
                </div>
                <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mb-4">
                    Conectando corazones con la vibración natural de la tierra desde 2023.
                </p>
                <p className="text-stone-400 dark:text-stone-500 text-xs italic font-serif">
                    Desde Montevideo, Uruguay, al mundo.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-stone-900 dark:text-white mb-4">Tienda</h4>
                <ul className="space-y-2">
                  <li><a className="text-stone-600 hover:text-primary dark:text-stone-400 text-sm" href="#">Novedades</a></li>
                  <li><a className="text-stone-600 hover:text-primary dark:text-stone-400 text-sm" href="#">Cristales</a></li>
                  <li><a className="text-stone-600 hover:text-primary dark:text-stone-400 text-sm" href="#">Hogar</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-stone-900 dark:text-white mb-4">Ayuda</h4>
                <ul className="space-y-2">
                  <li><a className="text-stone-600 hover:text-primary dark:text-stone-400 text-sm" href="#">Envíos</a></li>
                  <li><a className="text-stone-600 hover:text-primary dark:text-stone-400 text-sm" href={whatsappLink}>Contacto</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-stone-900 dark:text-white mb-4">Síguenos</h4>
                <div className="flex gap-4">
                  <a className="text-stone-500 hover:text-primary dark:text-stone-400 transition-colors" href="#">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg>
                  </a>
                  <a className="text-stone-500 hover:text-primary dark:text-stone-400 transition-colors" href="https://www.instagram.com/geodasdeluruguay/?hl=es-la">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="border-t border-stone-200 dark:border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-stone-400 text-sm">© 2023 Geodas del Uruguay. Todos los derechos reservados.</p>
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex gap-6">
                  <a className="text-stone-400 hover:text-stone-600 text-sm" href="#">Política de Privacidad</a>
                  <a className="text-stone-400 hover:text-stone-600 text-sm" href="#">Términos de Servicio</a>
                </div>
                <button 
                  onClick={() => setIsLoginModalOpen(true)}
                  className="text-stone-300 hover:text-stone-500 text-xs transition-colors cursor-pointer"
                >
                  Acceso Staff
                </button>
              </div>
            </div>
          </div>
      </footer>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
};