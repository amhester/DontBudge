"use strict";

var config = require('./../app.config.json');
var bunyan = require('bunyan');
var YodleeService = require('./../services/yodleeService.js');
<<<<<<< HEAD
var yodleeService = new YodleeService();
=======
>>>>>>> origin/master

module.exports = {};
module.exports.register = function (server) {
    var yodleeService = new YodleeService();
    //example route
    server.get('/', function (req, res, next) {
        console.log('/');

        yodleeService.doSomething('something', function (err, results) {
            if(err) {
                res.send(500, "Error in yodleeService");
            } else {
                //transform results here for response
                res.send(200, results);
            }
        });


    });

    server.get('/cobToken', function(req, res, next) {
        console.log('cobToken');
        res.send(200, yodleeService.getCobSessionToken());
    });

    //other routes can be applied below here following the same pattern as above
};