'use strict';
var DisplayManagePage = function() {
  var displaysAppContainer = element(by.css('.displays-app'));
  var title = element(by.id('title'));
  var displayNameField = element(by.model('display.name'));
  var downloadWindows64Button = element(by.id('downloadWindows64'));
  var displayUseCompanyAddressCheckbox = element(by.model('display.useCompanyAddress'));
  var displayRebootCheckbox = element(by.model('display.restartEnabled'));

  var displayTimeZoneSelect = element(by.model('display.timeZoneOffset'));  

  var displayHoursField = element(by.model('hours'));
  var displayMinutesField = element(by.model('minutes'));
  var displayMeridianButton = element(by.id('meridianButton'));

  var saveButton = element(by.id('saveButton'));
  var cancelButton = element(by.id('cancelButton'));

  var deleteButton = element(by.id('deleteButton'));
  var deleteForeverButton = element(by.buttonText('Delete Forever'));

  var displayLoader = element(by.id('display-loader'));

  this.getDisplaysAppContainer = function() {
    return displaysAppContainer;
  };

  this.getTitle = function() {
    return title;
  };

  this.getDisplayNameField = function() {
    return displayNameField;
  };
  
  this.getDownloadWindows64Button = function() {
    return downloadWindows64Button;
  }

  this.getDisplayUseCompanyAddressCheckbox = function() {
    return displayUseCompanyAddressCheckbox;
  };

  this.getDisplayRebootCheckbox = function() {
    return displayRebootCheckbox;
  };

  this.getDisplayTimeZoneSelect = function() {
    return displayTimeZoneSelect;
  };

  this.getDisplayHoursField = function() {
    return displayHoursField;
  };

  this.getDisplayMinutesField = function() {
    return displayMinutesField;
  };

  this.getDisplayMeridianButton = function() {
    return displayMeridianButton;
  };

  this.getSaveButton = function() {
    return saveButton;
  };

  this.getCancelButton = function() {
    return cancelButton;
  };

  this.getDeleteButton = function() {
    return deleteButton;
  };

  this.getDeleteForeverButton = function() {
    return deleteForeverButton;
  };

  this.getDisplayLoader = function() {
    return displayLoader;
  };
};

module.exports = DisplayManagePage;
