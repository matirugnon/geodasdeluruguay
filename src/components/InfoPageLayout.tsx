import React from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from './SEOHead';
import { SITE_URL, WHATSAPP_URL } from '../config/site';

interface InfoPageLayoutProps {
  title: string;
  description: string;
  intro: string;
  canonicalPath: string;
  children: React.ReactNode;
}

export const InfoPageLayout: React.FC<InfoPageLayoutProps> = ({
  title,
  description,
  intro,
  canonicalPath,
  children,
}) => {
  const canonical = `${SITE_URL}${canonicalPath}`;

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title={title}
        description={description}
        canonical={canonical}
        type="website"
      />

      <main className="max-w-[860px] mx-auto px-6 md:px-12 pt-16 pb-24">
        <header className="text-center pb-10 border-b border-stone-100">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#8C7E60] font-medium mb-4">
            Información del sitio
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-stone-900 font-medium mb-4">
            {title}
          </h1>
          <p className="text-stone-500 font-light leading-relaxed text-base max-w-2xl mx-auto">
            {intro}
          </p>
        </header>

        <div className="pt-10 space-y-10">
          {children}
        </div>

        <div className="mt-14 border border-stone-200 rounded-md bg-[#F8F7F4] p-6 sm:p-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-serif text-lg text-stone-900 font-medium mb-2">¿Tenés alguna duda?</h2>
            <p className="text-sm text-stone-500 leading-relaxed max-w-xl">
              Si necesitás confirmar un detalle sobre tu pedido, envío o una de estas políticas, podés escribirnos por WhatsApp.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:flex-shrink-0">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-5 py-3 bg-[#8C7E60] text-white rounded text-sm font-medium hover:bg-[#756A50] transition-colors duration-150"
            >
              Contactar por WhatsApp
            </a>
            <Link
              to="/tienda"
              className="inline-flex items-center justify-center px-5 py-3 border border-stone-300 text-stone-700 rounded text-sm font-medium hover:bg-stone-50 transition-colors duration-150"
            >
              Volver a la tienda
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};
