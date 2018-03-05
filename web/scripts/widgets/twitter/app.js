'use strict';
angular.module('risevision.widgets.twitter', [
    'risevision.widget.common.widget-button-toolbar',
    'risevision.widgets.services'
  ])
  .run(['defaultSettings', function (defaultSettings) {
    defaultSettings.twitterWidget = {
      'params': {},
      'additionalParams': {
        'screenName': '',
        'componentId': 'rise-twitter-' + Math.random().toString().substring(2)
      }
    };
  }]);
