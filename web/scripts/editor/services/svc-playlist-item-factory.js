'use strict';

angular.module('risevision.editor.services')
  .factory('playlistItemFactory', ['$modal', 'gadgetFactory',
    'presentationTracker', 'editorFactory', 'TEXT_WIDGET_ID',
    function ($modal, gadgetFactory, presentationTracker, editorFactory,
      TEXT_WIDGET_ID) {
      var factory = {};

      var _newPlaylistItem = function () {
        return {
          duration: 10,
          distributeToAll: true,
          timeDefined: false,
          additionalParams: null
        };
      };
      
      var _newWidget = function (widget) {
        var item = _newPlaylistItem();

        item.type = widget.gadgetType ? 
          widget.gadgetType.toLowerCase() : 'widget';
        item.name = widget.name ? widget.name : 'Widget Item';

        item.objectData = widget.url;
        item.objectReference = widget.id;

        factory.edit(item, true);
      };

      var _addProduct = function (productDetails) {
        presentationTracker('Content Selected', editorFactory.presentation.id,
          editorFactory.presentation.name);
        gadgetFactory.getGadgetByProduct(productDetails.productCode)
          .then(function (gadget) {
            _newWidget(gadget);
          });
      };

      factory.addContent = function () {
        presentationTracker('Add Content', editorFactory.presentation.id,
          editorFactory.presentation.name);
        var modalInstance = $modal.open({
          templateUrl: 'partials/editor/store-products-modal.html',
          size: 'lg',
          controller: 'storeProductsModal',
          resolve: {
            category: function () {
              return 'Content';
            }
          }
        });

        modalInstance.result.then(_addProduct);
      };
      
      var _addWidgetById = function(widgetId) {
        gadgetFactory.getGadget(widgetId)
          .then(function (gadget) {
            _newWidget(gadget);
          });
      }
      
      factory.addTextWidget = function() {
        presentationTracker('Add Text Widget', editorFactory.presentation.id,
          editorFactory.presentation.name);

        _addWidgetById(TEXT_WIDGET_ID);
      };

      factory.edit = function (item, showWidgetModal) {
        var modalInstance = $modal.open({
          templateUrl: 'partials/editor/playlist-item-modal.html',
          size: 'md',
          controller: 'PlaylistItemModalController',
          resolve: {
            item: function () {
              return item;
            },
            showWidgetModal: function () {
              return showWidgetModal;
            }
          }
        });
      };

      var _newWidgetByUrl = function (widgetDetails) {
        var item = _newPlaylistItem();
        item.type = 'widget';
        item.name = 'Widget from URL';
        item.objectData = widgetDetails.url;
        if (widgetDetails.settingsUrl) {
          item.settingsUrl = widgetDetails.settingsUrl;
        }
        factory.edit(item);
      };

      factory.addWidgetByUrl = function () {
        presentationTracker('Add Widget By URL', editorFactory.presentation
          .id, editorFactory.presentation.name);
        var modalInstance = $modal.open({
          templateUrl: 'partials/editor/widget-item-modal.html',
          controller: 'WidgetItemModalController',
          size: 'md'
        });
        modalInstance.result.then(function (result) {
          if (result && result.url) {
            _newWidgetByUrl(result);
          }
        });
      };

      return factory;
    }
  ]);
