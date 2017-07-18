var mongoose = require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose")

var ProfileSchema = new mongoose.Schema({
    name: String,
        contact: String,
        dob: String,
        occupation: String,
        image: String,
        country: String,
        address: String,
        currency: String
});

module.exports = mongoose.model("Profile", ProfileSchema);