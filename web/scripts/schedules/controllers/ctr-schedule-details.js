'use strict';

angular.module('risevision.schedules.controllers')
  .controller('scheduleDetails', ['$scope', '$q', '$state',
    'scheduleFactory', '$loading', '$log', '$modal', '$templateCache', 'bigQueryLogging',
    function ($scope, $q, $state, scheduleFactory, $loading, $log, $modal,
      $templateCache, bigQueryLogging) {
      $scope.factory = scheduleFactory;
      $scope.schedule = scheduleFactory.schedule;

      var _previousTransitions = _scheduleHasTransitions($scope.schedule);

      $scope.$watch('factory.loadingSchedule', function (loading) {
        if (loading) {
          $loading.start('schedule-loader');
        } else {
          $loading.stop('schedule-loader');
        }
      });

      $scope.confirmDelete = function () {
        $scope.modalInstance = $modal.open({
          template: $templateCache.get(
            'partials/components/confirm-modal/confirm-modal.html'),
          controller: 'confirmModalController',
          windowClass: 'modal-custom',
          resolve: {
            confirmationTitle: function () {
              return 'schedules-app.details.deleteTitle';
            },
            confirmationMessage: function () {
              return 'schedules-app.details.deleteWarning';
            },
            confirmationButton: function () {
              return 'common.delete-forever';
            },
            cancelButton: null
          }
        });

        $scope.modalInstance.result.then(scheduleFactory.deleteSchedule);
      };

      $scope.addSchedule = function () {
        if (!$scope.scheduleDetails.$dirty) {
          $state.go('apps.schedules.add');
        } else {
          $scope.modalInstance = $modal.open({
            template: $templateCache.get(
              'partials/components/confirm-modal/confirm-modal.html'),
            controller: 'confirmModalController',
            windowClass: 'modal-custom',
            resolve: {
              confirmationTitle: function () {
                return 'schedules-app.details.unsavedTitle';
              },
              confirmationMessage: function () {
                return 'schedules-app.details.unsavedWarning';
              },
              confirmationButton: function () {
                return 'common.save';
              },
              cancelButton: function () {
                return 'common.discard';
              }
            }
          });

          $scope.modalInstance.result.then(function () {
            // do what you need if user presses ok
            $scope.save()
              .then(function () {
                $state.go('apps.schedules.add');
              });
          }, function (value) {
            // do what you need to do if user cancels
            if (value) {
              $state.go('apps.schedules.add');
            }
          });
        }
      };

      $scope.save = function () {
        if (!$scope.scheduleDetails.$valid) {
          console.info('form not valid: ', $scope.scheduleDetails.$error);

          return $q.reject();
        } else {
          _logTransitionUsage();

          return scheduleFactory.updateSchedule();
        }
      };

      function _logTransitionUsage() {
        var addedTransitions = _scheduleHasTransitions($scope.schedule);

        if (!_previousTransitions && addedTransitions) {
          bigQueryLogging.logEvent('transitionsAdded', $scope.schedule.id);
        } else if (_previousTransitions && !addedTransitions) {
          bigQueryLogging.logEvent('transitionsRemoved', $scope.schedule.id);
        }

        _previousTransitions = addedTransitions;
      }

      function _scheduleHasTransitions (schedule) {
        var content = schedule.content;

        return _.find(content || [], function (item) {
          return item.transitionType && item.transitionType !== 'normal';
        });
      }
    }
  ]);
