'use strict';
describe('service: OAuthService:', function() {
  var OAUTH_PUBLIC_KEY = 'EJMI-lB9hB55OYEsYmjXDNfRGoY';
  var OAUTH_TOKEN_PROVIDER_URL = 'https://services-stage.risevision.com/oauthtokenprovider/';

  beforeEach(module('risevision.widgets.services'));

  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});
    $provide.service('userState',function(){
      return {
        getSelectedCompanyId : function(){
          return 'TEST_COMP_ID';
        },
        getAccessToken:function(){
          return {
            'token_type': 'Bearer',
            'access_token': 'TEST_CLIENT_ID'
          };
        }
      }
    });
    $provide.service('$log',function(){
      return {
        debug : function(){}
      }
    });
    $provide.value('OAUTH_TOKEN_PROVIDER_URL', OAUTH_TOKEN_PROVIDER_URL);
    $provide.service('OAuthio',function(){
      return {
        initialize : sinon.stub(),
        popup: sinon.stub()
      }
    });
  }));

  var oauthService, $httpBackend, oauthio;

  beforeEach(function(){
    inject(function($injector){
      $httpBackend = $injector.get('$httpBackend');
      oauthio = $injector.get('OAuthio');
      oauthService = $injector.get('OAuthService');
    });
    oauthService.initialize("twitter");
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should exist',function(){
    expect(oauthService).to.be.ok;
    expect(oauthService.initialize).to.be.a('function');
    expect(oauthService.authenticate).to.be.a('function');
    expect(oauthService.getConnectionStatus).to.be.a('function');
    expect(oauthService.revoke).to.be.a('function');
  });

  it('initialize', function() {
    oauthio.initialize.should.have.been.called;
  });

  it('Connection Status', function(done) {
    $httpBackend.expect('POST', OAUTH_TOKEN_PROVIDER_URL + 'status', {
        'companyId': 'TEST_COMP_ID',
        'provider': 'twitter'
      }).respond(200, {'authenticated': [1] });
    oauthService.getConnectionStatus()
      .then(function(status) {
        expect(status).to.equal(true);
        done();
      });
    setTimeout(function(){
      $httpBackend.flush();
    },10);
  });

  it('Authenticate', function(done) {
    oauthio.popup.returns(Q.resolve({code:1}));
    $httpBackend.when('GET', OAUTH_TOKEN_PROVIDER_URL + 'authenticate').respond(200, {'token': 'xxxxxx' });

    oauthService.authenticate()
      .then(function(key) {
        expect(key).to.equal('TEST_COMP_ID:twitter:1');
        done();
      });
    setTimeout(function(){
      $httpBackend.flush();
      $httpBackend.when('POST', OAUTH_TOKEN_PROVIDER_URL + 'authenticate').respond(200, {'key': 'TEST_COMP_ID:twitter:1'});
      setTimeout(function(){
        $httpBackend.flush();
      },10);
    },10);
  });

  it('Revoke', function(done) {
    $httpBackend.when('POST', OAUTH_TOKEN_PROVIDER_URL + 'revoke').respond(200, {'key': 'TEST_COMP_ID:twitter:1', 'revoked': true });

    oauthService.revoke()
      .then(function(response) {
        expect(response.key).to.equal('TEST_COMP_ID:twitter:1');
        expect(response.revoked).to.equal(true);
        done();
      });
    setTimeout(function(){
      $httpBackend.flush();
    },10);
  });

});
