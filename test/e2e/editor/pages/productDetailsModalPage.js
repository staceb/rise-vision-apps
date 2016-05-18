'use strict';
var ProductDetailsModalPage = function() {
  var productDetailsModal = element(by.id('productDetailsModal'));
  var useProductButton = element(by.id('useProductButton'));
  var viewInStoreButton = element(by.id('viewInStoreButton'));  

  var pricingLoader = element(by.xpath('//div[@spinner-key="loading-price"]'));

  var pricingInfo = element(by.id('pricingInfo'));
  var backButton = element(by.id('backButton'));

  this.getProductDetailsModal = function(){
    return productDetailsModal;
  };

  this.getUseProductButton = function(){
    return useProductButton;
  };

  this.getViewInStoreButton = function(){
    return viewInStoreButton;
  };  

  this.getPricingLoader = function(){
    return pricingLoader;
  }

  this.getPricingInfo = function(){
    return pricingInfo;
  }

  this.getBackButton = function() {
    return backButton;
  };
};

module.exports = ProductDetailsModalPage;
