'use strict';
var PurchaseFlowModalPage = function() {
  var emailField = element(by.id('contact-email'));
  var cardName = element(by.id('new-card-name'));
  var cardNumber = element(by.id('new-card-number'));
  var cardExpMon = element(by.id('new-card-expiry-month'));
  var cardExpYr = element(by.id('new-card-expiry-year'));
  var cardCVC = element(by.id('new-card-cvc'));
  var street = element(by.id('address-form-streetAddress'));
  var city = element(by.id('address-form-city'));
  var country = element(by.id('address-form-country'));
  var prov = element(by.css('select[name="province-selector"]'));
  var pc = element(by.id('address-form-postalCode'));
  var companyNameField = element(by.id('address-form-companyName'));
  var payButton = element(by.id('payButton'));

  this.getContinueButton = function() {
    return element(by.id('continueButton'));
  };

  this.getPayButton = function() {
    return payButton;
  };

  this.getFadeOverlay = function() {
    return fadeOverlay;
  };

  this.getEmailField = function() {
    return emailField;
  }

  this.getCompanyNameField = function() {
    return companyNameField;
  }

  this.getCardName = function() {
    return cardName;
  }

  this.getCardNumber = function() {
    return cardNumber;
  }

  this.getCardCVS = function() {
    return cardCVC;
  }

  this.getCardExpMon = function() {
    return cardExpMon;
  }

  this.getCardExpYr = function() {
    return cardExpYr;
  }

  this.getStreet = function() {
    return street;
  }

  this.getCity = function() {
    return city;
  }

  this.getCountry = function() {
    return country;
  }

  this.getProv = function() {
    return prov;
  }

  this.getPC = function() {
    return pc;
  }
};

module.exports = PurchaseFlowModalPage;
