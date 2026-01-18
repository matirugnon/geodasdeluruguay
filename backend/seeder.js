require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');

// Models
const Product = require('./models/Product');
const Category = require('./models/Category');
const Tip = require('./models/Tip');
const User = require('./models/User');

const seedData = async () => {
    await connectDB();

    try {
        // Clear existing data
        await Product.deleteMany();
        await Category.deleteMany();
        await Tip.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed...');

        // 1. Create Admin User
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt); // Default password
        
        await User.create({
            username: 'admin',
            password: hashedPassword,
            isAdmin: true
        });

        console.log('Admin User Created...');

        // 2. Create Categories
        const categoriesData = [
            { name: 'Collares', slug: 'collares', description: 'Fragmentos de energía.' },
            { name: 'Anillos', slug: 'anillos', description: 'Símbolos de compromiso.' },
            { name: 'Brazaletes', slug: 'brazaletes', description: 'Energía en tus manos.' },
            { name: 'Piedras', slug: 'piedras', description: 'Naturaleza pura.' },
            { name: 'Otros Accesorios', slug: 'otros-accesorios', description: 'Complementos.' }
        ];

        const createdCategories = await Category.insertMany(categoriesData);
        
        // Helper to find cat ID
        const getCatId = (slug) => createdCategories.find(c => c.slug === slug)._id;

        // 3. Create Products (Based on frontend INITIAL_PRODUCTS)
        const products = [
            {
                title: 'Geoda Catedral #42',
                description: 'Extraída de las profundidades del suelo de Artigas.',
                price: 4500,
                category: getCatId('piedras'),
                images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuCs51rpTI4GIA2atJxMreXDCw6ltculOmzdcaDyVqzcWN8ywCHuhkA3Pj3LRofBYe_6GJricPrssBHJdWjYbeBY-ZLLhfQeylXcVCHDfV5CBq9rS8P5X-gWviHtTvyvzC-JVCVQxl047YfdVx4ee0aTGqKl5JNB03YGz8pDVoaY5qPP9Njkrbj3cBx7lbNtS85fiSsTYOzZyvPSItUgy7kQ91CNuAgfc6NLQ4spnuaetRILU4xIgEwbnQaqzrWAOY4L2Pq56mXNRQdD'],
                specs: { weight: 4500, dimensions: '20x15x10 cm', origin: 'Artigas, Uruguay' },
                tags: ['Protección', 'Calma'],
                stock: 1,
                visible: true,
                type: 'Catedral'
            },
            {
                title: 'Collar Drusa Amatista',
                description: 'Energía concentrada en pequeño formato.',
                price: 1200,
                category: getCatId('collares'),
                images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuDcm0KWIwELayMnFdk7DB7GRMQM_66UW97KdiJp3_gCOhI6g-TNxupr5Rct7JYNeMEEn0hnBjGKHfN3e2Mrov3X5cB5WOKsR3uTKtviWcgsyDKIUCe1dJXz-QHqpf3j1vY2nDHyvVP5U0M_vzhlWTAGUos7mvuine_6PDuuMUfHXctGkB08Yuly-hkRT5_DL4RlWki-IQEJeXYFc4Oi_T1qxM9MEmys1CcFR6OoLPCFBy6Z7i0KKVJKcGw88zKeEPpMNewbWFKO-H8g'],
                specs: { weight: 20, dimensions: '3cm', origin: 'Artigas, Uruguay' },
                tags: ['Claridad'],
                stock: 12,
                visible: true,
                type: 'Collar'
            },
            {
                title: 'Anillo de Oro con Citrino',
                description: 'Diseño único en oro y plata con citrino en bruto.',
                price: 2900,
                category: getCatId('anillos'),
                images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuDEftD6U86_aHd85S4nLRDM3MaX8t8TXpzInkDJpr5OvF4K0iifelTx4gcSDX7IyVSX3FPI20IkA2IZ-3xKOPh9r9x8Jm8bFcEQsQGxIAdFZ1AqghRk-iE5HydGmpBR5vs0Eg6DTcBemE_odFFPoO6DD7G1x4-AL4fIVd_M1yI57dWLUrFeazOfUhs4vKCQFsTicW7rRcbmu9x4SAA0ekv2PWg0fcTt_8I87895TlRcpAjfGBn79-0BqI_dvHYsZVMcv9ucu9BrpmaF'],
                specs: { weight: 8, dimensions: 'Talla 16', origin: 'Artigas, Uruguay' },
                tags: ['Energía', 'Enfoque'],
                stock: 4,
                visible: true,
                type: 'Anillo'
            },
            {
                title: 'Cuarzo Cristal Puro',
                description: 'Sanador maestro. Amplifica la energía.',
                price: 1890,
                category: getCatId('piedras'),
                images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAHDiEAS4vNW1Wu5JHxUc_T4upeEbcxctnpJ4Qzg7eODjj5B6LN_QznTXQHsZVMrXnxLcAAiPr7znfOytuU6HNVmp_DtSxZ2FA0bTt6wubULfAYkQX--LubKv4ZZACBDRYX0RF7nCuY6S6wRfCTL7K3Vw9Jz4yZVuP9OpPRQAnDa9pNsJRoKlem4gASukMoU2khNET2KK3kTkd6GSB65YAGu4xRLy2i5wDnJvoTX65HMx0eGfhCDOfbVAczPPd7frlFC8vrA_BqSo5f'],
                specs: { weight: 600, dimensions: '10x10 cm', origin: 'Artigas, Uruguay' },
                tags: ['Sanación'],
                stock: 2,
                visible: true,
                type: 'Drusa'
            }
        ];

        await Product.insertMany(products);
        console.log('Products Imported...');

        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedData();