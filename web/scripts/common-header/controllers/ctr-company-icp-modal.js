'use strict';

angular.module('risevision.common.header')
  .controller('CompanyIcpModalCtrl', ['$scope', '$modalInstance',
    'company', 'user', 'COMPANY_INDUSTRY_FIELDS',
    function ($scope, $modalInstance, company, user,
      COMPANY_INDUSTRY_FIELDS) {

      $scope.company = company;
      $scope.user = user;
      $scope.DROPDOWN_INDUSTRY_FIELDS = COMPANY_INDUSTRY_FIELDS;

      $scope.save = function () {
        $modalInstance.close({
          user: user,
          company: company
        });
      };

      $scope.selectIndustry = function (industryValue) {
        if (company.companyIndustry !== industryValue) {
          company.companyIndustry = industryValue;
        } else {
          company.companyIndustry = '';
        }
      };

    }
  ]);
