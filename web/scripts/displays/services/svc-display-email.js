'use strict';

angular.module('risevision.displays.services')
  .service('displayEmail', ['$templateCache', 'userState', 'email',
    function ($templateCache, userState, email) {
      return {
        send: function (displayId, displayName) {
          if (!displayId || !displayName) {
            return;
          }

          var template = $templateCache.get(
            'partials/displays/add-display-email.html');
          template = template.replace('{{display.id}}', displayId);
          template = template.replace('{{display.name}}', displayName);

          return email.send(userState.getUserEmail(),
            'Set Up Your Display With Rise Vision',
            template);
        }
      };

    }
  ]);
