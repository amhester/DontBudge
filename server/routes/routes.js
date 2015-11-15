"use strict";

var config = require('./../app.config.json');
var bunyan = require('bunyan');
var YodleeService = require('./../services/yodleeService.js');
var yodleeService = new YodleeService();

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
        yodleeService.getCobSessionToken(function(err, result) {
            if (err) {
                res.send(500, "Error getCobSessionToken");
            }
            else {
                res.send(200, result);
            }
        });
    });

    server.get('/userLogin', function(req, res, next) {
        yodleeService.userLogin(config.apis.yodlee.testUser1.username, config.apis.yodlee.testUser1.password, function(err, result) {
            if (err) {
                res.send(500, "Error userLogin");
            }
            else {
                res.send(200, result);
            }
        });

    });

    server.get('/userLogout', function(req, res, next) {
        yodleeService.userLogout(cobToken, userToken, function(err, result) {
            if (err) {
                res.send(500, "Error userLogout.");
            }
            else {
                res.send(200, result);
            }
        });
    });

    server.get('/validUser', function(req, res, next) {
       yodleeService.isValidUser(cobToken, config.apis.yodlee.testUser1.username, function(err, result) {
           if (err) {
               res.send(500, "Error validUser");
           }
           else {
               res.send(200, result);
           }
       });
    });

    server.get('/userResults', function(req, res, next) {
       yodleeService.getUserResults(cobToken, userToken, {
           containerType: req.params.containerType,
           higherFetchLimit: req.params.higherFetchLimit,
           lowerFetchLimit: req.params.lowerFetchLimit,
           resultRange: {
               endNumber: req.params.endNumber,
               startNumber: req.params.endNumber
           },
           searchClients: {
               clientId: req.params.clientId,
               clientName: req.params.clientName
           },
           userInput: req.params.userInput,
           ignoreUserInput: req.params.ignoreUserInput,
           searchFilter: {
               currencyCode: req.params.currencyCode,
               postDateRange: {
                   fromDate: req.params.fromDate,
                   toDate: req.params.toDate
               },
               transactionSplitType: req.params.transactionSplitType,
               itemAccountId: {
                   identifier: req.params.identifier
               }
           }
       });
    });
    //other routes can be applied below here following the same pattern as above
};
