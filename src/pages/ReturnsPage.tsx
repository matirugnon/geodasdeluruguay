import React from 'react';
import { InfoPageLayout } from '../components/InfoPageLayout';

const sections = [
  {
    title: 'Si hubo un problema con tu pedido',
    paragraphs: [
      'Si el producto llegó dañado, incompleto o distinto a lo coordinado, te pedimos que nos escribas apenas lo recibas para revisar el caso.',
      'Vamos a evaluar la situación y buscar una solución razonable según el inconveniente informado.',
    ],
  },
  {
    title: 'Cómo revisar cada caso',
    paragraphs: [
      'Por tratarse de piezas naturales, únicas y artesanales, cada situación se analiza de forma individual.',
      'Las diferencias propias de vetas, textura o tono entre una piedra natural y lo que se ve en pantalla no necesariamente implican una falla del producto.',
    ],
  },
  {
    title: 'Antes de comprar',
    paragraphs: [
      'Si querés confirmar medidas, color o detalles de una pieza antes de comprar, podés consultarnos. Eso ayuda a evitar malentendidos y mejora la experiencia de compra.',
      'Ante cualquier inconveniente real de envío o de preparación del pedido, podés escribirnos para que podamos ayudarte.',
    ],
  },
];

export const ReturnsPage: React.FC = () => {
  return (
    <InfoPageLayout
      title="Devoluciones"
      description="Criterios generales para reportar problemas con un pedido y cómo se revisan estos casos."
      intro="Queremos que recibas tu pedido en buenas condiciones. Si surge un problema real con la entrega o con la preparación del pedido, podés escribirnos para revisarlo."
      canonicalPath="/devoluciones"
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

export default ReturnsPage;
