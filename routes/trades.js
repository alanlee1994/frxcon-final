var express = require("express"),
    router = express.Router(),
    Trade = require("../models/trade"),
    middleware = require("../middleware"),
    User = require("../models/user")

router.get("/",  middleware.isLoggedIn, function(req,res){
    var noMatch=null;
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Trade.find({offerCurrency:regex}, function(err,alltrades){
            if (err){
                console.log(err);
            } else {
                if(alltrades.length <1 ){
                    noMatch = "Currency that you require is not available.";
                }
                res.render("trades/index",{trades:alltrades,noMatch:noMatch});
            }
        });
    } else {
        Trade.find({}, function(err,alltrades){
            if (err){
                console.log(err);
            } else {
                res.render("trades/index",{trades:alltrades, noMatch:noMatch});
            }
        });
    }
});

//===========================where people post their requests================================
//rendering the form
router.get("/new", middleware.isLoggedIn, function (req,res){
    User.findById(req.user._id,function (err,foundUser){
        if (err) {
            console.log(err);
        } else {
            res.render("trades/new",{user:foundUser});
        }
    })
});
//posting the form information
router.post("/", middleware.isLoggedIn, function(req,res){
    var name= req.body.name;
    var image = req.body.image;
    var contact= req.body.contact;
    var location= req.body.location;
    var needCurrency= req.body.needCurrency;
    var need= req.body.need;
    var offerCurrency= req.body.offerCurrency;
    var offer= req.body.offer;
    var desc= req.body.description;
    var author={
        id: req.user._id,
        username: req.user.username
    };
    var newTrade={name: name , image: image , author:author, contact:contact, location: location, need: need, offer: offer, offerCurrency:offerCurrency, needCurrency:needCurrency, description: desc };
    Trade.create(newTrade,function(err,newlycreated){
        if (err){
            console.log(err);
        } else{
            res.redirect("/trades")    
        }
    });
})

router.get("/:id",function (req,res){
    Trade.findById(req.params.id).populate("comments").exec(function(err, foundTrade){
        if (err){
            console.log(err);
        } else {
            res.render("trades/show", {trade:foundTrade});
        }
    });
});

//edit trade
router.get("/:id/edit",middleware.checkTradeOwnership, function(req,res){
    Trade.findById(req.params.id, function(err,foundTrade){
        res.render("trades/edit",{trade:foundTrade});
    });
});
   

router.put("/:id",middleware.checkTradeOwnership,function(req,res){
    Trade.findByIdAndUpdate(req.params.id, req.body.trade, function(err,updatedTrade){
        if (err){
            res.render("/trades")
        } else {
            res.redirect("/trades/"+req.params.id);
        }
    });
});

//delete trade

router.delete("/:id", middleware.checkTradeOwnership,function(req,res){
    Trade.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/trades");
        } else {
            res.redirect("/trades");
        }
    })
});
// checkingout trades route

router.post("/:id/checkout", function(req,res,next){
    Trade.findById(req.params.id, function(err,foundTrade){
        if (err){
            console.log(err)
        }
        var stripe = require("stripe")("sk_test_YZWw0StrSxPe4LFoofvELjbe");
        var chargeAmount = req.body.chargeAmount;
        var token= req.body.stripeToken;
        var charge = stripe.charges.create({
        amount: foundTrade.need * 100,
        currency: foundTrade.needCurrency,
        source: token, // obtained with Stripe.js
        description: "Test Charge"
        }, function(err, charge){
            if(err){
            console.log(token , charge )
            req.flash('error', err.message);
            return res.redirect('back');
            } else {
                Trade.findByIdAndRemove(req.params.id, function(err){
                    if (err){
                        req.flash('error', "Unable to find Request.")
                    } else {
                        req.flash('success', 'Transaction Successful.');
                        res.redirect('/trades');
                    }
                })
            }
        });
    });
});

// Fuzzy search logic function
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;