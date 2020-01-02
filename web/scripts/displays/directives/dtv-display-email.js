'use strict';

angular.module('risevision.displays.directives')
  .directive('displayEmail', ['$q', '$loading', 'userState', 'displayEmail',
    function ($q, $loading, userState, displayEmail) {
      return {
        restrict: 'E',
        templateUrl: 'partials/displays/display-email.html',
        scope: true,
        link: function ($scope) {
          $scope.userEmail = userState.getUserEmail();

          $scope.anotherEmail = null;
          $scope.displayEmail = displayEmail;

          $scope.$watch('displayEmail.sendingEmail', function (loading) {
            if (loading) {
              $loading.start('display-email');
            } else {
              $loading.stop('display-email');
            }
          });

          var _sendEmail = function (email) {
            $scope.error = false;

            return displayEmail.send($scope.display.id, email)
              .catch(function (error) {
                $scope.error = true;

                return $q.reject(error);
              });
          };

          $scope.sendToAnotherEmail = function () {
            _sendEmail($scope.anotherEmail)
              .then(function () {
                $scope.emailResent = true;
                $scope.sendAnotherEmail = false;
                $scope.anotherEmail = null;
                $scope.anotherEmailForm.$setPristine(true);
              });
          };

          $scope.sendToUserEmail = function () {
            _sendEmail(userState.getUserEmail())
              .then(function () {
                $scope.emailResent = true;
              });
          };

        } //link()
      };
    }
  ]);
