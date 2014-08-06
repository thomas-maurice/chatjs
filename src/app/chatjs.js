/*
 * chatjs.js 
 * ---------
 * 
 * Author: svartbergtroll <tmaurice59@gmail.com>
 * Web: https://github.com/svartbergtroll/chatjs
 * 
 * Simple chat app
 */

var express = require("express");
var log4js = require("log4js");

log4js.configure('conf/log4js.json', {});
var logger = log4js.getLogger("chatjs")

var routes  = require("./routes");

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'swig');
app.use(express.static(__dirname + '/public'));


app.get('/', routes.index);

app.listen(8080, logger.info("Server up and ready"));
