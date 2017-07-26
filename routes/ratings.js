var express = require("express");
var router  = express.Router({mergeParams: true});
var User = require("../models/user");
var Rating = require("../models/rating");
var middleware = require("../middleware");

router.post('/', middleware.isLoggedIn, middleware.checkRatingExists, function(req, res) {
	User.findById(req.params.id, function(err, foundUser) {
		if(err) {
			console.log(err);
		} else if (req.body.rating) {
				Rating.create(req.body.rating, function(err, rating) {
				  if(err) {
				    console.log(err);
				  }
				  rating.author.id = req.user._id;
				  rating.author.username = req.user.username;
				  rating.save();
					foundUser.ratings.push(rating);
					foundUser.save();
					req.flash("success", "Successfully added rating");
					res.redirect('/profiles/' + foundUser._id)
				});
		} else {
				req.flash("error", "Please select a rating");
				res.redirect('back')
		}
		
		// res.redirect('/profiles/' + foundUser._id);
	});
});

module.exports = router;