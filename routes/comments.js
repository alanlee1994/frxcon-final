var express = require("express"),
    router = express.Router({mergeParams:true}),
    Trade = require("../models/trade"),
    Comment = require("../models/comment"),
    middleware = require("../middleware")

//=============================COMMENT ROUTES=====================================================
router.get("/new", middleware.isLoggedIn, function(req,res){
    Trade.findById(req.params.id, function(err,trade){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {trade:trade});
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req,res){
    Trade.findById(req.params.id , function(err,trade){
        if(err){
            console.log(err);
            res.redirect("/trades")
        } else {
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    req.flash("error","Something Went Wrong!")
                    console.log(err);
                } else {
                    comment.author.id = req.user._id
                    comment.author.username = req.user.username
                    comment.save();
                    trade.comments.push(comment);
                    trade.save();
                    req.flash("success","Successfully created your comment!")
                    res.redirect("/trades/"+trade._id)
                }
            });
        }
    });
});

//=================================EDIT=================================================
router.get("/:comment_id/edit", middleware.checkCommentOwnership,function(req,res){
    Comment.findById(req.params.comment_id, function(err,foundComment){
        if (err) {
            res.redirect("back")
        } else {
            res.render('comments/edit',{trade_id:req.params.id,comment:foundComment})
        }
    });
});

router.put("/:comment_id", middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err,updatedComment){
        if (err){
            res.redirect("back");
        } else {
            res.redirect("/trades/"+ req.params.id);
        }
    })
})
//======================================DELETE!============================================
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success","Comment Successfully Deleted.")
            res.redirect("/trades/"+ req.params.id);
        }
    });
});


module.exports = router;