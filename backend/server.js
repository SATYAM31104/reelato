// server.js
const express = require('express');
const cookieParser = require('cookie-parser'); // fixed typo
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./src/routes/auth.routes');
const foodRoutes = require('./src/routes/food.routes');

// Load environment variables
dotenv.config({ path: './.env' });

const app = express();
app.use(cookieParser());

// CORS configuration
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like Postman, mobile apps)
        if (!origin) return callback(null, true);

        // In production, allow Vercel domains and specific frontend URL
        if (process.env.NODE_ENV === 'production') {
            if (origin.endsWith('.vercel.app') || origin === process.env.FRONTEND_URL) {
                return callback(null, true);
            }
            return callback(new Error('CORS policy blocked this origin'), false);
        }

        // In development, allow localhost
        const allowedLocalOrigins = ['http://localhost:5173', 'http://localhost:3000'];
        if (allowedLocalOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error('CORS policy blocked this origin'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With'],
    exposedHeaders: ['Set-Cookie']
}));

// Additional middleware for mobile compatibility
app.use((req, res, next) => {
    // Add headers for mobile cookie support
    if (process.env.NODE_ENV === 'production') {
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Vary', 'Origin');
    }
    next();
});

// Middleware to parse JSON
app.use(express.json());

// Database connection
const { connectDB } = require('./src/db/db');
connectDB();

// Test route
app.get('/', (req, res) => {
    res.send('<h1>Reelato API is running!</h1>');
});

app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is working!', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);

// Start server (both development and production)
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at port ${PORT}`);
});

module.exports = app;