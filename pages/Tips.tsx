import React from 'react';

export const Tips: React.FC = () => {
  return (
    <div className="bg-stone-50 text-stone-800 antialiased selection:bg-gold/30 selection:text-stone-900 relative">
      <div className="absolute inset-0 pointer-events-none z-0 texture-overlay opacity-40 mix-blend-multiply fixed"></div>
      
      <main className="relative flex-1 flex flex-col items-center w-full z-10">
        
        {/* Hero Section */}
        <section className="w-full px-6 md:px-10 lg:px-40 py-20 md:py-32 flex justify-center relative overflow-hidden">
            <div className="absolute top-10 left-10 text-stone-200 opacity-60 transform -rotate-12 pointer-events-none hidden lg:block">
                <span className="material-symbols-outlined text-[120px] font-thin">diamond</span>
            </div>
            <div className="absolute bottom-10 right-10 text-olive/10 opacity-60 transform rotate-12 pointer-events-none hidden lg:block">
                <span className="material-symbols-outlined text-[150px] font-thin">spa</span>
            </div>
            <div className="max-w-[800px] w-full flex flex-col items-center text-center gap-8 z-10">
                <div className="flex flex-col items-center gap-4">
                    <span className="text-gold font-serif italic text-lg tracking-wider">Sabiduría Natural</span>
                    <h1 className="text-stone-900 text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight font-serif">
                        Diario Místico
                    </h1>
                </div>
                <div className="h-px w-24 bg-olive/30 my-2"></div>
                <p className="text-stone-500 text-lg md:text-xl font-light leading-relaxed max-w-2xl font-sans">
                    Una guía para reconectar con la energía de la tierra. Aprende a cuidar, limpiar y potenciar tus geodas en armonía con los ciclos naturales.
                </p>
            </div>
        </section>

        {/* Articles List */}
        <div className="w-full max-w-[1300px] px-6 md:px-10 lg:px-20 py-10 flex flex-col gap-32 md:gap-40 pb-32">
            
            {/* Article 1 */}
            <article className="group relative">
                <div className="flex flex-col md:flex-row items-center">
                    <div className="w-full md:w-3/5 relative z-0">
                        <div className="aspect-[4/3] md:aspect-[16/11] relative overflow-hidden blob-shape-1 shadow-2xl shadow-stone-900/10 transition-transform duration-700 ease-out group-hover:scale-[1.02]">
                            <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC7A5MQW_pef2MMdFqyZzDoT_QHkt4NArz2jlleBW4bKlMildZNUsm9-Ng-2k35vJ04uE0bZZUaEkCYPNgCYBjV2lERZgK1ZEoRxdALKUSBtSiF3kD8a2WrWpf2X7jSLA3mg2gltle5wPNgKV2pl6xez_epG6r1xTZshTyr8tHKNlDNoYnzwQ7lpM6z0yOOll9WpA6aNIK5Pb5c7uBLCcRpgWn2nX8hAgvphBmuVNvmCXIPo5XvfZ4doT0fDceGDfhlj1nuMJ94fbgi")'}}></div>
                            <div className="absolute inset-0 bg-stone-900/10 mix-blend-overlay"></div>
                        </div>
                    </div>
                    <div className="w-full md:w-2/5 md:-ml-24 mt-8 md:mt-0 relative z-10">
                        <div className="bg-paper/95 backdrop-blur-sm p-8 md:p-12 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-stone-100 flex flex-col gap-5 text-center md:text-left transition-transform duration-500 group-hover:-translate-y-2">
                            <div className="flex items-center justify-center md:justify-start gap-2 text-olive text-xs font-bold tracking-widest uppercase mb-1">
                                <span className="material-symbols-outlined text-[16px]">water_drop</span>
                                <span>Rituales de Limpieza</span>
                            </div>
                            <h2 className="text-stone-900 text-3xl md:text-4xl font-bold leading-tight font-serif">
                                Cómo limpiar tu Amatista
                            </h2>
                            <p className="text-stone-500 text-base leading-relaxed font-light font-sans">
                                El agua y la luna son elementos clave para purificar la energía acumulada. Descubre los métodos ancestrales para devolverle el brillo vibracional a tus cristales sin dañarlos, respetando su estructura mineral.
                            </p>
                            <div className="pt-4 flex justify-center md:justify-start">
                                <button className="group/btn flex items-center gap-2 text-stone-800 hover:text-olive font-serif italic text-lg transition-colors border-b border-stone-300 hover:border-olive pb-1">
                                    <span>Leer entrada</span>
                                    <span className="material-symbols-outlined text-[18px] transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </article>

            {/* Article 2 */}
            <article className="group relative">
                <div className="flex flex-col md:flex-row-reverse items-center">
                    <div className="w-full md:w-3/5 relative z-0">
                        <div className="aspect-[4/3] md:aspect-[16/11] relative overflow-hidden blob-shape-2 shadow-2xl shadow-gold/10 transition-transform duration-700 ease-out group-hover:scale-[1.02]">
                            <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBcfkhcnRYccxBEKp5KUtwcvqh9281l6oFABOybI6yY8DnncvS29XZCHYeMmSNAi6DvOYn9gdsdUr92xGjygRHUjcO2OKZcmmnTY68FbTP_MmwXFUa-72gvRC_oeaD_AeTbe53AyQGyeemECVB3OzFM9MD6kWsdShn7kWwlidkEDzNjxSZKgP6Oq0BDmY9To-FxuNXarjQ9WDVNA5k1bb_qxpkbWig2uzz2igz6N5rxO0jFmIqleGtggcwmB12cyGUj562WTDVLd-va")'}}></div>
                            <div className="absolute inset-0 bg-stone-900/10 mix-blend-overlay"></div>
                        </div>
                    </div>
                    <div className="w-full md:w-2/5 md:-mr-24 mt-8 md:mt-0 relative z-10">
                        <div className="bg-paper/95 backdrop-blur-sm p-8 md:p-12 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-stone-100 flex flex-col gap-5 text-center md:text-right transition-transform duration-500 group-hover:-translate-y-2">
                            <div className="flex items-center justify-center md:justify-end gap-2 text-gold text-xs font-bold tracking-widest uppercase mb-1">
                                <span>Propiedades Energéticas</span>
                                <span className="material-symbols-outlined text-[16px]">wb_sunny</span>
                            </div>
                            <h2 className="text-stone-900 text-3xl md:text-4xl font-bold leading-tight font-serif">
                                Energía de las Geodas
                            </h2>
                            <p className="text-stone-500 text-base leading-relaxed font-light font-sans">
                                Las geodas actúan como amplificadores naturales. Aprende cómo ubicarlas estratégicamente en tu hogar para transformar la vibración de tus espacios, atraer abundancia y generar un flujo de energía positiva.
                            </p>
                            <div className="pt-4 flex justify-center md:justify-end">
                                <button className="group/btn flex items-center gap-2 text-stone-800 hover:text-gold font-serif italic text-lg transition-colors border-b border-stone-300 hover:border-gold pb-1">
                                    <span>Descubrir magia</span>
                                    <span className="material-symbols-outlined text-[18px] transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </article>

            {/* Article 3 */}
            <article className="group relative">
                <div className="flex flex-col md:flex-row items-center">
                    <div className="w-full md:w-3/5 relative z-0">
                        <div className="aspect-[4/3] md:aspect-[16/11] relative overflow-hidden blob-shape-3 shadow-2xl shadow-olive/10 transition-transform duration-700 ease-out group-hover:scale-[1.02]">
                            <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuABcVCsyjahxP_W_zjWs5afnzT9q_c8BUXbQmMkS7yvSIqBmJcnTeYYlDsbv0mzza5OIqDub69JbS8n--fC6nKKMP5nBtn-hPiIwvn2DAUcMuBJhhbEfwkDGH0FRXZP04y8wv_DdJNgOjUX8SISlhS1I0oIN4mDHbsSr-ACd63986g0EM_tsZTeEdyQA1YsLIwMob7FyMJgCgYptwxFeXeYQy_jKgmcTCK1Hqf4s0PenOCwFRxKUlhqwE6hRotwuRU6DXuqd_Qusanp")'}}></div>
                            <div className="absolute inset-0 bg-stone-900/10 mix-blend-overlay"></div>
                        </div>
                    </div>
                    <div className="w-full md:w-2/5 md:-ml-24 mt-8 md:mt-0 relative z-10">
                        <div className="bg-paper/95 backdrop-blur-sm p-8 md:p-12 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-stone-100 flex flex-col gap-5 text-center md:text-left transition-transform duration-500 group-hover:-translate-y-2">
                            <div className="flex items-center justify-center md:justify-start gap-2 text-olive text-xs font-bold tracking-widest uppercase mb-1">
                                <span className="material-symbols-outlined text-[16px]">spa</span>
                                <span>Conexión Natural</span>
                            </div>
                            <h2 className="text-stone-900 text-3xl md:text-4xl font-bold leading-tight font-serif">
                                Meditación con Cuarzos
                            </h2>
                            <p className="text-stone-500 text-base leading-relaxed font-light font-sans">
                                Una guía paso a paso para incorporar tus cristales en tu práctica de meditación diaria. Siente la conexión profunda con la tierra, ancla tu energía y encuentra tu centro en medio del caos moderno.
                            </p>
                            <div className="pt-4 flex justify-center md:justify-start">
                                <button className="group/btn flex items-center gap-2 text-stone-800 hover:text-olive font-serif italic text-lg transition-colors border-b border-stone-300 hover:border-olive pb-1">
                                    <span>Ver práctica</span>
                                    <span className="material-symbols-outlined text-[18px] transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </article>

        </div>

        {/* Newsletter Section */}
        <section className="w-full px-6 md:px-10 lg:px-40 pb-24">
            <div className="layout-content-container flex flex-col max-w-[1000px] w-full mx-auto">
                <div className="relative overflow-hidden rounded-[2rem] bg-stone-800 p-10 md:p-20 text-center">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-gold/20 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-olive/20 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="relative z-10 flex flex-col items-center gap-8">
                        <div className="flex flex-col gap-4 max-w-2xl">
                            <span className="text-gold font-serif italic tracking-wide">Comunidad Exclusiva</span>
                            <h2 className="text-stone-50 text-3xl md:text-5xl font-bold leading-tight font-serif">
                                Únete al Círculo
                            </h2>
                            <p className="text-stone-300 text-lg font-light leading-relaxed font-sans">
                                Recibe consejos mensuales alineados con las fases lunares y acceso anticipado a nuestras piezas más especiales.
                            </p>
                        </div>
                        <div className="w-full max-w-md mt-4">
                            <form className="flex flex-col sm:flex-row gap-3">
                                <input className="flex-1 bg-stone-700/50 border border-stone-600 text-stone-100 placeholder:text-stone-400 rounded-lg px-5 py-4 focus:ring-1 focus:ring-gold focus:border-gold outline-none transition-all font-light" placeholder="Tu correo electrónico" type="email"/>
                                <button className="bg-gold hover:bg-gold-dim text-stone-900 font-bold py-4 px-8 rounded-lg transition-colors shadow-lg shadow-gold/20 whitespace-nowrap" type="button">
                                    Suscribirse
                                </button>
                            </form>
                            <p className="text-stone-500 text-xs mt-4 font-sans">
                                Respetamos tu privacidad y tu energía.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

      </main>
    </div>
  );
};