/*
 * App Configuration File
 * Put environment-specific global variables in this file.
 *
 * In general, if you put an variable here, you will want to
 * make sure to put an equivalent variable in all three places:
 * dev.js, stage.js & prod.js
 *
 */
(function (angular) {
  'use strict';

  try {
    angular.module('risevision.common.config');
  } catch (err) {
    angular.module('risevision.common.config', []);
  }

  angular.module('risevision.common.i18n.config', [])
    .constant('LOCALES_PREFIX', 'locales/translation_')
    .constant('LOCALES_SUFIX', '.json');

  angular.module('risevision.common.config')
    .value('ENABLE_EXTERNAL_LOGGING', true)
    .value('CORE_URL', 'https://rvaserver2.appspot.com/_ah/api')
    .value('COOKIE_CHECK_URL', '//storage-dot-rvaserver2.appspot.com')
    .value('STORE_URL', 'https://store.risevision.com/')
    .value('STORE_SERVER_URL',
      'https://store-dot-rvaserver2.appspot.com/')
    .value('STORE_ENDPOINT_URL',
      'https://store-dot-rvaserver2.appspot.com/_ah/api')
    .value('STORAGE_ENDPOINT_URL',
      'https://storage-dot-rvaserver2.appspot.com/_ah/api')
    .value('GSFP_URL', 'https://gsfp-dot-rvaserver2.appspot.com/fp')
    .value('APPS_URL', 'https://apps.risevision.com')
    .value('CHARGEBEE_TEST_SITE', 'risevision-test')
    .value('CHARGEBEE_PROD_SITE', 'risevision')
    .value('CHARGEBEE_PLANS_USE_PROD', 'true')
    .value('STRIPE_PROD_KEY', 'pk_live_31dWkTWQU125m2RcWpK4HQBR')
    .value('STRIPE_TEST_KEY', 'pk_test_GrMIAHSoqhaik4tcHepsxjOR');
})(angular);
