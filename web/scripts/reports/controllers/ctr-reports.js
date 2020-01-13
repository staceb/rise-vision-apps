'use strict';

angular.module('risevision.reports.controllers')
.controller('reports', ['$scope', '$log', 'reportsList',
  function ($scope, $log, reportsList) {
    $log.debug("reports");

    $scope.reports = reportsList.reports;

    $scope.isReportsListVisible = function () {
      return !(reportsList.loadingItems || $scope.isEmptyState());
    };

    $scope.isEmptyState = function () {
      return !reportsList.reports.length;
    };

    $scope.fileNameOrderFunction = function (report) {
      return report.name;
    };

    $scope.selectReport = function (report) {
      reportsList.onReportSelect(report);
    };

  }
]);
