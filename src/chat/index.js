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
      socket.broadcast.emit('deco', socket.nick);
      sockets.remove(function(el) { return el.id === socket.id; });
      socket.broadcast.emit('nbclient', sockets.length);
      logger.info("Now " + sockets.length + " clients connected");
    }
  });
  
  socket.on('nick', function(nick) {
    socket.nick = nick;
    logger.info("NICK " + ip.address + " : " + nick);
    socket.broadcast.emit('nick', nick);
    sockets.push(socket)
    socket.emit('nbclient', sockets.length);
    socket.broadcast.emit('nbclient', sockets.length);
    logger.info("Now " + sockets.length + " clients connected");
  });
  
  socket.on('typing', function() {
    socket.broadcast.emit('notyping', socket.nick);
  });
  
  socket.on('notyping', function() {
    socket.broadcast.emit('notyping', socket.nick);
  });
  
  socket.on('message', function(message) {
    logger.info("MESSAGE " + ip.address + "(" + socket.nick + ")" + " : " + message);
    socket.broadcast.emit('message', message);
  });
  
  socket.emit('connected', 'CONNECTED');
}
