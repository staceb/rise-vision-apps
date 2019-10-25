'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../../common/pages/homepage.js');
var SignInPage = require('./../../common/pages/signInPage.js');
var CommonHeaderPage = require('./../../common-header/pages/commonHeaderPage.js');
var helper = require('rv-common-e2e').helper;
var StorageHomePage = require('./../pages/storageHomePage.js');
var FilesListPage = require('./../pages/filesListPage.js');

var DownloadScenarios = function() {

  browser.driver.manage().window().setSize(1400, 900);
  describe('Download', function () {
    var homepage;
    var signInPage;
    var commonHeaderPage;
    var storageHomePage;
    var filesListPage;

    before(function () {
      homepage = new HomePage();
      signInPage = new SignInPage();
      commonHeaderPage = new CommonHeaderPage();
      storageHomePage = new StorageHomePage();
      filesListPage = new FilesListPage();
    });

    describe('Given a user who wants to download a file', function () {

      before(function () {
        homepage.getStorage();
        signInPage.signIn();

        helper.wait(storageHomePage.getStorageAppContainer(), 'Storage Apps Container');
        helper.waitDisappear(filesListPage.getFilesListLoader(), 'Storage Files Loader');
      });

      it('should show Download button', function () {
        expect(storageHomePage.getDownloadButton().isDisplayed()).to.eventually.be.true;
        expect(storageHomePage.getDownloadButton().isEnabled()).to.eventually.be.false;
      });

      it('should enable Download after file is selected',function(){
        filesListPage.filterFileList('package.json');

        expect(filesListPage.getFileItems().count()).to.eventually.be.greaterThan(0);

        filesListPage.getFileItems().get(0).click();
        
        expect(filesListPage.getFileItems().get(0).getAttribute('class')).to.eventually.contain('list-item--selected');
        expect(storageHomePage.getDownloadButton().isEnabled()).to.eventually.be.true;
      });

      it('should download the file',function(done){
        var filename = './tmp/package.json';
        var fs = require('fs');

        if (fs.existsSync(filename)) {
            // Make sure the browser doesn't have to rename the download.
            fs.unlinkSync(filename);
        }

        storageHomePage.getDownloadButton().click();

        browser.driver.wait(function() {
            // Wait until the file has been downloaded.
            return fs.existsSync(filename);
        }, 10000)
        .then(function() {
          expect(fs.readFileSync(filename, { encoding: 'utf8' })).to.be.ok;

          done();
        });
      });

    });
  });
};
module.exports = DownloadScenarios;
