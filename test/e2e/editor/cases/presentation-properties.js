'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../../common/pages/homepage.js');
var SignInPage = require('./../../common/pages/signInPage.js');
var CommonHeaderPage = require('./../../common-header/pages/commonHeaderPage.js');
var helper = require('rv-common-e2e').helper;
var WorkspacePage = require('./../pages/workspacePage.js');
var PresentationListPage = require('./../pages/presentationListPage.js');
var PresentationPropertiesModalPage = require('./../pages/presentationPropertiesModalPage.js');

var PresentationPropertiesScenarios = function() {

  browser.driver.manage().window().setSize(1920, 1080);
  describe('Presentation Properties', function () {
    var homepage;
    var signInPage;
    var commonHeaderPage;
    var workspacePage;
    var presentationListPage;
    var presentationPropertiesModalPage;
    before(function () {
      homepage = new HomePage();
      signInPage = new SignInPage();
      commonHeaderPage = new CommonHeaderPage();
      workspacePage = new WorkspacePage();
      presentationListPage = new PresentationListPage();
      presentationPropertiesModalPage = new PresentationPropertiesModalPage();
    });

    describe('Given a user who wants to set presentation properties of a new presentation', function () {

      before(function () {
        homepage.getEditor();
        signInPage.signIn();
        presentationListPage.openNewPresentation();
      });

      it('should load the workspace', function () {
        helper.wait(workspacePage.getWorkspaceContainer(), 'Workspace Container');
        expect(workspacePage.getWorkspaceContainer().isDisplayed()).to.eventually.be.true;
      });

      describe('Given a user clicks on the presentation properties cog icon', function () {
        it('should open the properties modal when clicking cog', function () {
          browser.sleep(500);
          helper.wait(workspacePage.getPresentationPropertiesButton(), 'Presentation Properties Button');
          helper.clickWhenClickable(workspacePage.getPresentationPropertiesButton(), 'Presentation Properties Button');
          helper.wait(presentationPropertiesModalPage.getPresentationPropertiesModal(), 'Presentation Properties Modal');
          browser.sleep(500);
          
          expect(presentationPropertiesModalPage.getPresentationPropertiesModal().isDisplayed()).to.eventually.be.true;
        });

        it('should open the properties modal when clicking Presentation name', function () {
          helper.wait(presentationPropertiesModalPage.getCancelButton(), 'Cancel Button');
          helper.clickWhenClickable(presentationPropertiesModalPage.getCancelButton(), 'Cancel Button');
          expect(presentationPropertiesModalPage.getPresentationPropertiesModal().isPresent()).to.eventually.be.false;
        
          helper.clickWhenClickable(workspacePage.getPresentationNameContainer(), 'Presentation Name Container');
          helper.wait(presentationPropertiesModalPage.getPresentationPropertiesModal(), 'Presentation Properties Modal');
          browser.sleep(500);
          
          expect(presentationPropertiesModalPage.getPresentationPropertiesModal().isDisplayed()).to.eventually.be.true;
        });

        it('should show Presentation Properties as title ', function () {
          expect(presentationPropertiesModalPage.getModalTitle().isDisplayed()).to.eventually.be.true;
          expect(presentationPropertiesModalPage.getModalTitle().getText()).to.eventually.equal('Presentation Properties');
        });

        it('should show Name label and input ', function () {
          expect(presentationPropertiesModalPage.getNameLabel().isDisplayed()).to.eventually.be.true;
          expect(presentationPropertiesModalPage.getNameLabel().getText()).to.eventually.equal('Name *');
          expect(presentationPropertiesModalPage.getNameInput().isDisplayed()).to.eventually.be.true;
        });

        it('should show Presentation ID', function () {
          expect(presentationPropertiesModalPage.getPresentationId().isDisplayed()).to.eventually.be.false;
        });

        it('should show Copy Presentation Button', function () {
          expect(presentationPropertiesModalPage.getCopyPresentationButton().isDisplayed()).to.eventually.be.false;
        });

        it('should show Resolution Label and Select', function () {
          expect(presentationPropertiesModalPage.getResolutionLabel().isDisplayed()).to.eventually.be.true;
          expect(presentationPropertiesModalPage.getResolutionLabel().getText()).to.eventually.equal('Resolution');
          expect(presentationPropertiesModalPage.getResolutionSelect().isDisplayed()).to.eventually.be.true;
        });

        it('should show background label ', function () {
          expect(presentationPropertiesModalPage.getBackgroundLabel().isDisplayed()).to.eventually.be.true;
          expect(presentationPropertiesModalPage.getBackgroundLabel().getText()).to.eventually.equal('Background');
        });

        it('should show background settings ', function () {
          expect(presentationPropertiesModalPage.getBackgroundImageSettings().isDisplayed()).to.eventually.be.true;

        });

        it('should show play until done', function () {
          expect(presentationPropertiesModalPage.getPlayUntilDonePlaceholderLabel().isDisplayed()).to.eventually.be.true;
          expect(presentationPropertiesModalPage.getPlayUntilDonePlaceholderLabel().getText()).to.eventually.equal('Play Until Done Placeholder');
          expect(presentationPropertiesModalPage.getPlayUntilDonePlaceholderSelect().isDisplayed()).to.eventually.be.true;
        });

        it('should show Hide Mouse Pointer', function () {
          expect(presentationPropertiesModalPage.getHideMousePointerCheckbox().isDisplayed()).to.eventually.be.true;
          expect(presentationPropertiesModalPage.getHideMousePointerCheckboxLabel().isDisplayed()).to.eventually.be.true;
          expect(presentationPropertiesModalPage.getHideMousePointerCheckboxLabel().getText()).to.eventually.equal('Hide Mouse Pointer');
        });

        it('should show apply button', function () {
          expect(presentationPropertiesModalPage.getApplyButton().isDisplayed()).to.eventually.be.true;
        });

        it('should show cancel button', function () {
          expect(presentationPropertiesModalPage.getCancelButton().isDisplayed()).to.eventually.be.true;
        });

        it('should save properties', function () {
          presentationPropertiesModalPage.getNameInput().clear();
          presentationPropertiesModalPage.getNameInput().sendKeys('E2E Test Presentation');
          helper.clickWhenClickable(presentationPropertiesModalPage.getApplyButton(), 'Apply Button');

          helper.waitDisappear(presentationPropertiesModalPage.getPresentationPropertiesModal(), 'Presentation Properties Modal');
          expect(presentationPropertiesModalPage.getPresentationPropertiesModal().isPresent()).to.eventually.be.false;
        });

        it('should handle Enter', function () {
          helper.wait(workspacePage.getPresentationPropertiesButton(), 'Presentation Properties Button');
          helper.clickWhenClickable(workspacePage.getPresentationPropertiesButton(), 'Presentation Properties Button');
          helper.wait(presentationPropertiesModalPage.getPresentationPropertiesModal(), 'Presentation Properties Modal');
          browser.sleep(500);
          presentationPropertiesModalPage.getNameInput().clear();
          presentationPropertiesModalPage.getNameInput().sendKeys('Presentation Enter');
          presentationPropertiesModalPage.getNameInput().sendKeys(protractor.Key.ENTER);

          helper.waitDisappear(presentationPropertiesModalPage.getPresentationPropertiesModal(), 'Presentation Properties Modal');
          expect(presentationPropertiesModalPage.getPresentationPropertiesModal().isPresent()).to.eventually.be.false;
          expect(workspacePage.getPresentationNameContainer().getText()).to.eventually.equal('Presentation Enter');
        });

      });
    });
  });
};
module.exports = PresentationPropertiesScenarios;
