"use strict";

var config = require('./../app.config.json');
var bunyan = require('bunyan');
var request = require('request');
var log = bunyan.createLogger({name:'YodleeService'});


class YodleeService {
    constructor () {
    }

    getCobSessionToken(cb) {
        var reqUrl = config.apis.yodlee.url;
        reqUrl += '/authenticate/coblogin?cobrandLogin=' + config.apis.yodlee.credentials.username;
        reqUrl += '&cobrandPassword=' + config.apis.yodlee.credentials.password;

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

    userLogout(cobToken, userToken, cb) {
        var reqUrl = config.apis.yodlee.url;
        reqUrl += '/jsonsdk/Login/logout?cobSessionToken=' + cobToken;
        reqUrl += '&userSessionToken=' + userToken;

        request.post({
            url: reqUrl.join('')
        }, function(err, res, body) {
            cb(err, JSON.parse(res.body), body);
        });
    }

    isValidUser(cobToken, username, cb) {
        var reqUrl = config.apis.yodlee.url;
        reqUrl += '/jsonsdk/Login/validateUser?cobSessionToken=' + cobToken;
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
        reqUrl += '?cobSessionToken=' + cobToken;
        reqUrl += '&userSessionToken' + userToken;


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
