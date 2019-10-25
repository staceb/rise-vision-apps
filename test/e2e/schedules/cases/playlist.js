'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../../common/pages/homepage.js');
var SignInPage = require('./../../common/pages/signInPage.js');
var CommonHeaderPage = require('./../../common-header/pages/commonHeaderPage.js');
var SchedulesListPage = require('./../pages/schedulesListPage.js');
var ScheduleAddPage = require('./../pages/scheduleAddPage.js');
var PlaylistPage = require('./../pages/playlistPage.js');
var helper = require('rv-common-e2e').helper;
var PlaylistItemModalPage = require('./../pages/playlistItemModalPage.js');

var PlaylistScenarios = function() {
  browser.driver.manage().window().setSize(1920, 1080);

  describe('Playlist', function () {
    this.timeout(2000);// to allow for protactor to load the seperate page
    var homepage;
    var signInPage;
    var commonHeaderPage;
    var schedulesListPage;
    var scheduleAddPage;
    var playlistPage;
    var playlistItemModalPage;

    before(function () {
      homepage = new HomePage();
      signInPage = new SignInPage();
      schedulesListPage = new SchedulesListPage();
      scheduleAddPage = new ScheduleAddPage();
      playlistPage = new PlaylistPage();
      commonHeaderPage = new CommonHeaderPage();
      playlistItemModalPage = new PlaylistItemModalPage();

      homepage.getSchedules();
      signInPage.signIn();
      helper.waitDisappear(schedulesListPage.getLoader(),'Schedules loader');
    });

    describe(' Given a user is adding a new schedule and a few playlist items', function () {
      before(function () {
        schedulesListPage.getScheduleAddButton().click();

        scheduleAddPage.getAddPlaylistItemButton().click();
        scheduleAddPage.getAddUrlItemButton().click();

        playlistItemModalPage.getUrlInput().sendKeys('http://risevision.com/content1.html');
        playlistItemModalPage.getSaveButton().click();

        // wait for transitions
        browser.sleep(500);

        scheduleAddPage.getAddPlaylistItemButton().click();
        scheduleAddPage.getAddUrlItemButton().click();

        playlistItemModalPage.getUrlInput().sendKeys('http://risevision.com/content2.html');
        playlistItemModalPage.getSaveButton().click();
      });

      describe('Should manage playlist items', function () {
        it('should have 2 items the Playlist', function () {
          expect(scheduleAddPage.getPlaylistItems().count()).to.eventually.equal(2);

          expect(scheduleAddPage.getPlaylistItems().get(0).getText()).to.eventually.contain('content1.html');
          expect(scheduleAddPage.getPlaylistItems().get(1).getText()).to.eventually.contain('content2.html');
        });

        it('arrows should be disabled', function () {
          expect(playlistPage.getMoveUpButtons().get(0).isEnabled()).to.eventually.be.false;
          expect(playlistPage.getMoveDownButtons().get(1).isEnabled()).to.eventually.be.false;

          expect(playlistPage.getMoveUpButtons().get(1).isEnabled()).to.eventually.be.true;
          expect(playlistPage.getMoveDownButtons().get(0).isEnabled()).to.eventually.be.true;
        });

        it('items should move up and down', function () {
          playlistPage.getMoveUpButtons().get(1).click();

          expect(scheduleAddPage.getPlaylistItems().get(0).getText()).to.eventually.contain('content2.html');
          expect(scheduleAddPage.getPlaylistItems().get(1).getText()).to.eventually.contain('content1.html');

          playlistPage.getMoveDownButtons().get(0).click();

          expect(scheduleAddPage.getPlaylistItems().get(0).getText()).to.eventually.contain('content1.html');
          expect(scheduleAddPage.getPlaylistItems().get(1).getText()).to.eventually.contain('content2.html');
        });

        it('should remove item', function (done) {
          playlistPage.getRemoveButtons().get(0).click();

          helper.clickWhenClickable(playlistPage.getRemoveItemButton(), 'Remove Item Confirm Button').then(function () {
            expect(scheduleAddPage.getPlaylistItems().count()).to.eventually.equal(1);

            done();
          });
        });

        it('should duplicate item', function () {
          playlistPage.getDuplicateItemButton().get(0).click();

          expect(scheduleAddPage.getPlaylistItems().count()).to.eventually.equal(2);
        });

        it('should open properties', function () {
          scheduleAddPage.getPlaylistItems().get(0).element(by.css('.playlist-item-name')).click();

          helper.wait(playlistItemModalPage.getPlaylistItemModal(), 'Edit Playist Modal');

          expect(playlistItemModalPage.getPlaylistItemModal().isDisplayed()).to.eventually.be.true;
          expect(playlistItemModalPage.getModalTitle().getText()).to.eventually.equal('Edit Playlist Item');
        });

        it('should close properties', function () {
          playlistItemModalPage.getSaveButton().click();

          // wait for transitions
          browser.sleep(500);

          expect(playlistItemModalPage.getPlaylistItemModal().isPresent()).to.eventually.be.false;
        });

      });
    });
  });
};
module.exports = PlaylistScenarios;
