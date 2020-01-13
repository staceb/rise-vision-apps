'use strict';

angular.module('risevision.reports.controllers')
  .controller('reports', ['$scope', '$log', 'ReportsFactory',
    function ($scope, $log, ReportsFactory) {
      $log.debug("reports");
    }
  ]);
