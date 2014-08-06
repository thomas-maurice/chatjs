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
var swig = require("swig");
var bodyparser = require('body-parser')

log4js.configure('conf/log4js.json', {});
var logger = log4js.getLogger("chatjs");
logger.info("Loading chatjs v0.0.1...")

var routes  = require("./routes");

var app = express();

app.engine('html', swig.renderFile);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));
app.use(bodyparser.urlencoded({extended: true}));


app.get('/', routes.index);
app.get('/chat', routes.chat);
app.post('/chat', routes.chat);

app.listen(8080, '0.0.0.0', logger.info("Server up and ready, listens on http://0.0.0.0:8080"));
