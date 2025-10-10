const mongoose = require('mongoose');
const saveSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Food'
    }
}, { timestamps: true });

const saveModel=mongoose.model('Save',saveSchema);  
module.exports=saveModel;