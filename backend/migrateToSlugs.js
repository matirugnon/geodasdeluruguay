require('dotenv').config();
const connectDB = require('./config/db');
const Product = require('./models/Product');
const Tip = require('./models/Tip');

const migrateToSlugs = async () => {
    await connectDB();

    try {
        console.log('🔄 Iniciando migración de slugs...');

        // Migrar Products — forzar regeneración usando el pre-save hook del modelo
        const products = await Product.find({});
        console.log(`📦 Encontrados ${products.length} productos`);

        for (const product of products) {
            product.markModified('title');
            product.slug = undefined;
            await product.save();
            console.log(`✅ Producto "${product.title}" → slug: "${product.slug}"`);
        }

        // Migrar Tips
        const tips = await Tip.find({});
        console.log(`📝 Encontrados ${tips.length} tips`);

        for (const tip of tips) {
            tip.markModified('title');
            tip.slug = undefined;
            await tip.save();
            console.log(`✅ Tip "${tip.title}" → slug: "${tip.slug}"`);
        }

        console.log('✨ Migración completada exitosamente');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error durante la migración:', error);
        process.exit(1);
    }
};

migrateToSlugs();
