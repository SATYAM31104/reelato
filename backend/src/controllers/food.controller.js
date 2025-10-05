const foodModel = require('../models/food.model');
const storageService = require('../services/storage.service');
const { v4: uuid } = require("uuid");

async function createFood(req, res) {
    try {
        console.log('Food Partner:', req.foodPartner);
        console.log('Request body:', req.body);
        console.log('Uploaded file:', req.file);

        if (!req.file) {
            return res.status(400).json({ message: "Video file is required" });
        }

        const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid());
        const foodItem = await foodModel.create({
            name: req.body.name,
            description: req.body.description,
            video: fileUploadResult.url,
            foodPartner: req.foodPartner._id
        })
        res.status(201).json({
            message: "Food item created successfully",
            food: foodItem
        });
    } catch (error) {
        console.error('Create food error:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
// Get all food items (public endpoint)
async function getAllFoodItems(req, res) {
    try {
        const foodItems = await foodModel.find().populate('foodPartner', 'name email');
        res.status(200).json({
            message: "Food items fetched successfully",
            count: foodItems.length,
            data: foodItems
        });
    } catch (error) {
        console.error('Get all food items error:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

// Get food items for specific food partner (protected)
async function getFoodItems(req, res) {
    try {
        const foodItems = await foodModel.find({ foodPartner: req.foodPartner._id });
        res.status(200).json({
            message: "Your food items fetched successfully",
            count: foodItems.length,
            data: foodItems
        });
    } catch (error) {
        console.error('Get food items error:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports = {
    createFood,
    getAllFoodItems,
    getFoodItems
}