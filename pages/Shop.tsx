import React from 'react';
import { Link } from 'react-router-dom';

export const Shop: React.FC = () => {
  return (
    <div className="font-newsreader text-[#181511] dark:text-gray-100 transition-colors duration-300 bg-background-light dark:bg-background-dark">
        <main className="flex-grow flex flex-col items-center w-full px-6 py-10 lg:px-20 lg:py-16">
            <div className="w-full max-w-[1200px] flex flex-col gap-10">
                <div className="flex flex-col items-center text-center gap-4 max-w-2xl mx-auto animate-fade-in-up">
                    <p className="text-primary text-sm font-bold uppercase tracking-widest font-noto-sans">Catálogo 2023</p>
                    <h1 className="text-[#1c1917] dark:text-white text-4xl md:text-5xl lg:text-6xl font-black italic tracking-tight font-newsreader">Explora nuestra Colección</h1>
                    <p className="text-accent-stone dark:text-stone-400 text-lg md:text-xl font-normal leading-relaxed max-w-lg font-newsreader">
                        Piezas únicas formadas por la naturaleza a lo largo de milenios, curadas artesanalmente para ti.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mt-6">
                    {/* Collares */}
                    <Link to="/tienda/collares" className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 min-h-[400px] md:min-h-[500px] lg:col-span-1">
                        <div className="absolute inset-0 bg-gray-200">
                            <div className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDcm0KWIwELayMnFdk7DB7GRMQM_66UW97KdiJp3_gCOhI6g-TNxupr5Rct7JYNeMEEn0hnBjGKHfN3e2Mrov3X5cB5WOKsR3uTKtviWcgsyDKIUCe1dJXz-QHqpf3j1vY2nDHyvVP5U0M_vzhlWTAGUos7mvuine_6PDuuMUfHXctGkB08Yuly-hkRT5_DL4RlWki-IQEJeXYFc4Oi_T1qxM9MEmys1CcFR6OoLPCFBy6Z7i0KKVJKcGw88zKeEPpMNewbWFKO-H8g')"}}>
                            </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                        <div className="absolute bottom-0 left-0 w-full p-8 md:p-10 flex flex-col gap-2 items-start transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                            <div className="bg-primary/90 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 font-noto-sans">Joyería Fina</div>
                            <h3 className="text-white text-3xl md:text-4xl font-bold font-newsreader italic">Collares</h3>
                            <div className="h-1 w-12 bg-primary rounded-full mt-2 group-hover:w-24 transition-all duration-500"></div>
                            <p className="text-stone-300 mt-2 text-sm md:text-base font-noto-sans font-light opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75 max-w-[80%]">Amatista, cuarzo y plata.</p>
                        </div>
                    </Link>

                    {/* Anillos */}
                    <Link to="/tienda/anillos" className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 min-h-[400px] md:min-h-[500px] lg:col-span-1">
                        <div className="absolute inset-0 bg-gray-200">
                            <div className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDEftD6U86_aHd85S4nLRDM3MaX8t8TXpzInkDJpr5OvF4K0iifelTx4gcSDX7IyVSX3FPI20IkA2IZ-3xKOPh9r9x8Jm8bFcEQsQGxIAdFZ1AqghRk-iE5HydGmpBR5vs0Eg6DTcBemE_odFFPoO6DD7G1x4-AL4fIVd_M1yI57dWLUrFeazOfUhs4vKCQFsTicW7rRcbmu9x4SAA0ekv2PWg0fcTt_8I87895TlRcpAjfGBn79-0BqI_dvHYsZVMcv9ucu9BrpmaF')"}}>
                            </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                        <div className="absolute bottom-0 left-0 w-full p-8 md:p-10 flex flex-col gap-2 items-start transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                            <div className="bg-primary/90 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 font-noto-sans">Hecho a mano</div>
                            <h3 className="text-white text-3xl md:text-4xl font-bold font-newsreader italic">Anillos</h3>
                            <div className="h-1 w-12 bg-primary rounded-full mt-2 group-hover:w-24 transition-all duration-500"></div>
                            <p className="text-stone-300 mt-2 text-sm md:text-base font-noto-sans font-light opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75 max-w-[80%]">Diseños únicos en oro y plata.</p>
                        </div>
                    </Link>

                    {/* Brazaletes (Previously Piedras en Bruto space) */}
                    <Link to="/tienda/brazaletes" className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 min-h-[300px] md:min-h-[400px] lg:col-span-1">
                        <div className="absolute inset-0 bg-gray-200">
                            <div className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC8k-UuWG8UhZqQEWRbYzP48OurLczlOiS1DapOY560Q_t2AIGbvb_q9-9G-zVF4XEUdtIKhCiHOLjlxZhX9eadXRjk5G09AStGME75qXVWwh91eYG-zzVn0VdgI73oTSTfihfml_rbMo8TlN_73LcWQOs-YfAYxIr16nDW1I-C5ugeqsJEcyRhC7YG2yU3CRSqIm41qbuFLFSVHmmMRmnkDRUgplm7TiWPP1bEWo4N9JmBEKQp8fNUBBfG76S0-Gem6628WNZD3GOl')"}}>
                            </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                        <div className="absolute bottom-0 left-0 w-full p-8 md:p-10 flex flex-col gap-2 items-start transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                            <h3 className="text-white text-3xl md:text-4xl font-bold font-newsreader italic">Brazaletes</h3>
                            <div className="h-1 w-12 bg-primary rounded-full mt-2 group-hover:w-24 transition-all duration-500"></div>
                        </div>
                    </Link>

                    {/* Piedras (Previously Piedras de Intención) */}
                    <Link to="/tienda/piedras" className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 min-h-[300px] md:min-h-[400px] lg:col-span-1">
                        <div className="absolute inset-0 bg-gray-200">
                            <div className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD6t1h4XVu53CHw4bna8AJvWF9JBRuloU_PxqHKSk5FZj7jRcBnXQWY6lNT8WsakYscY-rYtJRkvGGvaxKMxFYRbMQgtnzFt8pzSiVlRp77fK33u_pTPr9wTtQm6qz03cmv3d5GBQGiL9-UDCYIAHavNj7IEqCL_f0_0FFdEXVWreI03kEBO5ZnRtjEF-hRMLSa_m7FJyYyzyldpFw0jw-GOBxegH0vAtOqigag4LX8bHlbOVVWKKansALRFpyilJVNBOekZhvVf7jd')"}}>
                            </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                        <div className="absolute bottom-0 left-0 w-full p-8 md:p-10 flex flex-col gap-2 items-start transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                            <h3 className="text-white text-3xl md:text-4xl font-bold font-newsreader italic">Piedras</h3>
                            <div className="h-1 w-12 bg-primary rounded-full mt-2 group-hover:w-24 transition-all duration-500"></div>
                        </div>
                    </Link>

                    {/* Otros Accesorios (Previously Decoración) */}
                    <Link to="/tienda/otros-accesorios" className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 min-h-[300px] md:min-h-[400px] md:col-span-2">
                        <div className="absolute inset-0 bg-gray-200">
                            <div className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBQST63bp2GPEW4CsaIMd-b9dLrv1CDr6BiFvGqGmm4o_gTtBfIq3ME20W0Nh2qKh2gxs578vIYg9zUg4YvgvOCjvQLR0y5Wr2ZHJlLyQRFWBLEQDk5PVzVbGPZWPI6Y5RKtD-iweKRW6YQTehxksx9lKI26LG_0RBkA1UdK3f7hN_GRzuqLecf7cDnX72iQB1KhvckZHqtlojEaGWXO69PuupgPSqetNCvbN3qhfR31hK2Ew_G3BQtbLliyh0psrPQ1fUQ78SoWrjm')"}}>
                            </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                        <div className="absolute bottom-0 left-0 w-full p-8 md:p-10 flex flex-col gap-2 items-start transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                            <div className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 font-noto-sans">Novedad</div>
                            <h3 className="text-white text-3xl md:text-4xl font-bold font-newsreader italic">Otros Accesorios</h3>
                            <div className="h-1 w-12 bg-primary rounded-full mt-2 group-hover:w-24 transition-all duration-500"></div>
                            <p className="text-stone-300 mt-2 text-sm md:text-base font-noto-sans font-light opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75 max-w-[80%]">Complementos únicos para tu energía.</p>
                        </div>
                    </Link>
                </div>
            </div>
        </main>
    </div>
  );
};