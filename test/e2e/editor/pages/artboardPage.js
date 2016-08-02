'use strict';
var ArtboardPage = function() {
  var artboardContainer = element(by.id('artboard'));
  var overlayContainer = element(by.css('#artboard > div > div'));
  

  this.getArtboardContainer = function() {
    return artboardContainer;
  };

  this.getOverlayContainer = function() {
    return overlayContainer;
  };

  this.getPlaceholderContainers = function() {
  	return this.getArtboardContainer().all(by.css('artboard-placeholder'));
  };

};

module.exports = ArtboardPage;
