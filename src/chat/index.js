var log4js = require("log4js");
var sugar = require("sugar");
var logger = log4js.getLogger("chatjs");

var sockets = []

module.exports.onConnect = function(socket) {
  var ip = socket.handshake.address;
  logger.info("Websocket connection from " + ip.address);
  
  /* Configure the socket */
  socket.on('disconnect', function() {
    logger.info("Websocket disconnection from " + ip.address);
    if(socket.nick != undefined) {
      socket.broadcast.emit('deco', {nick: socket.nick, id: socket.id});
      sockets.remove(function(el) { return el.id === socket.id; });
      socket.broadcast.emit('nbclient', sockets.length);
      logger.info("Now " + sockets.length + " clients connected");
    }
    
    
  });
  
  socket.on('nick', function(nick) {
    if(nick == undefined) return;
    if(socket.nick == undefined) {
      // Send the userlist !
      l = [];
      sockets.forEach(function(s) {
        l.push({nick: s.nick, id: s.id});
      });
      socket.emit("userlist", l);
      sockets.push(socket);
    }
    var oldnick = socket.nick
    socket.nick = nick;
    logger.info("NICK " + ip.address + " : " + nick);
    socket.broadcast.emit('nick', {nick: nick, oldnick: oldnick, id: socket.id});
    socket.emit('nbclient', sockets.length);
    socket.broadcast.emit('nbclient', sockets.length);
    logger.info("Now " + sockets.length + " clients connected");
  });
  
  socket.on('typing', function() {
    socket.broadcast.emit('typing', socket.id);
  });
  
  socket.on('notyping', function() {
    socket.broadcast.emit('notyping', socket.id);
  });
  
  socket.on('message', function(message) {
    logger.info("MESSAGE " + ip.address + "(" + socket.nick + ")" + " : " + message);
    var msg = JSON.parse(message);
    msg.id = socket.id;
    message = JSON.stringify(msg)
    socket.broadcast.emit('message', message);
  });
  
  socket.emit('connected', 'CONNECTED');
}
