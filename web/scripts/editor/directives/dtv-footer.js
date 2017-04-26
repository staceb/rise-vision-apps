'use strict';

angular.module('risevision.editor.directives')
  .directive('footer', ['editorFactory', '$state',
    function (editorFactory, $state) {
      return {
        restrict: 'E',
        templateUrl: 'partials/editor/footerbar.html',
        link: function ($scope) {
          $scope.factory = editorFactory;

          $scope.showArtboard = function () {
            return editorFactory.validatePresentation()
              .then(function () {
                $scope.designMode = true;
                $state.go('apps.editor.workspace.artboard');
              });
          };

          $scope.showHtmlEditor = function () {
            $scope.designMode = false;
            $state.go('apps.editor.workspace.htmleditor');
          };
        }
      };
    }
  ]);
