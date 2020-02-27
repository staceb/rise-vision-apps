'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateComponentText', ['templateEditorFactory', 'templateEditorUtils',
    function (templateEditorFactory, templateEditorUtils) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/template-editor/components/component-text.html',
        link: function ($scope, element) {
          $scope.factory = templateEditorFactory;

          function _load() {
            var fontsize = $scope.getAvailableAttributeData($scope.componentId, 'fontsize');
            var fontsizeInt = templateEditorUtils.intValueFor(fontsize, null);
            var minfontsize = $scope.getAvailableAttributeData($scope.componentId, 'minfontsize');
            var minfontsizeInt = templateEditorUtils.intValueFor(minfontsize, 1);
            var maxfontsize = $scope.getAvailableAttributeData($scope.componentId, 'maxfontsize');
            var maxfontsizeInt = templateEditorUtils.intValueFor(maxfontsize, 200);

            $scope.minFontSize = minfontsizeInt;
            $scope.maxFontSize = maxfontsizeInt;
            $scope.fontsize = fontsizeInt;
            $scope.showFontSize = !!fontsizeInt;
            $scope.value = $scope.getAvailableAttributeData($scope.componentId, 'value');

            setTimeout(function () {
              console.log("componentId: ", $scope.componentId, "fontsize: ", $scope.fontsize, "fontsizeInt: ", fontsizeInt);
              console.log("minFontSize: ", $scope.minFontSize, "maxFontSize: ", $scope.maxFontSize);

              if ($scope.fontsize !== fontsizeInt) {
                $scope.fontsize = fontsizeInt;
              }
            }, 500);
          }

          $scope.save = function () {
            $scope.setAttributeData($scope.componentId, 'value', $scope.value);

            if ($scope.showFontSize) {
              $scope.setAttributeData($scope.componentId, 'fontsize', $scope.fontsize);
            }
          };

          $scope.registerDirective({
            type: 'rise-text',
            iconType: 'streamline',
            icon: 'text',
            element: element,
            show: function () {
              $scope.componentId = $scope.factory.selected.id;
              _load();
            }
          });

        }
      };
    }
  ]);
