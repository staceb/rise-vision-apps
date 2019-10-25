'use strict';

angular.module('risevision.template-editor.services')
  .constant('HTML_TEMPLATE_DOMAIN', 'https://widgets.risevision.com')
  .factory('templateEditorFactory', ['$q', '$log', '$state', '$rootScope', 'presentation',
    'processErrorCode', 'userState', 'checkTemplateAccess', '$modal', 'scheduleFactory', 'plansFactory',
    'templateEditorUtils', 'brandingFactory', 'blueprintFactory', 'financialLicenseFactory', 'presentationTracker',
    'HTML_PRESENTATION_TYPE', 'REVISION_STATUS_REVISED', 'REVISION_STATUS_PUBLISHED',
    function ($q, $log, $state, $rootScope, presentation, processErrorCode, userState,
      checkTemplateAccess, $modal, scheduleFactory, plansFactory, templateEditorUtils, brandingFactory,
      blueprintFactory, financialLicenseFactory,
      presentationTracker, HTML_PRESENTATION_TYPE, REVISION_STATUS_REVISED, REVISION_STATUS_PUBLISHED) {
      var factory = {
        hasUnsavedChanges: false
      };

      var _setPresentation = function (presentation, isUpdate) {

        if (isUpdate) {
          factory.presentation.id = presentation.id;
          factory.presentation.companyId = presentation.companyId;
          factory.presentation.revisionStatus = presentation.revisionStatus;
          factory.presentation.revisionStatusName = presentation.revisionStatusName;
          factory.presentation.creationDate = presentation.creationDate;
          factory.presentation.changeDate = presentation.changeDate;
          factory.presentation.changedBy = presentation.changedBy;
        } else {
          presentation.templateAttributeData =
            _parseJSON(presentation.templateAttributeData) || {};

          factory.presentation = presentation;
        }

        $rootScope.$broadcast('presentationUpdated');
      };

      var _getPresentationForUpdate = function () {
        var presentationVal = JSON.parse(JSON.stringify(factory.presentation));

        presentationVal.templateAttributeData =
          JSON.stringify(presentationVal.templateAttributeData);

        return presentationVal;
      };

      var _openExpiredModal = function () {
        var modalInstance = $modal.open({
          templateUrl: 'partials/template-editor/more-info-modal.html',
          controller: 'confirmModalController',
          windowClass: 'madero-style centered-modal',
          resolve: {
            confirmationTitle: function () {
              return 'template.expired-modal.expired-title';
            },
            confirmationMessage: function () {
              return 'template.expired-modal.expired-message';
            },
            confirmationButton: function () {
              return 'template.expired-modal.confirmation-button';
            },
            cancelButton: null
          }
        });

        modalInstance.result.then(function () {
          plansFactory.showPlansModal();
        });
      };

      var _checkTemplateAccess = function (productCode) {
        checkTemplateAccess(productCode)
          .catch(function () {
            _openExpiredModal();
          });
      };

      factory.addFromProduct = function (productDetails) {
        _clearMessages();

        factory.selected = null;

        factory.presentation = {
          id: undefined,
          productCode: productDetails.productCode,
          name: 'Copy of ' + productDetails.name,
          presentationType: HTML_PRESENTATION_TYPE,
          templateAttributeData: {},
          revisionStatusName: undefined,
          isTemplate: false,
          isStoreProduct: false
        };

        presentationTracker('HTML Template Copied', productDetails.productCode, productDetails.name);

        return blueprintFactory.load(factory.presentation.productCode)
          .then(function () {
            financialLicenseFactory.checkFinancialDataLicenseMessage();
          })
          .then(null, function (e) {
            _showErrorMessage('add', e);
            return $q.reject(e);
          });
      };

      factory.addPresentation = function () {
        var presentationVal = _getPresentationForUpdate();

        return presentation.add(presentationVal)
          .then(function (resp) {
            if (resp && resp.item && resp.item.id) {
              $rootScope.$broadcast('presentationCreated');

              presentationTracker('Presentation Created', resp.item.id, resp.item.name);

              $state.go('apps.editor.templates.edit', {
                presentationId: resp.item.id,
                productId: undefined
              }, {
                notify: false,
                location: 'replace'
              });

              return $q.resolve(resp.item.id);
            }
          });
      };

      factory.updatePresentation = function () {
        if (!factory.hasUnsavedChanges) {
          //Factory has no Changes.
          return $q.resolve();
        }

        var presentationVal = _getPresentationForUpdate();

        return presentation.update(presentationVal.id, presentationVal)
          .then(function (resp) {
            presentationTracker('Presentation Updated', resp.item.id, resp.item.name);

            _setPresentation(resp.item, true);

            return $q.resolve(resp.item.id);
          });
      };

      factory.isUnsaved = function () {
        return !!(factory.hasUnsavedChanges || brandingFactory.hasUnsavedChanges);
      };

      factory.save = function () {
        var deferred = $q.defer(),
          saveFunction;

        if (factory.presentation.id) {
          saveFunction = factory.updatePresentation;
        } else {
          saveFunction = factory.addPresentation;
        }

        _clearMessages();

        //show spinner
        factory.loadingPresentation = true;
        factory.savingPresentation = true;

        $q.all([brandingFactory.saveBranding(), saveFunction()])
          .then(function () {
            deferred.resolve();
          })
          .then(null, function (e) {
            // If adding, and there is a Presentation Id it means save was successful
            // and the failure was to update Branding
            _showErrorMessage(factory.presentation.id ? 'update' : 'add', e);

            deferred.reject(e);
          })
          .finally(function () {
            factory.loadingPresentation = false;
            factory.savingPresentation = false;
          });

        return deferred.promise;
      };


      factory.getPresentation = function (presentationId) {
        var deferred = $q.defer();

        _clearMessages();

        //show loading spinner
        factory.loadingPresentation = true;

        presentation.get(presentationId)
          .then(function (result) {
            _setPresentation(result.item);

            return blueprintFactory.load(factory.presentation.productCode);
          })
          .then(function () {
            _checkTemplateAccess(factory.presentation.productCode);

            deferred.resolve();
          })
          .then(null, function (e) {
            _showErrorMessage('get', e);
            factory.presentation = null;
            blueprintFactory.blueprintData = null;

            deferred.reject(e);
          })
          .finally(function () {
            factory.loadingPresentation = false;
          });

        return deferred.promise;
      };

      factory.deletePresentation = function () {
        var deferred = $q.defer();

        _clearMessages();

        //show spinner
        factory.loadingPresentation = true;
        factory.savingPresentation = true;

        presentation.delete(factory.presentation.id)
          .then(function () {
            presentationTracker('Presentation Deleted', factory.presentation.id, factory.presentation.name);

            $rootScope.$broadcast('presentationDeleted');

            factory.presentation = {};

            $state.go('apps.editor.list');
            deferred.resolve();
          })
          .then(null, function (e) {
            _showErrorMessage('delete', e);
            deferred.reject(e);
          })
          .finally(function () {
            factory.loadingPresentation = false;
            factory.savingPresentation = false;
          });

        return deferred.promise;
      };

      factory.isRevised = function () {
        return factory.presentation.revisionStatusName === REVISION_STATUS_REVISED;
      };

      factory.publish = function () {
        var deferred = $q.defer();

        _clearMessages();

        //show spinner
        factory.loadingPresentation = true;
        factory.savingPresentation = true;

        $q.all([brandingFactory.publishBranding(), _publishPresentation()])
          .then(function () {
            deferred.resolve();
          })
          .then(null, function (e) {
            _showErrorMessage('publish', e);

            deferred.reject();
          })
          .finally(function () {
            factory.loadingPresentation = false;
            factory.savingPresentation = false;
          });

        return deferred.promise;
      };

      factory.getAttributeData = function (componentId, attributeKey) {
        if (!componentId) {
          return null;
        }

        var component = _componentFor(componentId, false);

        // if the attributeKey is not provided, it returns the full component structure
        return attributeKey ? component[attributeKey] : component;
      };

      factory.setAttributeData = function (componentId, attributeKey, value) {
        if (!componentId) {
          return null;
        }

        var component = _componentFor(componentId, true);

        component[attributeKey] = value;
      };

      // updateAttributeData: do not update the object on getAttributeData
      // or it will unnecessarily trigger hasUnsavedChanges = true
      var _componentFor = function (componentId, updateAttributeData) {
        var attributeData = factory.presentation.templateAttributeData;
        var component;

        if (attributeData.components) {
          component = _.find(attributeData.components, {
            id: componentId
          });
        } else if (updateAttributeData) {
          attributeData.components = [];
        }

        if (!component) {
          component = {
            id: componentId
          };

          if (updateAttributeData) {
            attributeData.components.push(component);
          }
        }

        return component;
      };

      var _publishPresentation = function () {
        if (!factory.isRevised()) {
          // template is already published
          return $q.resolve();
        }

        return presentation.publish(factory.presentation.id)
          .then(function () {
            presentationTracker('Presentation Published', factory.presentation.id, factory.presentation.name);

            factory.presentation.revisionStatusName = REVISION_STATUS_PUBLISHED;
            factory.presentation.changeDate = new Date();
            factory.presentation.changedBy = userState.getUsername();
            $rootScope.$broadcast('presentationPublished');

            return _createFirstSchedule();
          });
      };

      var _createFirstSchedule = function () {
        return scheduleFactory.createFirstSchedule(factory.presentation.id, factory.presentation.name, factory
            .presentation.presentationType)
          .catch(function (err) {
            return err === 'Already have Schedules' ? $q.resolve() : $q.reject(err);
          });
      };

      var _parseJSON = function (json) {
        try {
          return JSON.parse(json);
        } catch (err) {
          $log.error('Invalid JSON: ' + err);
          return null;
        }
      };

      var _showErrorMessage = function (action, e) {
        factory.errorMessage = 'Failed to ' + action + ' Presentation.';
        factory.apiError = processErrorCode('Presentation', action, e);

        $log.error(factory.errorMessage, e);

        templateEditorUtils.showMessageWindow(factory.errorMessage, factory.apiError);
      };

      var _clearMessages = function () {
        factory.loadingPresentation = false;
        factory.savingPresentation = false;

        factory.errorMessage = '';
        factory.apiError = '';
      };

      var _init = function () {
        factory.presentation = {};

        _clearMessages();
      };

      _init();

      return factory;
    }
  ]);
