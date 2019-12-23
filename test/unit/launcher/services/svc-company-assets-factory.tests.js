'use strict';
describe('service: company assets factory:', function() {
  beforeEach(module('risevision.apps.launcher.services'));

  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});

    $provide.service('presentation', function() {
      return {
        list: 'presentationList'
      };
    });

    $provide.service('display', function() {
      return {
        list: 'displayList'
      };
    });

    $provide.service('schedule', function() {
      return {
        list: 'scheduleList'
      };
    });

    $provide.service('CachedRequest', function() {
      return sinon.stub().returns({
        execute: requestExecute = sinon.stub()
      });
    });

  }));
  
  var companyAssetsFactory, CachedRequest, requestExecute;
  beforeEach(function() {
    inject(function($injector) {
      companyAssetsFactory = $injector.get('companyAssetsFactory');
      CachedRequest = $injector.get('CachedRequest');
    });
  });

  it('should exist', function() {
    expect(companyAssetsFactory).to.be.ok;
    expect(companyAssetsFactory.hasPresentations).to.be.a('function');
    expect(companyAssetsFactory.hasSchedules).to.be.a('function');
    expect(companyAssetsFactory.getFirstDisplay).to.be.a('function');
    expect(companyAssetsFactory.hasDisplays).to.be.a('function');
  });

  it('should initialize CachedRequest services', function() {
    CachedRequest.should.have.been.calledThrice;
    CachedRequest.should.have.been.calledWith('presentationList', {
      sortBy: 'changeDate',
      reverse: true,
      count: 1
    });

    CachedRequest.should.have.been.calledWith('scheduleList', {
      count: 1,
      reverse: true,
      sortBy: "changeDate"
    });

    CachedRequest.should.have.been.calledWith('displayList', {
      sortBy: 'changeDate',
      reverse: true,
      count: 20
    });
  });
  
  xdescribe('hasTemplates:', function() {
    it('should resolve true if Company has templates', function(done) {
      requestExecute.returns(Q.resolve({
        items: [1]
      }));

      companyAssetsFactory.hasTemplates()
        .then(function(response) {
          requestExecute.should.have.been.calledWith(undefined);

          expect(response).to.be.true;

          done();
        })
        .catch(function() {
          done('error');
        });
    });

    it('should resolve false if Company does not have templates', function(done) {
      requestExecute.returns(Q.resolve({
        items: []
      }));

      companyAssetsFactory.hasTemplates()
        .then(function(response) {
          requestExecute.should.have.been.calledWith(undefined);

          expect(response).to.be.false;

          done();
        })
        .catch(function() {
          done('error');
        });
    });

    it('should reject if request fails', function(done) {
      requestExecute.returns(Q.reject('error'));

      companyAssetsFactory.hasTemplates()
        .then(function() {
          done('failed');
        })
        .catch(function(error) {
          expect(error).to.equal('error');

          done();
        });
    });

  });

  xdescribe('hasDisplays:', function() {
    it('should resolve true if Company has displays', function(done) {
      requestExecute.returns(Q.resolve({
        items: [1]
      }));

      companyAssetsFactory.hasDisplays()
        .then(function(response) {
          requestExecute.should.have.been.calledWith(undefined);

          expect(response).to.deep.equal({
            hasDisplays: true,
            hasActivatedDisplays: true
          });

          done();
        })
        .catch(function() {
          done('error');
        });
    });

    it('should resolve false if Company does not have displays', function(done) {
      requestExecute.returns(Q.resolve({
        items: []
      }));

      companyAssetsFactory.hasDisplays()
        .then(function(response) {
          requestExecute.should.have.been.calledWith(undefined);

          expect(response).to.deep.equal({
            hasDisplays: false,
            hasActivatedDisplays: true
          });

          done();
        })
        .catch(function() {
          done('error');
        });
    });

    it('should reject if request fails', function(done) {
      requestExecute.returns(Q.reject('error'));

      companyAssetsFactory.hasDisplays()
        .then(function() {
          done('failed');
        })
        .catch(function(error) {
          expect(error).to.equal('error');

          done();
        });
    });

  });

});
