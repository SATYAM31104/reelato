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
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Please Login First" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(401).json({ message: "Unauthorized" });
    }
}

module.exports = { authFoodPartnerMiddleware,authuserMiddleware };
