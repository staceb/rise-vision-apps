'use strict';
angular.module('risevision.reports.services')
.service('reportsList', ['coreAPILoader', '$q',
  function (coreAPILoader, $q) {
    var reports = [];
    var responses = [];
    var loadingItems = true;

    coreAPILoader().then(function (coreApi) {
      return coreApi.query.list();
    })
    .then(function (resp) {
      loadingItems = false;

      if (!resp.result || !resp.result.items) {return;}

      resp.result.items.forEach(function (item) {
        reports.push({
          id: item.id,
          name: item.name,
          url: item.url,
          isChecked: false,
          isSubmitted: false,
          description: item.description
        });
      });
    });

    function onReportSelect(report) {
      report.isChecked = !report.isChecked;
    }

    function runReports() {
      var responsePromises = reports.filter(function (report) {return report.isChecked;})
      .map(function (report) {return runReport(report);});

      return $q.all(responsePromises);
    }

    function runReport(report) {
      var deferred = $q.defer();

      coreAPILoader().then(function (coreApi) {
        report.isSubmitted = true;

        coreApi.query.run({id: report.id})
        .then(function (resp) {
          if (!resp.result || !resp.result.item) {return;}
          responses.push({name: report.name, status: resp.status});
          deferred.resolve(responses);
        });
      });

      return deferred.promise;
    }

    return {
      reports: reports,
      onReportSelect: onReportSelect,
      runReports: runReports,
      responses: responses
    };
  }
]);
