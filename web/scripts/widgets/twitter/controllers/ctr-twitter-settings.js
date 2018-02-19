angular.module( "risevision.widget.twitter.settings" )
  .controller( "TwitterSettingsController", [ "$scope", "$rootScope", "$q", "$log", "TwitterOAuthService",
    function( $scope, $rootScope, $q, $log, TwitterOAuthService ) {
      $scope.twitterConnected = false;

      TwitterOAuthService.getConnectionStatus()
        .then(function() {
          $scope.twitterConnected = true;
        }, function() {
          $scope.twitterConnected = false;
        });

      $scope.connect = function() {
        TwitterOAuthService.authenticate()
          .then(function(key) {
            $scope.twitterConnected = true;
          }, function() {
            $scope.twitterConnected = false;
          });
      }

      $scope.revoke = function() {
        TwitterOAuthService.revoke()
          .then(function() {
            $scope.twitterConnected = false;
          }, function() {
            $scope.twitterConnected = true;
          });
      }

    } ] )
  .value( "defaultSettings", {
    "params": {},
    "additionalParams": {
      "screenName": ""
    }
  } );
