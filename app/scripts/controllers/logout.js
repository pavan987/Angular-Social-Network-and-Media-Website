'use strict';

/**
 * @ngdoc function
 * @name istarVrWebSiteApp.controller:LogoutCtrl
 * @description
 * # LogoutCtrl
 * Controller of the istarVrWebSiteApp
 */
angular.module('istarVrWebSiteApp')
  .controller('LogoutCtrl', function (OauthBearerService, $cookies, $location) {
    var postParams ={
      token : $cookies.getObject('access_token')
    }

    OauthBearerService.postData('/logout/'+$cookies.getObject('username'), postParams, function (data, err) {
      if (!err){
        $cookies.remove('username')
        $cookies.remove('access_token')
        $cookies.remove('temp-s3-creds-thumbnail')
        $cookies.remove('temp-s3-creds')
        $cookies.remove("expires_in")
        $cookies.remove('temp-s3-creds-public')
        $cookies.remove('temp-s3-creds-public-expires-in')
        $cookies.remove('temp-s3-creds-expires-in')
        $location.path('/login')
      }
    })


  });
