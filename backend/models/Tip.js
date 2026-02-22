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

const tipSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        unique: true,
        index: true
    },
    excerpt: {
        type: String,
        required: false,
        default: ''
    },
    content: {
        type: String, // HTML/Rich Text
        required: false,
        default: '<p>Contenido en desarrollo...</p>'
    },
    image: {
        type: String,
        required: false,
        default: ''
    },
    date: {
        type: String, // Can store as formatted string or Date object
        default: new Date().toISOString()
    },
    tags: [{
        type: String
    }]
}, {
    timestamps: true
});

// Auto-generate unique slug from title before saving
tipSchema.pre('save', async function (next) {
    if (!this.isModified('title') && this.slug) return next();

    const baseSlug = slugify(this.title);
    let slug = baseSlug;
    let counter = 1;

    while (await mongoose.model('Tip').findOne({ slug, _id: { $ne: this._id } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }

    this.slug = slug;
    next();
});

module.exports = mongoose.model('Tip', tipSchema);