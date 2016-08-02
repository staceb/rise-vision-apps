'use strict';
var WidgetSettingsPage = function() {
  var title = element(by.css('.modal-header h2'));
  var closeButton = element(by.css('.close'));
  
  this.getTitle = function() {
    return title;
  };

  this.getCloseButton = function() {
    return closeButton;
  };

};

module.exports = WidgetSettingsPage;
