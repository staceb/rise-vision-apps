'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateEditorToolbar', ['templateEditorFactory',
    function (templateEditorFactory) {
      return {
        restrict: 'E',
        templateUrl: 'partials/template-editor/toolbar.html',
        link: function ($scope, element) {
          $scope.factory = templateEditorFactory;
          $scope.isEditingName = false;

          $scope.onPresentationNameBlur = function() {
            $scope.isEditingName = false;
          };

          $scope.$watch("isEditingName", function(editing) {
            var templateNameInput = element.find('input.presentation-name');

            if (editing) {
              setFocusPosition(templateNameInput[0], templateNameInput[0].value.length);
            }
          });

          function setFocusPosition(elem, caretPos) {
            if (elem !== null) {
              if (elem.createTextRange) {
                var range = elem.createTextRange();
                range.move('character', caretPos);
                range.select();
              } else {
                if (elem.setSelectionRange) {
                  elem.focus();
                  elem.setSelectionRange(caretPos, caretPos);
                } else
                  elem.focus();
              }
            }
          }
        }
      };
    }
  ]);
