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
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// Middleware
app.use(express.json()); // this is used to help fetch and read data from req.body 

// Routes
app.get("/", (req, res) => {
    res.send(`<h1>Hello this is my home page</h1>`);
});

// API routes mounting
// app.use("/api/v1", yourRouterHere);
app.use("/api/auth", authRoutes);
app.use('/api/food', foodRoutes);

// Database connection
const { connectDB } = require("./src/db/db");
connectDB();

app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
});
