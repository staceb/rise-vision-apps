'use strict';

angular.module('risevision.common.header')
  .value('COMPANY_ROLE_FIELDS', [
    ['IT/Network Administrator', 'it_network_administrator'],
    ['Facilities', 'facilities'],
    ['Professor/Instructor/Teacher', 'professor_instructor_teacher'],
    ['Marketing', 'marketing'],
    ['Designer', 'designer'],
    ['Executive/Business Owner', 'executive_business_owner'],
    ['Reseller/Integrator', 'reseller_integrator'],
    ['Architect/Consultant', 'architect_consultant'],
    ['Administrator/Volunteer/Intern', 'administrator_volunteer_intern'],
    ['Developer', 'developer'],
    ['Other', 'other']
  ])
  .value('COMPANY_INDUSTRY_FIELDS', [
    ['K-12 Education', 'PRIMARY_SECONDARY_EDUCATION',
      'https://cdn2.hubspot.net/hubfs/2700250/Assets%20May%5B17%5D/university.svg'
    ],
    ['Higher Education', 'HIGHER_EDUCATION',
      'https://www.risevision.com/hubfs/mortarboard-2.svg?t=1502211789708'
    ],
    ['Religious', 'RELIGIOUS_INSTITUTIONS',
      'https://www.risevision.com/hubfs/Assets%20May%5B17%5D/religious.svg?t=1502211789708'
    ],
    ['Nonprofit', 'PHILANTHROPY',
      'https://cdn2.hubspot.net/hubfs/2700250/Assets%20May%5B17%5D/donation-1.svg'
    ],
    ['Retail', 'RETAIL',
      'https://www.risevision.com/hubfs/business-1.svg'
    ],
    ['Restaurants and Bars', 'RESTAURANTS',
      'https://cdn2.hubspot.net/hubfs/2700250/Assets%20May%5B17%5D/restaurants.svg'
    ],
    ['Hospital and Healthcare', 'HOSPITAL_HEALTH_CARE',
      'https://www.risevision.com/hubfs/hospitality-2.svg?t=1502211789708'
    ],
    ['Libraries', 'LIBRARIES',
      'https://cdn2.hubspot.net/hubfs/2700250/Assets%20May%5B17%5D/teamwork.svg'
    ],
    ['Financial Services', 'FINANCIAL_SERVICES',
      'https://www.risevision.com/hubfs/Assets%20May%5B17%5D/finance.svg?t=1502211789708'
    ],
    ['Gyms and Fitness', 'HEALTH_WELLNESS_AND_FITNESS',
      'https://www.risevision.com/hubfs/health-2.svg?t=1502211789708'
    ],
    ['Hotels and Hospitality', 'HOSPITALITY'],
    ['Corporate Offices', 'EXECUTIVE_OFFICE'],
    ['Manufacturing', 'INDUSTRIAL_AUTOMATION'],
    ['Government', 'GOVERNMENT_ADMINISTRATION'],
    ['Auto Dealerships', 'AUTOMOTIVE',
      'https://cdn2.hubspot.net/hubfs/2700250/automobile-1.svg'
    ],
    ['Marketing and Advertising', 'MARKETING_AND_ADVERTISING',
      'https://cdn2.hubspot.net/hubfs/2700250/Assets%20May%5B17%5D/telemarketer.svg'
    ],
    ['Technology and Integrator', 'INFORMATION_TECHNOLOGY_AND_SERVICES'],
    ['Other', 'OTHER']
  ])
  .value('COMPANY_SIZE_FIELDS', [
    ['Solo', '1'],
    ['Fewer than 20 employees', '2'],
    ['21-50 employees', '21'],
    ['51-250 employees', '51'],
    ['More than 250 employees', '250']
  ])
  .constant('USER_ICP_WRITABLE_FIELDS', [
    'mailSyncEnabled'
  ])
  .constant('COMPANY_ICP_WRITABLE_FIELDS', [
    'companyIndustry'
  ])
  .factory('companyIcpFactory', ['$rootScope', '$q', '$log', 'userState',
    'updateCompany', 'updateUser', '$modal', 'pick',
    'USER_ICP_WRITABLE_FIELDS', 'COMPANY_ICP_WRITABLE_FIELDS', '$state',
    function ($rootScope, $q, $log, userState, updateCompany, updateUser,
      $modal, pick, USER_ICP_WRITABLE_FIELDS, COMPANY_ICP_WRITABLE_FIELDS, $state) {
      var factory = {};

      factory.init = function () {
        $rootScope.$on(
          'risevision.company.selectedCompanyChanged',
          function () {
            _checkIcpCollection();
          });
      };

      var _saveIcpData = function (result) {
        var company = result.company;
        var user = result.user;
        var companyId = company.id;
        var username = user.username;

        company = pick(company, COMPANY_ICP_WRITABLE_FIELDS);
        user = pick(user, USER_ICP_WRITABLE_FIELDS);

        var companyPromise = updateCompany(companyId, company);
        var userPromise = updateUser(username, user);

        $q.all([companyPromise, userPromise]).then(function () {
          $log.debug('User & Company Profiles updated');
        });
      };

      var _checkIcpCollection = function () {

        //make sure user registration process is complete
        if ($state.current.name.indexOf('common.auth') !== -1) {
          return;
        }

        var user = userState.getCopyOfProfile(true);
        var company = userState.getCopyOfSelectedCompany(true);

        //Rise user should not be asked to confirm industry of a sub-company
        if (userState.isRiseAdmin()) {
          return;
        }

        // Has industry been collected?
        if (company.companyIndustry) {
          return;
        }

        var modalInstance = $modal.open({
          templateUrl: 'partials/common-header/company-icp-modal.html',
          controller: 'CompanyIcpModalCtrl',
          size: 'md',
          backdrop: 'static', //prevent from closing modal by clicking outside
          keyboard: false, //prevent from closing modal by pressing escape
          resolve: {
            user: function () {
              return user;
            },
            company: function () {
              return company;
            }
          }
        });

        modalInstance.result.then(function (user, company) {
          _saveIcpData(user, company);
        });

      };

      return factory;
    }
  ]);
