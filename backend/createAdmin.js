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
        const newUsername = 'usernuevo'; // Cambia esto
        const newPassword = 'contranueva'; // Cambia esto
        
        // Eliminar usuario admin anterior si existe
        await User.deleteOne({ username: 'admin' });
        await User.deleteOne({ username: newUsername });

        // Hash de la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Crear usuario
        const user = new User({
            username: newUsername,
            password: hashedPassword,
            isAdmin: true
        });

        await user.save();
        console.log('Usuario admin creado exitosamente');
        console.log('Username:', newUsername);
        console.log('Password:', newPassword);
        process.exit(0);
    } catch (error) {
        console.error('Error al crear usuario:', error);
        process.exit(1);
    }
}
