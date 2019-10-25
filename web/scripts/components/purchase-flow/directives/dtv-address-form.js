'use strict';

angular.module('risevision.common.components.purchase-flow')
  .directive('addressForm', ['$templateCache', 'COUNTRIES', 'REGIONS_CA', 'REGIONS_US',
    function ($templateCache, COUNTRIES, REGIONS_CA, REGIONS_US) {
      return {
        restrict: 'E',
        scope: {
          formObject: '=',
          addressObject: '=',
          hideCompanyName: '='
        },
        template: $templateCache.get('partials/components/purchase-flow/address-form.html'),
        link: function ($scope) {
          $scope.countries = COUNTRIES;
          $scope.regionsCA = REGIONS_CA;
          $scope.regionsUS = REGIONS_US;

          $scope.isFieldInvalid = function (fieldName) {
            var form = $scope.formObject;
            var field = form[fieldName];

            return (field.$dirty || form.$submitted) && field.$invalid;
          };
        }
      };
    }
  ]);
