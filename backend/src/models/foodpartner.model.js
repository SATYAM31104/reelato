const mongoose = require('mongoose');
const foodPartnerSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:"foodPartner"
    },
    foodItems:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'foodItems'
    }]
})
const foodPartnerModel=mongoose.model('foodPartner',foodPartnerSchema); 
module.exports=foodPartnerModel;