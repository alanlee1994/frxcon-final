var mongoose = require("mongoose")

var profileSchema = new mongoose.Schema({
    name: String,
    contact: String,
    dob: String,
    occupation: String,
    image: String,
    country: String,
    address: String,
    currency: String,
    author:{
        id:{ 
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username: String
    },
    comments:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    }],
    trades:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Trade"
    }],
});
module.exports = mongoose.model("Profile", profileSchema);