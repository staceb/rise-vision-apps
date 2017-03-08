'use strict';
describe('directive: track-play', function() {
  var $compile,
      $rootScope,
      $scope,
      element,
      event;
  beforeEach(module('risevision.apps.launcher.directives'));
  beforeEach(module(function ($provide) {
    $provide.service('launcherTracker', function() {
      return function(eventName) {
        event = eventName
      }
    });
  }));
  beforeEach(inject(function(_$compile_, _$rootScope_){
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    element = $compile('<div track-play></div>')($scope);
    $scope.$digest();
  }));

  describe('track-play:', function () {
    it('should track Play event',function(){
      element.triggerHandler({type:'playing'});
      expect(event).to.equal('Played Tutorial');
    });
  });
});
