const mongoose = require('mongoose');
const foodPartnerSchema = new mongoose.Schema({
    restaurantName: {
        type: String,
        required: true
    },
    ownerName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "foodPartner"
    },
    foodItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'foodItems'
    }]
}, {
    timestamps: true
})
const foodPartnerModel=mongoose.model('foodPartner',foodPartnerSchema); 
module.exports=foodPartnerModel;