import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { Product, Tip } from '../types';

export const Home: React.FC = () => {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [tips, setTips] = useState<Tip[]>([]);

  useEffect(() => {
    const load = async () => {
      const allProducts = await dataService.getProducts();
      setFeatured(allProducts.filter(p => p.visible).slice(0, 3)); // New design shows 3 columns
      
      const allTips = await dataService.getTips();
      setTips(allTips.slice(0, 2)); // New design shows 2 columns
    };
    load();
  }, []);

  return (
    <main className="flex-grow">
      {/* Hero - Fullscreen */}
      <section className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBuvaexz6cWFeoEIiXrrxl3Vf5fSz09A5H_FY55F6YX6F0WO_MBIOZSN26HHID4lM-Tq5stQChs5dOI3eTXAfY90_3KJJO1BVhQm9l0iYJdviHPb0Q1B9w9PVA6ziKm9FnJFGHLBqmqjkqm7XjKupK_i9tiuvhsp3Krmk2iy-74Y4C3mkAB1B2Vfwtyx7u66iplwTxV_6BB-d7TzFi2Yp-fEgnSJFER4m8VtQGQXBsSIYRWVX6LOhWz4Ed8OXp3fyxElgRcuI7iOwjm")'}}>
           <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/40 to-transparent"></div>
        </div>
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
           <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 tracking-tight drop-shadow-md leading-tight">
                Conecta con la <br className="hidden sm:block"/><span className="italic text-primary">energía</span> de la tierra
            </h1>
            <p className="text-stone-200 text-base sm:text-lg md:text-xl lg:text-2xl font-medium max-w-3xl mx-auto mb-8 sm:mb-10 leading-relaxed px-4">
                Descubre la magia y el misticismo de los cristales uruguayos seleccionados a mano.
            </p>
            <Link to="/tienda" className="group relative inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-bold text-white transition-all duration-200 bg-primary rounded-xl hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg shadow-primary/30 transform hover:-translate-y-1">
                Explorar Colección
                <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform text-sm sm:text-base">arrow_forward</span>
            </Link>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce hidden md:block">
          <div className="flex flex-col items-center gap-2 text-white/70">
            <span className="text-xs uppercase tracking-wider">Scroll</span>
            <span className="material-symbols-outlined text-2xl">keyboard_arrow_down</span>
          </div>
        </div>
      </section>

      {/* Categories - Full Width Background */}
      <section className="w-full py-24 bg-pattern">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
            <span className="text-primary font-bold text-sm tracking-widest uppercase mb-2 block">Nuestras Colecciones</span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-stone-900 dark:text-white">Categorías Destacadas</h2>
            </div>
            
            {/* Grid Layout for 5 Items: 3 Top, 2 Bottom */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 lg:gap-8">
            
            {/* Row 1: Collares */}
            <Link to="/tienda/collares" className="lg:col-span-2 group relative block h-[400px] rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDcm0KWIwELayMnFdk7DB7GRMQM_66UW97KdiJp3_gCOhI6g-TNxupr5Rct7JYNeMEEn0hnBjGKHfN3e2Mrov3X5cB5WOKsR3uTKtviWcgsyDKIUCe1dJXz-QHqpf3j1vY2nDHyvVP5U0M_vzhlWTAGUos7mvuine_6PDuuMUfHXctGkB08Yuly-hkRT5_DL4RlWki-IQEJeXYFc4Oi_T1qxM9MEmys1CcFR6OoLPCFBy6Z7i0KKVJKcGw88zKeEPpMNewbWFKO-H8g")'}}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                <div className="absolute bottom-0 left-0 w-full p-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-serif text-3xl font-medium text-white mb-2 italic">Collares</h3>
                    <p className="text-stone-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 transform translate-y-2 group-hover:translate-y-0">
                            Piezas únicas cerca de tu corazón.
                    </p>
                </div>
            </Link>

            {/* Row 1: Anillos */}
            <Link to="/tienda/anillos" className="lg:col-span-2 group relative block h-[400px] rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDEftD6U86_aHd85S4nLRDM3MaX8t8TXpzInkDJpr5OvF4K0iifelTx4gcSDX7IyVSX3FPI20IkA2IZ-3xKOPh9r9x8Jm8bFcEQsQGxIAdFZ1AqghRk-iE5HydGmpBR5vs0Eg6DTcBemE_odFFPoO6DD7G1x4-AL4fIVd_M1yI57dWLUrFeazOfUhs4vKCQFsTicW7rRcbmu9x4SAA0ekv2PWg0fcTt_8I87895TlRcpAjfGBn79-0BqI_dvHYsZVMcv9ucu9BrpmaF")'}}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                <div className="absolute bottom-0 left-0 w-full p-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-serif text-3xl font-medium text-white mb-2 italic">Anillos</h3>
                    <p className="text-stone-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 transform translate-y-2 group-hover:translate-y-0">
                            Detalles de energía en tus manos.
                    </p>
                </div>
            </Link>

            {/* Row 1: Brazaletes */}
            <Link to="/tienda/brazaletes" className="lg:col-span-2 group relative block h-[400px] rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC8k-UuWG8UhZqQEWRbYzP48OurLczlOiS1DapOY560Q_t2AIGbvb_q9-9G-zVF4XEUdtIKhCiHOLjlxZhX9eadXRjk5G09AStGME75qXVWwh91eYG-zzVn0VdgI73oTSTfihfml_rbMo8TlN_73LcWQOs-YfAYxIr16nDW1I-C5ugeqsJEcyRhC7YG2yU3CRSqIm41qbuFLFSVHmmMRmnkDRUgplm7TiWPP1bEWo4N9JmBEKQp8fNUBBfG76S0-Gem6628WNZD3GOl")'}}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                <div className="absolute bottom-0 left-0 w-full p-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-serif text-3xl font-medium text-white mb-2 italic">Brazaletes</h3>
                    <p className="text-stone-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 transform translate-y-2 group-hover:translate-y-0">
                            Protección para tu día a día.
                    </p>
                </div>
            </Link>

            {/* Row 2: Piedras */}
            <Link to="/tienda/piedras" className="lg:col-span-3 group relative block h-[400px] rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD6t1h4XVu53CHw4bna8AJvWF9JBRuloU_PxqHKSk5FZj7jRcBnXQWY6lNT8WsakYscY-rYtJRkvGGvaxKMxFYRbMQgtnzFt8pzSiVlRp77fK33u_pTPr9wTtQm6qz03cmv3d5GBQGiL9-UDCYIAHavNj7IEqCL_f0_0FFdEXVWreI03kEBO5ZnRtjEF-hRMLSa_m7FJyYyzyldpFw0jw-GOBxegH0vAtOqigag4LX8bHlbOVVWKKansALRFpyilJVNBOekZhvVf7jd")'}}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                <div className="absolute bottom-0 left-0 w-full p-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-serif text-3xl font-medium text-white mb-2 italic">Piedras</h3>
                    <p className="text-stone-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 transform translate-y-2 group-hover:translate-y-0">
                            La naturaleza en su estado más puro.
                    </p>
                </div>
            </Link>

            {/* Row 2: Otros Accesorios */}
            <Link to="/tienda/otros-accesorios" className="lg:col-span-3 group relative block h-[400px] rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBQST63bp2GPEW4CsaIMd-b9dLrv1CDr6BiFvGqGmm4o_gTtBfIq3ME20W0Nh2qKh2gxs578vIYg9zUg4YvgvOCjvQLR0y5Wr2ZHJlLyQRFWBLEQDk5PVzVbGPZWPI6Y5RKtD-iweKRW6YQTehxksx9lKI26LG_0RBkA1UdK3f7hN_GRzuqLecf7cDnX72iQB1KhvckZHqtlojEaGWXO69PuupgPSqetNCvbN3qhfR31hK2Ew_G3BQtbLliyh0psrPQ1fUQ78SoWrjm")'}}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                <div className="absolute bottom-0 left-0 w-full p-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-serif text-3xl font-medium text-white mb-2 italic">Otros Accesorios</h3>
                    <p className="text-stone-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 transform translate-y-2 group-hover:translate-y-0">
                            Complementos para tu santuario.
                    </p>
                </div>
            </Link>

            </div>
        </div>
      </section>

      {/* Featured - Tesoros de Artigas */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto border-t border-stone-200 dark:border-stone-800">
         <div className="text-center mb-16">
            <span className="text-primary font-bold text-sm tracking-widest uppercase mb-2 block">Selección del Mes</span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-stone-900 dark:text-white">Tesoros de Artigas</h2>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {featured.length === 0 ? (
               <div className="col-span-3 text-center text-stone-500">Cargando tesoros...</div>
            ) : (
               featured.map(product => (
                  <div key={product.id} className="flex flex-col gap-5">
                    <Link to={`/producto/${product.id}`}>
                      <div className="relative aspect-[4/5] rounded-xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500">
                          <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{backgroundImage: `url("${product.images[0]}")`}}></div>
                          <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-stone-900/0 transition-colors duration-300"></div>
                      </div>
                    </Link>
                    <div className="text-center px-4">
                        <Link to={`/producto/${product.id}`}>
                          <h3 className="font-serif text-2xl font-bold text-stone-900 dark:text-white mb-1 hover:text-primary transition-colors">{product.title}</h3>
                        </Link>
                        <p className="text-stone-500 dark:text-stone-400 text-sm mb-5 font-medium capitalize">{product.category}</p>
                        <Link to={`/producto/${product.id}`} className="inline-block w-full md:w-auto px-8 py-3 bg-dried-green hover:bg-stone-600 text-white font-bold rounded-lg transition-colors shadow-sm">
                            Consultar
                        </Link>
                    </div>
                  </div>
               ))
            )}
         </div>
      </section>

      {/* Blog & Knowledge */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto bg-stone-50 dark:bg-stone-900/30 rounded-3xl my-8">
         <div className="text-center mb-16">
            <span className="text-dried-green font-bold text-sm tracking-widest uppercase mb-2 block">Blog &amp; Conocimiento</span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-stone-900 dark:text-white">Sabiduría de las Piedras</h2>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {tips.map(tip => (
               <article key={tip.id} className="group relative h-80 rounded-xl overflow-hidden cursor-pointer shadow-lg">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 grayscale-[20%] group-hover:grayscale-0" style={{backgroundImage: `url("${tip.image}")`}}></div>
                  <div className="absolute inset-0 bg-stone-900/50 group-hover:bg-stone-900/40 transition-colors duration-300"></div>
                  <div className="absolute bottom-0 left-0 p-8 w-full">
                     <h3 className="font-serif text-2xl font-bold text-white mb-2">{tip.title}</h3>
                     <div className="w-12 h-0.5 bg-primary mb-3"></div>
                     <p className="text-stone-200 text-sm opacity-90 line-clamp-2">{tip.excerpt}</p>
                  </div>
               </article>
            ))}
         </div>
         <div className="text-center">
            <Link to="/tips" className="inline-flex items-center gap-2 px-8 py-3 bg-dried-green hover:bg-stone-600 text-white font-bold rounded-full transition-colors shadow-md hover:shadow-lg">
               <span>Ver más tips y consejos</span>
               <span className="material-symbols-outlined text-sm">auto_stories</span>
            </Link>
         </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-white dark:bg-stone-900/50 border-t border-stone-200 dark:border-stone-800">
         <div className="max-w-[1100px] mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
               <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6">
                  <div className="flex-shrink-0 w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                     <span className="material-symbols-outlined text-3xl text-primary">local_shipping</span>
                  </div>
                  <div>
                     <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-white mb-2">Envíos a todo el país</h3>
                     <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed max-w-sm mx-auto md:mx-0">
                            Recibe la energía de nuestras geodas en la puerta de tu casa. Empaque seguro y protegido.
                     </p>
                  </div>
               </div>
               <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6 relative md:before:content-[''] md:before:absolute md:before:-left-6 md:before:top-2 md:before:bottom-2 md:before:w-px md:before:bg-stone-200 dark:md:before:bg-stone-800">
                  <div className="flex-shrink-0 w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                     <span className="material-symbols-outlined text-3xl text-primary">credit_card</span>
                  </div>
                  <div>
                     <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-white mb-3">Medios de Pago</h3>
                     <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 shadow-sm">
                           <span className="material-symbols-outlined text-stone-700 dark:text-stone-300 text-lg">handshake</span>
                           <span className="text-xs font-semibold text-stone-600 dark:text-stone-300">Mercado Pago</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 shadow-sm">
                           <span className="material-symbols-outlined text-stone-700 dark:text-stone-300 text-lg">account_balance</span>
                           <span className="text-xs font-semibold text-stone-600 dark:text-stone-300">Transferencia</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 shadow-sm">
                           <span className="material-symbols-outlined text-stone-700 dark:text-stone-300 text-lg">payments</span>
                           <span className="text-xs font-semibold text-stone-600 dark:text-stone-300">Efectivo</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
    </main>
  );
};