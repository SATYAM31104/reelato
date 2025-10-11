const foodPartnerModel = require("../models/foodpartner.model");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

async function authFoodPartnerMiddleware(req, res, next) {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Please Login First" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const foodPartner = await foodPartnerModel.findById(decoded.id);
        if (!foodPartner) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        req.foodPartner = foodPartner;
        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(401).json({ message: "Unauthorized" });
    }
}
async function authuserMiddleware(req, res, next) {
    try {
        // Try to get token from cookies first, then from Authorization header
        let token = req.cookies.token;
        
        // If no cookie token, try Authorization header (for mobile compatibility)
        if (!token) {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7);
            }
        }
        
        // Debug logging for mobile issues
        console.log('Auth middleware - Cookies received:', Object.keys(req.cookies));
        console.log('Auth middleware - Token from cookie:', !!req.cookies.token);
        console.log('Auth middleware - Token from header:', !!req.headers.authorization);
        console.log('Auth middleware - Final token present:', !!token);
        console.log('Auth middleware - User-Agent:', req.get('User-Agent')?.substring(0, 50));
        
        if (!token) {
            console.log('Auth middleware - No token found in cookies or headers, rejecting request');
            return res.status(401).json({ message: "Please Login First" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Try to find user first
        let user = await userModel.findById(decoded.id);
        if (user) {
            req.user = user;
            req.userType = 'user';
            return next();
        }

        // If not user, try food partner
        const foodPartnerModel = require("../models/foodpartner.model");
        let foodPartner = await foodPartnerModel.findById(decoded.id);
        if (foodPartner) {
            req.user = foodPartner;
            req.userType = 'foodPartner';
            return next();
        }

        return res.status(401).json({ message: "Unauthorized" });
    } catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(401).json({ message: "Unauthorized" });
    }
}

module.exports = { authFoodPartnerMiddleware,authuserMiddleware };
