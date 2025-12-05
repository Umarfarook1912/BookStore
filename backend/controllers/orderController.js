const Order = require('../models/Order');
const Book = require('../models/Book');

exports.createOrder = async (req, res) => {
    try {
        const { items } = req.body;
        if (!items || !items.length) return res.status(400).json({ message: 'No items' });

        let total = 0;
        const processedItems = [];
        for (const it of items) {
            const book = await Book.findById(it.book);
            if (!book) return res.status(400).json({ message: 'Invalid book in items' });
            processedItems.push({ book: book._id, quantity: it.quantity, price: book.price });
            total += book.price * it.quantity;
        }

        const order = new Order({ user: req.user._id, items: processedItems, total });
        await order.save();
        res.status(201).json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate('items.book');
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user').populate('items.book');
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        order.status = status;
        order.updatedAt = Date.now();
        await order.save();
        res.json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};
