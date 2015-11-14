"use strict";

/* --------------- Require Stuff ---------------------- */
var config = require('./app.config.json');
var bunyan = require('bunyan');
var restify = require('restify');
var routes = require('./routes/routes.js');

/* --------------- Other Global Initialization -------- */
<<<<<<< HEAD
var log = bunyan.createLogger({name:'com.DontBudge.server.logger'});
=======
var log = bunyan.createLogger({name: 'com.DontBudge.server.logger'});
>>>>>>> origin/master

var server = restify.createServer({
    name: config.name,
    version: config.version
});

/* --------------- listening to server events --------- */
server.on('after', function (req, res, route, error) {

});

/* --------------- Register Server Middleware --------- */
server.use(restify.acceptParser(server.acceptable));
server.use(restify.dateParser());
server.use(restify.queryParser());
server.use(restify.gzipResponse());
server.use(restify.bodyParser());
server.use(restify.CORS());

/* --------------- Register Routes Here --------------- */
routes.register(server);

/* --------------- Start the server listening --------- */
server.listen(config.port, config.host, function () {
    log.info(config.name + ' is now running, listening on ' + server.url);
});