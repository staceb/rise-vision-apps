'use strict';

angular.module('risevision.common.components.purchase-flow')
  .service('addressFactory', ['$q', '$log', 'userState', 'storeService', 'updateCompany', 'updateUser',
    'addressService', 'contactService',
    function ($q, $log, userState, storeService, updateCompany, updateUser, addressService, contactService) {
      var factory = {};

      var _addressesAreIdentical = function (src, result) {
        var dest = {
          // Use Current Name for Comparison
          name: src.name,
          street: result.line1,
          unit: result.line2 && result.line2.length ? result.line2 : '',
          city: result.city,
          postalCode: result.postalCode,
          province: result.region,
          country: result.country
        };

        return addressService.addressesAreIdentical(src, dest);
      };

      factory.validateAddress = function (addressObject) {
        addressObject.validationError = false;

        if (addressObject.country !== 'CA' && addressObject.country !== 'US') {
          $log.debug('Address Validation skipped for country: ', addressObject.country);

          return $q.resolve();
        } else {
          return storeService.validateAddress(addressObject)
            .then(function (result) {
              if (!_addressesAreIdentical(addressObject, result)) {
                $log.error('Validated address differs from entered address: ', addressObject, result);
              }
            })
            .catch(function (result) {
              addressObject.validationError = result.message ? result.message : 'Unknown Error';
            });
        }
      };

      factory.isValidOrEmptyAddress = function (addressObject) {
        if (addressService.isEmptyAddress(addressObject)) {
          $log.debug('Address is empty, skipped validation');
          return $q.resolve();
        }
        if (addressObject.country !== 'CA' && addressObject.country !== 'US' && addressObject.country !== '') {
          $log.debug('Address Validation skipped for country: ', addressObject.country);
          return $q.resolve();
        }
        return storeService.validateAddress(addressObject);
      };

      var _updateCompanySettings = function (company, isShipping) {
        if (isShipping) {
          // update Selected company saved in userState
          var shipToCopyNoFollow = userState.getCopyOfSelectedCompany(true);
          angular.extend(shipToCopyNoFollow, company);

          // this will fire 'risevision.company.updated' event
          userState.updateCompanySettings(shipToCopyNoFollow);
        }
        // only proceed if currently selected BillTo company is the User company
        else if (company.id === userState.getUserCompanyId()) {
          // update User company saved in userState
          var billToCopyNoFollow = userState.getCopyOfUserCompany(true);
          angular.extend(billToCopyNoFollow, company);

          // this will fire 'risevision.company.updated' event
          userState.updateCompanySettings(billToCopyNoFollow);
        }
      };

      factory.updateAddress = function (addressObject, contact, isShipping) {
        var deferred = $q.defer();
        var currentAddress = isShipping ? addressService.copyAddressFromShipTo(userState
            .getCopyOfSelectedCompany()) :
          userState.getCopyOfUserCompany();

        var addressFields = {};
        var requiresUpdate = false;

        if (!isShipping) {
          var billingContactEmails = currentAddress.billingContactEmails || [];
          var email = contact && contact.email;

          if (email && billingContactEmails.indexOf(email) === -1) {
            billingContactEmails.unshift(email);

            addressFields.billingContactEmails = billingContactEmails;

            requiresUpdate = true;
          }
        }

        if (addressObject && !addressService.addressesAreIdentical(addressObject, currentAddress) ||
          requiresUpdate) {
          if (isShipping) {
            addressService.copyAddressToShipTo(addressObject, addressFields);
          } else {
            addressService.copyAddress(addressObject, addressFields);
          }

          $log.info('Company Fields changed. Saving...');

          updateCompany(addressFields.id, addressFields)
            .then(function () {
              _updateCompanySettings(addressFields, isShipping);

              $log.info('Company Fields saved.');

              deferred.resolve();
            })
            .catch(function () {
              $log.info('Error saving Company Fields.');
              deferred.reject('Error saving Company Fields.');
            });
        } else {
          deferred.resolve();
        }

        return deferred.promise;
      };

      factory.updateContact = function (contact) {
        var deferred = $q.defer();
        var currentContact = userState.getCopyOfProfile();

        if (contact && !contactService.contactsAreIdentical(contact, currentContact)) {
          $log.info('Contact information changed. Saving...');

          updateUser(userState.getUsername(), contact)
            .then(function () {
              var profileCopyNoFollow = userState.getCopyOfProfile(true);
              contactService.copyContactObj(contact, profileCopyNoFollow);

              // this fires 'risevision.company.updated' event
              userState.updateUserProfile(profileCopyNoFollow);

              $log.info('Contact information saved.');
              deferred.resolve();
            })
            .catch(function () {
              $log.info('Error saving Contact information.');
              deferred.reject('Error saving Contact information.');
            });
        } else {
          deferred.resolve();
        }

        return deferred.promise;
      };

      return factory;
    }
  ]);
