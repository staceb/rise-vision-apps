'use strict';

angular.module('risevision.apps')
  // Set up our mappings between URLs, templates, and controllers
  .config(['$stateProvider',
    function storeRouteConfig($stateProvider) {

      // Use $stateProvider to configure states.
      $stateProvider
        .state('apps.schedules', {
          url: '?cid',
          abstract: true,
          template: '<div class="container schedules-app" ui-view></div>'
        })

        .state('apps.schedules.home', {
          url: '/schedules',
          controller: ['canAccessApps', '$state', '$location',
            function (canAccessApps, $state, $location) {
              canAccessApps().then(function () {
                $location.replace();
                $state.go('apps.schedules.list');
              });
            }
          ]
        })

        .state('apps.schedules.list', {
          url: '/schedules/list',
          templateProvider: ['$templateCache', function ($templateCache) {
            return $templateCache.get(
              'partials/schedules/schedules-list.html');
          }],
          controller: 'schedulesList',
          resolve: {
            canAccessApps: ['canAccessApps',
              function (canAccessApps) {
                return canAccessApps();
              }
            ]
          }
        })

        .state('apps.schedules.details', {
          url: '/schedules/details/:scheduleId',
          templateProvider: ['$templateCache', function ($templateCache) {
            return $templateCache.get(
              'partials/schedules/schedule-details.html');
          }],
          controller: 'scheduleDetails',
          resolve: {
            scheduleInfo: ['canAccessApps', 'scheduleFactory',
              '$stateParams',
              function (canAccessApps, scheduleFactory, $stateParams) {
                return canAccessApps().then(function () {
                  //load the schedule based on the url param
                  return scheduleFactory.getSchedule($stateParams.scheduleId);
                });
              }
            ]
          }
        })

        .state('apps.schedules.add', {
          url: '/schedules/add',
          templateProvider: ['$templateCache', function ($templateCache) {
            return $templateCache.get(
              'partials/schedules/schedule-add.html');
          }],
          controller: 'scheduleAdd',
          resolve: {
            scheduleInfo: ['canAccessApps', 'scheduleFactory',
              function (canAccessApps, scheduleFactory) {
                return canAccessApps().then(scheduleFactory.newSchedule);
              }
            ]
          }
        });

    }
  ]);

angular.module('risevision.schedules.services', [
  'risevision.common.header',
  'risevision.common.gapi',
  'risevision.apps.launcher.services',
  'risevision.template-editor.services'
]);
angular.module('risevision.schedules.filters', []);
angular.module('risevision.schedules.directives', [
  'risevision.schedules.filters'
]);
angular.module('risevision.schedules.controllers', []);
