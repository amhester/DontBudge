"use strict";

var config = require('./../app.config.json');
var bunyan = require('bunyan');
var request = require('request');

var log = bunyan.createLogger({name:'YodleeService'});


class YodleeService {
    constructor () {
    }


    getCobSessionToken(cb) {
        var stringBuilder = [];
        stringBuilder.push(config.apis.yodlee.url);
        stringBuilder.push('/authenticate/coblogin?cobrandLogin=');
        stringBuilder.push(config.apis.yodlee.credentials.username);
        stringBuilder.push('&cobrandPassword=');
        stringBuilder.push(config.apis.yodlee.credentials.password);
        var reqUrl = stringBuilder.join('');

        log.info('Request looks like',reqUrl);

        request.post(reqUrl, function(err, res, body) {
            cb(err, JSON.parse(res.body).cobrandConversationCredentials.sessionToken, body);
        });
    }

    //userLogin(username, password) {
    //    var stringBuidler = [];
    //    stringBuidler.push(config.apis.yodlee.url);
    //    stringBuilder.push('/authenticate/login?login=');
    //    stringBuidler.push(config.apis.yodlee.testUser1.username);
    //    stringBuidler.push('&password=');
    //    stringBuilder.push(config.apis.yodlee.testUser1.password);
    //    stringBuidler.push();
    //}

}

module.exports = YodleeService;
