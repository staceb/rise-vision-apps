'use strict';
describe('controller: display add', function() {
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
        }
      };
    });
    $provide.service('$loading',function(){
      return {
        start : function(spinnerKeys){
          return;
        },
        stop : function(spinnerKeys){
          return;
        }
      }
    });

  }));
  var $scope, displayFactory, $loading,$loadingStartSpy, $loadingStopSpy, displayAdded;
  beforeEach(function(){
    displayAdded = false;
    
    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      displayFactory = $injector.get('displayFactory');
      $loading = $injector.get('$loading');
      $loadingStartSpy = sinon.spy($loading, 'start');
      $loadingStopSpy = sinon.spy($loading, 'stop');
      $controller('displayAdd', {
        $scope : $scope,
        displayFactory: displayFactory,
        $loading: $loading,
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
    $scope.displayDetails = {};
    $scope.displayDetails.$valid = false;
    $scope.save();
  });

  it('should save the display',function(){
    $scope.displayDetails = {};
    $scope.displayDetails.$valid = true;
    $scope.display = {id:123};
    $scope.save();

    expect(displayAdded).to.be.true;

  });

  it('should show/hide loading spinner if loading', function(done) {
    $scope.$digest();
    $loadingStartSpy.should.have.been.calledWith('display-loader');

    displayFactory.loadingDisplay = false;
    $scope.$digest();
    setTimeout(function(){
      $loadingStopSpy.should.have.been.calledWith('display-loader');
      done();
    },10);
  })
});
