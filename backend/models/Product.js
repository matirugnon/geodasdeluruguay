const mongoose = require('mongoose');

function slugify(text) {
    return text
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
}

const productSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        unique: true,
        index: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    category: {
        type: String,
        required: true
    },
    images: [{
        type: String // Cloudinary URLs
    }],
    specs: {
        weight: { type: Number, default: 0 },
        dimensions: { type: String, default: '' },
        origin: { type: String, default: 'Uruguay' }
    },
    tags: [{
        type: String
    }],
    stock: {
        type: Number,
        required: true,
        default: 1
    },
    visible: {
        type: Boolean,
        default: true
    },
    isNewProduct: {
        type: Boolean,
        default: false
    },
    type: {
        type: String, // 'Catedral', 'Drusa', etc.
        default: 'Pieza'
    }
}, {
    timestamps: true
});

// Auto-generate unique slug from title before saving
productSchema.pre('save', async function (next) {
    // Only regenerate if title changed or slug is missing
    if (!this.isModified('title') && this.slug) return next();

    const baseSlug = slugify(this.title);
    let slug = baseSlug;
    let counter = 1;

    // Ensure uniqueness
    while (await mongoose.model('Product').findOne({ slug, _id: { $ne: this._id } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }

    this.slug = slug;
    next();
});

module.exports = mongoose.model('Product', productSchema);