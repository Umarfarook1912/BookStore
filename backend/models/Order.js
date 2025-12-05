const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
            quantity: { type: Number, default: 1 },
            price: { type: Number },
        },
    ],
    total: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', OrderSchema);
