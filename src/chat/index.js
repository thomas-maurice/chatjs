var log4js = require("log4js");
var logger = log4js.getLogger("chatjs");

module.exports.onConnect = function(socket) {
  var ip = socket.handshake.address;
  logger.info("Websocket connection from " + ip.address);
  
  /* Configure the socket */
  socket.on('disconnect', function() {
    logger.info("Websocket disconnection from " + ip.address);
    if(socket.nick != undefined)
      socket.broadcast.emit('deco', socket.nick);
  });
  
  socket.on('nick', function(nick) {
    socket.nick = nick;
    logger.info("NICK " + ip.address + " : " + nick);
    socket.broadcast.emit('nick', nick);
  });
  
  socket.on('message', function(message) {
    logger.info("MESSAGE " + ip.address + "(" + socket.nick + ")" + " : " + message);
    socket.broadcast.emit('message', message);
  });
  
  socket.emit('connected', 'CONNECTED');
}
