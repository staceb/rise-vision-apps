/*
 * App Configuration File
 * Put environment-specific global variables in this file.
 *
 * In general, if you put an variable here, you will want to
 * make sure to put an equivalent variable in all three places:
 * dev.js, test.js & prod.js
 *
 */

(function (angular) {

  'use strict';

  angular.module('risevision.common.i18n.config', [])
    .constant('LOCALES_PREFIX', 'locales/translation_')
    .constant('LOCALES_SUFIX', '.json');

  angular.module('risevision.apps.config', [])
    .value('APPS_ENV', 'PROD')
    .value('STORE_ENDPOINT_URL',
      'https://store-dot-rvaserver2.appspot.com/_ah/api')
    .value('RVA_URL', 'http://rva.risevision.com')
    .value('VIEWER_URL', 'http://preview.risevision.com')
    .value('ALERTS_WS_URL',
      'https://rvaserver2.appspot.com/alerts/cap')
    .value('STORAGE_ENDPOINT_URL',
      'https://storage-dot-rvaserver2.appspot.com/_ah/api')
    .value('MESSAGING_PRIMUS_URL',
      'https://services.risevision.com/messaging/primus?displayId=apps&machineId=1')
    .value('MESSAGING_PRESENCE_URL',
      'https://services.risevision.com/messaging/presence')
    .value('APPS_URL', '')
    .value('ENV_NAME', 'BETA')
    .value('OAUTH_TOKEN_PROVIDER_URL', 'https://services.risevision.com/oauthtokenprovider/')
    .value('OAUTH_PUBLIC_KEY', 'EJMI-lB9hB55OYEsYmjXDNfRGoY')
    .value('CHARGEBEE_TEST_SITE', 'risevision-test')
    .value('CHARGEBEE_PROD_SITE', 'risevision')
    .value('STRIPE_PROD_KEY', 'pk_live_31dWkTWQU125m2RcWpK4HQBR')
    .value('STRIPE_TEST_KEY', 'pk_test_GrMIAHSoqhaik4tcHepsxjOR')
    .value('HTML_TEMPLATE_URL', 'https://widgets.risevision.com/staging/templates/PRODUCT_CODE/src/template.html')
    .value('BLUEPRINT_URL', 'https://widgets.risevision.com/staging/templates/PRODUCT_CODE/blueprint.json');

})(angular);
