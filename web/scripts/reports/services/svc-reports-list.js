'use strict';
angular.module('risevision.reports.services')
.service('reportsList', ['coreAPILoader',
  function (coreAPILoader) {
    var reports = [];
    var loadingItems = true;

    coreAPILoader().then(function (coreApi) {
      return coreApi.query.list();
    })
    .then(function (resp) {
      console.log(resp);
      loadingItems = false;

      if (!resp.result.items) {return;}

      resp.result.items.forEach(function (item) {
        reports.push({
          id: item.id,
          name: item.name,
          url: item.url,
          isSelected: false
        });
      });
    });

    function onReportSelect(report) {
      report.isChecked = !report.isChecked;
    }

    return {
      reports: reports,
      onReportSelect: onReportSelect
    };
  }
]);
