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
router.get('/', foodController.getAllFoodItems)
// GET /api/food/partner/:partnerId [public] - Get food items by partner
router.get('/partner/:partnerId', foodController.getFoodItemsByPartner)
// GET /api/food/partner-info/:partnerId [public] - Get food partner info
router.get('/partner-info/:partnerId', foodController.getFoodPartnerInfo)

module.exports = router;