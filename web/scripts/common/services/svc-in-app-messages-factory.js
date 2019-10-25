'use strict';

angular.module('risevision.apps.services')
  .factory('inAppMessagesFactory', ['localStorageService', 'userState', 'CachedRequest', 'presentation', '$q',
    '$rootScope',
    function (localStorageService, userState, CachedRequest, presentation, $q, $rootScope) {
      var presentationListReq = new CachedRequest(presentation.list, {});
      var factory = {
        messageToShow: undefined
      };

      $rootScope.$on('risevision.company.selectedCompanyChanged', function () {
        _reset();
      });
      $rootScope.$on('risevision.company.updated', function () {
        _reset();
      });

      factory.pickMessage = function (forceReload) {
        presentationListReq.execute(forceReload).then(function (resp) {
          if (_shouldShowPricingChanges()) {
            factory.messageToShow = 'pricingChanges';
          } else if (_shouldShowPromoteTraining(resp.items)) {
            factory.messageToShow = 'promoteTraining';
          } else {
            factory.messageToShow = undefined;
          }
        });
      };

      factory.dismissMessage = function () {
        if (!factory.messageToShow) {
          return;
        }
        var alertDismissedKey = factory.messageToShow + 'Alert.dismissed';
        localStorageService.set(alertDismissedKey, true);
        factory.messageToShow = undefined;
      };

      var _reset = function () {
        factory.messageToShow = undefined;
        factory.pickMessage(true);
      };

      var _shouldShowPricingChanges = function () {
        var company = userState.getCopyOfSelectedCompany();
        var creationDate = ((company && company.creationDate) ? (new Date(company.creationDate)) : (
          new Date()));
        var isPastCreationDate = creationDate < new Date('June 25, 2019');

        return isPastCreationDate && !_isDismissed('pricingChanges');
      };

      var _shouldShowPromoteTraining = function (presentations) {
        var hasAddedPresentation = presentations && presentations.length > 0;
        return userState.isEducationCustomer() && hasAddedPresentation && !_isDismissed('promoteTraining');
      };

      var _isDismissed = function (key) {
        return localStorageService.get(key + 'Alert.dismissed') === true;
      };

      return factory;
    }
  ]);
