var express = require("express"),
    router = express.Router({mergeParams: true}),
    Trade = require("../models/trade"),
    Comment = require("../models/comment"),
    passport = require("passport"),
    User = require("../models/user"),
    Profile = require("../models/profile"),
    middleware = require("../middleware"),
    bodyParser=require("body-parser")

router.get("/", function (req,res){
    res.render("landing");
});

//==================================AUTH Routes=================================================
//signup page
router.get("/register",function(req,res){
    res.render("register");
})
//sign up logic
router.post("/register", function(req,res){
    var newUser=new User({username:req.body.username})
    User.register(newUser , req.body.password, function(err,user){
        if(err){
            req.flash("error", err.message)
            return res.render("register")
        }
        passport.authenticate("local")(req,res, function(){
            req.flash("Success","Welcome, " + user.username)
            res.redirect("/profiles/"+user._id+"/new");
        });
    });
});
//login
router.get("/login", function(req,res){
    res.render("login");
})
//login logic
router.post("/login", passport.authenticate("local", {
    successRedirect:"/trades",
    failureRedirect:"/login"
}),function(req,res){
})
//logout logic
router.get("/logout", function(req,res){
    req.logout();
    req.flash("success","Logged you out, see you soon!")
    res.redirect("/trades");
})
//==================================Profile========================================================
router.get("/profiles/:username/new", function(req,res){
    res.render("profiles/fill");
});

router.post("/profiles/:id", function(req,res){
    var name =req.body.name,
        contact = req.body.contact,
        dob = req.body.dob,
        occupation = req.body.occupation,
        image = req.body.image,
        country = req.body.country,
        address = req.body.address,
        currency = req.body.currency
    var profileInfo={name: name, contact:contact, dob: dob, 
    occupation: occupation, image: image, country:country, address:address, 
    currency: currency};
    User.findById(req.user._id, function(err,foundUser){
        if (err){
            console.log(err);
        } else{
            foundUser.profileInfo = profileInfo;
            foundUser.save();
            res.redirect("/profiles/"+foundUser.id)    
        }
    });
});

router.get("/profiles/:id",function(req,res){
    User.findById(req.params.id, function(err, foundUser){
        if (err){
            console.log(err)
            req.flash("error","Request not found!")
            res.redirect("back")
        } else {
            res.render("profiles/show", {profile:foundUser});
        }
    });
});

//Edit Profile======================================================================================
router.get("/profiles/:id/edit", function(req,res){
    User.findById(req.params.id, function(err,foundUser){
        if (err) {
            res.redirect("back")
        } else {
            res.render('profiles/edit', {profile:foundUser})
        }
    });
});

router.put("/profiles/:id", function(req,res){
    User.findById(req.params.id, function(err,updatedUser){
        if (err){
            req.flash("error","Edit request cannot be handled")
            res.render("back")
        } else {
            updatedUser.profileInfo = req.body.profile;
            updatedUser.save();
            res.redirect("/profiles/"+req.params.id);
        }
    });
});

module.exports=router;