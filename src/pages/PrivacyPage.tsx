import React from 'react';
import { InfoPageLayout } from '../components/InfoPageLayout';

const sections = [
  {
    title: 'Qué datos podemos recibir',
    paragraphs: [
      'Cuando hacés una consulta o una compra, podemos recibir datos básicos como nombre, teléfono, email, dirección de entrega y la información necesaria para coordinar tu pedido.',
      'También podemos conservar los datos mínimos vinculados a pagos, envíos y mensajes de atención para poder hacer seguimiento del pedido.',
    ],
  },
  {
    title: 'Para qué los usamos',
    paragraphs: [
      'Usamos esos datos únicamente para responder consultas, gestionar compras, coordinar entregas, confirmar pagos y dar soporte si surge algún inconveniente con el pedido.',
      'No vendemos ni cedemos tu información personal para fines comerciales ajenos a Geodas del Uruguay.',
    ],
  },
  {
    title: 'Cómo cuidamos la información',
    paragraphs: [
      'Tratamos la información con criterio de uso limitado y solo durante el tiempo necesario para la atención, la gestión del pedido y la administración básica del sitio.',
      'Si necesitás revisar o corregir un dato vinculado a una compra o consulta, podés escribirnos por nuestros canales de contacto.',
    ],
  },
];

export const PrivacyPage: React.FC = () => {
  return (
    <InfoPageLayout
      title="Privacidad"
      description="Cómo usamos los datos básicos de contacto, compra y entrega en Geodas del Uruguay."
      intro="En Geodas del Uruguay usamos solo la información necesaria para responder consultas, gestionar pedidos y coordinar entregas. No compartimos datos personales para fines comerciales ajenos a la tienda."
      canonicalPath="/privacidad"
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

export default PrivacyPage;
