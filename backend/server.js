require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const orderRoutes = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect DB
connectDB();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send({ ok: true, message: 'BookStore API' }));

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/orders', orderRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Server error' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
