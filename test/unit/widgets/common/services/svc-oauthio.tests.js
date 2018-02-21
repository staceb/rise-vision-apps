'use strict';
describe('service: OAuthio:', function() {
  var OAUTH_PUBLIC_KEY = 'EJMI-lB9hB55OYEsYmjXDNfRGoY';

  beforeEach(module('risevision.widgets.services'));

  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});
    $provide.service('$log',function(){
      return {
        debug : function(){}
      }
    });
    $provide.value('OAUTH_PUBLIC_KEY', OAUTH_PUBLIC_KEY);

    $provide.service('$window', function() {
      var oauth = {
        initialize: sinon.stub(),
        popup: sinon.stub()
      };

      var window = { OAuth: oauth};

      return window;
    });
  }));

  var oauthio, oauth;

  beforeEach(function(){
    inject(function($injector){
      oauth = $injector.get('$window').OAuth;
      oauthio = $injector.get('OAuthio');
    });
  });

  it('should exist',function(){
    expect(oauthio).to.be.ok;
    expect(oauthio.initialize).to.be.a('function');
    expect(oauthio.popup).to.be.a('function');
  });

  it('initialize', function() {
    oauthio.initialize();
    oauth.initialize.should.have.been.calledWith(OAUTH_PUBLIC_KEY);
  });

  it('popup', function() {
    oauthio.popup('twitter', 'xxxxxx');
    oauth.popup.should.have.been.calledWith('twitter', {state: 'xxxxxx'});
  });

});
