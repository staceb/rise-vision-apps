'use strict';
describe('service: displayEmail:', function() {
  beforeEach(module('risevision.displays.services'));

  beforeEach(module(function ($provide) {
    $provide.service('email', function() {
      return {
        send: function() {
        }
      }
    })
    $provide.service('$templateCache',function(){
      return {
        get: function(url){
          expect(url).to.be.ok;

          return 'email template w/ {{display.id}} & {{display.name}}';
        },
        put: function() {}
      }
    });
    $provide.service('userState', function() {
      return {
        getUserEmail: function() {
          return 'user@gmail.com';
        },
        _restoreState: function() {}
      };
    });
  }));
  
  var displayEmail, sendSpy;
  beforeEach(function(){
    inject(function($injector){
      displayEmail = $injector.get('displayEmail');
      var emailService = $injector.get('email');
      sendSpy = sinon.spy(emailService, 'send');
    });
  });

  it('should exist',function(){
    expect(displayEmail).to.be.truely;
    expect(displayEmail.send).to.be.a('function');
  });
  
  it('should send email',function(){
    displayEmail.send('displayId', 'displayName');
    sendSpy.should.have.been.calledWith('user@gmail.com',
      'Set Up Your Display With Rise Vision',
      'email template w/ displayId & displayName');
  });

  it('should not call w/ missing parameters',function(){
    displayEmail.send();

    sendSpy.should.not.have.been.called;
  });


});
