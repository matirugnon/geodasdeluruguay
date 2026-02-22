const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Tip = require('../models/Tip');

const SITE_URL = process.env.STOREFRONT_URL || process.env.FRONTEND_URL || 'https://geodasdeluruguay.vercel.app';

// ─── robots.txt ────────────────────────────────────────────────────────────────
router.get('/robots.txt', (req, res) => {
    const robots = `User-agent: *
Allow: /
Disallow: /checkout
Disallow: /api/

Sitemap: ${SITE_URL}/sitemap.xml
`;
    res.type('text/plain').send(robots);
});

// ─── sitemap.xml ───────────────────────────────────────────────────────────────
router.get('/sitemap.xml', async (req, res) => {
    try {
        const products = await Product.find({ visible: true }).select('slug updatedAt').lean();
        const tips = await Tip.find({}).select('slug updatedAt').lean();

        const today = new Date().toISOString().split('T')[0];

        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

  <!-- Static pages -->
  <url>
    <loc>${SITE_URL}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE_URL}/tienda</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${SITE_URL}/tips</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>

  <!-- Category pages -->
  <url>
    <loc>${SITE_URL}/tienda/collares</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${SITE_URL}/tienda/anillos</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${SITE_URL}/tienda/brazaletes</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${SITE_URL}/tienda/piedras</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${SITE_URL}/tienda/otros-accesorios</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;

        // Product pages
        for (const p of products) {
            if (!p.slug) continue;
            const lastmod = p.updatedAt ? new Date(p.updatedAt).toISOString().split('T')[0] : today;
            xml += `
  <url>
    <loc>${SITE_URL}/producto/${p.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
        }

        // Tip pages
        for (const t of tips) {
            if (!t.slug) continue;
            const lastmod = t.updatedAt ? new Date(t.updatedAt).toISOString().split('T')[0] : today;
            xml += `
  <url>
    <loc>${SITE_URL}/tips/${t.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
        }

        xml += `
</urlset>`;

        res.type('application/xml').send(xml);
    } catch (error) {
        console.error('Error generating sitemap:', error);
        res.status(500).send('Error generating sitemap');
    }
});

module.exports = router;
