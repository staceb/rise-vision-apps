'use strict';

angular.module('risevision.apps.launcher.services')
  .factory('onboardingFactory', ['$rootScope', '$q', '$localStorage', 'userState', 'companyAssetsFactory',
    function ($rootScope, $q, $localStorage, userState, companyAssetsFactory) {
      var factory = {
        onboardingStep: undefined
      };

      $localStorage.onboarding = angular.extend({
        currentStep: 1,
        completed: false
      }, $localStorage.onboarding);

      var _checkCreationDate = function() {
        var company = userState.getCopyOfSelectedCompany();
        var creationDate = ((company && company.creationDate) ? (new Date(company.creationDate)) : (
          new Date()));
        return creationDate > new Date('Dec 3, 2019');
      };

      var _isMailSyncEnabled = function() {
        var profile = userState.getCopyOfProfile();

        return profile && profile.mailSyncEnabled;
      };

      factory.isOnboarding = function() {
        var completed = $localStorage.onboarding.completed;

        return userState.isEducationCustomer() && _checkCreationDate() && !completed;
      };

      var _getOnboardingStep = function (forceReload) {
        if (!factory.isOnboarding()) {
          return;
        }

        var templatesCheck = companyAssetsFactory.hasTemplates(forceReload);
        var displaysCheck = companyAssetsFactory.hasDisplays(forceReload);

        $q.all([templatesCheck, displaysCheck, _isMailSyncEnabled()])
        .then(function (resp) {
          if (resp && !resp[0]) {
            factory.onboardingStep = 'addTemplate';
          } else if (resp && !resp[1].hasDisplays) {
            factory.onboardingStep = 'addDisplay';
          } else if (resp && !resp[1].hasActivatedDisplays) {
            factory.onboardingStep = 'activateDisplay';
          } else if (resp && !resp[2]) {
            factory.onboardingStep = 'promotePlaybook';
          }
        });
      };

      var _reset = function () {
        factory.onboardingStep = undefined;
        
        _getOnboardingStep(true);
      };

      $rootScope.$on('risevision.company.selectedCompanyChanged', function () {
        _reset();
      });

      return factory;
    }
  ]);
