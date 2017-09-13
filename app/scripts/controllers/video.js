'use strict';

/**
 * @ngdoc function
 * @name istarVrWebSiteApp.controller:FriendCtrl
 * @description
 * # FriendCtrl
 * Controller of the istarVrWebSiteApp
 */
angular.module('istarVrWebSiteApp')
  .controller('VideoCtrl', function ($cookies,OauthService) {

    // check if oauth cookie is set and if it hasn't expired
    if ($cookies.getObject("access_token") !== undefined) {
      if ($cookies.getObject("expires_in") <= ((new Date().getTime()) - 1000)) {
        OauthService.fetchRefreshToken();
        console.log("Requesting for oauth token IF");
      }
    } else {
      $window.location.href = "/#!/login";
      console.log("Requesting for oauth token else");
    }



  });
