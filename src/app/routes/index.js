var log4js = require("log4js");
var logger = log4js.getLogger("chatjs");

exports.index = function(req, res) {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  logger.info("GET / from " + ip);
  res.render('index', {pagetitle: "ChatJS"});
}

exports.chat = require("./chat.js").chat;
