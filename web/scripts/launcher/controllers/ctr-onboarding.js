'use strict';

angular.module('risevision.apps.launcher.controllers')
  .controller('OnboardingCtrl', ['$scope', '$localStorage',
    function ($scope, $localStorage) {
      $scope.onboarding = $localStorage.onboarding;

      $scope.nextStep = function () {
        $scope.onboarding.currentStep++;

        if ($scope.onboarding.currentStep === 4) {
          $scope.onboarding.completed = true;
        }
      };
    }
  ]); //ctr
