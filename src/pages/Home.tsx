import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { Product, Tip } from '../types';
import { useCart } from '../context/CartContext';
import { productUrl, tipUrl } from '../utils/slugify';
import { SEOHead } from '../components/SEOHead';

import { motion } from 'framer-motion';

// Hot reload enabled via Docker volumes

export const Home: React.FC = () => {
   const [featured, setFeatured] = useState<Product[]>([]);
   const [tips, setTips] = useState<Tip[]>([]);
   const { addItem } = useCart();

   // Hot Reload Testing... 🚀

   useEffect(() => {
      const load = async () => {
         const allProducts = await dataService.getVisibleProducts();
         setFeatured(allProducts.slice(0, 4));

         const allTips = await dataService.getTips();
         setTips(allTips.slice(0, 2));
      };
      load();
   }, []);

   const scrollToShop = () => {
      const shopSection = document.getElementById('shop');
      if (shopSection) {
         shopSection.scrollIntoView({ behavior: 'smooth' });
      } else {
         window.location.href = '/tienda';
      }
   };

   return (
      <main className="flex-grow bg-white">
         <SEOHead
           title="Cristales y Piedras Naturales de Uruguay"
           description="Geodas, amatistas, cuarzos y accesorios energéticos naturales de Uruguay. Envío a todo el país. Conectá con la energía de la tierra."
         />

         {/* ── Hero Section ─────────────────────────────────────── */}
         <section className="relative h-[calc(100vh-5rem)] min-h-[700px] flex items-center justify-center bg-[#F5F5F0]">

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

         {/* ── Nuestra Colección ─────────────────────────────── */}
         <section id="shop" className="py-20 md:py-28 px-6 md:px-12 max-w-[1280px] mx-auto">
            <div className="text-center mb-14">
               <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-3 font-medium">Nuestra Colección</h2>
               <p className="text-stone-500 font-sans text-base font-light">Piezas seleccionadas con cuidado para vos</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
               {featured.length === 0 ? (
                  <div className="col-span-2 lg:col-span-4 text-center text-stone-400 py-12">Cargando colección...</div>
               ) : (
                  featured.map((product) => (
                     <div
                        key={product.id}
                        className="group cursor-pointer flex flex-col"
                     >
                        <div className="relative aspect-[3/4] overflow-hidden bg-[#F5F3EF] mb-4 rounded-md">
                           <Link to={productUrl(product.slug)}>
                              <img
                                 src={product.images[0]}
                                 alt={product.title}
                                 loading="lazy"
                                 className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                              />
                           </Link>
                           <button
                              onClick={(e) => {
                                 e.preventDefault();
                                 e.stopPropagation();
                                 addItem(product);
                              }}
                              className="absolute bottom-3 right-3 bg-white p-2.5 rounded shadow-sm opacity-0 md:opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200 hover:bg-[#8C7E60] hover:text-white text-stone-700 z-10"
                           >
                              <span className="material-symbols-outlined !text-[18px]">shopping_bag</span>
                           </button>
                        </div>
                        <Link to={productUrl(product.slug)} className="px-0.5">
                           <h3 className="font-serif text-sm md:text-base text-stone-800 mb-1 group-hover:text-[#8C7E60] transition-colors duration-200 line-clamp-2 leading-snug">{product.title}</h3>
                           <p className="text-stone-900 font-semibold text-base md:text-lg">$ {product.price.toLocaleString('es-UY')}</p>
                        </Link>
                     </div>
                  ))
               )}
            </div>

            <div className="mt-14 text-center">
               <Link to="/tienda" className="inline-flex items-center gap-2 px-6 py-3 border border-stone-300 text-stone-700 hover:border-[#8C7E60] hover:text-[#8C7E60] text-sm font-medium tracking-wide rounded transition-colors duration-200">
                  Ver todo el catálogo
                  <span className="material-symbols-outlined !text-[16px]">arrow_forward</span>
               </Link>
            </div>
         </section>

         {/* ── Categorías ─────────────────────────────────────── */}
         <section className="w-full py-20 md:py-28 px-6 sm:px-8 lg:px-12 bg-[#F8F7F4]">
            <div className="max-w-[1280px] mx-auto">
               <div className="text-center mb-14">
                  <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-3 font-medium">
                     Categorías
                  </h2>
                  <p className="text-stone-500 font-sans text-base font-light">Explorá nuestra selección por categoría</p>
               </div>

               <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">

                  {/* Collares */}
                  <Link to="/tienda/collares" className="group flex flex-col items-center text-center">
                     <div className="w-full aspect-square rounded-md overflow-hidden bg-white mb-5">
                        <img
                           alt="Collares"
                           className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-300"
                           src="collar_recorte.jpeg"
                        />
                     </div>
                     <h3 className="font-serif text-lg md:text-xl text-stone-800 group-hover:text-[#8C7E60] transition-colors duration-200 mb-2">
                        Collares
                     </h3>
                     <span className="text-xs text-stone-500 font-sans tracking-wide group-hover:text-[#8C7E60] transition-colors duration-200 flex items-center gap-1">
                        Ver colección <span className="material-symbols-outlined !text-[14px]">arrow_forward</span>
                     </span>
                  </Link>

                  {/* Anillos */}
                  <Link to="/tienda/anillos" className="group flex flex-col items-center text-center">
                     <div className="w-full aspect-square rounded-md overflow-hidden bg-white mb-5">
                        <img
                           alt="Anillos"
                           className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-300"
                           src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnSMhRgCqhmDYFYh3ESceU8A3AdIRHeEFxc5Abqrd13ZiRDfE0RwPi4kMH9Cq35BMXlejc0paIe1P0bOCL_Q8iOJHkmE8c29ymDelXBJAM1mlEi5U31f68lWmpAO3JI3Kh5T79kKJ6tCutDU1lYM1JQi7638TtmSC5Qcz_6VSJNAUtZGDHWWPScQ-vEaIB1E9LkCFckr_2eQPWwQNF1i1-clgxTMg0UqwSAD58nsdl89SLwtkOdr4QzAW4bKVmRFf45NKDW7BUNpQ"
                        />
                     </div>
                     <h3 className="font-serif text-lg md:text-xl text-stone-800 group-hover:text-[#8C7E60] transition-colors duration-200 mb-2">
                        Anillos
                     </h3>
                     <span className="text-xs text-stone-500 font-sans tracking-wide group-hover:text-[#8C7E60] transition-colors duration-200 flex items-center gap-1">
                        Ver colección <span className="material-symbols-outlined !text-[14px]">arrow_forward</span>
                     </span>
                  </Link>

                  {/* Brazaletes */}
                  <Link to="/tienda/brazaletes" className="group flex flex-col items-center text-center">
                     <div className="w-full aspect-square rounded-md overflow-hidden bg-white mb-5">
                        <img
                           alt="Brazaletes"
                           className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-300"
                           src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTaeVS6A1XDK8iUsulRqkPQFnZu65sRdzX-ICjYuUEU7_iWUo4GTfPI9u2m3p6B7sKA4iO51NyEQLar7ZtkFFv6SKUUweyOL_cbdkphian9iMmBGWzeqw01_5823q4hgX4Cac3TyH9xazEv9f-NwtsJSeFxruHCY5U8hYPknpnMRMiKQ_1_r7oUfAsLFRnIdXZw6-vdQpODgS02RKo40ou961Zoua6MMjor51oPwQcejCODG2vlgC4fJmxfg28o5qWo5-IT5zywHM"
                        />
                     </div>
                     <h3 className="font-serif text-lg md:text-xl text-stone-800 group-hover:text-[#8C7E60] transition-colors duration-200 mb-2">
                        Brazaletes
                     </h3>
                     <span className="text-xs text-stone-500 font-sans tracking-wide group-hover:text-[#8C7E60] transition-colors duration-200 flex items-center gap-1">
                        Ver colección <span className="material-symbols-outlined !text-[14px]">arrow_forward</span>
                     </span>
                  </Link>

                  {/* Piedras Naturales */}
                  <Link to="/tienda/piedras" className="group flex flex-col items-center text-center">
                     <div className="w-full aspect-square rounded-md overflow-hidden bg-white mb-5">
                        <img
                           alt="Piedras Naturales"
                           className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-300"
                           src="https://lh3.googleusercontent.com/aida-public/AB6AXuApabR_HinlbryjIg1XoxoeJHVH2D4L6McnZ0DsOlrzjewK8OhbOjLvPkhHgGzhaET_8d9zsb4cPIfOK_MHKMMm7Qv5g_iPeo0vGXBg97-BYfO3geC1JsRv2Sqf7m-I2BkS_-PEJ22rgJ1CQJIJElGNvDl7NKyW5t8WDQ4hPX-EReRCg3av6lhQeI2rD3KR3xXeEqaefBK7PcJ28OeqesrOBd9E6__Cd5dz5xs-KXwXErs14uAGam3lDJ9SWmnFjEQHSd8i-SYXZBk"
                        />
                     </div>
                     <h3 className="font-serif text-lg md:text-xl text-stone-800 group-hover:text-[#8C7E60] transition-colors duration-200 mb-2">
                        Piedras Naturales
                     </h3>
                     <span className="text-xs text-stone-500 font-sans tracking-wide group-hover:text-[#8C7E60] transition-colors duration-200 flex items-center gap-1">
                        Ver colección <span className="material-symbols-outlined !text-[14px]">arrow_forward</span>
                     </span>
                  </Link>

               </div>
            </div>
         </section>

         {/* ── Info / Trust Section ───────────────────────────── */}
         <section className="py-16 md:py-20 bg-white border-t border-stone-100">
            <div className="max-w-[1100px] mx-auto px-6">
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
                  <div className="flex flex-col items-center gap-3">
                     <span className="material-symbols-outlined text-[28px] text-[#8C7E60]">local_shipping</span>
                     <h3 className="font-serif text-lg font-medium text-stone-800">Envíos a todo el país</h3>
                     <p className="text-stone-500 text-sm leading-relaxed max-w-xs">
                        Empaque seguro y protegido hasta la puerta de tu casa.
                     </p>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                     <span className="material-symbols-outlined text-[28px] text-[#8C7E60]">verified</span>
                     <h3 className="font-serif text-lg font-medium text-stone-800">Piezas auténticas</h3>
                     <p className="text-stone-500 text-sm leading-relaxed max-w-xs">
                        Cada pieza es natural y única, seleccionada con cuidado.
                     </p>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                     <span className="material-symbols-outlined text-[28px] text-[#8C7E60]">credit_card</span>
                     <h3 className="font-serif text-lg font-medium text-stone-800">Múltiples medios de pago</h3>
                     <p className="text-stone-500 text-sm leading-relaxed max-w-xs">
                        Mercado Pago, transferencia bancaria o efectivo.
                     </p>
                  </div>
               </div>
            </div>
         </section>
      </main>
   );
};