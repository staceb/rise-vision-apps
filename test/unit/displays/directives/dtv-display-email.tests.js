'use strict';
describe('directive: display email', function() {
  beforeEach(module('risevision.displays.directives'));
  beforeEach(module(function ($provide) {
    $provide.service('$loading',function(){
      return $loading = {
        start: sinon.spy(),
        stop: sinon.spy()
      }
    });

    $provide.service('userState',function(){
      return {
        getUserEmail: function() {
          return 'user@email.com'
        }
      };
    });

    $provide.service('displayEmail',function(){
      return displayEmail = {
        send: sinon.spy(function() {
          if (failSendEmail) {
            return Q.reject();
          } else {
            return Q.resolve();  
          }          
        }),
        sendingEmail: false
      }
    });

  }));

  var elm, $scope, displayEmail, failSendEmail, $loading;

  beforeEach(inject(function($compile, $rootScope, $templateCache){
    failSendEmail = false;

    var tpl = '<display-email></display-email>';
    $templateCache.put('partials/displays/display-email.html', '<p></p>');

    elm = $compile(tpl)($rootScope.$new());
    $rootScope.$digest();
    
    $scope = elm.scope();

    $scope.display = {};
  }));

  it('should compile html', function() {
    expect(elm.html()).to.equal('<p></p>');
    expect($scope.display).to.be.ok;
    expect($scope.sendToUserEmail).to.be.a('function');
    expect($scope.sendToAnotherEmail).to.be.a('function');
  });

  it('should populate user email', function() {
    expect($scope.userEmail).to.equal('user@email.com');
  });

  describe('$loading: ', function() {
    it('should stop spinner', function() {
      $loading.stop.should.have.been.calledWith('display-email');
    });
    
    it('should start spinner', function(done) {
      $scope.displayEmail.sendingEmail = true;
      $scope.$digest();
      setTimeout(function() {
        $loading.start.should.have.been.calledWith('display-email');
        
        done();
      }, 10);
    });
  });

  describe('sendToAnotherEmail:',function(){
    it('should send instructions to another email address',function(done){
      $scope.display.id = 'ID';
      $scope.anotherEmail = 'another@email.com';
      $scope.sendToAnotherEmail();

      displayEmail.send.should.have.been.calledWith('ID', 'another@email.com');
      setTimeout(function() {
        expect($scope.anotherEmail).to.not.be.ok;
        expect($scope.error).to.be.false;

        done();
      }, 10);
    });

    it('should handle send failure',function(done){
      failSendEmail = true;
      $scope.sendToAnotherEmail();

      setTimeout(function() {
        expect($scope.error).to.be.true;

        done();
      }, 10);
    });
  });

  describe('sendToUserEmail:',function(){
    it('should send instructions to user email',function(done){
      $scope.display.id = 'ID';
      $scope.sendToUserEmail();

      displayEmail.send.should.have.been.calledWith('ID', 'user@email.com');
      setTimeout(function() {
        expect($scope.error).to.be.false;

        done();
      }, 10);
    });

    it('should handle send failure',function(done){
      failSendEmail = true;
      $scope.sendToUserEmail();

      setTimeout(function() {
        expect($scope.error).to.be.true;

        done();
      }, 10);
    });
  });
  
});
