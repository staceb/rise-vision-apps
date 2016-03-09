'use strict';

angular.module('risevision.displays.services')
  .factory('displayTracker', ['userState', 'segmentAnalytics',
    'bigQueryLogging',
    function (userState, segmentAnalytics, bigQueryLogging) {
      return function (eventName, displayId, displayName, downloadType) {
        if (eventName) {
          segmentAnalytics.track(eventName, {
            displayId: displayId,
            displayName: displayName,
            companyId: userState.getSelectedCompanyId(),
            downloadType: downloadType
          });
          if (eventName === 'Player Download') {
            bigQueryLogging.logEvent(eventName, displayId);
          }
        }
      };
    }
  ]);
