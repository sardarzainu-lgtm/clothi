const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

const userRoutes = require('./routes/userRoutes.js');
const productRoutes = require('./routes/productRoutes.js');
const orderRoutes = require('./routes/orderRoutes.js');
const uploadRoutes = require('./routes/uploadRoutes.js');
const reviewRoutes = require('./routes/reviewRoutes.js');
const settingsRoutes = require('./routes/settingsRoutes.js');
const dailyDealRoutes = require('./routes/dailyDealRoutes.js');

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/products', reviewRoutes); // Review routes nested under products
app.use('/api/settings', settingsRoutes);
app.use('/api/dailydeals', dailyDealRoutes);

const __dirname1 = path.resolve();
app.use('/uploads', express.static(path.join(__dirname1, '/uploads')));

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error handling middleware (must be after all routes)
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        error: process.env.NODE_ENV === 'production' ? {} : err.stack,
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
