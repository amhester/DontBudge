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

    userLogin(username, password, cb) {

        this.getCobSessionToken(function(err, token) {
            request.post({
                url: config.apis.yodlee.url + '/authenticate/login',
                form: {
                    login:username,
                    password:password,
                    cobSessionToken:token
                }
            }, function(err, res, body) {
                cb(err, JSON.parse(res.body), body);
            });
        });
    }

    userLogout() {
        
    }

}

module.exports = YodleeService;
