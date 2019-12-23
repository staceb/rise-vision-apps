'use strict';
describe('service: onboardingFactory:', function() {
  beforeEach(module('risevision.apps.launcher.services'));

  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});

    $provide.service('companyAssetsFactory', function() {
      return {
        hasTemplates: sinon.stub(),
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
    expect(onboardingFactory.isOnboarding).to.be.a('function');
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
        creationDate: 'Nov 25, 2019'
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

  describe('onboardingStep:', function() {
    it('should reset on Company change', function() {
      onboardingFactory.onboardingStep = 'step1';

      $rootScope.$emit('risevision.company.selectedCompanyChanged');
      $rootScope.$digest();

      expect(onboardingFactory.onboardingStep).to.be.undefined;
    });

    it('should not set onboarding step if isOnboarding is false', function() {
      onboardingFactory.onboardingStep = 'step1';
      sinon.stub(onboardingFactory, 'isOnboarding').returns(false);

      $rootScope.$emit('risevision.company.selectedCompanyChanged');
      $rootScope.$digest();

      expect(onboardingFactory.onboardingStep).to.be.undefined;
      companyAssetsFactory.hasTemplates.should.not.have.been.called;
      companyAssetsFactory.hasDisplays.should.not.have.been.called;
    });

    it('should load assets if isOnboarding', function() {
      onboardingFactory.onboardingStep = 'step1';

      $rootScope.$emit('risevision.company.selectedCompanyChanged');
      $rootScope.$digest();

      expect(onboardingFactory.onboardingStep).to.be.undefined;
      companyAssetsFactory.hasTemplates.should.have.been.calledWith(true);
      companyAssetsFactory.hasDisplays.should.have.been.calledWith(true);
    });

    it('should show addTemplate', function(done) {
      companyAssetsFactory.hasTemplates.returns(Q.resolve(false));
      companyAssetsFactory.hasDisplays.returns(Q.resolve());

      $rootScope.$emit('risevision.company.selectedCompanyChanged');
      $rootScope.$digest();

      setTimeout(function() {
        expect(onboardingFactory.onboardingStep).to.equal('addTemplate');

        done();
      }, 10);      
    });

    it('should show addDisplay', function(done) {
      companyAssetsFactory.hasTemplates.returns(Q.resolve(true));
      companyAssetsFactory.hasDisplays.returns(Q.resolve({
        hasDisplays: false
      }));

      $rootScope.$emit('risevision.company.selectedCompanyChanged');
      $rootScope.$digest();

      setTimeout(function() {
        expect(onboardingFactory.onboardingStep).to.equal('addDisplay');

        done();
      }, 10);
    });

    it('should show activateDisplay', function(done) {
      companyAssetsFactory.hasTemplates.returns(Q.resolve(true));
      companyAssetsFactory.hasDisplays.returns(Q.resolve({
        hasDisplays: true,
        hasActivatedDisplays: false
      }));

      $rootScope.$emit('risevision.company.selectedCompanyChanged');
      $rootScope.$digest();

      setTimeout(function() {
        expect(onboardingFactory.onboardingStep).to.equal('activateDisplay');

        done();
      }, 10);
    });

    it('should show promotePlaybook', function(done) {
      companyAssetsFactory.hasTemplates.returns(Q.resolve(true));
      companyAssetsFactory.hasDisplays.returns(Q.resolve({
        hasDisplays: true,
        hasActivatedDisplays: true
      }));

      $rootScope.$emit('risevision.company.selectedCompanyChanged');
      $rootScope.$digest();

      setTimeout(function() {
        expect(onboardingFactory.onboardingStep).to.equal('promotePlaybook');

        done();
      }, 10);
    });

  });
});
