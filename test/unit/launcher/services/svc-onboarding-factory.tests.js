'use strict';
describe('service: onboardingFactory:', function() {
  beforeEach(module('risevision.apps.launcher.services'));

  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});

    $provide.service('companyAssetsFactory', function() {
      return {
        hasTemplates: sinon.stub(),
        hasSchedules: sinon.stub(),
        hasDisplays: sinon.stub()
      };
    });

    $provide.service('userState',function(){
      return {
        getCopyOfSelectedCompany: sinon.stub().returns({
          creationDate: 'Jan 1, 2020'
        }),
        getCopyOfProfile: sinon.stub(),
        isEducationCustomer: sinon.stub().returns(true),
        _restoreState: function(){}
      }
    });

    $provide.service('updateUser', function() {
      return function() {
        return Q.resolve();
      };
    });

    $provide.service('$localStorage', function() {
      return {
        onboarding: {
          currentStep: 2
        }
      };
    });

  }));
  
  var onboardingFactory, $localStorage, userState, companyAssetsFactory;
  beforeEach(function() {
    inject(function($injector) {
      $localStorage = $injector.get('$localStorage');
      userState = $injector.get('userState');
      companyAssetsFactory = $injector.get('companyAssetsFactory');
      
      onboardingFactory = $injector.get('onboardingFactory');
    });
  });

  it('should exist', function() {
    expect(onboardingFactory).to.be.ok;
    expect(onboardingFactory.isCurrentStep).to.be.a('function');
    expect(onboardingFactory.isCurrentTab).to.be.a('function');
    expect(onboardingFactory.setCurrentTab).to.be.a('function');
    expect(onboardingFactory.isTabCompleted).to.be.a('function');
    expect(onboardingFactory.isOnboarding).to.be.a('function');
    expect(onboardingFactory.isTemplateOnboarding).to.be.a('function');
    expect(onboardingFactory.refresh).to.be.a('function');
    expect(onboardingFactory.setPlaybookSignup).to.be.a('function');
    expect(onboardingFactory.onboardingStep).to.be.undefined;
  });

  it('should initialize $localStorage.onboarding value', function() {
    expect($localStorage.onboarding).to.deep.equal({
      currentStep: 2,
      completed: false
    });
  });

  describe('isOnboarding:', function() {
    it('should return false if not an education customer', function() {
      userState.isEducationCustomer.returns(false);

      expect(onboardingFactory.isOnboarding()).to.be.false;
    });

    it('should return false if company was created before the launch date', function() {
      userState.getCopyOfSelectedCompany.returns({
        creationDate: 'Nov 25, 2010'
      });

      expect(onboardingFactory.isOnboarding()).to.be.false;
    });

    it('should return true if company was created after the launch date', function() {
      expect(onboardingFactory.isOnboarding()).to.be.true;
    });

    it('should return false if company has already completed onboarding', function() {
      $localStorage.onboarding = {
        completed: true
      };

      expect(onboardingFactory.isOnboarding()).to.be.false;
    });
  });

  describe('isTemplateOnboarding',function() {
    it('should return true if is onboarding and first step', function() {
      sinon.stub(onboardingFactory, 'isOnboarding').returns(true);
      sinon.stub(onboardingFactory, 'isCurrentTab').withArgs(1).returns(true);
      expect(onboardingFactory.isTemplateOnboarding()).to.be.true;
    });

    it('should return false if not onboarding', function() {
      sinon.stub(onboardingFactory, 'isOnboarding').returns(false);
      sinon.stub(onboardingFactory, 'isCurrentTab').withArgs(1).returns(true);
      expect(onboardingFactory.isTemplateOnboarding()).to.be.false;
    });

    it('should return false if is onboarding but not first step', function() {
      sinon.stub(onboardingFactory, 'isOnboarding').returns(true);
      sinon.stub(onboardingFactory, 'isCurrentTab').withArgs(1).returns(false);
      expect(onboardingFactory.isTemplateOnboarding()).to.be.false;
    });
  });

  describe('refresh:', function() {
    it('should go to initial step', function(done) {
      expect(onboardingFactory.isCurrentStep('addTemplate')).to.be.false;
      companyAssetsFactory.hasSchedules.returns(Q.resolve(false));
      
      onboardingFactory.refresh().then(function(){
        expect(onboardingFactory.isCurrentStep('addTemplate')).to.be.true;
        expect(onboardingFactory.isCurrentTab(1)).to.be.true;
        expect(onboardingFactory.isTabCompleted(1)).to.be.false;
        expect(onboardingFactory.loading).to.be.false;
        done();
      });
      expect(onboardingFactory.loading).to.be.true;
    });

    it('should resolve if not onboarding', function(done) {
      sinon.stub(onboardingFactory, 'isOnboarding').returns(false);
      companyAssetsFactory.hasSchedules.returns(Q.resolve(false));
      
      onboardingFactory.refresh().then(function(){
        expect(onboardingFactory.isCurrentStep('addTemplate')).to.be.false;
        expect(onboardingFactory.isCurrentTab(1)).to.be.false;
        expect(onboardingFactory.isTabCompleted(1)).to.be.false;
        done();
      });
    });

    it('should reject on rejected requests', function(done) {
      expect(onboardingFactory.isCurrentStep('addTemplate')).to.be.false;
      companyAssetsFactory.hasSchedules.returns(Q.reject());
      
      onboardingFactory.refresh()
        .then(done)
        .catch(function(){
          expect(onboardingFactory.loading).to.be.false;
          expect(onboardingFactory.isCurrentStep('addTemplate')).to.be.false;
          expect(onboardingFactory.isCurrentTab(1)).to.be.false;
          expect(onboardingFactory.isTabCompleted(1)).to.be.false;
          done();
        });
      expect(onboardingFactory.loading).to.be.true;
    });

    it('should show templateAdded after addTemplate', function(done) {
      companyAssetsFactory.hasSchedules.returns(Q.resolve(false));
      onboardingFactory.refresh().then(function(){
        expect(onboardingFactory.isCurrentStep('addTemplate')).to.be.true;
        
        companyAssetsFactory.hasSchedules.returns(Q.resolve(true));
        onboardingFactory.refresh().then(function(){
          expect(onboardingFactory.isCurrentStep('templateAdded')).to.be.true;
          expect(onboardingFactory.isCurrentTab(1)).to.be.true;
          expect(onboardingFactory.isTabCompleted(1)).to.be.true;
          expect(onboardingFactory.isCurrentStep('addTemplate')).to.be.false;
          done();
        });
      });
    });

    it('should show addDisplay', function(done) {
      companyAssetsFactory.hasSchedules.returns(Q.resolve(true));
      companyAssetsFactory.hasDisplays.returns(Q.resolve({
        hasDisplays: false        
      }));
      
      onboardingFactory.refresh().then(function(){
        expect(onboardingFactory.isCurrentStep('addDisplay')).to.be.true;
        expect(onboardingFactory.isCurrentTab(2)).to.be.true;

        expect(onboardingFactory.isTabCompleted(1)).to.be.true;
        expect(onboardingFactory.isTabCompleted(2)).to.be.false;
        done();
      });
    });

    it('should show activateDisplay', function(done) {
      companyAssetsFactory.hasSchedules.returns(Q.resolve(true));
      companyAssetsFactory.hasDisplays.returns(Q.resolve({
        hasDisplays: true,
        hasActivatedDisplays: false        
      }));
      
      onboardingFactory.refresh().then(function(){
        expect(onboardingFactory.isCurrentStep('activateDisplay')).to.be.true;
        expect(onboardingFactory.isCurrentTab(2)).to.be.true;

        expect(onboardingFactory.isTabCompleted(1)).to.be.true;
        expect(onboardingFactory.isTabCompleted(2)).to.be.false;
        done();
      });
    });

    it('should show displayActivated after addDisplay', function(done) {
      companyAssetsFactory.hasSchedules.returns(Q.resolve(true));
      companyAssetsFactory.hasDisplays.returns(Q.resolve({
        hasDisplays: false
      }));      
      onboardingFactory.refresh().then(function(){
        expect(onboardingFactory.isCurrentStep('addDisplay')).to.be.true;
        companyAssetsFactory.hasDisplays.returns(Q.resolve({
          hasDisplays: true,
          hasActivatedDisplays: true
        }));
        onboardingFactory.refresh().then(function(){
          expect(onboardingFactory.isCurrentStep('displayActivated')).to.be.true;
          expect(onboardingFactory.isCurrentTab(2)).to.be.true;

          expect(onboardingFactory.isTabCompleted(1)).to.be.true;
          expect(onboardingFactory.isTabCompleted(2)).to.be.true;
          done();
        });
      });
    });

    it('should show displayActivated after activateDisplay', function(done) {
      companyAssetsFactory.hasSchedules.returns(Q.resolve(true));
      companyAssetsFactory.hasDisplays.returns(Q.resolve({
        hasDisplays: true,
        hasActivatedDisplays: false
      }));      
      onboardingFactory.refresh().then(function(){
        expect(onboardingFactory.isCurrentStep('activateDisplay')).to.be.true;
        companyAssetsFactory.hasDisplays.returns(Q.resolve({
          hasDisplays: true,
          hasActivatedDisplays: true
        }));
        onboardingFactory.refresh().then(function(){
          expect(onboardingFactory.isCurrentStep('displayActivated')).to.be.true;
          expect(onboardingFactory.isCurrentTab(2)).to.be.true;
          done();
        });
      });
    });

    it('should show promotePlaybook', function(done) {
      companyAssetsFactory.hasSchedules.returns(Q.resolve(true));
      companyAssetsFactory.hasDisplays.returns(Q.resolve({
        hasDisplays: true,
        hasActivatedDisplays: true
      }));
      
      onboardingFactory.refresh().then(function(){
        expect(onboardingFactory.isCurrentStep('promotePlaybook')).to.be.true;
        expect(onboardingFactory.isCurrentTab(3)).to.be.true;
        expect(onboardingFactory.isTabCompleted(3)).to.be.false;
        done();
      });
    });

    it('should show promoteTraining and complete onboarding', function(done) {
      companyAssetsFactory.hasSchedules.returns(Q.resolve(true));
      companyAssetsFactory.hasDisplays.returns(Q.resolve({
        hasDisplays: true,
        hasActivatedDisplays: true
      }));
      userState.getCopyOfProfile.returns({mailSyncEnabled:true});
      
      onboardingFactory.refresh().then(function(){
        expect(onboardingFactory.isCurrentStep('promoteTraining')).to.be.true;
        expect(onboardingFactory.isCurrentTab(3)).to.be.true;
        expect(onboardingFactory.isTabCompleted(3)).to.be.true;
        expect(onboardingFactory.alreadySubscribed).to.be.true;
        expect($localStorage.onboarding.completed).to.be.true;
        
        done();
      });
    });
  });
});
