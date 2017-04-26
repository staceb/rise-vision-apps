'use strict';

angular.module('risevision.editor.directives')
  .constant('PRESENTATION_BORDER_SIZE', 12)
  .directive('artboardPresentation', ['editorFactory', 'placeholderFactory',
    'PRESENTATION_BORDER_SIZE', '$stateParams',
    function (editorFactory, placeholderFactory, PRESENTATION_BORDER_SIZE, $stateParams) {
      return {
        scope: true,
        restrict: 'E',
        templateUrl: 'partials/editor/artboard-presentation.html',
        link: function ($scope, element, attrs) {
          var heightIncrement = PRESENTATION_BORDER_SIZE;
          var widthIncrement = 2 * PRESENTATION_BORDER_SIZE;

          $scope.editorFactory = editorFactory;
          $scope.placeholderFactory = placeholderFactory;
          element.addClass('artboard-presentation');

          $scope.$watch('editorFactory.presentation', function () {
            $scope.presentation = editorFactory.presentation;
            element.css('width', ($scope.presentation.width +
                widthIncrement) + $scope.presentation
              .widthUnits);
            element.css('height', ($scope.presentation.height +
                heightIncrement) + $scope.presentation
              .heightUnits);
            element.css('background', $scope.presentation.backgroundStyle);
            element.css('backgroundSize',
              $scope.presentation.backgroundScaleToFit ? 'contain' :
              '');
          }, true);

          $scope.$watch('editorFactory.zoomLevel', function () {
            element.css('transform', 'scale('+editorFactory.zoomLevel+')');
            element.css('transform-origin', '0% 0%');
          });

          element.on('mousewheel DOMMouseScroll', function(e){    
              if (e.ctrlKey) {
                e.preventDefault();
                $scope.$apply(function(){
                  if (e.originalEvent.detail < 0 || e.originalEvent.wheelDelta > 0) {
                    editorFactory.zoomOut();
                  } else {
                    editorFactory.zoomIn();
                  }
                });  
              }
          });

          $scope.showEmptyState = function () {
            return !editorFactory.presentation.id && !$scope.hasUnsavedChanges &&
              !$stateParams.copyPresentation;
          };
        } //link()
      };
    }
  ]);
