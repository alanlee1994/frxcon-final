var Trade = require("../models/trade"),
    Comment = require("../models/comment"),
    Profile = require("../models/profile")

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

module.exports = middlewareObj