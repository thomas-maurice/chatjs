// Client side operation for the chat app
var socket = io.connect(host);

var unread_messages = 0

// pick a color !
var colors = [
  "aqua", "black", "blue", "fuchsia", "grey", "lime", "maroon", "navy", "olive",
  "orange", "purple", "red", "silver", "teal", "yellow",
];

randomizeColor();

var smileySubstitutions = [
    // Spinning one !
    [":))", "fa-smile-o fa-spin"],
    [":((", "fa-frown-o fa-spin"],
    
    // Like !
    ["(y)", "fa-thumbs-up text-success"],
    ["(n)", "fa-thumbs-down text-danger"],
    
    // Standard one
    [":)", "fa-smile-o"],
    [":-)", "fa-smile-o"],
    [":]", "fa-smile-o"],
    [":-]", "fa-smile-o"],
    [" :/ ", "fa-meh-o"],
    [":-/", "fa-meh-o"],
    [":-|", "fa-meh-o"],
    [":|", "fa-meh-o"],
    [":(", "fa-frown-o"],
    [":-(", "fa-frown-o"],
    [":[", "fa-frown-o"],
    [":-[", "fa-frown-o"],
    ["&lt;3", "fa-heart text-danger"],
  ]

socket.on('connected', function(message) {
  $('#connstatus').html('Connected <i style="color:green;" class="fa fa-check"></i>');
  socket.emit('nick', nickname);
  $('#userlist').html('');
  displayMessage('<span class="text-success"><i class="fa fa-arrow-right"></i> You have joined the chatroom !</span>');
});

socket.on('typing', function(id) {
  $('#'+id+' .status').html('&nbsp;<i class="fa fa-keyboard-o text-muted" />');
});

socket.on('notyping', function(id) {
  $('#'+id+' .status').html('');
});

socket.on('nick', function(nick) {
  if(!$('#'+nick.id).length)
    displayMessage('<span class="text-info"><i class="fa fa-arrow-right"></i> <strong>'+nick.nick+"</strong> has joined the chatroom !</span>");
  else // He is already registered
    displayMessage('<span class="text-info"><i class="fa fa-user"></i> <strong>'+nick.oldnick+"</strong> is now known as <strong>"+nick.nick+"</strong></span>");
  
  if($('#'+nick.id).length) $('#'+nick.id).remove();
  $('#userlist').append('<li class="list-group-item" id="'+nick.id+'">'+nick.nick+' <span class="status"></span></li>');
  notifyAction();
});

socket.on('userlist', function(l) {
  for(i=0; i < l.length;i++) {
    if($('#'+l[i].id).length) $('#'+l[i].id).remove();
    $('#userlist').append('<li class="list-group-item" id="'+l[i].id+'">'+l[i].nick+' <span class="status"></span></li>');
  }
});

socket.on('nbclient', function(nb) {
  if(nb != 1)
    $('#nbusers').html("<p>" + nb + " users connected.</p>");
  else
    $('#nbusers').html("<p>" + nb + " user connected (you !).</p>");
});

socket.on('message', function(message) {
  msg = JSON.parse(message);
  displayMessage(formatMessage(msg));
  notifyAction();
});

socket.on('deco', function(nick) {
  displayMessage('<span class="text-info"><i class="fa fa-arrow-left"></i> <strong>'+nick.nick+"</strong> has left the chatroom !</span>");
  $('#'+nick.id).remove();
});

socket.on('disconnect', function() {
  $('#connstatus').html('Disconnected <i style="color:red;" class="fa fa-times fa-spin"></i>');
  $('#nbusers').html('<p>Currently disconnected from the server.</p>');
  displayMessage('<span class="text-danger"><i class="fa fa-arrow-left"></i> You have been disconnected from the server !</span>');
});

// Lib stuff
function displayMessage(msg) {
  var id = makeMessageId(20);
  var date = new Date();
  var horo = "[" + Date.create().format('{24hr}:{mm}:{ss}') + "]";
  
  var message = '<div id="'+id+'"><span>'+horo + "</span> " + msg+'</div>';
  $('#chatconsole').prepend(message);
  setTimeout(function() {
      if(ninjaMode) {
        $('#'+id).fadeOut(3000, function() {$('#'+id).remove();});
      }
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

function notifyAction() {
  if(!document.hasFocus()) {
    unread_messages += 1;
    $('#title').html("("+unread_messages+") Chatjs");
  }
}

function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(string, find, replace) {
  return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function formatMessage(msg) {
  var htmlmessage = markdown.toHTML(msg.message).remove("<p>").remove("</p>");
  // And now smileytize it :)
  for(i=0;i<smileySubstitutions.length;i++)
    htmlmessage = replaceAll(htmlmessage, smileySubstitutions[i][0], '<i class="fa '+smileySubstitutions[i][1]+' fa-lg" />');
    //htmlmessage = htmlmessage.replace(smileySubstitutions[i][0], '<i class="fa '+smileySubstitutions[i][1]+' fa-lg" />');

  htmlmessage = htmlmessage.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
  return '<font color="'+msg.color+'"><i class="fa fa-comment"></i> <strong>' + msg.nick.escapeHTML() + '</strong></font></span><span class="text-muted"> : ' + htmlmessage + '</span>';
}

function randomizeColor() {
  color = colors[Math.floor(Math.random() * colors.length)];
  displayMessage('<span class="text-info"><i class="fa fa-info-circle" /> Your new color is <font color="'+color+'"><strong>'+color+'</strong></font></span>');
}

// jQuery stuff
$(document).ready(function() {
  // Keypress !
  var listener = new window.keypress.Listener();
  listener.simple_combo("alt c", function() {
    randomizeColor();
  });
  
  $('html').mouseenter(function() {
    unread_messages = 0;
    $("#title").html("Chatjs");
  });
  
  $("#message").keyup(function (e) {
      if (e.keyCode == 13) {
          broadcastMessage();
      }
      if($('#message').val() != "" && $('#message').val().length == 1) // Send it only once
        socket.emit("typing");
      else if($('#message').val() == "")
        socket.emit("notyping");
  });
  
  $("#nickname").keyup(function (e) {
      if (e.keyCode == 13) {
          if($("#nickname").val() == "")
            $("#nickname").val(nickname);
          else {
            nickname = $("#nickname").val();
            socket.emit("nick", nickname);
            displayMessage('<span class="text-info"><i class="fa fa-user" /> You are now known as <strong>'+nickname+'</strong></span>');
            $('#message').focus();
          }
      }
  });
  
  $("#sendbutton").click(function() {
    broadcastMessage();
  });
  
  $("#randcolorbutton").click(function() {
    randomizeColor();
  });
  
  $("#clearbutton").click(function() {
    $('#chatconsole').html("");
  });
  
  $("#ninjamode").click(function() {
    if(ninjaMode) {
      ninjaMode = false;
      $("#ninjamode").html("Switch to ninja mode")
    } else {
      ninjaMode = true;
      $("#ninjamode").html("Switch to normal mode")
    }
  });
  
  function broadcastMessage() {
    if($('#message').val() == "") return;
    
    message = {}
    message.message = $('#message').val();
    message.nick = nickname;
    message.color = color;
    
    socket.emit("message", JSON.stringify(message));
    
	  displayMessage(formatMessage(message));
    
    $('#message').val("");
    socket.emit("notyping");
  }
});
