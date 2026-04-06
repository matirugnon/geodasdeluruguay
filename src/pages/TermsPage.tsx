import React from 'react';
import { InfoPageLayout } from '../components/InfoPageLayout';

const sections = [
  {
    title: 'Uso general del sitio',
    paragraphs: [
      'Este sitio está pensado para mostrar el catálogo de Geodas del Uruguay, compartir información básica sobre cada pieza y facilitar el contacto o la compra.',
      'Si tenés dudas sobre una pieza, un medio de pago o una entrega, te recomendamos consultarnos antes de finalizar la compra.',
    ],
  },
  {
    title: 'Productos, fotos y colores',
    paragraphs: [
      'Trabajamos con piezas naturales y únicas. Las fotos buscan representar cada producto de la forma más fiel posible, pero pueden existir pequeñas variaciones de color, brillo o textura según la pantalla desde la que se mire.',
      'Si querés confirmar un detalle visual o de tamaño, podés escribirnos antes de comprar.',
    ],
  },
  {
    title: 'Stock, precios y contenido',
    paragraphs: [
      'La disponibilidad de cada producto está sujeta a stock y confirmación al momento de la compra.',
      'Podemos actualizar precios, descripciones, imágenes o información general del sitio cuando sea necesario para mantener el catálogo correcto y actualizado.',
    ],
  },
];

export const TermsPage: React.FC = () => {
  return (
    <InfoPageLayout
      title="Términos y condiciones"
      description="Condiciones generales de uso del sitio, disponibilidad de stock y carácter orientativo de imágenes y contenido."
      intro="Estas condiciones resumen el uso general del sitio y del catálogo público de Geodas del Uruguay. Buscan dejar reglas básicas y razonables para una tienda pequeña y artesanal."
      canonicalPath="/terminos"
    >
      {sections.map((section) => (
        <section key={section.title} className="border-b border-stone-100 pb-8 last:border-b-0 last:pb-0">
          <h2 className="font-serif text-2xl text-stone-900 font-medium mb-4">{section.title}</h2>
          <div className="space-y-4">
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-stone-600 font-light leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      ))}
    </InfoPageLayout>
  );
};

export default TermsPage;
