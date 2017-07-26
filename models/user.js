var mongoose = require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username:String,
    password:String,
    profileInfo:{
        name: String,
        contact: String,
        dob: String,
        occupation: String,
        image: String,
        country: String,
        address: String,
        currency: String
    },
       ratings:
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Rating"
      }
    ,
    rating: { type: Number, default: 0 }
    
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);