'use strict';
angular.module('risevision.widgets.services')
  .factory('OAuthio', ['OAUTH_PUBLIC_KEY', '$window', '$q', '$log',
    function (OAUTH_PUBLIC_KEY, $window, $q, $log) {
      var svc = {};

      svc.initialize = function () {
        $window.OAuth.initialize(OAUTH_PUBLIC_KEY);
      };

      svc.popup = function (provider, stateToken) {
        var deferred = $q.defer();
        $window.OAuth.popup(provider, {
          'state': stateToken
        }, function (error, result) {
          if (!error) {
            deferred.resolve(result);
          } else {
            deferred.reject();
            $log.debug('could not connect to twitter with oauth.io! ' + error);
          }
        });
        return deferred.promise;
      };

      return svc;
    }
  ]);
