'use strict';

angular.module('risevision.editor.directives')
  .directive('toolbar', ['editorFactory', 'placeholdersFactory',
    function (editorFactory, placeholdersFactory) {
      return {
        restrict: 'E',
        templateUrl: 'partials/editor/toolbar.html',
        link: function ($scope) {
          $scope.addNewPlaceholder = function () {
            placeholdersFactory.addNewPlaceholder();
          };

          $scope.openProperties = function () {
            editorFactory.openPresentationProperties();
          };
        } //link()
      };
    }
  ]);
