'use strict';
describe('directive: weekly-templates', function() {
  var $compile,
      $rootScope,
      $scope,
      element,
      isEducationCustomer,
      sessionStorage,
      editorFactory;
  beforeEach(module('risevision.apps.launcher.directives'));
  beforeEach(module(function ($provide) {
    $provide.service('productsFactory', function() {
      return {
      };
    }); 
    $provide.service('ScrollingListService', function() {
      return function() {
        return {
          search: {},
          loadingItems: false,
          doSearch: sinon.stub()
        };
      };
    });
    $provide.service('editorFactory', function() {
      return editorFactory;
    });  
    $provide.service('userState', function() {
      return {
        isEducationCustomer: function() {
          return isEducationCustomer;
        }
      };
    });
    $provide.service('$sessionStorage', function() {
      return sessionStorage
    });   
    
  }));
  beforeEach(inject(function(_$compile_, _$rootScope_, $templateCache){
    isEducationCustomer = true;
    sessionStorage = {
        $default: sinon.stub(),
        weeklyTemplatesFullView: true
    };
    editorFactory = {addFromProduct: sinon.stub()};

    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $templateCache.put('partials/launcher/weekly-templates.html', '<p>mock</p>');
  }));

  function compileDirective() {
    element = $compile('<weekly-templates></weekly-templates>')($rootScope.$new());
    $rootScope.$digest();
    $scope = element.isolateScope();   
  }

  describe('weekly-templates:', function () {
    beforeEach(function(){
      compileDirective();
    });

    it('should compile', function() {
      expect(element[0].outerHTML).to.equal('<weekly-templates class="ng-scope ng-isolate-scope"><p>mock</p></weekly-templates>');
    });

    it('should initialize scope', function() {
      expect($scope.fullView).to.be.true;
      expect($scope.search).to.deep.equal({
          filter: 'templateOfTheWeek:1',
          category: 'Templates',
          count: 4
        }
      );
      expect($scope.factory).to.be.a.function;
      expect($scope.toggleView).to.be.a.function;
      expect($scope.select).to.be.a.function;
    });

    it('should use session storage value for fullView',function() {
      expect($scope.fullView).to.be.true;
      sessionStorage.weeklyTemplatesFullView = false;
      compileDirective();
      expect($scope.fullView).to.be.false;
    })

    it('should load Templates if Education',function() {
      expect($scope.factory).to.be.a.function;
      isEducationCustomer = true;
      compileDirective();
      expect($scope.factory).to.be.a.function;
    });

    it('should not load Templates if not Education',function() {
      isEducationCustomer = false;
      compileDirective();
      expect($scope.factory).to.not.be.a.function;
    });

  });

  describe('weekly-templates: toggleView()', function () {
    beforeEach(function(){
      compileDirective();
    });    

    it('should toggle fullView',function(){
      expect($scope.fullView).to.be.true;
      $scope.toggleView();
      expect($scope.fullView).to.be.false;
      $scope.toggleView();
      expect($scope.fullView).to.be.true;
    });

    it('should save state in session', function () {
      expect(sessionStorage.weeklyTemplatesFullView).to.be.true;
      $scope.toggleView();
      expect(sessionStorage.weeklyTemplatesFullView).to.be.false;
      $scope.toggleView();
      expect(sessionStorage.weeklyTemplatesFullView).to.be.true;
    });
  });

  describe('weekly-templates: select()',function(){
    beforeEach(function(){
      compileDirective();
    });  

    it('should copy template',function(){
      var product = {}
      $scope.select(product);
      editorFactory.addFromProduct.should.have.been.calledWith(product);
    });
  });

});
