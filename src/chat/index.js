var log4js = require("log4js");
var logger = log4js.getLogger("chatjs");

module.exports.onConnect = function(socket) {
  var ip = socket.handshake.address;
  logger.info("Websocket connection from " + ip.address);
}
