'use strict';
var config = require('../../config/config.json');

var HomePage = function() {
  var url = config.rootUrl + '/';
  var displaysUrl = config.rootUrl + '/displays/list';
  var editorUrl = config.rootUrl + '/editor/list';
  var schedulesUrl = config.rootUrl + '/schedules/list';
  var storageUrl = config.rootUrl + '/storage';

  var appLauncherContainer = element(by.id('appLauncherContainer'));
  var presentationAddButton = element(by.id('presentationAddButton'));

  var welcomeText = element(by.id('welcome-text'));
  var appTitleText = element(by.id('app-title'));
  var signUpText = element(by.id('sign-up-text'));
  var signInText = element(by.id('sign-in-text'));
  var signUpLink = element(by.id('sign-up-link'));
  var signInLink = element(by.id('sign-in-link'));  


  this.get = function() {
    browser.get(url);
  };

  this.getProtectedPage = function() {
    browser.get(displaysUrl);
  };

  this.getDisplays = function() {
    browser.get(displaysUrl);
  };

  this.getEditor = function() {
    browser.get(editorUrl);
  };

  this.getSchedules = function() {
    browser.get(schedulesUrl);
  };

  this.getStorage = function() {
    browser.get(storageUrl);
  };

  this.getUrl = function() {
    return url;
  }

  this.getProtectedPageUrl = function() {
    return displaysUrl;
  }

  this.getAppLauncherContainer = function() {
    return appLauncherContainer;
  };

  this.getPresentationAddButton = function() {
    return presentationAddButton;
  };

  this.getWelcomeText = function() {
    return welcomeText;
  };

  this.getAppTitleText = function() {
    return appTitleText;
  };

  this.getSignUpText = function() {
    return signUpText;
  };

  this.getSignInText = function() {
    return signInText;
  };

  this.getSignUpLink = function() {
    return signUpLink;
  };

  this.getSignInLink = function() {
    return signInLink;
  };

  this.getMetaByName = function(name) {
    return element(by.xpath("//meta[@name='"+name+"']"));
  };

  this.getMetaByItemProp = function(itemprop) {
    return element(by.xpath("//meta[@itemprop='"+itemprop+"']"));
  };

  this.getMetaByProperty = function(property) {
    return element(by.xpath("//meta[@property='"+property+"']"));
  };

};

module.exports = HomePage;
