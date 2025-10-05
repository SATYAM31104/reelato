const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const foodPartnerModel = require('../models/foodpartner.model');


async function registerUser(req, res) {
    try {
        const { name, email, password } = req.body;
        
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

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        // Set cookie and send response
        res.cookie('token', token, { httpOnly: true });
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
        res.cookie('token', token, { httpOnly: true });
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
        res.cookie('token', token, { httpOnly: true });
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
        res.cookie('token', token, { httpOnly: true });
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
module.exports = { registerUser, loginUser, logoutUser, registerFoodPartner,loginFoodPartner,logoutFoodPartner}; //aaise export kar rahe because aur bhi saaare function likhne hain
