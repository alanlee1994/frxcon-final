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
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);