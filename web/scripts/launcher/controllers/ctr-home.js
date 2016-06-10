'use strict';

angular.module('risevision.apps.launcher.controllers')
  .controller('HomeCtrl', ['$scope', 'launcherTracker', 'editorFactory',
    'displayFactory', 'localStorageService', '$loading',
    function ($scope, launcherTracker, editorFactory, displayFactory, 
      localStorageService, $loading) {
      $scope.launcherTracker = launcherTracker;
      $scope.editorFactory = editorFactory;
      $scope.displayFactory = displayFactory;
      $scope.showHelp = localStorageService.get('launcher.showHelp') ===
        'true';

      $loading.startGlobal('launcher.loading');
      $scope.$watch('editorFactory.presentations.loadingItems', function (
        loadingItems) {
        if (loadingItems === false) {
          $loading.stopGlobal('launcher.loading');
        }
      });

      $scope.toggleHelp = function () {
        $scope.showHelp = !$scope.showHelp;
        localStorageService.set('launcher.showHelp', $scope.showHelp);
      };
    }
  ]); //ctr
