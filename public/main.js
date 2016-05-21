$(function(){
  //Section variables

  //io html components
  var $chatinput = $('#chat-input');
  var $username = $('#username');
  var $chathistory = $('#chat-history');

  //other variables
  var socket = io();
  var username;

  //Section functions

  //append new message to the chat history
  var appendMessage = function(data){
    var html = "<p>" + data.username + ": " + data.message + "</p>";
    $chathistory.append(html);

    $chathistory.scrollTop($chathistory.prop('scrollHeight'));
  };

  //send a new message
  var sendMessage = function(){
    //If username is not set yet set is with default value and login
    //with new username before sending message
    if(!username){
      setUserName($username.val());
      socket.emit('login', username);
    }

    var message = $chatinput.val();
    var data = {
      message: message,
      username: username + "(You)"
    };

    appendMessage(data);
    socket.emit('message', message);
    $('#chat-input').val('');
  };

  //set username with given value or anonymious
  var setUserName = function(_username){
    username = _username && _username.length > 0 ? _username : 'anonymious';
  };

  //Section event handlers

  //keydown on chat input
  $chatinput.keydown(function(event){
    if(event.which == 13){ //check if it is the enter key
      sendMessage();
    }
  });

  //keydown on username
  $username.keydown(function(event){
    if(event.which == 13){ //check if it is the enter key
      setUserName($username.val());
      socket.emit('login', username);
    }
  });

  //Section socket listeners

  //Listen new messages from server
  socket.on('message', function(data){
    appendMessage(data);
  });
});
