'use strict';
var PricingComponentModalPage = function() {
  var subscribeButton = element(by.id('subscribeButton'));

  this.getSubscribeButton = function() {
    return subscribeButton;
  };
};

module.exports = PricingComponentModalPage;
