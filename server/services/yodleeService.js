"use strict";

var config = require('./../app.config.json');
var bunyan = require('bunyan');
var request = require('request');

class YodleeService {
    constructor () {

    }

    doSomething (something, callback) {
        request('some-http-route-here' + something, function (err, res, body) {
            callback(err, res, body);
        });
    }
}

module.exports = YodleeService;