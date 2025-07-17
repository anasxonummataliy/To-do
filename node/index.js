const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const todoRoutes = require('./routes/todo');

// .env faylni o‘qish
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware’lar
app.use(cors());
app.use(express.json());

// Route’larni ulash
app.use('/api/todos', todoRoutes);

// MongoDB’ga ulanish
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('✅ MongoDB bilan ulanish muvaffaqiyatli');
        // Serverni ishga tushirish
        app.listen(PORT, () => {
            console.log(`🚀 Server ishga tushdi: http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ MongoDB ulanishda xatolik:', err.message);
    });
