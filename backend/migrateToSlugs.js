require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Product = require('./models/Product');
const Tip = require('./models/Tip');

// Helper function to generate slug
function generateSlug(text) {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

const migrateToSlugs = async () => {
    await connectDB();

    try {
        console.log('🔄 Iniciando migración de slugs...');

        // Migrar Products
        const products = await Product.find({});
        console.log(`📦 Encontrados ${products.length} productos`);

        for (const product of products) {
            if (!product.slug) {
                const baseSlug = generateSlug(product.title);
                let slug = baseSlug;
                let counter = 1;

                // Asegurar que el slug sea único
                while (await Product.findOne({ slug, _id: { $ne: product._id } })) {
                    slug = `${baseSlug}-${counter}`;
                    counter++;
                }

                product.slug = slug;
                await product.save();
                console.log(`✅ Producto "${product.title}" → slug: "${slug}"`);
            }
        }

        // Migrar Tips
        const tips = await Tip.find({});
        console.log(`📝 Encontrados ${tips.length} tips`);

        for (const tip of tips) {
            if (!tip.slug) {
                const baseSlug = generateSlug(tip.title);
                let slug = baseSlug;
                let counter = 1;

                while (await Tip.findOne({ slug, _id: { $ne: tip._id } })) {
                    slug = `${baseSlug}-${counter}`;
                    counter++;
                }

                tip.slug = slug;
                await tip.save();
                console.log(`✅ Tip "${tip.title}" → slug: "${slug}"`);
            }
        }

        console.log('✨ Migración completada exitosamente');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error durante la migración:', error);
        process.exit(1);
    }
};

migrateToSlugs();
