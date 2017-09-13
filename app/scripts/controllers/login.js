'use strict';

/**
 * @ngdoc function
 * @name istarVrWebSiteApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the istarVrWebSiteApp
 */
angular.module('istarVrWebSiteApp')
  .controller('LoginCtrl',  function ($scope, OauthService, $cookies, $location ) {

     $scope.submit = function() {
       OauthService.fetchOauthToken($scope.username, $scope.password, function(err){
         if(err){
           alert("Please check username/password")

         }
         else {

           $location.path('/profile');
         }
       });
     }
    //
    // };

    // fetching oauth token and storing in cookie (both operations done by service)
     //console.log($cookies.getObject("oauth2"));
  });
