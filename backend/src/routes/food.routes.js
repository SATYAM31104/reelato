const express = require('express');
const router = express.Router();
const foodController = require('../controllers/food.controller');
const { authFoodPartnerMiddleware, authuserMiddleware } = require('../middlewares/auth.middleware');
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

// POST /api/food/like [protected] - Like/Unlike food item
router.post('/like', authuserMiddleware, foodController.likeFood);
// GET /api/food/like-status/:foodId [protected] - Get like status for food item
router.get('/like-status/:foodId', authuserMiddleware, foodController.getLikeStatus);
// POST /api/food/save [protected] - Save/Unsave food item
router.post('/save', authuserMiddleware, foodController.saveFood);
// POST /api/food/comment [protected] - Add comment to food item
router.post('/comment', authuserMiddleware, foodController.addComment);
// GET /api/food/comments/:foodId [public] - Get comments for food item
router.get('/comments/:foodId', foodController.getComments);
// DELETE /api/food/comment/:commentId [protected] - Delete comment
router.delete('/comment/:commentId', authuserMiddleware, foodController.deleteComment);
// GET /api/food/saved [protected] - Get user's saved videos
router.get('/saved', authuserMiddleware, foodController.getSavedVideos);
// GET /api/food/saved-simple [protected] - Get user's saved videos (simple version)
router.get('/saved-simple', authuserMiddleware, async (req, res) => {
    try {
        const saveModel = require('../models/sav.model');
        const user = req.user;
        
        console.log('Simple saved videos for user:', user._id);
        
        // Get basic save records
        const saves = await saveModel.find({ user: user._id });
        console.log('Found saves:', saves.length);
        
        res.json({
            message: 'Simple saved videos fetched',
            count: saves.length,
            data: saves
        });
    } catch (error) {
        console.error('Simple saved videos error:', error);
        res.status(500).json({ message: 'Error: ' + error.message });
    }
});
// GET /api/food/test-auth [protected] - Test user authentication
router.get('/test-auth', authuserMiddleware, (req, res) => {
    res.json({ 
        message: 'User authenticated successfully', 
        user: { 
            id: req.user._id, 
            name: req.user.name, 
            email: req.user.email 
        } 
    });
});

module.exports = router;