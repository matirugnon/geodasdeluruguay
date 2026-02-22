import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SITE_URL, SITE_NAME } from '../utils/slugify';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'product' | 'article';
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

/**
 * Componente de meta tags SEO reutilizable.
 * Maneja title, description, Open Graph, Twitter Cards y JSON-LD.
 */
export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description = 'Cristales, geodas y piedras naturales de Uruguay. Amatistas, cuarzos, ágatas y accesorios energéticos. Envío a todo el país.',
  canonical,
  image = `${SITE_URL}/og-default.jpg`,
  type = 'website',
  noindex = false,
  jsonLd,
}) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Cristales y Piedras Naturales`;
  const canonicalUrl = canonical || SITE_URL;

  return (
    <Helmet>
      {/* Basicos */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={type === 'product' ? 'product' : type === 'article' ? 'article' : 'website'} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="es_UY" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(Array.isArray(jsonLd) ? jsonLd : jsonLd)}
        </script>
      )}
    </Helmet>
  );
};
