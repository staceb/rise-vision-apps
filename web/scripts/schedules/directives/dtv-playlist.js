'use strict';

angular.module('risevision.schedules.directives')
  .directive('playlist', ['$modal', '$templateCache', 'playlistFactory',
    function ($modal, $templateCache, playlistFactory) {
      return {
        restrict: 'E',
        scope: {
          playlistItems: '='
        },
        templateUrl: 'partials/schedules/playlist.html',
        link: function ($scope) {
          $scope.factory = playlistFactory;

          $scope.manage = function (playlistItem) {
            $modal.open({
              templateUrl: 'partials/schedules/playlist-item.html',
              controller: 'playlistItemModal',
              size: 'md',
              resolve: {
                playlistItem: function () {
                  return playlistItem;
                }
              }
            });
          };

          $scope.remove = function (playlistItem) {
            var modalInstance = $modal.open({
              template: $templateCache.get(
                'partials/components/confirm-modal/confirm-modal.html'),
              controller: 'confirmModalController',
              windowClass: 'modal-custom',
              resolve: {
                confirmationTitle: function () {
                  return 'Remove Playlist Item';
                },
                confirmationMessage: function () {
                  return 'Are you sure you want to remove ' +
                    'this item from the Playlist?';
                },
                confirmationButton: function () {
                  return 'Remove';
                },
                cancelButton: null
              }
            });

            modalInstance.result.then(function () {
              playlistFactory.removePlaylistItem(playlistItem);
            });
          };

          $scope.sortItem = function (evt) {
            var oldIndex = evt.data.oldIndex;
            var newIndex = evt.data.newIndex;

            playlistFactory.moveItem(oldIndex, newIndex);
          };
        } //link()
      };
    }
  ]);
