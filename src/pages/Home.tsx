import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { Product, Tip } from '../types';

import { motion } from 'framer-motion';

export const Home: React.FC = () => {
   const [featured, setFeatured] = useState<Product[]>([]);
   const [tips, setTips] = useState<Tip[]>([]);

   useEffect(() => {
      const load = async () => {
         const allProducts = await dataService.getVisibleProducts();
         setFeatured(allProducts.slice(0, 3)); // New design shows 3 columns

         const allTips = await dataService.getTips();
         setTips(allTips.slice(0, 2)); // New design shows 2 columns
      };
      load();
   }, []);

   const scrollToShop = () => {
      const shopSection = document.getElementById('shop');
      if (shopSection) {
         shopSection.scrollIntoView({ behavior: 'smooth' });
      } else {
         window.location.hash = '#/tienda';
      }
   };

   return (
      <main className="flex-grow">
         {/* Hero Section - Replicating the provided image design */}
         <section className="relative pt-20 pb-8 px-4 md:px-8 lg:px-12 h-screen min-h-[700px] flex items-center justify-center bg-[#F5F5F0]">

            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, ease: "easeOut" }}
               className="relative w-full max-w-7xl bg-white shadow-xl overflow-hidden rounded-sm flex flex-col lg:flex-row h-[85vh] min-h-[500px]"
            >
               {/* Left Content */}
               <div className="flex-1 p-12 lg:p-24 flex flex-col justify-center relative z-10 bg-white">
                  <motion.h1
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: 0.3, duration: 0.8 }}
                     className="font-serif text-5xl md:text-6xl lg:text-7xl text-[#8C7E60] leading-[0.9] mb-6"
                  >
                     GEODAS DEL <br /> URUGUAY
                  </motion.h1>

                  <motion.p
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     transition={{ delay: 0.5, duration: 0.8 }}
                     className="text-lg text-[#8C8C8C] font-light tracking-wide mb-8 font-sans"
                  >
                     Conectá con la energía de la tierra
                  </motion.p>

                  <motion.div
                     initial={{ scaleX: 0 }}
                     animate={{ scaleX: 1 }}
                     transition={{ delay: 0.6, duration: 0.8 }}
                     className="w-24 h-[1px] bg-[#D4C4A8] mb-10 origin-left"
                  ></motion.div>

                  <motion.div
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                     className="w-fit"
                  >
                     <Link
                        to="/tienda"
                        className="inline-block px-8 py-3 border border-[#8C7E60] rounded-full text-[#8C7E60] text-sm tracking-widest hover:bg-[#8C7E60] hover:text-white transition-all duration-300 uppercase font-sans"
                     >
                        Ver Tienda
                     </Link>
                  </motion.div>
               </div>

               {/* Right Image Area */}
               <div className="flex-1 relative h-[400px] lg:h-auto bg-white overflow-hidden">
                  {/* Gradient Overlay to blend image with white background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white via-white/50 to-transparent z-10 w-1/3"></div>

                  <motion.div
                     initial={{ opacity: 0, scale: 1.1 }}
                     animate={{ opacity: 1, scale: 1 }}
                     transition={{ delay: 0.4, duration: 1.2 }}
                     className="w-full h-full flex items-center justify-center bg-white"
                  >
                     <img
                        src="/screen.png"
                        alt="Geoda de Amatista"
                        className="w-full h-full object-cover object-center lg:object-[center_right]"
                     />
                  </motion.div>
               </div>
            </motion.div>
         </section>

         {/* Categorías Destacadas - Nuevo diseño minimalista */}
         <section className="w-full py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-[#FDFBF7] dark:bg-[#1A1917] transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
               <div className="text-center mb-16 md:mb-20">
                  <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-[#8C7E60] tracking-wide">
                     Categorías Destacadas
                  </h2>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 items-end">

                  {/* Collares */}
                  <div className="group flex flex-col items-center text-center">
                     <div className="relative w-full aspect-[4/5] flex items-center justify-center mb-6 overflow-hidden">
                        <img
                           alt="Collar de oro con colgante de geoda blanca"
                           className="h-64 md:h-72 object-contain mix-blend-multiply dark:mix-blend-normal dark:opacity-90 transform group-hover:scale-105 transition-transform duration-500 ease-out"
                           src="collar_recorte.jpeg"
                        />
                     </div>
                     <h3 className="font-serif text-2xl tracking-widest uppercase mb-6 text-[#8C7E60]">
                        Collares
                     </h3>
                     <Link
                        to="/tienda/collares"
                        className="inline-block px-8 py-3 rounded-full border border-[#8C7E60] text-xs tracking-widest text-[#8C7E60] hover:bg-[#8C7E60] hover:text-white dark:hover:text-[#1A1917] transition-all duration-300 uppercase font-sans"
                     >
                        Ver Categoría
                     </Link>
                  </div>

                  {/* Anillos */}
                  <div className="group flex flex-col items-center text-center">
                     <div className="relative w-full aspect-[4/5] flex items-center justify-center mb-6 overflow-hidden">
                        <img
                           alt="Anillo de oro con amatista rugosa"
                           className="h-48 md:h-56 object-contain mix-blend-multiply dark:mix-blend-normal dark:opacity-90 transform group-hover:scale-105 transition-transform duration-500 ease-out"
                           src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnSMhRgCqhmDYFYh3ESceU8A3AdIRHeEFxc5Abqrd13ZiRDfE0RwPi4kMH9Cq35BMXlejc0paIe1P0bOCL_Q8iOJHkmE8c29ymDelXBJAM1mlEi5U31f68lWmpAO3JI3Kh5T79kKJ6tCutDU1lYM1JQi7638TtmSC5Qcz_6VSJNAUtZGDHWWPScQ-vEaIB1E9LkCFckr_2eQPWwQNF1i1-clgxTMg0UqwSAD58nsdl89SLwtkOdr4QzAW4bKVmRFf45NKDW7BUNpQ"
                        />
                     </div>
                     <h3 className="font-serif text-2xl tracking-widest uppercase mb-6 text-[#8C7E60]">
                        Anillos
                     </h3>
                     <Link
                        to="/tienda/anillos"
                        className="inline-block px-8 py-3 rounded-full border border-[#8C7E60] text-xs tracking-widest text-[#8C7E60] hover:bg-[#8C7E60] hover:text-white dark:hover:text-[#1A1917] transition-all duration-300 uppercase font-sans"
                     >
                        Ver Categoría
                     </Link>
                  </div>

                  {/* Brazaletes */}
                  <div className="group flex flex-col items-center text-center">
                     <div className="relative w-full aspect-[4/5] flex items-center justify-center mb-6 overflow-hidden">
                        <img
                           alt="Brazalete ancho de oro con piedra blanca"
                           className="h-40 md:h-48 object-contain mix-blend-multiply dark:mix-blend-normal dark:opacity-90 transform group-hover:scale-105 transition-transform duration-500 ease-out"
                           src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTaeVS6A1XDK8iUsulRqkPQFnZu65sRdzX-ICjYuUEU7_iWUo4GTfPI9u2m3p6B7sKA4iO51NyEQLar7ZtkFFv6SKUUweyOL_cbdkphian9iMmBGWzeqw01_5823q4hgX4Cac3TyH9xazEv9f-NwtsJSeFxruHCY5U8hYPknpnMRMiKQ_1_r7oUfAsLFRnIdXZw6-vdQpODgS02RKo40ou961Zoua6MMjor51oPwQcejCODG2vlgC4fJmxfg28o5qWo5-IT5zywHM"
                        />
                     </div>
                     <h3 className="font-serif text-2xl tracking-widest uppercase mb-6 text-[#8C7E60]">
                        Brazaletes
                     </h3>
                     <Link
                        to="/tienda/brazaletes"
                        className="inline-block px-8 py-3 rounded-full border border-[#8C7E60] text-xs tracking-widest text-[#8C7E60] hover:bg-[#8C7E60] hover:text-white dark:hover:text-[#1A1917] transition-all duration-300 uppercase font-sans"
                     >
                        Ver Categoría
                     </Link>
                  </div>

                  {/* Piedras Naturales */}
                  <div className="group flex flex-col items-center text-center">
                     <div className="relative w-full aspect-[4/5] flex items-center justify-center mb-6 overflow-hidden">
                        <img
                           alt="Geoda de amatista púrpura natural"
                           className="h-56 md:h-64 object-contain mix-blend-multiply dark:mix-blend-normal dark:opacity-90 transform group-hover:scale-105 transition-transform duration-500 ease-out"
                           src="https://lh3.googleusercontent.com/aida-public/AB6AXuApabR_HinlbryjIg1XoxoeJHVH2D4L6McnZ0DsOlrzjewK8OhbOjLvPkhHgGzhaET_8d9zsb4cPIfOK_MHKMMm7Qv5g_iPeo0vGXBg97-BYfO3geC1JsRv2Sqf7m-I2BkS_-PEJ22rgJ1CQJIJElGNvDl7NKyW5t8WDQ4hPX-EReRCg3av6lhQeI2rD3KR3xXeEqaefBK7PcJ28OeqesrOBd9E6__Cd5dz5xs-KXwXErs14uAGam3lDJ9SWmnFjEQHSd8i-SYXZBk"
                        />
                     </div>
                     <h3 className="font-serif text-2xl tracking-widest uppercase mb-6 text-[#8C7E60] max-w-[200px] leading-tight">
                        Piedras Naturales
                     </h3>
                     <Link
                        to="/tienda/piedras"
                        className="inline-block px-8 py-3 rounded-full border border-[#8C7E60] text-xs tracking-widest text-[#8C7E60] hover:bg-[#8C7E60] hover:text-white dark:hover:text-[#1A1917] transition-all duration-300 uppercase font-sans"
                     >
                        Ver Categoría
                     </Link>
                  </div>

               </div>
            </div>
            <div className="w-full h-1 mt-16 bg-gradient-to-r from-transparent via-[#8C7E60]/20 to-transparent"></div>
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
                              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url("${product.images[0]}")` }}></div>
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
               <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-stone-900 dark:text-white">Tips y consejos de nuestras Piedras</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
               {tips.map(tip => (
                  <Link key={tip.id} to={`/tips/${tip.slug}`}>
                     <article className="group relative h-80 rounded-xl overflow-hidden cursor-pointer shadow-lg">
                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 grayscale-[20%] group-hover:grayscale-0" style={{ backgroundImage: `url("${tip.image}")` }}></div>
                        <div className="absolute inset-0 bg-stone-900/50 group-hover:bg-stone-900/40 transition-colors duration-300"></div>
                        <div className="absolute bottom-0 left-0 p-8 w-full">
                           <h3 className="font-serif text-2xl font-bold text-white mb-2">{tip.title}</h3>
                           <div className="w-12 h-0.5 bg-primary mb-3"></div>
                           <p className="text-stone-200 text-sm opacity-90 line-clamp-2">{tip.excerpt}</p>
                        </div>
                     </article>
                  </Link>
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