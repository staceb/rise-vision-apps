'use strict';
angular.module('risevision.widget.twitter.services', [
  'risevision.widgets.services'
]);

angular.module('risevision.widget.twitter.settings', [
    'risevision.widget.common.widget-button-toolbar',
    'risevision.widget.twitter.services'
  ])
  .run(['defaultSettings', function (defaultSettings) {
    defaultSettings.twitterWidget = {
      'params': {},
      'additionalParams': {
        'screenName': ''
      }
    };
  }]);
