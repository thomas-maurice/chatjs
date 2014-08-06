var log4js = require("log4js");
var logger = log4js.getLogger("chatjs");

exports.chat = function(req, res) {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var nick = req.body.nickname;
  if(req.method != "POST" || nick == undefined) {
    logger.info("GET /chat from " + ip + " 304 /");
    res.redirect('/');
    return;
  }
  logger.info("POST /chat from " + ip + " using nickname " + nick);
  res.render('chat', {pagetitle: "ChatJS - Chat", nick: nick});
};
