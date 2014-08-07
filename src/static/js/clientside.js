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
  
  var message = '<div id="'+id+'"><span>'+horo + "</span> " + msg+'</div>';
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
  
  var smileySubstitutions = [
    [":)", "fa-smiley-o"],
    [":-)", "fa-smiley-o"],
    [":]", "fa-smiley-o"],
    [":-]", "fa-smiley-o"],
    [":/", "fa-meh-o"],
    [":-/", "fa-meh-o"],
    [":(", "fa-frown-o"],
    [":-(", "fa-frown-o"],
    [":[", "fa-frown-o"],
    [":-[", "fa-frown-o"],
  ]
  
  $("#message").keyup(function (e) {
      if (e.keyCode == 13) {
          broadcastMessage();
      }
      if($('#message').val() != "")
		socket.emit("typing");
	  else
	    socket.emit("notyping");
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
    var htmlmessage = markdown.toHTML(message.message).remove("<p>").remove("</p>");
    // And now smileytize it :)
    for(i=0;i<smileySubstitutions.length;i++)
      htmlmessage = htmlmessage.replace(smileySubstitutions[i][0], '<i class="fa '+smileySubstitutions[i][1]+' fa-lg" />');
      
    var fullmessage = '<span class="text-warning"><i class="fa fa-user"></i> ' + nickname.escapeHTML() + '</span>  <span class="text-muted"><i class="fa fa-comment"></i> ' + htmlmessage + '</span>';
	  displayMessage(fullmessage);
    $('#message').val("");
    socket.emit("notyping");
  }
});
