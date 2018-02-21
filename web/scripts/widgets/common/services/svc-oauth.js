/* globals OAuth */
'use strict';
angular.module('risevision.widgets.services')
  .factory('OAuthService', ['$http', 'OAUTH_TOKEN_PROVIDER_URL', 'OAuthio', '$q', '$log', 'userState',
    function ($http, OAUTH_TOKEN_PROVIDER_URL, OAuthio, $q, $log, userState) {
      var svc = {};
      var provider = '';
      var authorization = (userState.getAccessToken().token_type === 'Bearer') ? userState.getAccessToken().token_type +
        ' ' + userState.getAccessToken().access_token : userState.getAccessToken().access_token;
      var requestOptions = {
        'headers': {
          'authorization': authorization
        },
        'withCredentials': true,
        'responseType': 'json'
      };
      var key = '';

      svc.initialize = function (newProvider) {
        OAuthio.initialize();
        provider = newProvider;
      };

      var _getStatus = function () {
        var deferred = $q.defer();
        $http.post(OAUTH_TOKEN_PROVIDER_URL + 'status', {
            'companyId': userState.getSelectedCompanyId(),
            'provider': provider
          }, requestOptions)
          .then(function (response) {
            deferred.resolve(response);
          }, function (response) {
            deferred.reject(response);
            $log.debug('Could not get Status! ' + response);
          });
        return deferred.promise;
      };

      svc.getConnectionStatus = function () {
        var deferred = $q.defer();
        _getStatus()
          .then(function (response) {
            if (response.data && Array.isArray(response.data.authenticated) && response.data.authenticated.length) {
              key = userState.getSelectedCompanyId() + ':' + provider + ':' + response.data.authenticated[0];
              deferred.resolve(true);
            } else {
              deferred.reject(new Error("No authenticated on the response"));
            }
          }, function (response) {
            deferred.reject(response);
          });

        return deferred.promise;
      };

      var _getStateToken = function () {
        var deferred = $q.defer();
        $http.get(OAUTH_TOKEN_PROVIDER_URL + 'authenticate', requestOptions)
          .then(function (response) {
            if (response.data && response.data.token) {
              deferred.resolve(response.data.token);
            } else {
              deferred.reject();
            }
          }, function (response) {
            deferred.reject();
            $log.debug('Could not get state token! ' + response);
          });
        return deferred.promise;
      };

      var _authenticateWithOauthIO = function (stateToken) {
        var deferred = $q.defer();
        OAuthio.popup(provider, stateToken)
          .then(function (result) {
            deferred.resolve(result.code);
          }, function () {
            deferred.reject();
          });
        return deferred.promise;
      };

      var _authenticateWithOauthTokenProvider = function (code) {
        var deferred = $q.defer();
        $http.post(OAUTH_TOKEN_PROVIDER_URL + 'authenticate', {
            'code': code,
            'companyId': userState.getSelectedCompanyId(),
            'provider': provider
          }, requestOptions)
          .then(function (response) {
            if (response.data && response.data.key) {
              deferred.resolve(response.data.key);
            } else {
              deferred.reject();
            }
          }, function (response) {
            deferred.reject();
            $log.debug('Could not authenticate with OAuth Token Provider! ' + response);
          });
        return deferred.promise;
      };

      svc.authenticate = function () {
        var deferred = $q.defer();
        _getStateToken()
          .then(function (stateToken) {
            _authenticateWithOauthIO(stateToken)
              .then(function (code) {
                _authenticateWithOauthTokenProvider(code)
                  .then(function (newKey) {
                    key = newKey;
                    deferred.resolve(newKey);
                  }, function () {
                    deferred.reject();
                  });
              }, function () {
                deferred.reject();
              });
          }, function () {
            deferred.reject();
          });

        return deferred.promise;
      };

      svc.revoke = function () {
        var deferred = $q.defer();
        $http.post(OAUTH_TOKEN_PROVIDER_URL + 'revoke', {
            'key': key
          }, requestOptions)
          .then(function (response) {
            deferred.resolve(response.data);
          }, function (response) {
            deferred.reject();
            $log.debug('Could not revoke with OAuth Token Provider! ' + response);
          });
        return deferred.promise;
      };

      return svc;
    }
  ]);
