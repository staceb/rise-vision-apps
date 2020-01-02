'use strict';

angular.module('risevision.displays.services')
  .value('DISPLAY_EVENTS_TO_BQ', [
    'Display Created',
    'Player Download'
  ])
  .factory('displayTracker', ['userState', 'segmentAnalytics',
    'bigQueryLogging', 'DISPLAY_EVENTS_TO_BQ',
    function (userState, segmentAnalytics, bigQueryLogging,
      DISPLAY_EVENTS_TO_BQ) {
      return function (eventName, displayId, displayName, downloadType, hasOwnMediaPlayer) {
        if (eventName) {
          segmentAnalytics.track(eventName, {
            displayId: displayId,
            displayName: displayName,
            companyId: userState.getSelectedCompanyId(),
            downloadType: downloadType,
            hasOwnMediaPlayer: hasOwnMediaPlayer
          });
          if (DISPLAY_EVENTS_TO_BQ.indexOf(eventName) !== -1) {
            bigQueryLogging.logEvent(eventName, displayId);
          }
        }
      };
    }
  ]);
