const express = require('express');
const router = express.Router();
const foodController = require('../controllers/food.controller');
const { authFoodPartnerMiddleware } = require('../middlewares/auth.middleware');
const multer = require('multer');

const upload = multer({
    storage: multer.memoryStorage(),
});

// POST /api/food [protected] - Add food item
router.post('/', authFoodPartnerMiddleware, upload.single("video"), foodController.createFood)
// GET /api/food [public] - Get all food items
router.get('/', (req, res) => {
    res.json({ message: "Get food items endpoint - coming soon" });
});

module.exports = router;