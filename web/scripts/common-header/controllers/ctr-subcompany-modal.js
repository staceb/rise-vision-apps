'use strict';
/*global alert: false */

angular.module('risevision.common.header')
  .controller('SubCompanyModalCtrl', ['$scope', '$modalInstance', '$modal',
    '$templateCache', 'createCompany', 'addressFactory', 'countries', 'REGIONS_CA',
    'REGIONS_US', 'TIMEZONES', 'userState', '$loading', 'messageBox', 'humanReadableError',
    'companyTracker', 'bigQueryLogging', 'COMPANY_INDUSTRY_FIELDS',
    'COMPANY_SIZE_FIELDS',
    function ($scope, $modalInstance, $modal, $templateCache,
      createCompany, addressFactory, countries, REGIONS_CA, REGIONS_US, TIMEZONES, userState,
      $loading, messageBox, humanReadableError, companyTracker, bigQueryLogging,
      COMPANY_INDUSTRY_FIELDS, COMPANY_SIZE_FIELDS) {

      $scope.company = {};
      $scope.countries = countries;
      $scope.regionsCA = REGIONS_CA;
      $scope.regionsUS = REGIONS_US;
      $scope.timezones = TIMEZONES;
      $scope.COMPANY_INDUSTRY_FIELDS = COMPANY_INDUSTRY_FIELDS;
      $scope.COMPANY_SIZE_FIELDS = COMPANY_SIZE_FIELDS;

      $scope.forms = {};

      $scope.$watch('loading', function (loading) {
        if (loading) {
          $loading.start('add-subcompany-modal');
        } else {
          $loading.stop('add-subcompany-modal');
        }
      });

      $scope.closeModal = function () {
        $modalInstance.dismiss('cancel');
      };

      $scope.save = function () {
        if (!$scope.forms.companyForm.$valid) {
          console.info('form not valid: ', $scope.forms.companyForm.$error);
        } else {
          $scope.loading = true;

          addressFactory.isValidOrEmptyAddress($scope.company)
            .then(function () {
              createCompany(userState.getSelectedCompanyId(), $scope.company)
                .then(function (company) {
                  companyTracker('Company Created', company.id, company.name);

                  $modalInstance.close('success');
                }, function (err) {
                  messageBox('Error', humanReadableError(err));
                })
                .finally(function () {
                  $scope.loading = false;
                });

            })
            .catch(function (error) {
              $scope.loading = false;

              messageBox('We couldn\'t validate your address.', humanReadableError(error));
            });
        }
      };

      // Show Move Company Modal
      $scope.moveCompany = function (size) {
        // var modalInstance =
        $modal.open({
          template: $templateCache.get('partials/common-header/move-company-modal.html'),
          controller: 'MoveCompanyModalCtrl',
          size: size
        });
      };
    }
  ]);
