"use strict";

var config = require('./../app.config.json');
var bunyan = require('bunyan');
var request = require('request');
var log = bunyan.createLogger({name:'YodleeService'});
var RedisService = require('./redisService');

var redisService = new RedisService();

class YodleeService {
    constructor () {
    }

    getCobSessionToken(cb) {
        var reqUrl = config.apis.yodlee.url;
        reqUrl += '/authenticate/coblogin?cobrandLogin=' + config.apis.yodlee.credentials.username;
        reqUrl += '&cobrandPassword=' + config.apis.yodlee.credentials.password;

        log.info('Request looks like',reqUrl);

        request.post(reqUrl, function(err, res, body) {
            console.log(JSON.parse(res.body).cobrandConversationCredentials.sessionToken);
            redisService.cacheToken('cobToken', JSON.parse(res.body).cobrandConversationCredentials.sessionToken, function(err, data) {
                if (err) {
                    log.warn('Error caching cobToken!');
                }
                else {
                    cb(err, data, body);
                }
            });
        });
    }

    userLogin(username, password, cb) {
        var self = this;
        redisService.getToken('cobToken', function(err, cobToken) {
            self.getCobSessionToken(function(err) {
                request.post({
                    url: config.apis.yodlee.url + '/authenticate/login',
                    form: {
                        login: username,
                        password: password,
                        cobSessionToken: cobToken
                    }
                }, function(err, res, body) {
                    redisService.cacheToken('userToken', JSON.parse(res.body).userContext.conversationCredentials.sessionToken, function(err, data) {
                       if (err) {
                            log.warn('Error caching userToken');
                       }
                       else {
                           cb(err, data, body);
                       }
                    });
                });
            });
        });
    }

    userLogout(cobToken, userToken, cb) {
        var reqUrl = config.apis.yodlee.url;
        reqUrl += '/jsonsdk/Login/logout?cobSessionToken=' + redisService.getToken('cobToken');
        reqUrl += '&userSessionToken=' + redisService.getToken('userToken');

        request.post({
            url: reqUrl.join('')
        }, function(err, res, body) {
            cb(err, JSON.parse(res.body), body);
        });
    }

    isValidUser(cobToken, username, cb) {
        var reqUrl = config.apis.yodlee.url;
        reqUrl += '/jsonsdk/Login/validateUser?cobSessionToken=' + redisService.getToken('cobToken');
        reqUrl += '&userName=' + username;

        request.post({
            url: reqUrl.join('')
        }, function(err, res, body) {
            cb(err, JSON.parse(res.body), body);
        });
    }


    /**
     * let's get our user's data, also priming the cache on the
     * server, with transactions from transactionSearchRequest.higherFetchLimit
     * to transactionSearchRequest.lowerFetchLimit for accessing chunks
     * of transactions data at a later time using this.getUserTransactions()
     * */
    getUserResults(cobToken, userToken, options) {
        var reqUrl = config.apis.yodlee.url + '/jsonsdk/TransactionSearchService/executeUserSearchRequest';
        reqUrl += '?cobSessionToken=' + redisService.getToken('cobToken');
        reqUrl += '&userSessionToken' + redisService.getToken('userToken');


        request.post({
            url: reqUrl,
            form: {
                transactionSearchRequest: {
                    containerType: 'ALL',
                    higherFetchLimit: config.apis.yodlee.higherFetchLimit,
                    lowerFetchLimit: config.apis.yodlee.lowerFetchLimit,
                    resultRange: {
                        endNumber: 100,
                        startNumber: 1
                    },
                    searchClients: {
                        clientId: config.apis.yodlee.searchClients.clientId,
                        clientName: config.apis.yodlee.searchClients.clientName
                    },
                    ignoreUserInput: true,
                    searchFilter: {
                        currencyCode: options.searchFilter.currencyCode,
                        transactionSplitType: 'P'
                    }
                }
            }
        }, function(err, req, body ) {
           ch(err, JSON.parse(res.body), body);
        });

    }

    /**
     * let's use searchIdentifier.identifier from getUserResults
     * to get chucks of transaction data for our user.  This request
     * will receive chunks, from the cache on the Yodlee server, of size
     * specified by transactionSearchRequest.resultRange.endNumber and
     * transactionSearchRequest.resultRange.startNumber.
     * */
    getUserTransactions() {
        //TODO: implement getUserTransactions
    }
}

module.exports = YodleeService;
