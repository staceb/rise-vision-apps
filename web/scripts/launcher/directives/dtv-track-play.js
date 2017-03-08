'use strict';

angular.module('risevision.apps.launcher.directives')
  .directive('trackPlay', ['launcherTracker',
    function (launcherTracker) {
      return {
        restrict: 'A',
        link: function ($scope, element) {
          element.on('playing', function ($event) {
            launcherTracker('Played Tutorial');
          });
        }
      };
    }
  ]);
