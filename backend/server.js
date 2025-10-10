const express = require('express');
const cookieparser = require('cookie-parser');
const dotenv = require('dotenv');
const authRoutes = require("./src/routes/auth.routes")
const foodRoutes = require('./src/routes/food.routes')
const cors = require('cors')

// Load environment variables
dotenv.config({ path: './.env' });

const app = express();
app.use(cookieparser());

// CORS configuration for Vercel deployment
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? [process.env.FRONTEND_URL, 'https://your-app-name.vercel.app'] 
        : ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

// Middleware
app.use(express.json()); // this is used to help fetch and read data from req.body 

// Database connection
const { connectDB } = require("./src/db/db");
connectDB();

// Routes
app.get("/", (req, res) => {
    res.send(`<h1>Reelato API is running!</h1>`);
});

// Test route
app.get("/api/test", (req, res) => {
    res.json({ message: "Backend is working!", timestamp: new Date().toISOString() });
});

// API routes mounting
app.use("/api/auth", authRoutes);
app.use('/api/food', foodRoutes);

// For Vercel serverless functions
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running at port ${PORT}`);
    });
}

module.exports = app;
