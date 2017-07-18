var Trade = require("../models/trade"),
    Comment = require("../models/comment"),
    Profile = require("../models/profile"),
    User = require("../models/user");

var middlewareObj={};

middlewareObj.checkProfileOwnership = function(req,res,next){   
    if(req.isAuthenticated()){
        Profile.findById(req.params.id, function(err,foundProfile){
            if (err){
                req.flash("error","Request not found!")
                res.redirect("back")
            } else {
                if (foundProfile.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error","You don't have permission to do that!")
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that")
        res.redirect("back");
    }
}

middlewareObj.checkTradeOwnership = function(req,res,next){   
    if(req.isAuthenticated()){
        Trade.findById(req.params.id, function(err,foundTrade){
            if (err){
                req.flash("error","Request not found!")
                res.redirect("back")
            } else {
                if (foundTrade.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error","You don't have permission to do that!")
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that")
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req,res,next){   
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err,foundComment){
            if (err){
                res.redirect("back")
            } else {
                if (foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error","You don't have permission to do that!")
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error","You need to be logged in to do that!")
        res.redirect("back");
    }
}
middlewareObj.isLoggedIn = function(req,res,next){
    if (req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be logged in to do that")
    res.redirect("/login");
}   

middlewareObj.checkRatingExists = function(req, res, next){
  User.findById(req.params.id).populate("ratings").exec(function(err, foundProfile){
    if(err){
      console.log(err);
    }
    for(var i = 0; i < foundProfile.ratings.length; i++ ) {
      if(foundProfile.ratings[i].author.id.equals(req.user._id)) {
        req.flash("success", "You already rated this!");
        return res.redirect('/trades/' + foundProfile._id);
      }
    }
    next();
  })
}

module.exports = middlewareObj