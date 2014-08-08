/**
 * clientside.js 
 * ---------
 * 
 * Author: svartbergtroll <tmaurice59@gmail.com>
 * Web: https://github.com/svartbergtroll/chatjs
 * 
 * Simple chat app - client side app.
 */

/** Socket which is connected to the server */ 
var socket = io.connect(host);
/** How many unread messages we have */
var unread_messages = 0

/** Available color list */
var colors = [
  "aqua", "black", "blue", "fuchsia", "grey", "lime", "maroon", "navy", "olive",
  "orange", "purple", "red", "silver", "teal", "yellow",
];

/**
 * \brief Smiley substitution
 * These will be used to substitute smileys. To add
 * some just add an array to the array with the format :
 * ['pattern', 'replacement'],
 */
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
    [":-/", "fa-meh-o"],
    [":-|", "fa-meh-o"],
    [":|", "fa-meh-o"],
    [":(", "fa-frown-o"],
    [":-(", "fa-frown-o"],
    [":[", "fa-frown-o"],
    [":-[", "fa-frown-o"],
    ["&lt;3", "fa-heart text-danger"],
  ]

/*
 *   ___ ___                    .___.__                       
 *  /   |   \_____    ____    __| _/|  |   ___________  ______
 * /    ~    \__  \  /    \  / __ | |  | _/ __ \_  __ \/  ___/
 * \    Y    // __ \|   |  \/ /_/ | |  |_\  ___/|  | \/\___ \ 
 *  \ __|_  /(____  /___|  /\____ | |____/\___  >__|  /____  >
 *        \/      \/     \/      \/           \/           \/
 */

/**
 * This handler is called upon connection
 */
var socketOnConnected = socket.on('connected', function(message) {
  $('#connstatus').html('Connected <i style="color:green;" class="fa fa-check"></i>');
  socket.emit('nick', nickname); // We announce our nickname
  $('#userlist').html(''); // Empty the userlist (used upon reconnection)
  displayMessage('<span class="text-success">\
  <i class="fa fa-arrow-right"></i> You have joined the chatroom !</span>');
});

/**
 * Called upon typing. We make the designated user type
 */
var socketOnTyping = socket.on('typing', function(id) {
  $('#'+id+' .status').html('&nbsp;<i class="fa fa-keyboard-o text-muted" />');
});

/**
 * Called upon no typing signal, we remove the icon
 */
var socketOnNoTyping = socket.on('notyping', function(id) {
  $('#'+id+' .status').html('');
});

/**
 * Called upon nick change. We have to actualize the existing nick
 * field, or create a new one.
 */
var socketOnNick = socket.on('nick', function(nick) {
  if(!$('#'+nick.id).length)
    displayMessage('<span class="text-info"><i class="fa fa-arrow-right"></i> <strong>'+nick.nick+"</strong> has joined the chatroom !</span>");
  else // He is already registered
    displayMessage('<span class="text-info"><i class="fa fa-user"></i> <strong>'+nick.oldnick+"</strong> is now known as <strong>"+nick.nick+"</strong></span>");
  // Actualize or create a new one
  if($('#'+nick.id).length) $('#'+nick.id + " .nick").html('&nbsp;'+nick.nick);
  else $('#userlist').append('<li class="list-group-item" id="'+nick.id+'"><span class="nick hint--right hint--rounded">&nbsp;'+nick.nick+'</span>&nbsp;<span class="status"></span></li>');
  notifyAction();
});

/**
 * Called upon the receiving of the userlist. This happen when we
 * join the chatroom we so have to create the user items.
 */
var socketOnUserlist = socket.on('userlist', function(l) {
  for(i=0; i < l.length;i++) {
    if($('#'+l[i].id).length) $('#'+l[i].id).remove();
    $('#userlist').append('<li class="list-group-item" id="'+l[i].id+'"><span class="nick hint--right hint--rounded">'+l[i].nick+'</span>&nbsp;<span class="status"></span></li>');
  }
});

/**
 * Canned upon a client number actualization.
 */
var socketOnNbclient = socket.on('nbclient', function(nb) {
  if(nb != 1)
    $('#nbusers').html("<p>" + nb + " users connected.</p>");
  else
    $('#nbusers').html("<p>" + nb + " user connected (you !).</p>");
});

/**
 * Called when we recieve a message
 */
var socketOnMessage = socket.on('message', function(message) {
  msg = JSON.parse(message);
  displayMessage(formatMessage(msg));
  notifyAction();
});

