var mongoose = require("mongoose")

var tradeSchema = new mongoose.Schema({
    name: String,
    contact: String,
    location: String,
    needCurrency: String,
    need: Number,
    offerCurrency:String,
    offer: Number,
    description: String,
    author: {
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    },
    comments:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    }]
});
module.exports = mongoose.model("trade",tradeSchema);