const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const foodPartnerModel = require('../models/foodpartner.model');


async function registerUser(req, res) {
    try {
        console.log('User registration request received:', req.body);
        const { name, email, password } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user already exists
        const isUserExist = await userModel.findOne({ email });
        if (isUserExist) {
            return res.status(400).json({ message: "User already exist" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await userModel.create({
            name,
            email,
            password: hashedPassword
        });

        console.log('User created successfully:', user._id);

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        // Set cookie and send response
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // true in production for HTTPS
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' for cross-site in production
            maxAge: 24 * 60 * 60 * 1000 // 1 day in milliseconds
        });
        console.log('Cookie set for user:', user._id);
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Email or Password" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid Email or Password" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // true in production for HTTPS
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' for cross-site in production
            maxAge: 24 * 60 * 60 * 1000 // 1 day in milliseconds
        });
        res.status(200).json({
            message: "User logged in successfully",
            user: { name: user.name, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
function logoutUser(req, res) {
    try {
        res.clearCookie('token');
        res.status(200).json({ message: "User logged out successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
async function registerFoodPartner(req, res) {
    try {
        console.log('Request body:', req.body); // Debug log
        const { restaurantName, ownerName, email, password, phone, address } = req.body;
        const isFoodPartnerExist = await foodPartnerModel.findOne({ email });
        if (isFoodPartnerExist) {
            return res.status(400).json({ message: "Food Partner already exist" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const foodPartner = await foodPartnerModel.create({
            restaurantName,
            ownerName,
            email,
            password: hashedPassword,
            phone,
            address
        });
        const token = jwt.sign({ id: foodPartner._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // true in production for HTTPS
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' for cross-site in production
            maxAge: 24 * 60 * 60 * 1000 // 1 day in milliseconds
        });
        res.status(201).json({
            message: "Food Partner registered successfully",
            foodPartner: {
                restaurantName: foodPartner.restaurantName,
                ownerName: foodPartner.ownerName,
                email: foodPartner.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
async function loginFoodPartner(req, res) {
    try {
        console.log('Food Partner login request received:', req.body);
        const { email, password } = req.body;
        const foodPartner = await foodPartnerModel.findOne({ email });
        if (!foodPartner) {
            return res.status(400).json({ message: "Invalid Email or Password" });
        }
        const isPasswordValid = await bcrypt.compare(password, foodPartner.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid Email or Password" });
        }
        const token = jwt.sign({ id: foodPartner._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // true in production for HTTPS
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' for cross-site in production
            maxAge: 24 * 60 * 60 * 1000 // 1 day in milliseconds
        });
        console.log('Cookie set for food partner:', foodPartner._id);
        res.status(200).json({
            message: "Food Partner logged in successfully",
            foodPartner: {
                restaurantName: foodPartner.restaurantName,
                ownerName: foodPartner.ownerName,
                email: foodPartner.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
function logoutFoodPartner(req, res) {
    try {
        res.clearCookie('token');
        res.status(200).json({ message: "Food Partner logged out successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

// General logout endpoint
function logout(req, res) {
    try {
        res.clearCookie('token');
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

// Check authentication status
async function getMe(req, res) {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Try to find user first
        let user = await userModel.findById(decoded.id).select('-password');
        if (user) {
            return res.status(200).json({
                type: 'user',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            });
        }

        // If not user, try food partner
        let foodPartner = await foodPartnerModel.findById(decoded.id).select('-password');
        if (foodPartner) {
            return res.status(200).json({
                type: 'foodPartner',
                foodPartner: {
                    id: foodPartner._id,
                    restaurantName: foodPartner.restaurantName,
                    ownerName: foodPartner.ownerName,
                    email: foodPartner.email
                }
            });
        }

        return res.status(401).json({ message: "User not found" });
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
}

module.exports = { registerUser, loginUser, logoutUser, registerFoodPartner, loginFoodPartner, logoutFoodPartner, logout, getMe };
