import React from 'react';
import { Gem, Instagram, MessageCircle, ShieldCheck, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

const whatsappNumber = '59891458797';
const whatsappLink = `https://wa.me/${whatsappNumber}`;

const footerLinks = {
  tienda: [
    { label: 'Todo el catálogo', to: '/tienda' },
    { label: 'Piedras naturales', to: '/tienda/piedras' },
    { label: 'Collares', to: '/tienda/collares' },
    { label: 'Otros accesorios', to: '/tienda/otros-accesorios' },
  ],
  ayuda: [
    { label: 'Contacto directo', href: whatsappLink },
    { label: 'Tips y guía de compra', to: '/tips' },
  ],
};

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-[rgba(198,184,162,0.75)] bg-[rgba(252,248,242,0.88)]">
      <div className="content-shell section-shell">
        <div className="info-card grid gap-8 rounded-[2rem] px-6 py-8 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr] lg:px-10">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--brand-soft)] text-[var(--brand)]">
                <Gem className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-400">Geodas del Uruguay</p>
                <p className="mt-1 font-serif text-2xl text-stone-900">Piezas naturales con presencia real.</p>
              </div>
            </div>

            <p className="max-w-md text-sm leading-7 text-stone-600">
              Selección cuidada de geodas, cristales y accesorios minerales para regalo, colección o espacios personales.
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.25rem] border border-[rgba(198,184,162,0.7)] bg-white/80 p-4">
                <div className="mb-2 flex items-center gap-2 text-[var(--brand)]">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-[0.18em]">Compra segura</span>
                </div>
                <p className="text-sm text-stone-600">Mercado Pago, transferencia y atención personalizada.</p>
              </div>
              <div className="rounded-[1.25rem] border border-[rgba(198,184,162,0.7)] bg-white/80 p-4">
                <div className="mb-2 flex items-center gap-2 text-[var(--brand)]">
                  <Truck className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-[0.18em]">Envíos</span>
                </div>
                <p className="text-sm text-stone-600">Cobertura nacional y coordinación directa por WhatsApp.</p>
              </div>
            </div>
          </div>

          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-400">Tienda</p>
            <ul className="space-y-3">
              {footerLinks.tienda.map((item) => (
                <li key={item.label}>
                  <Link className="text-sm text-stone-600 transition-colors duration-150 hover:text-[var(--brand)]" to={item.to}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-400">Ayuda</p>
            <ul className="space-y-3">
              {footerLinks.ayuda.map((item) => (
                <li key={item.label}>
                  {'to' in item ? (
                    <Link className="text-sm text-stone-600 transition-colors duration-150 hover:text-[var(--brand)]" to={item.to}>
                      {item.label}
                    </Link>
                  ) : (
                    <a
                      className="text-sm text-stone-600 transition-colors duration-150 hover:text-[var(--brand)]"
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-400">Atención directa</p>
            <a
              className="info-card flex items-center gap-3 rounded-[1.35rem] px-4 py-4 transition-colors duration-150 hover:border-[var(--brand)]"
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e9f7ef] text-[#2f9b56]">
                <MessageCircle className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-900">WhatsApp</p>
                <p className="text-xs text-stone-500">+598 91 458 797</p>
              </div>
            </a>

            <div className="flex gap-3">
              <a
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(198,184,162,0.8)] bg-white/80 text-stone-600 transition-colors duration-150 hover:border-[var(--brand)] hover:text-[var(--brand)]"
                href="https://www.instagram.com/geodasdeluruguay/?hl=es-la"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(198,184,162,0.8)] bg-white/80 text-stone-600 transition-colors duration-150 hover:border-[#25D366] hover:text-[#25D366]"
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>

            <p className="fine-print">
              Atención pensada para ayudarte a elegir con calma, resolver dudas y coordinar entregas de forma clara.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 px-2 pt-6 text-xs text-stone-400 md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} Geodas del Uruguay. Todos los derechos reservados.</p>
          <div className="flex gap-5">
            <a className="transition-colors duration-150 hover:text-stone-600" href="#">Privacidad</a>
            <a className="transition-colors duration-150 hover:text-stone-600" href="#">Términos</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
