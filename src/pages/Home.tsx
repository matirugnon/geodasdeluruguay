import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { Product, Tip } from '../types';
import { useCart } from '../context/CartContext';

import { motion } from 'framer-motion';

export const Home: React.FC = () => {
   const [featured, setFeatured] = useState<Product[]>([]);
   const [tips, setTips] = useState<Tip[]>([]);
   const { addItem } = useCart();

   useEffect(() => {
      const load = async () => {
         const allProducts = await dataService.getVisibleProducts();
         setFeatured(allProducts.slice(0, 4)); // New design shows 4 columns for collection

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
         <section className="relative pt-20 h-screen min-h-[700px] flex items-center justify-center bg-[#F5F5F0]">

            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, ease: "easeOut" }}
               className="relative w-full h-[85vh] min-h-[500px] bg-white shadow-xl overflow-hidden flex flex-col lg:flex-row"
            >
               {/* Left Content */}
               <div className="flex-1 p-8 md:p-12 lg:p-24 flex flex-col justify-center relative z-10 bg-white">
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
                     Elegancia natural para tu hogar
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
                     <button
                        onClick={scrollToShop}
                        className="inline-block px-8 py-3 border border-[#8C7E60] rounded-full text-[#8C7E60] text-sm tracking-widest hover:bg-[#8C7E60] hover:text-white transition-all duration-300 uppercase font-sans"
                     >
                        Ver Tienda
                     </button>
                  </motion.div>
               </div>

               {/* Right Image Area */}
               <div className="hidden lg:block flex-1 relative h-[400px] lg:h-auto bg-white overflow-hidden">
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

         {/* Nuestra Colección (Shop Section) */}
         <section id="shop" className="py-16 md:py-24 px-4 md:px-12 max-w-[1280px] mx-auto">
            <div className="text-center mb-10 md:mb-16">
               <h2 className="font-serif text-3xl md:text-5xl text-[#8C7E60] mb-4">Nuestra Colección</h2>
               <div className="w-16 h-[1px] bg-[#D4C4A8] mx-auto"></div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
               {featured.length === 0 ? (
                  <div className="col-span-2 lg:col-span-4 text-center text-[#8C8C8C]">Cargando colección...</div>
               ) : (
                  featured.map((product) => (
                     <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="group cursor-pointer flex flex-col"
                     >
                        <div className="relative aspect-square md:aspect-[3/4] overflow-hidden bg-white mb-3 md:mb-4 rounded-sm shadow-sm hover:shadow-md transition-shadow">
                           <Link to={`/producto/${product.id}`}>
                              <img
                                 src={product.images[0]}
                                 alt={product.title}
                                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              />
                           </Link>
                           <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none"></div>
                           <button
                              onClick={(e) => {
                                 e.preventDefault();
                                 e.stopPropagation();
                                 addItem(product);
                              }}
                              className="absolute bottom-2 right-2 md:bottom-4 md:right-4 bg-white/90 p-2.5 md:p-3 rounded-full shadow-md md:shadow-lg opacity-100 translate-y-0 md:opacity-0 md:translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-[#8C7E60] hover:text-white flex items-center justify-center z-10"
                           >
                              <span className="material-symbols-outlined !text-[16px] md:!text-[18px]">shopping_bag</span>
                           </button>
                        </div>
                        <Link to={`/producto/${product.id}`} className="mt-auto px-1 md:px-0">
                           <h3 className="font-serif text-sm md:text-lg text-[#5A5243] mb-0.5 md:mb-1 group-hover:text-[#8C7E60] transition-colors line-clamp-2 md:line-clamp-1 leading-snug">{product.title}</h3>
                           <p className="text-[#8C8C8C] font-light text-xs md:text-base">$ {product.price.toLocaleString('es-UY')}</p>
                        </Link>
                     </motion.div>
                  ))
               )}
            </div>

            <div className="mt-12 md:mt-16 text-center">
               <Link to="/tienda" className="inline-flex items-center gap-2 text-[#8C7E60] hover:text-[#5A5243] transition-colors border-b border-[#8C7E60] pb-1 uppercase text-xs md:text-sm tracking-widest font-sans">
                  Ver todo el catálogo <span className="material-symbols-outlined !text-[14px] md:!text-[16px]">arrow_forward</span>
               </Link>
            </div>
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
                  <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="group flex flex-col items-center text-center">
                     <div className="relative w-full aspect-square flex items-center justify-center mb-6 overflow-hidden">
                        <div className="absolute w-full h-full bg-[#F5F5F0] dark:bg-stone-800 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-90 blur-2xl"></div>
                        <img
                           alt="Collar de oro con colgante de geoda blanca"
                           className="w-48 h-48 md:w-56 md:h-56 object-contain mix-blend-multiply dark:mix-blend-normal dark:opacity-90 transform group-hover:scale-110 transition-transform duration-500 ease-out relative z-10"
                           src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6_5Eph0A8KHNmuHLTSLlaqbtLBvFpLFPzR1jJM-XuobE-YBtuHT5puMTSm8qEgFtdst-PP6Cd02XI6c0MCdpKtTBUJJxlcNBY-WpTDnAfpPxjPdnD3dDqcSL7S-oOiNnIWMU9MkNsAUkymAFybCXKW3mm4qJIWFo2aL9lssKcOq4humv2fCuttKNlVc5JJT060OELWXBBESY0pK4ryFXpAjdV6KnIimSY4u70D-oXLenBsmMGV8OqPQSIXo6hF4lYM80rDbSipYs"
                        />
                     </div>
                     <h3 className="font-serif text-2xl tracking-widest uppercase mb-6 text-[#8C7E60] min-h-[3rem] flex items-center">
                        Collares
                     </h3>
                     <Link
                        to="/tienda/collares"
                        className="inline-block px-8 py-3 rounded-full border border-[#8C7E60] text-xs tracking-widest text-[#8C7E60] hover:bg-[#8C7E60] hover:text-white dark:hover:text-[#1A1917] transition-all duration-300 uppercase font-sans"
                     >
                        Ver Categoría
                     </Link>
                  </motion.div>

                  {/* Anillos */}
                  <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="group flex flex-col items-center text-center">
                     <div className="relative w-full aspect-square flex items-center justify-center mb-6 overflow-hidden">
                        <div className="absolute w-full h-full bg-[#F5F5F0] dark:bg-stone-800 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-90 blur-2xl"></div>
                        <img
                           alt="Anillo de oro con amatista rugosa"
                           className="w-48 h-48 md:w-56 md:h-56 object-contain mix-blend-multiply dark:mix-blend-normal dark:opacity-90 transform group-hover:scale-110 transition-transform duration-500 ease-out relative z-10"
                           src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnSMhRgCqhmDYFYh3ESceU8A3AdIRHeEFxc5Abqrd13ZiRDfE0RwPi4kMH9Cq35BMXlejc0paIe1P0bOCL_Q8iOJHkmE8c29ymDelXBJAM1mlEi5U31f68lWmpAO3JI3Kh5T79kKJ6tCutDU1lYM1JQi7638TtmSC5Qcz_6VSJNAUtZGDHWWPScQ-vEaIB1E9LkCFckr_2eQPWwQNF1i1-clgxTMg0UqwSAD58nsdl89SLwtkOdr4QzAW4bKVmRFf45NKDW7BUNpQ"
                        />
                     </div>
                     <h3 className="font-serif text-2xl tracking-widest uppercase mb-6 text-[#8C7E60] min-h-[3rem] flex items-center">
                        Anillos
                     </h3>
                     <Link
                        to="/tienda/anillos"
                        className="inline-block px-8 py-3 rounded-full border border-[#8C7E60] text-xs tracking-widest text-[#8C7E60] hover:bg-[#8C7E60] hover:text-white dark:hover:text-[#1A1917] transition-all duration-300 uppercase font-sans"
                     >
                        Ver Categoría
                     </Link>
                  </motion.div>

                  {/* Brazaletes */}
                  <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="group flex flex-col items-center text-center">
                     <div className="relative w-full aspect-square flex items-center justify-center mb-6 overflow-hidden">
                        <div className="absolute w-full h-full bg-[#F5F5F0] dark:bg-stone-800 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-90 blur-2xl"></div>
                        <img
                           alt="Brazalete ancho de oro con piedra blanca"
                           className="w-48 h-48 md:w-56 md:h-56 object-contain mix-blend-multiply dark:mix-blend-normal dark:opacity-90 transform group-hover:scale-110 transition-transform duration-500 ease-out relative z-10"
                           src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTaeVS6A1XDK8iUsulRqkPQFnZu65sRdzX-ICjYuUEU7_iWUo4GTfPI9u2m3p6B7sKA4iO51NyEQLar7ZtkFFv6SKUUweyOL_cbdkphian9iMmBGWzeqw01_5823q4hgX4Cac3TyH9xazEv9f-NwtsJSeFxruHCY5U8hYPknpnMRMiKQ_1_r7oUfAsLFRnIdXZw6-vdQpODgS02RKo40ou961Zoua6MMjor51oPwQcejCODG2vlgC4fJmxfg28o5qWo5-IT5zywHM"
                        />
                     </div>
                     <h3 className="font-serif text-2xl tracking-widest uppercase mb-6 text-[#8C7E60] min-h-[3rem] flex items-center">
                        Brazaletes
                     </h3>
                     <Link
                        to="/tienda/brazaletes"
                        className="inline-block px-8 py-3 rounded-full border border-[#8C7E60] text-xs tracking-widest text-[#8C7E60] hover:bg-[#8C7E60] hover:text-white dark:hover:text-[#1A1917] transition-all duration-300 uppercase font-sans"
                     >
                        Ver Categoría
                     </Link>
                  </motion.div>

                  {/* Piedras Naturales */}
                  <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="group flex flex-col items-center text-center">
                     <div className="relative w-full aspect-square flex items-center justify-center mb-6 overflow-hidden">
                        <div className="absolute w-full h-full bg-[#F5F5F0] dark:bg-stone-800 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-90 blur-2xl"></div>
                        <img
                           alt="Geoda de amatista púrpura natural"
                           className="w-48 h-48 md:w-56 md:h-56 object-contain mix-blend-multiply dark:mix-blend-normal dark:opacity-90 transform group-hover:scale-110 transition-transform duration-500 ease-out relative z-10"
                           src="https://lh3.googleusercontent.com/aida-public/AB6AXuApabR_HinlbryjIg1XoxoeJHVH2D4L6McnZ0DsOlrzjewK8OhbOjLvPkhHgGzhaET_8d9zsb4cPIfOK_MHKMMm7Qv5g_iPeo0vGXBg97-BYfO3geC1JsRv2Sqf7m-I2BkS_-PEJ22rgJ1CQJIJElGNvDl7NKyW5t8WDQ4hPX-EReRCg3av6lhQeI2rD3KR3xXeEqaefBK7PcJ28OeqesrOBd9E6__Cd5dz5xs-KXwXErs14uAGam3lDJ9SWmnFjEQHSd8i-SYXZBk"
                        />
                     </div>
                     <h3 className="font-serif text-2xl tracking-widest uppercase mb-6 text-[#8C7E60] min-h-[3rem] flex items-center">
                        Piedras Naturales
                     </h3>
                     <Link
                        to="/tienda/piedras"
                        className="inline-block px-8 py-3 rounded-full border border-[#8C7E60] text-xs tracking-widest text-[#8C7E60] hover:bg-[#8C7E60] hover:text-white dark:hover:text-[#1A1917] transition-all duration-300 uppercase font-sans"
                     >
                        Ver Categoría
                     </Link>
                  </motion.div>

               </div>
            </div>
            <div className="w-full h-1 mt-16 bg-gradient-to-r from-transparent via-[#8C7E60]/20 to-transparent"></div>
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