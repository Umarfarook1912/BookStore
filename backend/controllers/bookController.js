const Book = require('../models/Book');

exports.createBook = async (req, res) => {
    try {
        const book = new Book(req.body);
        await book.save();
        res.status(201).json(book);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.json(book);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.json({ message: 'Book deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.json(book);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.listBooks = async (req, res) => {
    try {
        const { genre, author, priceMin, priceMax, ratingMin, search, page = 1, limit = 12 } = req.query;
        const q = {};
        if (genre) q.genre = genre;
        if (author) q.author = { $regex: author, $options: 'i' };
        if (ratingMin) q.rating = { $gte: Number(ratingMin) };
        if (priceMin || priceMax) q.price = {};
        if (priceMin) q.price.$gte = Number(priceMin);
        if (priceMax) q.price.$lte = Number(priceMax);
        if (search) q.$or = [
            { title: { $regex: search, $options: 'i' } },
            { author: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
        ];

        const skip = (Number(page) - 1) * Number(limit);
        const [items, total] = await Promise.all([
            Book.find(q).skip(skip).limit(Number(limit)),
            Book.countDocuments(q),
        ]);
        res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};
