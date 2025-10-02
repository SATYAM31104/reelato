const model=require('mongoose');

const foodSchema=new mongoose.Schema({
    name:{
        type : String,
        required : true
    },
    video:{
        type : String,
        required : true
    },
    description:{
        type : String,
        required : true
    }
    ,
    foodPartner:{
        type: mongoose.objectId,
        ref: 'foodPartner', 
    }
    
})
const foodModel=mongoose.model('food',foodSchema);
module.exports=foodModel;