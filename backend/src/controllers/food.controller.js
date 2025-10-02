// const foodModel = require('../models/food.model'); // TODO: Create food model

async function createFood(req, res) {
    try {
        console.log('Food Partner:', req.foodPartner);
        console.log(req.body);
        console.log(req.file);
      res.send("food item created")
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports={
    createFood
}