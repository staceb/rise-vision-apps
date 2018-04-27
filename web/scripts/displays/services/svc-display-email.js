'use strict';

angular.module('risevision.displays.services')
  .service('displayEmail', ['$templateCache', 'userState', 'display', '$q',
    function ($templateCache, userState, displayService, $q) {
      var factory = {};

      factory.sendingEmail = false;

      factory.send = function (displayId, emailAddress) {
        if (!displayId) {
          return $q.reject('Invalid Display ID');
        }

        factory.sendingEmail = true;

        return displayService.sendSetupEmail(displayId, (emailAddress || userState.getUserEmail()))
          .finally(function () {
            factory.sendingEmail = false;
          });
      };

      return factory;

    }
  ]);
