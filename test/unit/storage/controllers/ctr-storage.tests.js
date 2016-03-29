'use strict';
describe('controller: Storage', function() {
  beforeEach(module('risevision.storage.controllers'));
  beforeEach(module(function ($provide) {
    $provide.service('storageFactory',function(){
      return storageFactory = {
        storageFull: false
        }
    });
  }));
  var $scope, storageFactory;
  beforeEach(function(){
    inject(function($injector,$rootScope, $controller){

      $scope = $rootScope.$new();
      $controller('StorageController', {
        $scope : $scope
      });
      $scope.$digest();
    });
  });
  
  it('should exist',function(){
    expect($scope).to.be.ok;
  });

  it('should set storageFull',function(){
    expect(storageFactory.storageFull).to.be.true;
  });

});
