'use strict';

angular.module('risevision.displays.controllers')
  .controller('displayAdd', ['$scope', 'displayFactory', '$loading', '$log',
    function ($scope, displayFactory, $loading, $log) {
      $scope.factory = displayFactory;
      $scope.display = displayFactory.display;

      $scope.$watch('factory.loadingDisplay', function (loading) {
        if (loading) {
          $loading.start('display-loader');
        } else {
          $loading.stop('display-loader');
        }
      });

      $scope.save = function () {
        if (!$scope.displayDetails.$valid) {
          $log.error('form not valid: ', $scope.displayDetails.errors);
          return;
        }

        displayFactory.addDisplay();
      };

    }
  ]);
