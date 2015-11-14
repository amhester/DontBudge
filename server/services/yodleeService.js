"use strict";

var config = require('./../app.config.json');
var bunyan = require('bunyan');
var request = require('request');

var log = bunyan.createLogger({name:'YodleeService'});

class YodleeService {
    constructor () {

    }

    doSomething (something, callback) {
        request('some-http-route-here' + something, function (err, res, body) {
            callback(err, res, body);
        });
    }


    getCobSessionToken() {
        var stringBuilder = [];
        stringBuilder.push(config.apis.yodlee.url);
        stringBuilder.push('/authenticate/coblogin?cobrandLogin=');
        stringBuilder.push(config.apis.yodlee.credentials.username);
        stringBuilder.push('&cobrandPassword=');
        stringBuilder.push(config.apis.yodlee.credentials.password);
        var reqUrl = stringBuilder.join('');

        log.info('Request looks like',reqUrl);
        request.post(reqUrl, function(err, res, body) {
            log.info('Response looks like', res.body);
            return res.body;
        });
    }

}

module.exports = YodleeService;