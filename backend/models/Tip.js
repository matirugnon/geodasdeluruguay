const mongoose = require('mongoose');

const tipSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    excerpt: {
        type: String,
        required: true
    },
    content: {
        type: String, // HTML/Rich Text
        required: true
    },
    image: {
        type: String,
        required: true
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

module.exports = mongoose.model('Tip', tipSchema);