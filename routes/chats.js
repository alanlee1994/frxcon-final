var express = require("express"),
    router = express.Router({mergeParams:true}),
    server = require("http").createServer(router),
    middleware = require("../middleware"),
    http = require('http').Server(router),
    io = require('socket.io').listen(server);

router.get("/chats",function(req,res){
  res.render("chats/index");
});

io.sockets.on('connection',function(socket){
  socket.on('send message',function (data){
    io.sockets.emit('new message',data);
  });
});

module.exports=router;