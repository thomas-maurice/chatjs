// Client side operation for the chat app
var socket = io.connect('http://0.0.0.0:8080');

socket.on('connected', function(message) {
  $('#connstatus').html('Connected <i style="color:green;" class="fa fa-check"></i>');
  socket.emit('nick', nickname);
  $('#chatconsole').prepend('<p class="text-success"><i class="fa fa-arrow-right"></i> You have joined the chatroom !</p>');
});

socket.on('nick', function(nick) {
  $('#chatconsole').prepend('<p class="text-info"><i class="fa fa-arrow-right"></i> '+nick+" has joined the chatroom !</p>");
});

socket.on('message', function(message) {
  msg = JSON.parse(message);
  $('#chatconsole').prepend('<p><span class="text-warning"><i class="fa fa-user"></i> ' + msg.nick + '</span>  <span class="text-muted"><i class="fa fa-comment"></i> ' + msg.message + '</span></p>');
});

socket.on('deco', function(nick) {
  $('#chatconsole').prepend('<p class="text-info"><i class="fa fa-arrow-left"></i> '+nick+" has left the chatroom !</p>");
});

socket.on('disconnect', function() {
  $('#connstatus').html('Disconnected <i style="color:red;" class="fa fa-times fa-spin"></i>');
  $('#chatconsole').prepend('<p class="text-error"><i class="fa fa-arrow-left"></i> You have been disconnected from the server !</p>');
});

// jQuery stuff
$(document).ready(function() {
  $("#message").keyup(function (e) {
      if (e.keyCode == 13) {
          broadcastMessage();
      }
  });
  
  $("#sendbutton").click(function() {
    broadcastMessage();
  });
  
  function broadcastMessage() {
    if($('#message').val() == "") return;
    
    message = {}
    message.message = $('#message').val();
    message.nick = nickname;
    
    socket.emit("message", JSON.stringify(message));
    $('#chatconsole').prepend('<p><span class="text-warning"><i class="fa fa-user"></i> ' + nickname + '</span>  <span class="text-muted"><i class="fa fa-comment"></i> ' + message.message + '</span></p>');

    $('#message').val("");
  }
});
