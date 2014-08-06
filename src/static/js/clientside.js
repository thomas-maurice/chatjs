// Client side operation for the chat app
var socket = io.connect(host);

socket.on('connected', function(message) {
  $('#connstatus').html('Connected <i style="color:green;" class="fa fa-check"></i>');
  socket.emit('nick', nickname);
  displayMessage('<span class="text-success"><i class="fa fa-arrow-right"></i> You have joined the chatroom !</span>');
});

socket.on('nick', function(nick) {
  displayMessage('<span class="text-info"><i class="fa fa-arrow-right"></i> '+nick+" has joined the chatroom !</span>");
});

socket.on('message', function(message) {
  msg = JSON.parse(message);
  displayMessage('<span class="text-warning"><i class="fa fa-user"></i> ' + msg.nick + '</span>  <span class="text-muted"><i class="fa fa-comment"></i> ' + msg.message + '</span>');
});

socket.on('deco', function(nick) {
  displayMessage('<span class="text-info"><i class="fa fa-arrow-left"></i> '+nick+" has left the chatroom !</span>");
});

socket.on('disconnect', function() {
  $('#connstatus').html('Disconnected <i style="color:red;" class="fa fa-times fa-spin"></i>');
  displayMessage('<span class="text-error"><i class="fa fa-arrow-left"></i> You have been disconnected from the server !</span>');
});

// Lib stuff
function displayMessage(msg) {
  var id = makeMessageId(20);
  var date = new Date();
  var horo = "["
  if(date.getUTCHours()<10) horo += "0" + date.getUTCHours(); else horo += date.getUTCHours();
  horo += ":";
  if(date.getUTCMinutes()<10) horo += "0" + date.getUTCMinutes(); else horo += date.getUTCMinutes();
  horo += ":";
  if(date.getUTCSeconds()<10) horo += "0" + date.getUTCSeconds(); else horo += date.getUTCSeconds();
  horo += "]";
  
  var message = '<p id="'+id+'"><span>'+horo + "</span> " + msg+'</p>';
  $('#chatconsole').prepend(message);
  setTimeout(function() {
      $('#'+id).fadeOut(3000, function() {$('#'+id).remove();});
    },120000
  );
}

function makeMessageId(idLen) {
    var text = "";
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < idLen; i++ )
        text += chars.charAt(Math.floor(Math.random() * chars.length));

    return text;
}

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
    displayMessage('<span class="text-warning"><i class="fa fa-user"></i> ' + nickname + '</span>  <span class="text-muted"><i class="fa fa-comment"></i> ' + message.message + '</span>');

    $('#message').val("");
  }
});
