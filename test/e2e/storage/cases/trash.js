'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../../launcher/pages/homepage.js');
var LoginPage = require('./../../launcher/pages/loginPage.js');
var CommonHeaderPage = require('rv-common-e2e').commonHeaderPage;
var helper = require('rv-common-e2e').helper;
var StorageHomePage = require('./../pages/storageHomePage.js');
var FilesListPage = require('./../pages/filesListPage.js');

var TrashScenarios = function() {

  browser.driver.manage().window().setSize(1400, 900);
  describe("Trash", function () {
    var homepage;
    var loginPage;
    var commonHeaderPage;
    var storageHomePage;
    var filesListPage;

    before(function () {
      homepage = new HomePage();
      loginPage = new LoginPage();
      commonHeaderPage = new CommonHeaderPage();
      storageHomePage = new StorageHomePage();
      filesListPage = new FilesListPage();
    });

    describe("Given a user who wants to delete a file forever", function () {

      before(function () {
        homepage.getStorage();
        //wait for spinner to go away.
        helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader').then(function () {
          loginPage.signIn();
        });

        helper.wait(storageHomePage.getStorageAppContainer(), 'Storage Apps Container');
        helper.waitDisappear(storageHomePage.getLoader(), 'Storage Files Loader');

        //upload sample file       
        var uploadFilePath = process.cwd() + "/bower.json";
        storageHomePage.getUploadInput().sendKeys(uploadFilePath);

        //wait upload to finish        
        helper.waitDisappear(storageHomePage.getUploadPanel(), 'Storage Upload Panel');
        helper.waitDisappear(storageHomePage.getLoader(), 'Storage Files Loader');
      });

      it('should show Trash button', function () {
        expect(storageHomePage.getMoveToTrashButton().isDisplayed()).to.eventually.be.true;
        expect(storageHomePage.getMoveToTrashButton().isEnabled()).to.eventually.be.false;

        expect(storageHomePage.getRestoreFromTrashButton().isDisplayed()).to.eventually.be.false;
      });

      it('should enable Trash after file is selected',function(){
        storageHomePage.filterFileList("bower.json");

        expect(filesListPage.getFileItems().count()).to.eventually.be.greaterThan(0);

        filesListPage.getFileItems().get(0).click();
        
        expect(filesListPage.getFileItems().get(0).getAttribute('class')).to.eventually.contain('active');
        expect(storageHomePage.getMoveToTrashButton().isEnabled()).to.eventually.be.true;
      });

      it('should delete the file',function(){
        storageHomePage.getMoveToTrashButton().click();

        helper.waitDisappear(storageHomePage.getPendingOperationsPanel(), 'Pending Operations Panel');

        expect(filesListPage.getFileItems().count()).to.eventually.equal(0);
      });

      it('should show deleted file in Trash folder',function(){
        storageHomePage.filterFileList("Trash");

        browser.actions()
        .click(filesListPage.getFileItems().get(0))
        .click(filesListPage.getFileItems().get(0))
        .perform();

        helper.waitDisappear(storageHomePage.getLoader(), 'Files Loader');
        
        storageHomePage.filterFileList("bower.json");
        expect(filesListPage.getFileItems().count()).to.eventually.be.greaterThan(0);
      });


      it('should restore file from Trash',function(){
        expect(storageHomePage.getRestoreFromTrashButton().isDisplayed()).to.eventually.be.true;
        expect(storageHomePage.getRestoreFromTrashButton().isEnabled()).to.eventually.be.false;

        filesListPage.getFileItems().get(0).click();
        expect(storageHomePage.getRestoreFromTrashButton().isEnabled()).to.eventually.be.true;

        storageHomePage.getRestoreFromTrashButton().click();

        helper.waitDisappear(storageHomePage.getPendingOperationsPanel(), 'Pending Operations Panel');
        storageHomePage.filterFileList("bower.json");
        expect(filesListPage.getFileItems().count()).to.eventually.equal(0);
      });

      it('should show restored file in files list',function(){
        storageHomePage.getSearchInput().clear();
        // go back to root folder
        browser.actions()
        .click(filesListPage.getFileItems().get(0))
        .click(filesListPage.getFileItems().get(0))
        .perform();

        helper.waitDisappear(storageHomePage.getLoader(), 'Files Loader');

        storageHomePage.filterFileList("bower.json");
        expect(filesListPage.getFileItems().count()).to.eventually.be.greaterThan(0);
      });

      it('should delete the file forever',function(done){
        //delete file
        filesListPage.getFileItems().get(0).click();
        storageHomePage.getMoveToTrashButton().click();
        helper.waitDisappear(storageHomePage.getPendingOperationsPanel(), 'Pending Operations Panel');

        //open Trash
        storageHomePage.filterFileList("Trash");
        browser.actions()
          .click(filesListPage.getFileItems().get(0))
          .click(filesListPage.getFileItems().get(0))
          .perform();
        helper.waitDisappear(storageHomePage.getLoader(), 'Files Loader');
       
        expect(storageHomePage.getDeleteForeverButton().isDisplayed()).to.eventually.be.true;
        expect(storageHomePage.getDeleteForeverButton().isEnabled()).to.eventually.be.false;

        //delete forever
        storageHomePage.filterFileList("bower.json");
        filesListPage.getFileItems().get(0).click();        
        expect(storageHomePage.getDeleteForeverButton().isEnabled()).to.eventually.be.true;       
        storageHomePage.getDeleteForeverButton().click();
        
        //show confirmation modal
        helper.clickWhenClickable(storageHomePage.getConfirmDeleteButton(), "Delete Forever Confirm Button").then(function () {          
          helper.waitDisappear(storageHomePage.getPendingOperationsPanel(), 'Pending Operations Panel');
          storageHomePage.filterFileList("bower.json");
          //file is deleted
          expect(filesListPage.getFileItems().count()).to.eventually.equal(0);
          done();
        });
      });
    });
  });
};
module.exports = TrashScenarios;