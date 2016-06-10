'use strict';

angular.module('risevision.displays.controllers')
  .controller('displayAddModal', ['$scope', '$modalInstance', 'displayFactory', 
  'userState', '$log',
    function ($scope, $modalInstance, displayFactory, userState, $log) {
      $scope.factory = displayFactory;
      $scope.display = displayFactory.display;
      $scope.userEmail = userState.getUserEmail();

      $scope.save = function () {
        if (!$scope.displayAdd.$valid) {
          $log.error('form not valid: ', $scope.displayAdd.errors);
          return;
        }

        displayFactory.addDisplay().then(function () {
          $scope.display = displayFactory.display;
        });
      };
      
      $scope.dismiss = function () {
        $modalInstance.dismiss();
      };

    }
  ]);
