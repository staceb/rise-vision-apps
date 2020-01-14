'use strict';

angular.module('risevision.reports.controllers')
.controller('reports', ['$scope', '$log', 'reportsList', 'userState',
  function ($scope, $log, reportsList, userState) {
    $scope.reports = reportsList.reports;
    $scope.responses = reportsList.responses;
    $scope.userEmail = userState.getUserEmail();

    $scope.isReportsListVisible = function () {
      return !(reportsList.loadingItems || $scope.isEmptyState());
    };

    $scope.isEmptyState = function () {
      return !reportsList.reports.length;
    };

    $scope.selectReport = function (report) {
      reportsList.onReportSelect(report);
    };

    $scope.runReports = function () {
      reportsList.runReports();
    };

    $scope.isSubmitted = function () {
      var submittedReports = reportsList.reports
        .filter(function (report) {return report.isSubmitted;});

      return submittedReports.length;
    };
  }
]);
