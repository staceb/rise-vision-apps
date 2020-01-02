'use strict';
describe('directive: onboarding-display-add', function() {
  var $compile,
      $rootScope,
      $scope,
      element,
      firstDisplay,
      companyAssetsFactory,
      displayFactory,
      tracker;
  beforeEach(module('risevision.apps.launcher.directives'));
  beforeEach(module(function ($provide) {
    $provide.service('displayFactory', function() {
      return {
        init: sinon.stub()
      };
    }); 
    $provide.service('companyAssetsFactory', function() {
      return {
        getFirstDisplay: sinon.stub().returns(Q.resolve(firstDisplay))        
      };
    });
    $provide.service('displayTracker', function() { 
      return tracker = sinon.stub();
    });
  }));
  beforeEach(inject(function(_$compile_, _$rootScope_, $templateCache, $injector){
    firstDisplay = {id: 'firstDislay'};
    displayFactory = $injector.get('displayFactory');
    companyAssetsFactory = $injector.get('companyAssetsFactory');    
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $templateCache.put('partials/launcher/onboarding-display-add.html', '<p>mock</p>');
  }));

  function compileDirective(downloadOnly) {
    element = $compile('<onboarding-display-add download-only="'+downloadOnly+'" ></onboarding-display-add>')($rootScope.$new());
    $rootScope.$digest();
    $scope = element.isolateScope(); 
  }

  describe('onboarding-display-add:', function () {
    beforeEach(function() {
      compileDirective(true);
    });

    it('should compile', function() {
      expect(element[0].outerHTML).to.equal('<onboarding-display-add download-only="true" class="ng-scope ng-isolate-scope"><p>mock</p></onboarding-display-add>');
    });

    it('should initialize scope', function() {
      expect($scope.downloadOnly).to.be.true;
      expect($scope.setCurrentPage).to.be.a.function;
      expect($scope.showMediaPlayerPage).to.be.a.function;      
      expect($scope.display).to.not.be.ok;
    });

    it('should set current page', function() {
      $scope.setCurrentPage('name');

      expect($scope.currentPage).to.equal('name');
    });
  });

  describe('showMediaPlayerPage:',function() {
    beforeEach(function() {
      $scope.display = {id: 'id', name: 'name'};
    });

    it('should show user media player page the and track event', function() {
      $scope.showMediaPlayerPage(true);
      expect($scope.currentPage).to.equal('userMediaPlayer');
      expect(tracker).to.have.been.calledWith('Media Player Type Selected', 'id', 'name', undefined, true);
    });

    it('should show buy media player page the and track event', function() {
      $scope.showMediaPlayerPage(false);
      expect($scope.currentPage).to.equal('preconfiguredMediaPlayer');
      expect(tracker).to.have.been.calledWith('Media Player Type Selected', 'id', 'name', undefined, false);
    });
  });

  describe('on displayCreated:',function() {
    beforeEach(function() {
      compileDirective(true);
    });

    it('should set display from factory', function() {
      var display = {id:'myDisplay'};
      displayFactory.display = display;
      $scope.$emit('displayCreated');
      $scope.$digest();

      expect($scope.display).to.equal(display);
    });
  });

  describe('downloadOnly:',function() {
    it('should load first display if downloadOnly', function(done) {
      compileDirective(true);

      expect(companyAssetsFactory.getFirstDisplay).to.have.been.called;
      setTimeout(function(){
        expect($scope.display).to.equal(firstDisplay);
        expect($scope.currentPage).to.equal('displayAdded');
        done();
      },10);
    });

    it('should init factory if not downloadOnly', function() {
      var display = {id:'myDisplay'};
      displayFactory.display = display;
      compileDirective(false);

      expect(displayFactory.init).to.have.been.called;
      expect($scope.display).to.equal(display);
      expect(companyAssetsFactory.getFirstDisplay).to.not.have.been.called;
    });
  });


});
