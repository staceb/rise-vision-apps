'use strict';
describe('controller: AutoScheduleModalController', function() {
  beforeEach(module('risevision.editor.controllers'));
  beforeEach(module(function ($provide) {
    presentationName = {};
    $provide.service('$modalInstance',function(){
      return {
        dismiss : function(){}
      }
    });  
    $provide.service('launcherTracker',function(){
      return launcherTracker = {}
    });    
  }));
  var $scope, $modalInstance, $modalInstanceDismissSpy, presentationName, launcherTracker;

  beforeEach(function(){

    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      $modalInstance = $injector.get('$modalInstance');
      
      $modalInstanceDismissSpy = sinon.spy($modalInstance, 'dismiss');

      $controller('AutoScheduleModalController', {
        $scope: $scope,
        $modalInstance : $modalInstance,
        presentationName: presentationName
      });
      $scope.$digest();
    });
  });
  
  it('should exist',function(){
    expect($scope).to.be.ok;
    expect($scope.dismiss).to.be.a('function');
    expect($scope.presentationName).to.equal(presentationName);
    expect($scope.launcherTracker).to.equal(launcherTracker);
  });

  it('should dismiss modal',function(){
      $scope.dismiss();
      $modalInstanceDismissSpy.should.have.been.called;
  });

});
