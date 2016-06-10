'use strict';
describe('controller: display add modal', function() {
  var displayId = 1234;
  beforeEach(module('risevision.displays.controllers'));
  beforeEach(module('risevision.displays.services'));
  beforeEach(module(mockTranlate()));
  beforeEach(module(function ($provide) {
    $provide.service('displayFactory',function(){
      return {
        display: {},
        loadingDisplay: true,
        addDisplay : function(){
          displayAdded = true;

          return Q.resolve();
        }
      };
    });
    
    $provide.service('$modalInstance',function(){
      return {
        dismiss : function(action){
          return;
        }
      }
    });

  }));
  var $scope, displayFactory, $modalInstanceDismissSpy, displayAdded;
  beforeEach(function(){
    displayAdded = false;
    
    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      displayFactory = $injector.get('displayFactory');
      var $modalInstance = $injector.get('$modalInstance');
      $modalInstanceDismissSpy = sinon.spy($modalInstance, 'dismiss');

      $controller('displayAddModal', {
        $scope : $scope,
        displayFactory: displayFactory,
        $modalInstance: $modalInstance,
        $log: $injector.get('$log')
      });
      $scope.$digest();
    });
  });
  
  it('should exist',function(){
    expect($scope).to.be.truely;

    expect($scope.save).to.be.a('function');
  });

  it('should init the correct defaults',function(){
    expect($scope.display).to.be.truely;
    expect($scope.display).to.deep.equal({});
  });

  it('should return early if the form is invalid',function(){
    $scope.displayAdd = {};
    $scope.displayAdd.$valid = false;
    $scope.save();
  });

  it('should save the display',function(){
    $scope.displayAdd = {};
    $scope.displayAdd.$valid = true;
    $scope.display = {id:123};
    $scope.save();

    expect(displayAdded).to.be.true;

  });

  it('should dismiss modal when clicked on close with no action',function(){
    $scope.dismiss();

    $modalInstanceDismissSpy.should.have.been.called;
  });

});
