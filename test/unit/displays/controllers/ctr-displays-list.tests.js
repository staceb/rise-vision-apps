'use strict';
describe('controller: displays list', function() {
  beforeEach(module('risevision.displays.controllers'));
  beforeEach(module('risevision.displays.services'));
  beforeEach(module(mockTranlate()));
  beforeEach(module(function ($provide) {
    $provide.service('userState',userState);
    $provide.service('display',function(){
      return {
        list : function(search, cursor){
          apiCount++;
          var deferred = Q.defer();
          if(returnDisplays){
            deferred.resolve(result);
          }else{
            deferred.reject('ERROR; could not retrieve list');
          }
          return deferred.promise;
        }
      }
    });
    $provide.service('$location',function(){
      return {
        _path : '',
        path : function(path){
          if (path){
            this._path = path;
          }
          return this._path;
        },
        search: function() {
          return {};
        },
        url: function() {
          return {};
        }
      }
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
    
    $provide.value('translateFilter', function(){
      return function(key){
        return key;
      };
    });
  }));
  var $scope, userState, $location, returnDisplays, companyId, apiCount, scrollEvent, result, $loading,$loadingStartSpy, $loadingStopSpy;
  beforeEach(function(){
    scrollEvent = {target: {scrollHeight: 0, clientHeight: 0, scrollTop: 0}};
    result = {
      items: [],
      cursor: 'asdf'
    };

    for (var i = 1; i <= 40; i++) {
      result.items.push(i);
    }

    apiCount = 0;
    companyId = 'some_company_id';
    returnDisplays = true;
    userState = function(){
      return {
        getSelectedCompanyId : function(){
          return companyId;
        },
        _restoreState : function(){

        },
        isSubcompanySelected : function(){
          return true;
        }
      }
    };
    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      $scope.listLimit = 5;
      $loading = $injector.get('$loading');
      $loadingStartSpy = sinon.spy($loading, 'start');
      $loadingStopSpy = sinon.spy($loading, 'stop');
      $location = $injector.get('$location');
      $controller('displaysList', {
        $scope : $scope,
        userState : $injector.get('userState'),
        display:$injector.get('display'),
        $location : $location,
        $log : $injector.get('$log'),
        $loading: $loading});
      $scope.$digest();  
    });
  });

  it('should exist',function(){
    expect($scope).to.be.truely;
    expect($scope.displayTracker).to.be.ok;

    expect($scope.sortBy).to.be.a('function');
    expect($scope.doSearch).to.be.a('function');
    expect($scope.load).to.be.a('function');
  });

  it('should init the scope objects',function(){
    expect($scope.displays).to.be.truely;
    expect($scope.displays).to.have.property('list');
    expect($scope.displays).to.have.property('add');
    expect($scope.displays).to.have.property('clear');
    expect($scope.displays).to.have.property('endOfList');
    
    expect($scope.search).to.be.truely;
    expect($scope.search).to.have.property('sortBy');
    expect($scope.search).to.have.property('count');
    expect($scope.search).to.have.property('reverse');
    expect($scope.search.count).to.equal(5);
  });
  
  beforeEach(function(done) {
    setTimeout(function(){
      expect($scope.loadingDisplays).to.be.false;
      expect(apiCount).to.equal(1);
      expect($scope.error).to.not.be.ok;
      
      done();
    },10);
  });
  
  it('should load the list',function(){
    expect($scope.loadingDisplays).to.be.false;
    expect($scope.displays).to.be.truely;
    expect($scope.displays.list).to.have.length(40);
    expect($scope.displays.cursor).to.be.truely;
    expect($scope.displays.endOfList).to.be.false;

  });
  
  describe('list functions: ',function(){
    returnDisplays = true;
    
    describe('load: ',function(){
      it('should re-load if there are more items',function(done){
        result = {
          items: [21],
        };
        $scope.load();
        $scope.$digest();
        
        expect($scope.loadingDisplays).to.be.true;
        $loadingStartSpy.should.have.been.calledWith('displays-list-loader');
        setTimeout(function(){
          expect($scope.loadingDisplays).to.be.false;
          expect($scope.error).to.not.be.ok;
          expect(apiCount).to.equal(2);
          
          expect($scope.displays.list).to.have.length(41);
          expect($scope.displays.cursor).to.not.be.truely;
          expect($scope.displays.endOfList).to.be.true;
          $scope.$digest();
          $loadingStopSpy.should.have.been.calledWith('displays-list-loader');
          done();
        },10);
      });
      
      it('should not re-load if there are no more items',function(done){
        result = {
          items: [41],
        };
        $scope.load();
        $scope.$digest();
        
        expect($scope.loadingDisplays).to.be.true;
        setTimeout(function(){
          $scope.load();
          
          expect($scope.loadingDisplays).to.be.false;
                    
          done();
        },10);
      });
    });
    
    describe('sortBy: ',function(){
      it('should reset list and reverse sort by name',function(done){
        $scope.sortBy('name');
        $scope.$digest();
        
        expect($scope.loadingDisplays).to.be.true;
        setTimeout(function(){
          expect($scope.loadingDisplays).to.be.false;
          expect($scope.error).to.not.be.ok;
          expect(apiCount).to.equal(2);
          
          expect($scope.displays.list).to.have.length(40);

          expect($scope.search.sortBy).to.equal('name');
          expect($scope.search.reverse).to.be.true;
          
          done();
        },10);
      
      });
      
      it('should reset list and sort by status',function(done){
        $scope.sortBy('status');
        $scope.$digest();
        
        expect($scope.loadingDisplays).to.be.true;
        setTimeout(function(){
          expect($scope.loadingDisplays).to.be.false;
          expect($scope.error).to.not.be.ok;
          expect(apiCount).to.equal(2);
          
          expect($scope.displays.list).to.have.length(40);
          
          expect($scope.search.sortBy).to.equal('status');
          expect($scope.search.reverse).to.be.false;
          
          done();
        },10);
      });
    });
    
    it('should reset list and doSearch',function(done){
      $scope.doSearch();
      $scope.$digest();
      
      expect($scope.loadingDisplays).to.be.true;
      setTimeout(function(){
        expect($scope.loadingDisplays).to.be.false;
        expect($scope.error).to.not.be.ok;
        expect(apiCount).to.equal(2);
        
        expect($scope.displays.list).to.have.length(40);
        
        expect($scope.search.sortBy).to.equal('name');
        expect($scope.search.reverse).to.be.false;
        
        done();
      },10);
    });
    
    it('should set error if list fails to load',function(done){
      returnDisplays = false;
      $scope.doSearch();
      $scope.$digest();
      
      expect($scope.loadingDisplays).to.be.true;
      setTimeout(function(){
        expect($scope.loadingDisplays).to.be.false;
        expect($scope.error).to.be.ok;
        expect(apiCount).to.equal(2);
        expect($scope.displays.list).to.have.length(0);
        
        done();
      },10);
    });
  });

});
