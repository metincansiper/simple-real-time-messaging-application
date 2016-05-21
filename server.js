var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.port || 3000;

//login the client socket with username
var login = function(socket, username){
  socket.username = username;
  console.log('user ' + socket.username + ' logged in');
};

server.listen(port, function(){
  console.log('server listening on port%d', port);
});

app.use(express.static(__dirname + '/public'));

//listen new client sockets
io.on('connection', function(socket){
  console.log('A new client connected');

  //listen client login action
  socket.on('login', function(username){
    login(socket, username);
  });

  //listen client messages
  socket.on('message', function(message){
    //Emit the message to all other clients
    socket.broadcast.emit('message', {
      username: socket.username,
      message: message
    });
  });
});