/**
 * Called when we recieve a status signal.
 * 
 * When the status is empty we clear it, othrwise display it
 */
var socketOnStatus = socket.on('status', function(message) {
  msg = JSON.parse(message);
  displayMessage(formatStatus(msg));
  notifyAction();
  if(msg.message == "") {
    $('#'+msg.id + " .nick").removeAttr('data-hint');
  } else {
    $('#'+msg.id + " .nick").attr('data-hint', msg.message);
  }
});

/**
 * Called when a user disconnects. We remove it from the userlist
 */
var socketOnDeco = socket.on('deco', function(nick) {
  displayMessage('<span class="text-info"><i class="fa fa-arrow-left"></i> <strong>'+nick.nick+"</strong> has left the chatroom !</span>");
  $('#'+nick.id).remove();
});

/**
 * Called when you are disconnected from the server. By default the socket
 * will try to reconnect.
 */
var socketOnDisconnect = socket.on('disconnect', function() {
  $('#connstatus').html('Disconnected <i style="color:red;" class="fa fa-times fa-spin"></i>');
  $('#nbusers').html('<p>Currently disconnected from the server.</p>');
  displayMessage('<span class="text-danger"><i class="fa fa-arrow-left"></i> You have been disconnected from the server !</span>');
});

/*
 *    _____  .__                          .____    ._____.    
 *   /     \ |__| ______ ____             |    |   |__\_ |__  
 *  /  \ /  \|  |/  ___// ___\    ______  |    |   |  || __ \ 
 * /    Y    \  |\___ \\  \___   /_____/  |    |___|  || \_\ \
 * \____|__  /__/____  >\___  >           |_______ \__||___  /
 *         \/        \/     \/                    \/       \/
 */
 
/**
 * Displays a message.
 */
function displayMessage(msg) {
  var id = makeMessageId(30);
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

/**
 * Generates a random ID. Used to destroy the messages after some time.
 */
function makeMessageId(idLen) {
    var text = "";
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < idLen; i++ )
        text += chars.charAt(Math.floor(Math.random() * chars.length));

    return text;
}

/**
 * Notify an action happened by appending a number to
 * the title of the window.
 */
function notifyAction() {
  if(!document.hasFocus()) {
    unread_messages += 1;
    $('#title').html("("+unread_messages+") Chatjs");
  }
}

/**
 * Escapes a regular expression
 */
function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

/**
 * Replaces all the occurence of a string in a string
 */
