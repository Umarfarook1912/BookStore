const mongoose = require('mongoose');

const connectDB = async (uri) => {
    try {
        const mongoUri = uri || process.env.MONGODB_URI;
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
