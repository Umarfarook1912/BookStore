const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String },
    price: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    description: { type: String },
    coverImage: { type: String },
    stock: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Book', BookSchema);
