var express = require("express"),
    app=express(),
    bodyParser=require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    methodOverride = require("method-override"),
    passport = require("passport"),
    LocalStrategy = require("passport-local");
    
    
var Trade = require("./models/trade"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    chatServer = require('./servers/server.js')
    
//=================Routing!!========================================================================
var commentRoutes = require("./routes/comments"),
    tradeRoutes = require("./routes/trades"),
    indexRoutes = require("./routes/index"),
    ChatRoutes = require("./routes/chats")
    // ratingRoutes = require("./routes/ratings")
//=====================================Setup and initialization======================================
// mongoose.connect("mongodb://localhost/frxcon");
mongoose.connect("mongodb://frxcon:pokiki123@ds129023.mlab.com:29023/frxcon");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());
chatServer(app);

//====================Passport configuration ======================================================

app.use(require("express-session")({
    secret:"orbital, why no apollo 11?",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// //this will be the middleware for all route!!!============

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});

//using routed js file
app.use(indexRoutes);
app.use("/trades/:id/comments",commentRoutes);
app.use("/trades",tradeRoutes);
app.use(ChatRoutes);
// app.use("/profile/:id", ratingRoutes);
//==========================app.listen!==========================================================
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("frxcon is now running...");
});