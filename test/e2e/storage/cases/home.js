'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../../launcher/pages/homepage.js');
var LoginPage = require('./../../launcher/pages/loginPage.js');
var CommonHeaderPage = require('rv-common-e2e').commonHeaderPage;
var helper = require('rv-common-e2e').helper;
var StorageHomePage = require('./../pages/storageHomePage.js');

var HomeScenarios = function() {

  browser.driver.manage().window().setSize(1400, 900);
  describe("Storage Home", function () {
    var homepage;
    var loginPage;
    var commonHeaderPage;
    var storageHomePage;

    before(function () {
      homepage = new HomePage();
      loginPage = new LoginPage();
      commonHeaderPage = new CommonHeaderPage();
      storageHomePage = new StorageHomePage();
    });

    describe("Given a user who want see a list of her files", function () {

      before(function () {
        homepage.getStorage();
        //wait for spinner to go away.
        helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader').then(function () {
          loginPage.signIn();
        });
      });

      it('should load Storage Home', function () {
        helper.wait(storageHomePage.getStorageAppContainer(), 'Storage Apps Container');
        
        expect(storageHomePage.getStorageAppContainer().isDisplayed()).to.eventually.be.true;
      });

      it('should load files',function(){
        helper.waitDisappear(storageHomePage.getLoader(), 'Storage Files Loader');
        expect(storageHomePage.getStorageFileList().isDisplayed()).to.eventually.be.true;
      });

      it('should show action buttons',function(){
        expect(storageHomePage.getNewFolderButton().isDisplayed()).to.eventually.be.true;
        expect(storageHomePage.getUploadDropdown().isDisplayed()).to.eventually.be.true;
      });

      it('should show search input',function(){
        expect(storageHomePage.getSearchInput().isDisplayed()).to.eventually.be.true;       
      });

    });
  });
};
module.exports = HomeScenarios;
