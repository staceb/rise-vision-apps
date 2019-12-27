'use strict';

angular.module('risevision.displays.controllers')
  .controller('displayAddModal', ['$scope', '$modalInstance', 'displayFactory', 'downloadOnly', 'displayTracker',
    function ($scope, $modalInstance, displayFactory, downloadOnly, displayTracker) {
      var _init = function () {
        $scope.display = displayFactory.display;
        $scope.downloadOnly = downloadOnly;

        if (downloadOnly) {
          $scope.setCurrentPage('displayAdded');
        }
      };

      $scope.$on('displayCreated', function () {
        $scope.display = displayFactory.display;
      });

      $scope.setCurrentPage = function (tabName) {
        $scope.previousPage = $scope.currentPage;
        $scope.currentPage = tabName;
      };

      $scope.showMediaPlayerPage = function (hasOwnPlayer) {
        if (hasOwnPlayer) {
          $scope.setCurrentPage('userMediaPlayer');
        } else {
          $scope.setCurrentPage('preconfiguredMediaPlayer');
        }
        displayTracker('Media Player Type Selected', $scope.display.id, $scope.display.name, undefined, !!
          hasOwnPlayer);
      };

      $scope.showPreviousPage = function () {
        $scope.setCurrentPage($scope.previousPage);
      };

      $scope.dismiss = function () {
        $modalInstance.dismiss();
      };

      _init();

    }
  ]);
