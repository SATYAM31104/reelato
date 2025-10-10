const foodModel = require('../models/food.model');
const storageService = require('../services/storage.service');
const { v4: uuid } = require("uuid");
const likeModel = require('../models/likes.model');
const saveModel = require('../models/sav.model');
const commentModel = require('../models/comment.model');
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
        const foodItems = await foodModel.find().populate('foodPartner', 'restaurantName ownerName email phone address');
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

// Get food items by specific partner (public endpoint)
async function getFoodItemsByPartner(req, res) {
    try {
        const { partnerId } = req.params;
        console.log('Fetching food items for partner ID:', partnerId);

        const foodItems = await foodModel.find({ foodPartner: partnerId }).populate('foodPartner', 'restaurantName ownerName email phone address');
        console.log('Found food items:', foodItems.length);

        res.status(200).json({
            message: "Food items fetched successfully",
            count: foodItems.length,
            data: foodItems,
            partner: foodItems.length > 0 ? foodItems[0].foodPartner : null
        });
    } catch (error) {
        console.error('Get food items by partner error:', error);
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

// Get food partner info (public endpoint)
async function getFoodPartnerInfo(req, res) {
    try {
        const { partnerId } = req.params;
        console.log('Fetching partner info for ID:', partnerId);

        const foodPartnerModel = require('../models/foodpartner.model');
        const partner = await foodPartnerModel.findById(partnerId).select('restaurantName ownerName email phone address');

        if (!partner) {
            return res.status(404).json({ message: "Food partner not found" });
        }

        console.log('Found partner:', partner);
        res.status(200).json({
            message: "Food partner info fetched successfully",
            data: partner
        });
    } catch (error) {
        console.error('Get food partner info error:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

async function likeFood(req, res) {
    try {
        const { foodId } = req.body;
        const user = req.user;

        // Validate foodId
        if (!foodId) {
            return res.status(400).json({ message: "Food ID is required" });
        }

        // Check if food item exists
        const foodItem = await foodModel.findById(foodId);
        if (!foodItem) {
            return res.status(404).json({ message: "Food item not found" });
        }

        // Check if user already liked this food
        const isAlreadyLiked = await likeModel.findOne({
            user: user._id,
            food: foodId
        });

        if (isAlreadyLiked) {
            // Unlike: Remove like and decrease count
            await likeModel.deleteOne({
                user: user._id,
                food: foodId
            });

            await foodModel.findByIdAndUpdate(foodId, {
                $inc: { likeCount: -1 }
            });

            return res.status(200).json({
                message: "Food unliked successfully",
                liked: false
            });
        } else {
            // Like: Create like and increase count
            const like = await likeModel.create({
                user: user._id,
                food: foodId
            });

            await foodModel.findByIdAndUpdate(foodId, {
                $inc: { likeCount: 1 }
            });

            return res.status(201).json({
                message: "Food liked successfully",
                liked: true,
                like: like
            });
        }
    } catch (error) {
        console.error('Like food error:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

// Get like status for a food item by user
async function getLikeStatus(req, res) {
    try {
        const { foodId } = req.params;
        const user = req.user;

        if (!foodId) {
            return res.status(400).json({ message: "Food ID is required" });
        }

        const like = await likeModel.findOne({
            user: user._id,
            food: foodId
        });

        const foodItem = await foodModel.findById(foodId).select('likeCount');

        res.status(200).json({
            message: "Like status fetched successfully",
            liked: !!like,
            likeCount: foodItem ? foodItem.likeCount : 0
        });
    } catch (error) {
        console.error('Get like status error:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
async function saveFood(req, res) {
    try {
        const { foodId } = req.body;
        const user = req.user;

        // Validate foodId
        if (!foodId) {
            return res.status(400).json({ message: "Food ID is required" });
        }

        // Check if food item exists
        const foodItem = await foodModel.findById(foodId);
        if (!foodItem) {
            return res.status(404).json({ message: "Food item not found" });
        }

        // Check if user already saved this food
        const isAlreadySaved = await saveModel.findOne({
            user: user._id,
            food: foodId
        });

        if (isAlreadySaved) {
            // Unsave: Remove save and decrease count
            await saveModel.deleteOne({
                user: user._id,
                food: foodId
            });

            await foodModel.findByIdAndUpdate(foodId, {
                $inc: { saveCount: -1 }
            });

            return res.status(200).json({
                message: "Food unsaved successfully",
                saved: false
            });
        } else {
            // Save: Create save and increase count
            const save = await saveModel.create({
                user: user._id,
                food: foodId
            });

            await foodModel.findByIdAndUpdate(foodId, {
                $inc: { saveCount: 1 }
            });

            return res.status(201).json({
                message: "Food saved successfully",
                saved: true,
                save: save
            });
        }
    } catch (error) {
        console.error('Save food error:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

// Add comment to food item
async function addComment(req, res) {
    try {
        const { foodId, text } = req.body;
        const user = req.user;

        // Validate input
        if (!foodId || !text) {
            return res.status(400).json({ message: "Food ID and comment text are required" });
        }

        if (text.trim().length === 0) {
            return res.status(400).json({ message: "Comment cannot be empty" });
        }

        if (text.length > 500) {
            return res.status(400).json({ message: "Comment cannot exceed 500 characters" });
        }

        // Check if food item exists
        const foodItem = await foodModel.findById(foodId);
        if (!foodItem) {
            return res.status(404).json({ message: "Food item not found" });
        }

        // Create comment
        const comment = await commentModel.create({
            user: user._id,
            food: foodId,
            text: text.trim()
        });

        // Populate user info for response
        await comment.populate('user', 'name email');

        // Update comment count
        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { commentCount: 1 }
        });

        res.status(201).json({
            message: "Comment added successfully",
            comment: comment
        });
    } catch (error) {
        console.error('Add comment error:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

// Get comments for a food item
async function getComments(req, res) {
    try {
        const { foodId } = req.params;
        const { page = 1, limit = 20 } = req.query;

        if (!foodId) {
            return res.status(400).json({ message: "Food ID is required" });
        }

        // Check if food item exists
        const foodItem = await foodModel.findById(foodId);
        if (!foodItem) {
            return res.status(404).json({ message: "Food item not found" });
        }

        // Get comments with pagination
        const comments = await commentModel
            .find({ food: foodId })
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const totalComments = await commentModel.countDocuments({ food: foodId });

        res.status(200).json({
            message: "Comments fetched successfully",
            comments: comments,
            totalComments: totalComments,
            currentPage: page,
            totalPages: Math.ceil(totalComments / limit)
        });
    } catch (error) {
        console.error('Get comments error:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

// Delete comment (only by comment owner)
async function deleteComment(req, res) {
    try {
        const { commentId } = req.params;
        const user = req.user;

        if (!commentId) {
            return res.status(400).json({ message: "Comment ID is required" });
        }

        // Find comment
        const comment = await commentModel.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Check if user owns the comment
        if (comment.user.toString() !== user._id.toString()) {
            return res.status(403).json({ message: "You can only delete your own comments" });
        }

        // Delete comment
        await commentModel.findByIdAndDelete(commentId);

        // Update comment count
        await foodModel.findByIdAndUpdate(comment.food, {
            $inc: { commentCount: -1 }
        });

        res.status(200).json({
            message: "Comment deleted successfully"
        });
    } catch (error) {
        console.error('Delete comment error:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

// Get saved videos for user
async function getSavedVideos(req, res) {
    try {
        const user = req.user;
        console.log('Getting saved videos for user:', user._id);

        // Get basic save records first
        const userSaves = await saveModel.find({ user: user._id }).sort({ createdAt: -1 });
        console.log('Found user saves:', userSaves.length);

        if (userSaves.length === 0) {
            return res.status(200).json({
                message: "No saved videos found",
                count: 0,
                data: []
            });
        }

        // Get food items for each save
        const savedVideos = [];
        for (const save of userSaves) {
            try {
                const foodItem = await foodModel.findById(save.food);
                if (foodItem) {
                    // Get food partner info
                    let partnerInfo = null;
                    if (foodItem.foodPartner) {
                        try {
                            const foodPartnerModel = require('../models/foodpartner.model');
                            partnerInfo = await foodPartnerModel.findById(foodItem.foodPartner).select('restaurantName ownerName');
                        } catch (partnerError) {
                            console.error('Error fetching partner info:', partnerError);
                        }
                    }

                    // Transform data for frontend
                    const videoData = {
                        id: foodItem._id,
                        videoUrl: foodItem.video,
                        description: foodItem.description,
                        restaurantName: partnerInfo?.restaurantName || 'Unknown Restaurant',
                        restaurantId: partnerInfo?._id || foodItem.foodPartner,
                        foodName: foodItem.name,
                        createdAt: foodItem.createdAt,
                        likeCount: foodItem.likeCount || 0,
                        commentCount: foodItem.commentCount || 0,
                        saveCount: foodItem.saveCount || 0,
                        savedAt: save.createdAt
                    };

                    savedVideos.push(videoData);
                    console.log('Added saved video:', foodItem.name);
                }
            } catch (itemError) {
                console.error('Error processing saved item:', itemError);
                // Continue with other items
            }
        }

        console.log('Returning saved videos:', savedVideos.length);

        res.status(200).json({
            message: "Saved videos fetched successfully",
            count: savedVideos.length,
            data: savedVideos
        });
    } catch (error) {
        console.error('Get saved videos error:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports = {
    createFood,
    getAllFoodItems,
    getFoodItems,
    getFoodItemsByPartner,
    getFoodPartnerInfo,
    likeFood,
    getLikeStatus,
    saveFood,
    addComment,
    getComments,
    deleteComment,
    getSavedVideos
}