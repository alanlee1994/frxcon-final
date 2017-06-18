var express = require("express"),
    router = express.Router({mergeParams:true}),
    server = require("http").createServer(router),
    middleware = require("../middleware"),
    http = require('http').Server(router),
    io = require('socket.io').listen(server);

router.get("/chats/login",function(req,res){
  res.render("chats/login");
});

router.get("/chats",function(req,res){
  res.render("chats/chat");
});
module.exports=router;