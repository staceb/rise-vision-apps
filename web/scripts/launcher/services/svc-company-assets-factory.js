'use strict';

angular.module('risevision.apps.launcher.services')
  .factory('companyAssetsFactory', ['$q', 'CachedRequest', 'presentation', 'display',
    function ($q, CachedRequest, presentation, display) {
      var factory = {};
      var templateSearch = {
        sortBy: 'changeDate',
        reverse: true,
        count: 1,
        filter: 'presentationType:\"HTML Template\"'
      };
      var displaySearch = {
        sortBy: 'changeDate',
        reverse: true,
        count: 1
      };
      var templateListRequest = new CachedRequest(presentation.list, templateSearch);
      var displayListRequest = new CachedRequest(display.list, displaySearch);

      factory.hasTemplates = function (forceReload) {
        var deferred = $q.defer();

        templateListRequest.execute(forceReload).then(function (resp) {
          var hasAddedTemplate = resp && resp.items && resp.items.length > 0;

          if (hasAddedTemplate) {
            deferred.resolve(true);
          } else {
            deferred.resolve(false);
          }
        }).catch(function (e) {
          deferred.reject(e);
        });

        return deferred.promise;
      };

      factory.hasDisplays = function (forceReload) {
        var deferred = $q.defer();

        displayListRequest.execute(forceReload).then(function (resp) {
            var hasAddedDisplay = resp && resp.items && resp.items.length > 0;
            var response = {
              hasDisplays: false,
              hasActivatedDisplays: true
            };

            if (hasAddedDisplay) {
              response.hasDisplays = true;
            }

            deferred.resolve(response);
          })
          .catch(function (e) {
            deferred.reject(e);
          });

        return deferred.promise;
      };

      return factory;
    }
  ]);