function replaceAll(string, find, replace) {
  return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

/**
 * Formats a message to HTML and returns it
 */
function formatMessage(msg) {
  var htmlmessage = markdown.toHTML(msg.message).remove("<p>").remove("</p>");
  // And now smileytize it :)
  for(i=0;i<smileySubstitutions.length;i++)
    htmlmessage = replaceAll(htmlmessage, smileySubstitutions[i][0],
    '<i class="fa '+smileySubstitutions[i][1]+' fa-lg" />');

  htmlmessage = htmlmessage.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
  return '<font color="'+msg.color.escapeHTML()+'"><i class="fa fa-comment"></i> <strong>'
    + msg.nick + '</strong></font></span><span class="text-muted"> : ' + htmlmessage + '</span>';
}

/**
 * Formats a status and returns it
 */
function formatStatus(msg) {
  var htmlmessage = markdown.toHTML(msg.message).remove("<p>").remove("</p>");
  // And now smileytize it :)
  for(i=0;i<smileySubstitutions.length;i++)
    htmlmessage = replaceAll(htmlmessage, smileySubstitutions[i][0],
    '<i class="fa '+smileySubstitutions[i][1]+' fa-lg" />');

  htmlmessage = htmlmessage.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
  return '<font color="'+msg.color.escapeHTML()+'"><i class="fa fa-asterisk"></i> <strong>' +
    msg.nick + '</strong></font></span><span class="text-muted"> ' +
    htmlmessage + '</span>';
}

/**
 * Change the user's color by a random one
 */
function randomizeColor() {
  color = colors[Math.floor(Math.random() * colors.length)];
  displayMessage('<span class="text-info"><i class="fa fa-info-circle" />\
    Your new color is <font color="'+color+'"><strong>'+color+'</strong></font></span>');
}

/**
 * Toggles wether the ninja mode is activated or not
 * and displays it in the chat window
 */
function toggleNinjaMode() {
  if(ninjaMode) {
    ninjaMode = false;
    $("#ninjamode").html("Switch to ninja mode")
    displayMessage('<span class="text-info">\
     <i class="fa fa-info-circle" /> You <strong>disabled</strong> ninja mode</span>');
  } else {
    ninjaMode = true;
    $("#ninjamode").html("Switch to normal mode");
    displayMessage('<span class="text-info"><i class="fa fa-info-circle" />\
     You <strong>enabled</strong> ninja mode</span>');
  }
}

/**
 * Adjusts the height of the central part of the app
 */
function adjustHeight() {
  var height = $(window).height()-20-$('#toppart').height()-2*$('#footer').height() + "px";
  $('.centerpart').css("max-height", height);
  $('.centerpart').css("height", height);
}

/**
 * Get the input of the entry box, parse it
 * if it is a command we execute a command otherwise
 * we treat it as a message and we broadcast it to the other people !
 */
function broadcastMessage() {
  if($('#message').val() == "") return;
  
  var msg = $('#message').val();
  
  if(msg.match(/^\/me[ ]?.*/gim)) {
    var status = /^\/me (.*)/gim.exec(msg);
    if(status == null) {
      var stat = {};
      stat.message = "";
      stat.nick = nickname;
      stat.color = color;
      socket.emit("status", JSON.stringify(stat));
      $('#mystatus').html('');
    } else {
      status=status[1];
      var stat = {};
      stat.message = status;
      stat.nick = nickname;
      stat.color = color;
      socket.emit("status", JSON.stringify(stat));
      displayMessage(formatStatus(stat));
      $('#mystatus').html("<em>"+status+"</em>")
    }
  } else  { // This is a standard message !
    var message = {};
    message.message = msg;
    message.nick = nickname;
    message.color = color;
    
    socket.emit("message", JSON.stringify(message));
     
    displayMessage(formatMessage(message));
  }
  
  $('#message').val("");
  socket.emit("notyping");
}

/*
 *      __________                                         __          _____  _____ 
 *     |__\_____  \  __ __   ___________ ___.__.   _______/  |_ __ ___/ ____\/ ____\
 *     |  |/  / \  \|  |  \_/ __ \_  __ <   |  |  /  ___/\   __\  |  \   __\\   __\ 
 *     |  /   \_/.  \  |  /\  ___/|  | \/\___  |  \___ \  |  | |  |  /|  |   |  |   
 * /\__|  \_____\ \_/____/  \___  >__|   / ____| /____  > |__| |____/ |__|   |__|   
 * \______|      \__>           \/       \/           \/                          
 */
/**
 * Called asap when the doc is ready !
 */
$(document).ready(function() {
  // Resize elements
  adjustHeight();
  $(window).resize(function() {
    adjustHeight();
  });
  
  // Set the nickname and get a random color
  $('#mynick').html(nickname);
  randomizeColor();
  
  // Keypress listeners
  var listener = new window.keypress.Listener();
  listener.simple_combo("alt c", function() {
    randomizeColor();
  });
  listener.simple_combo("alt n", function() {
    toggleNinjaMode();
  });
  listener.simple_combo("alt r", function() {
    $('#chatconsole').html('')
  });
  
  // Resets the unread messages when we look at the page
  $('html').mouseenter(function() {
    unread_messages = 0;
    $("#title").html("Chatjs");
  });
  
  // This is used to catch the <entry> hit on the entrybox
  $("#message").keyup(function (e) {
      if (e.keyCode == 13) {
          broadcastMessage();
      }
      if($('#message').val() != "" && $('#message').val().length == 1) // Send it only once
        socket.emit("typing");
      else if($('#message').val() == "")
        socket.emit("notyping");
  });
  
  // Catch the <enter> signal in the nickname field
  $("#nickname").keyup(function (e) {
      if (e.keyCode == 13) {
          if($("#nickname").val() == "")
            $("#nickname").val(nickname);
          else {
            nickname = $("#nickname").val().escapeHTML();
            $('#mynick').html(nickname);
            socket.emit("nick", nickname);
            displayMessage('<span class="text-info"><i class="fa fa-user" /> You are now known as <strong>'+nickname+'</strong></span>');
            $('#message').focus();
          }
      }
  });
  
  // Click on the send button
  $("#sendbutton").click(function() {
    broadcastMessage();
  });
  
  // Click on the randomize button
  $("#randcolorbutton").click(function() {
    randomizeColor();
  });
  
  // Click on the click button
  $("#clearbutton").click(function() {
    $('#chatconsole').html("");
  });
  
  // Click on the ninja mode toggle
  $("#ninjamode").click(function() {
    toggleNinjaMode();
  });
});
