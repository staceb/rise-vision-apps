'use strict';

angular.module('risevision.apps.launcher.directives')
  .directive('onboardingDisplayAdd', ['displayFactory', 'companyAssetsFactory', 'displayTracker',
    function (displayFactory, companyAssetsFactory, displayTracker) {
      return {
        restrict: 'E',
        scope: {
          downloadOnly: '='
        },
        templateUrl: 'partials/launcher/onboarding-display-add.html',
        link: function ($scope) {
          $scope.$watch('downloadOnly', function () {
            if ($scope.downloadOnly) {
              companyAssetsFactory.getFirstDisplay().then(function (display) {
                if (display) {
                  $scope.setCurrentPage('displayAdded');

                  $scope.display = display;
                }
              });
            } else {
              displayFactory.init();

              $scope.display = displayFactory.display;
            }
          });

          $scope.$on('displayCreated', function () {
            $scope.display = displayFactory.display;
          });

          $scope.setCurrentPage = function (tabName) {
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

        } //link()
      };
    }
  ]);
