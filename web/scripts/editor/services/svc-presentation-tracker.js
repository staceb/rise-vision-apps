'use strict';

angular.module('risevision.editor.services')
  .factory('presentationTracker', ['userState', 'segmentAnalytics',
    'bigQueryLogging',
    function (userState, segmentAnalytics, bigQueryLogging) {
      return function (eventName, presentationId, presentationName) {
        if (eventName) {
          segmentAnalytics.track(eventName, {
            presentationId: presentationId,
            presentationName: presentationName,
            companyId: userState.getSelectedCompanyId()
          });
          if (eventName === 'Presentation Created') {
            bigQueryLogging.logEvent(eventName, presentationId);
          }
        }
      };
    }
  ]);
