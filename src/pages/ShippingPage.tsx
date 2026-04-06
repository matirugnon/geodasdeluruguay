import React from 'react';
import { InfoPageLayout } from '../components/InfoPageLayout';

const sections = [
  {
    title: 'Cómo coordinamos los envíos',
    paragraphs: [
      'Realizamos envíos dentro de Uruguay y también podemos coordinar retiro o entrega según el tipo de pedido y la ubicación.',
      'Cuando la compra requiere una coordinación especial, te contactamos para confirmar los datos antes de despachar la pieza.',
    ],
  },
  {
    title: 'Tiempos estimados',
    paragraphs: [
      'Los tiempos de entrega son orientativos y pueden variar según el destino, el medio de envío y la fecha de compra.',
      'Si necesitás una referencia más precisa antes de comprar, podés consultarnos y te indicamos la mejor estimación disponible.',
    ],
  },
  {
    title: 'Seguimiento y contacto',
    paragraphs: [
      'Una vez confirmado el pedido, usamos los datos de contacto compartidos durante la compra para coordinar el envío o avisarte cualquier novedad relevante.',
      'Si tu compra necesita una coordinación adicional, te lo informamos por contacto directo.',
    ],
  },
];

export const ShippingPage: React.FC = () => {
  return (
    <InfoPageLayout
      title="Envíos"
      description="Información general sobre modalidades de entrega, coordinación y tiempos estimados de envío."
      intro="Estas indicaciones resumen de forma general cómo coordinamos entregas y envíos. Los tiempos pueden variar según el destino y el tipo de pedido."
      canonicalPath="/envios"
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

export default ShippingPage;
