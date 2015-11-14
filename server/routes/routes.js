"use strict";

var config = require('./../app.config.json');
var bunyan = require('bunyan');
var YodleeService = require('./../services/yodleeService.js');

module.exports = {};
module.exports.register = function (server) {
    var yodleeService = new YodleeService();
    //example route
    server.get('/', function (req, res, next) {
        yodleeService.doSomething('something', function (err, results) {
            if(err) {
                res.send(500, "Error in yodleeService");
            } else {
                //transform results here for response
                res.send(200, results);
            }
        });
    });

    //other routes can be applied below here following the same pattern as above
};