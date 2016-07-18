'use strict';
  
describe('service: playlistItemFactory:', function() {
  beforeEach(module('risevision.editor.services'));
  beforeEach(module(function ($provide) {
    item = {
      'name': 'item1',
      'duration': '10',
      'type': 'gadget',
      'objectReference': null,
      'index': '0',
      'playUntilDone': 'false',
      'objectData': 'Hello Digital',
      'additionalParams': null,
      'timeDefined': 'false'
    };

    $provide.service('$modal',function(){
      return {
        open : function(obj){
          var deferred = Q.defer();

          openModal = obj.controller;
          if (obj.resolve) {
            currentItem = obj.resolve.item ? obj.resolve.item() : undefined;
            obj.resolve.category ? obj.resolve.category() : undefined;
          }

          if(openModal === 'WidgetItemModalController') {
            deferred.resolve({
              url:'http://www.risevision.com/widget.html',
              settingsUrl:'http://www.risevision.com/settings.html'
            });
          } else {
            deferred.resolve({additionalParams: 'updatedParams'});
          }
         
          return {
            result: deferred.promise
          };
        }
      }
    });
    
    $provide.service('gadgetFactory', function() {
      return {
        getGadget: function(gadgetId) {
          var deferred = Q.defer();

          deferred.resolve({
            id: gadgetId,
            name: 'gadgetName',
            url: 'http://someurl.com/gadget.html',
            gadgetType: 'Widget'
          });
          
          return deferred.promise;
        },
        getGadgetByProduct: function() {
          var deferred = Q.defer();

          deferred.resolve({
            id: 'gadgetId',
            name: 'gadgetName',
            url: 'http://someurl.com/gadget.html',
            gadgetType: 'Widget'
          });
          
          return deferred.promise;
        }
      };
    });

    $provide.service('presentationTracker', function() {
      return function(eventName){
        trackedEvent = eventName;
      };
    });

    $provide.service('editorFactory', function() {
      return {
        presentation: {}
      };
    });
    
    $provide.value('TEXT_WIDGET_ID', 'textWidgetId');

  }));
  var item, playlistItemFactory, openModal, currentItem, trackedEvent;

  beforeEach(function(){
    openModal = null;
    currentItem = null;
    
    inject(function($injector){  
      playlistItemFactory = $injector.get('playlistItemFactory');
      playlistItemFactory.item = item;
    });
  });

  it('should exist',function(){
    expect(playlistItemFactory).to.be.truely;

    expect(playlistItemFactory.addContent).to.be.a('function');
    expect(playlistItemFactory.addTextWidget).to.be.a('function');
    expect(playlistItemFactory.edit).to.be.a('function');

  });
  
  it('edit: ', function() {
    playlistItemFactory.edit(item);
    
    expect(openModal).to.equal('PlaylistItemModalController');
    expect(currentItem).to.equal(item);
  });
  
  describe('add widget: ', function() {
    it('should add new widget', function(done) {
      playlistItemFactory.addContent();

      expect(trackedEvent).to.equal('Add Content');
      expect(openModal).to.equal('storeProductsModal');
      expect(currentItem).to.not.be.ok;

      setTimeout(function() {
        expect(openModal).to.equal('PlaylistItemModalController');
        expect(currentItem).to.deep.equal({
          duration: 10,
          distributeToAll: true,
          timeDefined: false,
          additionalParams: null,
          type: 'widget',
          objectReference: 'gadgetId',
          name: 'gadgetName',
          objectData: 'http://someurl.com/gadget.html'
        });
        
        done();
      }, 10);
    });
  });
  
  it('addTextWidget:', function(done) {
    playlistItemFactory.addTextWidget();

    expect(trackedEvent).to.equal('Add Text Widget');
    expect(currentItem).to.not.be.ok;

    setTimeout(function() {
      expect(openModal).to.equal('PlaylistItemModalController');
      expect(currentItem).to.deep.equal({
        duration: 10,
        distributeToAll: true,
        timeDefined: false,
        additionalParams: null,
        type: 'widget',
        objectReference: 'textWidgetId',
        name: 'gadgetName',
        objectData: 'http://someurl.com/gadget.html'
      });
      
      done();
    }, 10);
  });

  describe('add widget by url: ', function() {
    it('should add widget by url', function(done) {
      playlistItemFactory.addWidgetByUrl();
      
      expect(trackedEvent).to.equal('Add Widget By URL');
      expect(openModal).to.equal('WidgetItemModalController');
      expect(currentItem).to.not.be.ok;
      setTimeout(function() {
        expect(openModal).to.equal('PlaylistItemModalController');
        expect(currentItem).to.deep.equal({
          duration: 10,
          distributeToAll: true,
          timeDefined: false,
          additionalParams: null,
          type: 'widget',
          name: 'Widget from URL',
          objectData: 'http://www.risevision.com/widget.html',
          settingsUrl:'http://www.risevision.com/settings.html' 
        });
        done();
      }, 10);
    });
  });
});
