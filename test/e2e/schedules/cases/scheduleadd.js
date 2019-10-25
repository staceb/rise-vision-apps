'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../../common/pages/homepage.js');
var SignInPage = require('./../../common/pages/signInPage.js');
var CommonHeaderPage = require('./../../common-header/pages/commonHeaderPage.js');
var SchedulesListPage = require('./../pages/schedulesListPage.js');
var ScheduleAddPage = require('./../pages/scheduleAddPage.js');
var helper = require('rv-common-e2e').helper;

var ScheduleAddScenarios = function() {
  browser.driver.manage().window().setSize(1920, 1080);

  describe('Schedule Add', function () {
    this.timeout(2000);// to allow for protactor to load the seperate page
    var homepage;
    var signInPage;
    var commonHeaderPage;
    var schedulesListPage;
    var scheduleAddPage;

    before(function () {
      homepage = new HomePage();
      signInPage = new SignInPage();
      schedulesListPage = new SchedulesListPage();
      scheduleAddPage = new ScheduleAddPage();
      commonHeaderPage = new CommonHeaderPage();

      homepage.getSchedules();
      signInPage.signIn();
      helper.waitDisappear(schedulesListPage.getLoader(),'Schedules loader');
      schedulesListPage.getScheduleAddButton().click();
    });

    it('should show schedule add page', function () {
      expect(scheduleAddPage.getScheduleNameField().isPresent()).to.eventually.be.true;
    });

    it('should not show Preview Button', function () {
      expect(scheduleAddPage.getPreviewButton().isDisplayed()).to.eventually.be.false;
    });

    it('should show Save Button', function () {
      expect(scheduleAddPage.getSaveButton().isPresent()).to.eventually.be.true;
    });

    it('should show Cancel Button', function () {
      expect(scheduleAddPage.getCancelButton().isPresent()).to.eventually.be.true;
    });

    it('should add schedule', function () {
      var scheduleName = 'TEST_E2E_SCHEDULE';
      scheduleAddPage.getScheduleNameField().sendKeys(scheduleName);
      scheduleAddPage.getSaveButton().click();
      helper.wait(scheduleAddPage.getDeleteButton(), 'Delete Button');
      expect(scheduleAddPage.getDeleteButton().isDisplayed()).to.eventually.be.true;
      expect(scheduleAddPage.getPreviewButton().isDisplayed()).to.eventually.be.true;
    });

    after(function () {
      helper.clickWhenClickable(scheduleAddPage.getDeleteButton(), 'Display Delete Button').then(function () {
        helper.clickWhenClickable(scheduleAddPage.getDeleteForeverButton(), 'Display Delete Forever Button').then(function () {
        });
      });
    });
  });
};
module.exports = ScheduleAddScenarios;
