'use strict';

angular.module('risevision.editor.controllers')
  .controller('AutoScheduleModalController', ['$scope', 'presentationName',
    '$modalInstance', 'launcherTracker',
    function ($scope, presentationName, $modalInstance, launcherTracker) {
      $scope.presentationName = presentationName;
      $scope.launcherTracker = launcherTracker;

      $scope.dismiss = function () {
        $modalInstance.dismiss();
      };

    }
  ]); //ctr
