'use strict';

/**
 * @ngdoc function
 * @name istarVrWebSiteApp.controller:VideosCtrl
 * @description
 * # VideosCtrl
 * Controller of the istarVrWebSiteApp
 */
angular.module('istarVrWebSiteApp')
  .controller('VideosCtrl', function (OauthService, OauthBearerService, $http, $httpParamSerializer, $cookies, $location, $scope) {


    var getVideos = function() {

      /* Request backend to get json of all videos and replace the urls with presigned urls */
      OauthBearerService.getData('/get_all_content/' + $cookies.getObject('username'), function (data, err) {

        if (err) {

        }
        else {
          $scope.myvideos = data.Data;
        }

      })
    }


    // check if oauth cookie is set and if it hasn't expired
    if ($cookies.getObject("access_token") !== undefined) {
      if ($cookies.getObject("expires_in") <= ((new Date().getTime()) - 1000)) {
        OauthService.fetchRefreshToken();
      }
      getVideos()

    } else {
      $location.path('/login');
    }





  });
