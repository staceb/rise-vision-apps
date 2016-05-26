'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../../launcher/pages/homepage.js');
var LoginPage = require('./../../launcher/pages/loginPage.js');
var CommonHeaderPage = require('rv-common-e2e').commonHeaderPage;
var PresentationListPage = require('./../pages/presentationListPage.js');
var WorkspacePage = require('./../pages/workspacePage.js');
var helper = require('rv-common-e2e').helper;
var PresentationPropertiesModalPage = require('./../pages/presentationPropertiesModalPage.js');
var StoreProductsModalPage = require('./../pages/storeProductsModalPage.js');

var TemplateAddScenarios = function() {

  browser.driver.manage().window().setSize(1920, 1080);
  describe("In order to manage presentations " +
    "As a user signed in " +
    "I would like to add presentations", function () {
    var homepage;
    var loginPage;
    var commonHeaderPage;
    var presentationsListPage;
    var workspacePage;
    var presentationPropertiesModalPage;
    var storeProductsModalPage;

    before(function () {
      homepage = new HomePage();
      loginPage = new LoginPage();
      presentationsListPage = new PresentationListPage();
      workspacePage = new WorkspacePage();
      commonHeaderPage = new CommonHeaderPage();
      presentationPropertiesModalPage = new PresentationPropertiesModalPage();
      storeProductsModalPage = new StoreProductsModalPage();

      homepage.getEditor();
      //wait for spinner to go away.
      helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader').then(function () {
        loginPage.signIn();
      });
      helper.waitDisappear(presentationsListPage.getPresentationsLoader(),'Presentation loader');
      presentationsListPage.getPresentationAddButton().click();

      helper.wait(storeProductsModalPage.getStoreProductsModal(), 'Select Content Modal');
    });

    it('should open the Store Templates Modal', function () {
      expect(storeProductsModalPage.getStoreProductsModal().isDisplayed()).to.eventually.be.true;
    });

    it('should show modal title', function () {
      expect(storeProductsModalPage.getModalTitle().getText()).to.eventually.equal('Add a New Presentation');
    });

    it('should show a search box', function () {
      expect(storeProductsModalPage.getSearchFilter().isDisplayed()).to.eventually.be.true;
      expect(storeProductsModalPage.getSearchInput().getAttribute('placeholder')).to.eventually.equal('Search for Templates');
    });

    it('should show search categories', function() {
      expect(storeProductsModalPage.getSearchCategories().count()).to.eventually.equal(9);
      expect(storeProductsModalPage.getSearchCategories().get(0).getText()).to.eventually.equal("ALL");
    })

    it('should show a list of templates', function () {
      expect(storeProductsModalPage.getStoreProductsList().isDisplayed()).to.eventually.be.true;
    });

    it('should show templates', function () {
      helper.waitDisappear(storeProductsModalPage.getStoreProductsLoader()).then(function () {
        expect(storeProductsModalPage.getStoreProducts().count()).to.eventually.be.above(0);
      });
    });

    it('should show Add Blank Presentation',function(){
      expect(storeProductsModalPage.getAddBlankPresentation().isDisplayed()).to.eventually.be.true;
    });

    it('should show a link to Missing Template form',function(){
      expect(storeProductsModalPage.getSuggestTemplate().isDisplayed()).to.eventually.be.true;
    });

    // The Store Templates are not yet released to sub-companies
    // so there are no templates to select; disabled tests
    // TODO: re-enable tests when templates are released
    xit('should open the Template presentation', function () {
      storeProductsModalPage.getAddProductButtons().get(0).click();

      helper.wait(presentationPropertiesModalPage.getPresentationPropertiesModal(), 'Presentation Properties Modal');

      expect(presentationPropertiesModalPage.getNameInput().getAttribute('value')).to.eventually.contain('Copy of ');
    });

    xit('should treat template as New Presentation', function () {
      expect(workspacePage.getPreviewButton().getAttribute('disabled')).to.eventually.equal('true');

      expect(workspacePage.getPublishButton().isDisplayed()).to.eventually.be.false;
      expect(workspacePage.getRestoreButton().isDisplayed()).to.eventually.be.false;
      expect(workspacePage.getDeleteButton().isDisplayed()).to.eventually.be.false;

      expect(workspacePage.getSaveButton().isPresent()).to.eventually.be.true;
      expect(workspacePage.getCancelButton().isPresent()).to.eventually.be.true;
    });

  });
};
module.exports = TemplateAddScenarios;
