'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../../launcher/pages/homepage.js');
var LoginPage = require('./../../launcher/pages/loginPage.js');
var CommonHeaderPage = require('rv-common-e2e').commonHeaderPage;
var DisplaysListPage = require('./../pages/displaysListPage.js');
var DisplayAddPage = require('./../pages/displayAddPage.js');
var helper = require('rv-common-e2e').helper;

var DisplayAddScenarios = function() {

  browser.driver.manage().window().setSize(1280, 960);
  describe("In order to manage displays " +
    "As a user signed in " +
    "I would like to add displays", function () {
    this.timeout(2000);// to allow for protactor to load the seperate page
    var homepage;
    var loginPage;
    var commonHeaderPage;
    var displaysListPage;
    var displayAddPage;

    before(function () {
      homepage = new HomePage();
      loginPage = new LoginPage();
      displaysListPage = new DisplaysListPage();
      displayAddPage = new DisplayAddPage();
      commonHeaderPage = new CommonHeaderPage();

      homepage.getDisplays();
      //wait for spinner to go away.
      helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader').then(function () {
        loginPage.signIn();
      });
      helper.waitDisappear(displaysListPage.getDisplaysLoader(), 'Displays loader');
      displaysListPage.getDisplayAddButton().click();
    });

    it('should show display add page', function () {
      expect(displayAddPage.getDisplayNameField().isPresent()).to.eventually.be.true;
    });

    it('should show User Company Address Checkbox', function () {
      expect(displayAddPage.getDisplayUseCompanyAddressCheckbox().isPresent()).to.eventually.be.true;
    });

    it('should show Reboot Checkbox', function () {
      expect(displayAddPage.getDisplayRebootCheckbox().isPresent()).to.eventually.be.true;
    });

    it('should show Time Selector', function () {
      expect(displayAddPage.getDisplayHoursField().isPresent()).to.eventually.be.true;
      expect(displayAddPage.getDisplayMinutesField().isPresent()).to.eventually.be.true;
      expect(displayAddPage.getDisplayMeridianButton().isPresent()).to.eventually.be.true;
    });

    it('should show Save Button', function () {
      expect(displayAddPage.getSaveButton().isPresent()).to.eventually.be.true;
    });

    it('should show Cancel Button', function () {
      expect(displayAddPage.getCancelButton().isPresent()).to.eventually.be.true;
    });

    it('should select timezone',function(){
      displayAddPage.getDisplayUseCompanyAddressCheckbox().click();
      displayAddPage.getDisplayTimeZoneSelect().element(by.cssContainingText('option', 'Buenos Aires')).click();
      expect(displayAddPage.getDisplayTimeZoneSelect().$('option:checked').getText()).to.eventually.contain('Buenos Aires');
    });

    it('should add display', function () {
      var displayName = 'TEST_E2E_DISPLAY';
      displayAddPage.getDisplayNameField().sendKeys(displayName);
      displayAddPage.getSaveButton().click();
      helper.wait(displayAddPage.getDeleteButton(), 'Delete Button');
      expect(displayAddPage.getDeleteButton().isDisplayed()).to.eventually.be.true;
    });
    
    it('should show download buttons', function() {
      expect(displayAddPage.getDownloadWindows64Button().isDisplayed()).to.eventually.be.true;
    });

    it('should show correct timezone after reload',function(){
      browser.refresh();
      helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');
      browser.sleep(1000);
      expect(displayAddPage.getDisplayTimeZoneSelect().$('option:checked').getText()).to.eventually.contain('Buenos Aires');
    });

    after(function () {
      helper.clickWhenClickable(displayAddPage.getDeleteButton(), "Display Delete Button").then(function () {
        helper.clickWhenClickable(displayAddPage.getDeleteForeverButton(), "Display Delete Forever Button").then(function () {
        });
      });
    });
  });
};

module.exports = DisplayAddScenarios;
