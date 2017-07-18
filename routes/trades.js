var express = require("express"),
    router = express.Router(),
    Trade = require("../models/trade"),
    middleware = require("../middleware")


router.get("/", function(req,res){
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
    res.render("trades/new");
});
//posting the form information
router.post("/", middleware.isLoggedIn, function(req,res){
    var name= req.body.name;
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
    var newTrade={name: name , author:author, contact:contact, location: location, need: need, offer: offer, offerCurrency:offerCurrency, needCurrency:needCurrency, description: desc };
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

router.get("/:id/checkout",middleware.isLoggedIn, function (req,res){
    Trade.findById(req.params.id, function(err,foundTrade){
            var errMsg = req.flash('error')[0];
            res.render("trades/checkout",{trade:foundTrade, errMsg: errMsg, noError:!errMsg});
        });
});

router.post("/:id/checkout", function(req,res,next){
    Trade.findById(req.params.id, function(err,foundTrade){
        if (err){
            console.log(err)
        }
        var stripe = require("stripe")("sk_test_YZWw0StrSxPe4LFoofvELjbe");
        var token= req.body.stripeToken;
        var charge = stripe.charges.create({
        amount: foundTrade.need * 100,
        currency: foundTrade.needCurrency,
        source: token, // obtained with Stripe.js
        description: "Test Charge"
        },function(err, charge){
            if(err){
            req.flash('error', err.message);
            return res.redirect('/trades/'+foundTrade._id+'/checkout');
            } else{
                Trade.findByIdAndRemove(req.params.id, function(err){
                    if (err){
                        req.flash('error', "Please contact user to remove this request.")
                    } else {
                        req.flash('success', 'Transaction Successful.');
                        res.redirect('/');
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