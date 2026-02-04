require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const cleanProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Eliminar todos los productos
        const result = await Product.deleteMany({});
        console.log(`✅ Eliminados ${result.deletedCount} productos`);

        console.log('Limpieza completada. Ahora puedes agregar productos desde el admin.');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

cleanProducts();
