const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB conectado');
    createAdminUser();
}).catch(err => console.error(err));

async function createAdminUser() {
    try {
        // Verificar si ya existe
        const existingUser = await User.findOne({ username: 'admin' });
        if (existingUser) {
            console.log('El usuario admin ya existe');
            process.exit(0);
            return;
        }

        // Hash de la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        // Crear usuario
        const user = new User({
            username: 'admin',
            password: hashedPassword,
            isAdmin: true
        });

        await user.save();
        console.log('Usuario admin creado exitosamente');
        console.log('Username: admin');
        console.log('Password: admin123');
        process.exit(0);
    } catch (error) {
        console.error('Error al crear usuario:', error);
        process.exit(1);
    }
}
